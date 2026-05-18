// =============================================================================
// GitHub-First DOSM Data Client
// =============================================================================
// Fetches data from DOSM's GitHub repos (data-gov-my/datagovmy-meta &
// dosm-malaysia/data-open) instead of the rate-limited DOSM API.
//
// This is a CLIENT-side module — uses localStorage for ETag persistence and
// in-memory Map for caching metadata with a 5-minute TTL.
// =============================================================================

// ---------------------------------------------------------------------------
// 1. GITHUB_REPOS — configuration for the upstream GitHub sources
// ---------------------------------------------------------------------------

export const GITHUB_REPOS = {
  /** datagovmy-meta: dataset catalogue metadata + static assets */
  META: {
    owner: 'data-gov-my',
    repo: 'datagovmy-meta',
    branch: 'main',
    raw_base: 'https://raw.githubusercontent.com/data-gov-my/datagovmy-meta/main',
    api_base: 'https://api.github.com/repos/data-gov-my/datagovmy-meta',
  },
  /** dosm-malaysia/data-open: geodata (GeoJSON boundary files) */
  GEODATA: {
    owner: 'dosm-malaysia',
    repo: 'data-open',
    branch: 'main',
    raw_base: 'https://raw.githubusercontent.com/dosm-malaysia/data-open/main',
    api_base: 'https://api.github.com/repos/dosm-malaysia/data-open',
  },
  /** DOSM blob storage — parquet & CSV data files */
  DOSM_STORAGE: {
    base_url: 'https://storage.dosm.gov.my',
  },
  /** Legacy DOSM API (used only as last-resort fallback) */
  DOSM_API: {
    base_url: 'https://api.data.gov.my',
  },
} as const;

// ---------------------------------------------------------------------------
// 2. GEO_PATHS — layer-name → GitHub raw path mapping
// ---------------------------------------------------------------------------

export const GEO_PATHS: Record<string, string> = {
  country:      '/datasets/geodata/administrative/administrative_0_country.geojson',
  states:       '/datasets/geodata/administrative/administrative_1_state.geojson',
  districts:    '/datasets/geodata/administrative/administrative_2_district.geojson',
  subdistricts: '/datasets/geodata/administrative/administrative_3_subdistrict.geojson',
  parlimen:     '/datasets/geodata/electoral/electoral_0_parlimen.geojson',
  dun:          '/datasets/geodata/electoral/electoral_1_dun.geojson',
};

// ---------------------------------------------------------------------------
// 3. DOSMCatalogueMeta — full metadata shape for a single dataset
// ---------------------------------------------------------------------------

export interface DOSMCatalogueMetaField {
  id: string;
  description: { en: string; ms: string };
  data_type: string;
  /** Units of measurement (e.g. "RM millions", "'000 persons") */
  unit?: { en: string; ms: string };
}

export interface DOSMCatalogueMetaFrequency {
  id: string;
  label: { en: string; ms: string };
}

export interface DOSMCatalogueMetaDataRange {
  start: string;
  end: string;
}

export interface DOSMCatalogueMeta {
  id: string;
  type: string;
  title: { en: string; ms: string };
  description: { en: string; ms: string };
  source: string[];
  link_parquet: string;
  link_csv: string;
  link_preview: string;
  frequency: DOSMCatalogueMetaFrequency;
  geography: string[];
  demography: string[];
  date_range: DOSMCatalogueMetaDataRange;
  fields: DOSMCatalogueMetaField[];
  related_datasets: string[];
  /** GitHub SHA of the blob when fetched (for cache-busting) */
  _github_sha?: string;
  /** ISO timestamp of when this metadata was last fetched */
  _fetched_at?: string;
}

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface GitHubContentEntry {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  download_url: string | null;
}

interface GitHubCommitEntry {
  commit: {
    committer: {
      date: string;
    };
    message: string;
  };
  sha: string;
}

// ---------------------------------------------------------------------------
// 4. GitHubDOSMClient
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const ETAG_STORAGE_PREFIX = 'dosm_etag_';
const DEFAULT_CONCURRENCY = 6;

