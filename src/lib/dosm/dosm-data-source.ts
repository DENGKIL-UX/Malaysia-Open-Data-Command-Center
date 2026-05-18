/**
 * DOSM Data Source Module — Priority Cascade
 *
 * Implements a 5-tier priority cascade for fetching DOSM data, from fastest/most-local
 * to slowest/most-remote. Each tier is tried in order; on failure, the next tier is
 * attempted. The result always includes which tier ultimately served the data.
 *
 * Priority order:
 *   1. static_json   — Pre-built local JSON files (served by Cloudflare, zero external requests)
 *   2. github_meta   — DOSM GitHub raw metadata (CDN-backed, 5000 req/hr)
 *   3. dosm_storage   — Direct storage.dosm.gov.my CSV files (no API compute)
 *   4. dosm_api       — api.data.gov.my (rate-limited, LAST RESORT)
 *   5. csv_fallback   — CSV download from any available URL
 *
 * This is a CLIENT-side module. All fetches are performed from the browser.
 */

import { DATASETS } from '@/lib/data/datasets';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Identifies which tier in the priority cascade served the data. */
export type DataSourceTier =
  | 'static_json'
  | 'github_meta'
  | 'dosm_storage'
  | 'dosm_api'
  | 'csv_fallback';

/** Result returned by `fetchDOSMDataset`. */
export interface DOSMDataResult {
  /** Parsed data rows from the dataset. */
  data: any[];
  /** Which tier in the cascade served the data. */
  source: DataSourceTier;
  /** The URL that was actually fetched. */
  sourceUrl: string;
  /** Unix timestamp (ms) when the data was fetched. */
  fetchedAt: number;
  /** Optional metadata from the DOSM catalogue. */
  meta?: {
    id: string;
    title_en?: string;
    title_ms?: string;
    frequency?: string;
    last_updated?: string;
    fields?: Array<{ id: string; type: string; label: { en: string; ms: string } }>;
  };
  /** Error message if the fetch partially failed. */
  error?: string;
}

/** Full dataset metadata entry from the local DATASETS catalogue. */
export interface DatasetMeta {
  id: string;
  title_en: string;
  title_ms: string;
  description_en: string;
  description_ms: string;
  frequency: string;
  geography: string[];
  demography: string[];
  dataset_begin: number;
  dataset_end: number;
  data_source: string[];
  category_en: string;
  category_ms: string;
  subcategory_en: string;
  subcategory_ms: string;
  category_sort: number;
  link_parquet: string;
  link_csv: string;
  last_updated: string;
  data_as_of: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Base URL for GitHub raw metadata (data-gov-my/datagovmy-meta). */
const GITHUB_META_BASE =
  'https://raw.githubusercontent.com/data-gov-my/datagovmy-meta/main/data-catalogue';

/** Base URL for DOSM storage (CSV files). */
const DOSM_STORAGE_BASE = 'https://storage.dosm.gov.my';

/** Base URL for the DOSM public API. */
const DOSM_API_BASE = 'https://api.data.gov.my/data-catalogue';

/** Request timeout in milliseconds. */
const FETCH_TIMEOUT = 15_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create an AbortController-backed fetch with a timeout.
 * @internal
 */
function fetchWithTimeout(url: string, timeoutMs: number = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(id));
}

/**
 * Build a `DOSMDataResult` object with sensible defaults.
 * @internal
 */
function makeResult(
  data: any[],
  source: DataSourceTier,
  sourceUrl: string,
  meta?: DOSMDataResult['meta'],
  error?: string,
): DOSMDataResult {
  return {
    data,
    source,
    sourceUrl,
    fetchedAt: Date.now(),
    meta,
    error,
  };
}

/**
 * Build a minimal `meta` block from a local `DatasetMeta` entry.
 * @internal
 */
function metaFromLocal(entry: DatasetMeta): DOSMDataResult['meta'] {
  return {
    id: entry.id,
    title_en: entry.title_en,
    title_ms: entry.title_ms,
    frequency: entry.frequency,
    last_updated: entry.last_updated,
  };
}