class GitHubDOSMClient {
  // In-memory cache for metadata — avoids repeated GitHub API calls
  private metaCache = new Map<string, CacheEntry<DOSMCatalogueMeta>>();
  // In-memory cache for the catalogue index (list of dataset IDs)
  private indexCache: CacheEntry<string[]> | null = null;
  // In-memory cache for GeoJSON layers
  private geoCache = new Map<string, CacheEntry<GeoJSON.GeoJsonObject>>();

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /**
   * List all dataset IDs from the GitHub API (contents of data-catalogue dir).
   * Returns an array of dataset ID strings, or empty array on failure.
   */
  async getCatalogueIndex(): Promise<string[]> {
    // Return from cache if fresh
    if (this.indexCache && Date.now() - this.indexCache.timestamp < CACHE_TTL_MS) {
      return this.indexCache.data;
    }

    try {
      const url = `${GITHUB_REPOS.META.api_base}/contents/data-catalogue?ref=${GITHUB_REPOS.META.branch}`;
      const headers = this._githubHeaders();

      const res = await fetch(url, { headers });

      if (!res.ok) {
        console.warn(`[GitHubDOSMClient] getCatalogueIndex failed: ${res.status}`);
        return this.indexCache?.data ?? [];
      }

      const contents: GitHubContentEntry[] = await res.json();

      // Each subdirectory in data-catalogue/ is a dataset ID
      const datasetIds = contents
        .filter((entry) => entry.type === 'dir')
        .map((entry) => entry.name)
        .sort();

      this.indexCache = { data: datasetIds, timestamp: Date.now() };
      return datasetIds;
    } catch (err) {
      console.error('[GitHubDOSMClient] getCatalogueIndex error:', err);
      return this.indexCache?.data ?? [];
    }
  }

  /**
   * Fetch metadata JSON for a single dataset from GitHub raw.
   * Returns DOSMCatalogueMeta or null on failure.
   */
  async getDatasetMeta(datasetId: string): Promise<DOSMCatalogueMeta | null> {
    // Return from cache if fresh
    const cached = this.metaCache.get(datasetId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const rawUrl = `${GITHUB_REPOS.META.raw_base}/data-catalogue/${datasetId}/${datasetId}.json`;
      const cacheKey = `meta_${datasetId}`;
      const headers: Record<string, string> = {
        ...this._githubHeaders(),
        ...this._conditionalHeaders(cacheKey),
      };

      const res = await fetch(rawUrl, { headers });

      if (res.status === 304) {
        // Not Modified — return cached value (if any)
        return cached?.data ?? null;
      }

      if (!res.ok) {
        console.warn(`[GitHubDOSMClient] getDatasetMeta(${datasetId}) failed: ${res.status}`);
        return cached?.data ?? null;
      }

      // Store ETag for future conditional requests
      const etag = res.headers.get('etag');
      if (etag) {
        this._storeEtag(cacheKey, etag);
      }

      const meta: DOSMCatalogueMeta = await res.json();
      meta._fetched_at = new Date().toISOString();

      this.metaCache.set(datasetId, { data: meta, timestamp: Date.now() });
      return meta;
    } catch (err) {
      console.error(`[GitHubDOSMClient] getDatasetMeta(${datasetId}) error:`, err);
      return cached?.data ?? null;
    }
  }

  /**
   * Batch fetch metadata for ALL datasets with concurrency control.
   * Returns an array of non-null DOSMCatalogueMeta objects.
   */
  async getAllDatasetMeta(options?: {
    concurrency?: number;
    onProgress?: (loaded: number, total: number) => void;
  }): Promise<DOSMCatalogueMeta[]> {
    const ids = await this.getCatalogueIndex();
    const concurrency = options?.concurrency ?? DEFAULT_CONCURRENCY;
    const results: DOSMCatalogueMeta[] = [];
    let loaded = 0;

    // Process in batches of `concurrency`
    for (let i = 0; i < ids.length; i += concurrency) {
      const batch = ids.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map(async (id) => {
          const meta = await this.getDatasetMeta(id);
          return meta;
        })
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled' && result.value !== null) {
          results.push(result.value);
        }
      }

      loaded += batch.length;
      options?.onProgress?.(loaded, ids.length);
    }

    return results;
  }

  /**
   * Fetch GeoJSON for a given layer from the DOSM geodata repo.
   * Returns a parsed GeoJSON object or null on failure.
   */
  async getGeoJSON(layer: string): Promise<GeoJSON.GeoJsonObject | null> {
    const path = GEO_PATHS[layer];
    if (!path) {
      console.warn(`[GitHubDOSMClient] Unknown geo layer: ${layer}`);
      return null;
    }

    // Return from cache if fresh
    const cached = this.geoCache.get(layer);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const rawUrl = `${GITHUB_REPOS.GEODATA.raw_base}${path}`;
      const cacheKey = `geo_${layer}`;
      const headers: Record<string, string> = {
        ...this._githubHeaders(),
        ...this._conditionalHeaders(cacheKey),
      };

      const res = await fetch(rawUrl, { headers });

      if (res.status === 304) {
        return cached?.data ?? null;
      }

      if (!res.ok) {
        console.warn(`[GitHubDOSMClient] getGeoJSON(${layer}) failed: ${res.status}`);
        return cached?.data ?? null;
      }

      const etag = res.headers.get('etag');
      if (etag) {
        this._storeEtag(cacheKey, etag);
      }

      const geojson: GeoJSON.GeoJsonObject = await res.json();

      this.geoCache.set(layer, { data: geojson, timestamp: Date.now() });
      return geojson;
    } catch (err) {
      console.error(`[GitHubDOSMClient] getGeoJSON(${layer}) error:`, err);
      return cached?.data ?? null;
    }
  }

  /**
   * Check the last commit date for a geodata file.
   * Returns an ISO date string or null on failure.
   */
  async getGeoDataLastUpdated(layer: string): Promise<string | null> {
    const path = GEO_PATHS[layer];
    if (!path) return null;

    try {
      const url =
        `${GITHUB_REPOS.GEODATA.api_base}/commits` +
        `?path=${encodeURIComponent(path)}` +
        `&per_page=1&sha=${GITHUB_REPOS.GEODATA.branch}`;

      const res = await fetch(url, { headers: this._githubHeaders() });

      if (!res.ok) {
        console.warn(`[GitHubDOSMClient] getGeoDataLastUpdated(${layer}) failed: ${res.status}`);
        return null;
      }

      const commits: GitHubCommitEntry[] = await res.json();
      if (commits.length === 0) return null;

      return commits[0].commit.committer.date;
    } catch (err) {
      console.error(`[GitHubDOSMClient] getGeoDataLastUpdated(${layer}) error:`, err);
      return null;
    }
  }

  /**
   * Fetch actual dataset data using link_csv from metadata.
   * Falls back through: CSV → DOSM API preview → null.
   * Returns parsed rows as an array of plain objects, or null on failure.
   */
  async getDatasetData(datasetId: string): Promise<Record<string, unknown>[] | null> {
    const meta = await this.getDatasetMeta(datasetId);
    if (!meta) return null;

    // --- Attempt 1: Fetch CSV from link_csv --------------------------------
    if (meta.link_csv) {
      try {
        const csvRes = await fetch(meta.link_csv);
        if (csvRes.ok) {
          const csvText = await csvRes.text();
          const rows = this._parseCSV(csvText);
          if (rows.length > 0) return rows;
        }
      } catch (err) {
        console.warn(`[GitHubDOSMClient] CSV fetch failed for ${datasetId}:`, err);
      }
    }

    // --- Attempt 2: DOSM API preview endpoint -------------------------------
    if (meta.link_preview) {
      try {
        const previewRes = await fetch(meta.link_preview);
        if (previewRes.ok) {
          const data = await previewRes.json();
          // The preview endpoint typically returns { data: [...] }
          if (Array.isArray(data)) return data;
          if (data?.data && Array.isArray(data.data)) return data.data;
        }
      } catch (err) {
        console.warn(`[GitHubDOSMClient] Preview fetch failed for ${datasetId}:`, err);
      }
    }

    // --- Attempt 3: DOSM API catalog data endpoint -------------------------
    try {
      const apiUrl = `${GITHUB_REPOS.DOSM_API.base_url}/data-catalogue/${datasetId}`;
      const apiRes = await fetch(apiUrl);
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (Array.isArray(data)) return data;
        if (data?.data && Array.isArray(data.data)) return data.data;
      }
    } catch (err) {
      console.warn(`[GitHubDOSMClient] DOSM API fallback failed for ${datasetId}:`, err);
    }

    return null;
  }

  /**
   * Check GitHub commits to find datasets that were recently changed.
   * Returns an array of objects with datasetId and lastCommitDate.
   */
  async getRecentlyUpdatedDatasets(
    sinceHours: number = 24
  ): Promise<Array<{ datasetId: string; lastCommitDate: string }>> {
    const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000).toISOString();
    const results: Array<{ datasetId: string; lastCommitDate: string }> = [];

    try {
      // Query the meta repo for recent commits to data-catalogue/
      const url =
        `${GITHUB_REPOS.META.api_base}/commits` +
        `?path=data-catalogue&since=${encodeURIComponent(since)}` +
        `&per_page=100&sha=${GITHUB_REPOS.META.branch}`;

      const res = await fetch(url, { headers: this._githubHeaders() });

      if (!res.ok) {
        console.warn(`[GitHubDOSMClient] getRecentlyUpdatedDatasets failed: ${res.status}`);
        return [];
      }

      const commits: GitHubCommitEntry[] = await res.json();

      // Extract dataset IDs from commit messages / paths
      // We need a second call to get file details per commit
      const seen = new Set<string>();

      for (const commit of commits) {
        // Try to get file details for this commit
        try {
          const detailUrl =
            `${GITHUB_REPOS.META.api_base}/commits/${commit.sha}`;
          const detailRes = await fetch(detailUrl, { headers: this._githubHeaders() });

          if (detailRes.ok) {
            const detail = await detailRes.json();
            const files: Array<{ filename: string }> = detail.files ?? [];

            for (const file of files) {
              // Path pattern: data-catalogue/{datasetId}/{datasetId}.json
              const match = file.filename.match(/^data-catalogue\/([^/]+)\//);
              if (match && !seen.has(match[1])) {
                seen.add(match[1]);
                results.push({
                  datasetId: match[1],
                  lastCommitDate: commit.commit.committer.date,
                });
              }
            }
          }
        } catch {
          // Skip this commit if detail fetch fails
          continue;
        }

        // Rate-limit: avoid hammering the GitHub API
        if (results.length >= 30) break;
      }

      return results;
    } catch (err) {
      console.error('[GitHubDOSMClient] getRecentlyUpdatedDatasets error:', err);
      return [];
    }
  }

  // -----------------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------------

  /**
   * Build standard GitHub API headers including optional authentication.
   */
  private _githubHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    // Support optional GITHUB_TOKEN for higher rate limits
    const token = typeof process !== 'undefined'
      ? process.env?.GITHUB_TOKEN
      : undefined;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Build conditional request headers (If-None-Match) using a stored ETag.
   */
  private _conditionalHeaders(cacheKey: string): Record<string, string> {
    const etag = this._getStoredEtag(cacheKey);
    if (etag) {
      return { 'If-None-Match': etag };
    }
    return {};
  }

  /**
   * Store an ETag in localStorage for future conditional requests.
   */
  private _storeEtag(cacheKey: string, etag: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`${ETAG_STORAGE_PREFIX}${cacheKey}`, etag);
      }
    } catch {
      // localStorage may be unavailable (SSR, private browsing, etc.)
    }
  }

  /**
   * Retrieve a stored ETag from localStorage.
   */
  private _getStoredEtag(cacheKey: string): string | null {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(`${ETAG_STORAGE_PREFIX}${cacheKey}`);
      }
    } catch {
      // Ignore
    }
    return null;
  }

  /**
   * Parse a CSV string into an array of plain objects.
   * Handles quoted fields, escaped quotes, and mixed line endings.
   */
  private _parseCSV(csvText: string): Record<string, unknown>[] {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = this._parseCSVLine(lines[0]);
    const rows: Record<string, unknown>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this._parseCSVLine(lines[i]);
      if (values.length === 0) continue;

      const row: Record<string, unknown> = {};
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j];
        const raw = values[j] ?? '';
        row[key] = this._coerceCSVValue(raw);
      }
      rows.push(row);
    }

    return rows;
  }

  /**
   * Parse a single CSV line respecting RFC 4180 quoting rules.
   */
  private _parseCSVLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const ch = line[i];

      if (inQuotes) {
        if (ch === '"') {
          // Escaped quote or end of quoted field
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i += 2;
          } else {
            inQuotes = false;
            i++;
          }
        } else {
          current += ch;
          i++;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
          i++;
        } else if (ch === ',') {
          fields.push(current);
          current = '';
          i++;
        } else {
          current += ch;
          i++;
        }
      }
    }

    fields.push(current);
    return fields;
  }

  /**
   * Coerce a CSV string value into a typed JS value.
   * Numbers stay as numbers, "true"/"false" → boolean, else string.
   */
  private _coerceCSVValue(raw: string): unknown {
    if (raw === '') return null;

    // Try integer
    if (/^-?\d+$/.test(raw)) {
      return parseInt(raw, 10);
    }
    // Try float
    if (/^-?\d+\.\d+$/.test(raw)) {
      return parseFloat(raw);
    }
    // Boolean
    if (raw.toLowerCase() === 'true') return true;
    if (raw.toLowerCase() === 'false') return false;

    return raw;
  }
}

// ---------------------------------------------------------------------------
// 5. Singleton export
// ---------------------------------------------------------------------------

export const githubDOSMClient = new GitHubDOSMClient();