// ---------------------------------------------------------------------------
// CSV Parsing
// ---------------------------------------------------------------------------

/**
 * Parse a CSV string into an array of row objects.
 *
 * Handles:
 *  - Quoted fields (including embedded commas and newlines)
 *  - Double-quote escaping (`""` → `"`)
 *  - BOM marker
 *  - Trailing newlines / empty rows
 *
 * This is a simple, dependency-free parser suitable for the typical CSV files
 * served by storage.dosm.gov.my.
 *
 * @param csv - Raw CSV string content.
 * @returns Array of objects keyed by header names.
 */
export function parseCSV(csv: string): any[] {
  // Strip BOM if present
  if (csv.charCodeAt(0) === 0xfeff) {
    csv = csv.slice(1);
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < csv.length) {
    const ch = csv[i];

    if (inQuotes) {
      if (ch === '"') {
        // Double-quote escaping
        if (i + 1 < csv.length && csv[i + 1] === '"') {
          currentField += '"';
          i += 2;
          continue;
        }
        // End of quoted field
        inQuotes = false;
        i++;
        continue;
      }
      currentField += ch;
      i++;
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (ch === ',') {
        currentRow.push(currentField);
        currentField = '';
        i++;
        continue;
      }
      if (ch === '\r') {
        // Handle \r\n or standalone \r
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
        i++;
        if (i < csv.length && csv[i] === '\n') i++;
        continue;
      }
      if (ch === '\n') {
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
        i++;
        continue;
      }
      currentField += ch;
      i++;
    }
  }

  // Flush the last field/row
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  const result: any[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // Skip entirely empty rows
    if (row.length === 1 && row[0].trim() === '') continue;

    const obj: Record<string, string> = {};
    for (let c = 0; c < headers.length; c++) {
      const value = c < row.length ? row[c] : '';
      obj[headers[c]] = value.trim();
    }
    result.push(obj);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Look up a dataset's metadata from the local DATASETS catalogue (287+ entries).
 *
 * @param datasetId - The dataset identifier (e.g. `"population_state"`).
 * @returns The matching `DatasetMeta` entry, or `undefined` if not found.
 */
export function getLocalDatasetMeta(datasetId: string): DatasetMeta | undefined {
  return (DATASETS as DatasetMeta[]).find((d) => d.id === datasetId);
}

/**
 * Resolve the DOSM storage CSV URL for a given dataset ID.
 *
 * Uses the local `link_csv` field if available. Otherwise constructs a
 * best-effort URL from the known DOSM storage URL pattern.
 *
 * @param datasetId - The dataset identifier.
 * @returns The resolved CSV URL, or an empty string if it cannot be determined.
 */
export function resolveStorageUrl(datasetId: string): string {
  // First: try the local catalogue
  const local = getLocalDatasetMeta(datasetId);
  if (local?.link_csv) return local.link_csv;

  // Fallback: construct from known category patterns
  // The DOSM storage URL pattern is typically:
  //   https://storage.dosm.gov.my/{category}/{filename}.csv
  // Since we don't have category info without the catalogue entry,
  // return empty to signal inability to resolve.
  return '';
}

/**
 * Fetch and parse a CSV file from a DOSM storage URL.
 *
 * @param csvUrl - The full URL to the CSV file.
 * @returns Parsed array of row objects.
 */
export async function fetchCSVFromDOSM(csvUrl: string): Promise<any[]> {
  const response = await fetchWithTimeout(csvUrl);
  if (!response.ok) {
    throw new Error(`CSV fetch failed: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  return parseCSV(text);
}

/**
 * Get a display badge (label, colour, description) for a data source tier.
 *
 * Useful for rendering source attribution in the UI.
 *
 * @param tier - The data source tier.
 * @returns An object with `label`, `color` (hex), and `description`.
 */
export function getDataSourceBadge(
  tier: DataSourceTier,
): { label: string; color: string; description: string } {
  switch (tier) {
    case 'static_json':
      return {
        label: 'Static',
        color: '#10b981',
        description: 'Pre-built static data',
      };
    case 'github_meta':
      return {
        label: 'GitHub',
        color: '#06b6d4',
        description: 'Fetched from DOSM GitHub repository',
      };
    case 'dosm_storage':
      return {
        label: 'DOSM Storage',
        color: '#f59e0b',
        description: 'Direct from storage.dosm.gov.my',
      };
    case 'dosm_api':
      return {
        label: 'DOSM API',
        color: '#ef4444',
        description: 'Rate-limited API (last resort)',
      };
    case 'csv_fallback':
      return {
        label: 'CSV Fallback',
        color: '#8b5cf6',
        description: 'CSV download fallback',
      };
  }
}

// ---------------------------------------------------------------------------
// Tier implementations
// ---------------------------------------------------------------------------

/**
 * Tier 1: Try fetching pre-built static JSON from the local `/data/fallback/` path.
 * These files would be built from the GitHub repo and served by Cloudflare,
 * resulting in the fastest possible load with zero external API requests.
 * @internal
 */
async function tryStaticJson(
  datasetId: string,
): Promise<DOSMDataResult | null> {
  const url = `/data/fallback/${datasetId}.json`;
  try {
    const res = await fetchWithTimeout(url, 5_000);
    if (!res.ok) return null;

    const json = await res.json();
    // The static JSON may be { data: [...] } or a plain array
    const data = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : null;
    if (!data) return null;

    const localMeta = getLocalDatasetMeta(datasetId);
    return makeResult(data, 'static_json', url, localMeta ? metaFromLocal(localMeta) : undefined);
  } catch {
    return null;
  }
}

/**
 * Tier 2: Fetch metadata from the GitHub raw (datagovmy-meta) repository,
 * then download the CSV from the `link_csv` or `link_parquet` field.
 *
 * The GitHub CDN is fast and allows 5,000 requests/hour.
 * @internal
 */
async function tryGitHubMeta(
  datasetId: string,
): Promise<DOSMDataResult | null> {
  const metaUrl = `${GITHUB_META_BASE}/${datasetId}.json`;
  try {
    const res = await fetchWithTimeout(metaUrl, 10_000);
    if (!res.ok) return null;

    const meta = await res.json();

    // Prefer CSV link from metadata
    const csvUrl: string | undefined = meta.link_csv || meta.link_parquet;
    if (!csvUrl) return null;

    // Fetch the actual data CSV
    const data = await fetchCSVFromDOSM(csvUrl);

    const resultMeta: DOSMDataResult['meta'] = {
      id: datasetId,
      title_en: meta.title_en,
      title_ms: meta.title_ms,
      frequency: meta.frequency,
      last_updated: meta.last_updated,
      fields: meta.fields,
    };

    return makeResult(data, 'github_meta', metaUrl, resultMeta);
  } catch {
    return null;
  }
}

/**
 * Tier 3: Try fetching CSV directly from DOSM storage (storage.dosm.gov.my).
 *
 * This avoids the API compute layer entirely and directly reads from the
 * object storage. Uses the local DATASETS catalogue to resolve the URL.
 * @internal
 */
async function tryDOSMStorage(
  datasetId: string,
): Promise<DOSMDataResult | null> {
  const csvUrl = resolveStorageUrl(datasetId);
  if (!csvUrl) return null;

  try {
    const data = await fetchCSVFromDOSM(csvUrl);
    if (data.length === 0) return null;

    const localMeta = getLocalDatasetMeta(datasetId);
    return makeResult(data, 'dosm_storage', csvUrl, localMeta ? metaFromLocal(localMeta) : undefined);
  } catch {
    return null;
  }
}

/**
 * Tier 4: Use the DOSM public API at api.data.gov.my.
 *
 * This is the LAST RESORT tier because the API is rate-limited and involves
 * server-side compute. It returns JSON directly.
 * @internal
 */
async function tryDOSMApi(
  datasetId: string,
): Promise<DOSMDataResult | null> {
  const apiUrl = `${DOSM_API_BASE}?id=${datasetId}&limit=1000`;
  try {
    const res = await fetchWithTimeout(apiUrl, 15_000);
    if (!res.ok) return null;

    const json = await res.json();
    // The API typically returns { data: [...] } or a plain array
    const data = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : null;
    if (!data || data.length === 0) return null;

    const localMeta = getLocalDatasetMeta(datasetId);
    const resultMeta: DOSMDataResult['meta'] = localMeta
      ? metaFromLocal(localMeta)
      : { id: datasetId };

    return makeResult(data, 'dosm_api', apiUrl, resultMeta);
  } catch {
    return null;
  }
}

/**
 * Tier 5: CSV fallback — attempt to construct and fetch a CSV URL
 * from any available information (local catalogue, DOSM storage patterns).
 *
 * This tier is reached when all previous tiers have failed, and it attempts
 * a direct CSV download from any URL we can construct or discover.
 * @internal
 */
async function tryCSVFallback(
  datasetId: string,
): Promise<DOSMDataResult | null> {
  // Try the local catalogue's link_csv first
  const local = getLocalDatasetMeta(datasetId);
  if (local?.link_csv) {
    try {
      const data = await fetchCSVFromDOSM(local.link_csv);
      if (data.length > 0) {
        return makeResult(
          data,
          'csv_fallback',
          local.link_csv,
          metaFromLocal(local),
        );
      }
    } catch {
      // Fall through
    }
  }

  // Try constructing URL from DOSM storage patterns
  // Common categories: demography, population, hies, national-accounts, prices, labour, etc.
  const knownCategories = [
    'demography',
    'population',
    'hies',
    'national-accounts',
    'prices',
    'labour',
    'finance',
    'economy',
    'health',
    'environment',
    'education',
    'transport',
    'trade',
    'communications',
  ];

  for (const category of knownCategories) {
    const url = `${DOSM_STORAGE_BASE}/${category}/${datasetId}.csv`;
    try {
      const data = await fetchCSVFromDOSM(url);
      if (data.length > 0) {
        const fallbackMeta = local ? metaFromLocal(local) : { id: datasetId };
        return makeResult(data, 'csv_fallback', url, fallbackMeta);
      }
    } catch {
      // Continue to next category
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Fetch a DOSM dataset using the priority cascade.
 *
 * Tries each data source in order of preference:
 *   1. **static_json** — Pre-built local JSON (fastest, zero external requests)
 *   2. **github_meta** — DOSM GitHub raw metadata → CSV link (CDN-backed)
 *   3. **dosm_storage** — Direct CSV from storage.dosm.gov.my (no API compute)
 *   4. **dosm_api** — api.data.gov.my (rate-limited, LAST RESORT)
 *   5. **csv_fallback** — CSV download from any discoverable URL
 *
 * If all tiers fail, returns a result with an empty `data` array and an
 * `error` message — **never throws**.
 *
 * @param datasetId - The dataset identifier (e.g. `"population_state"`).
 * @returns A `DOSMDataResult` describing the outcome.
 */
export async function fetchDOSMDataset(datasetId: string): Promise<DOSMDataResult> {
  const localMeta = getLocalDatasetMeta(datasetId);
  const baseMeta: DOSMDataResult['meta'] = localMeta
    ? metaFromLocal(localMeta)
    : { id: datasetId };

  // Tier 1: Static JSON
  const t1 = await tryStaticJson(datasetId);
  if (t1) return t1;

  // Tier 2: GitHub metadata
  const t2 = await tryGitHubMeta(datasetId);
  if (t2) return t2;

  // Tier 3: DOSM storage direct
  const t3 = await tryDOSMStorage(datasetId);
  if (t3) return t3;

  // Tier 4: DOSM API (last resort before full fallback)
  const t4 = await tryDOSMApi(datasetId);
  if (t4) return t4;

  // Tier 5: CSV fallback
  const t5 = await tryCSVFallback(datasetId);
  if (t5) return t5;

  // All tiers exhausted — return error result
  return makeResult(
    [],
    'static_json', // Default tier for the error case
    '',
    baseMeta,
    `Unable to fetch dataset "${datasetId}" from any source. All 5 tiers exhausted.`,
  );
}
