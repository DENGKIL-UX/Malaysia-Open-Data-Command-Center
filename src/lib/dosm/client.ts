// src/lib/dosm/client.ts
// Client for api.data.gov.my/data-catalogue
// Three-tier fetch strategy:
//   Tier 1: API proxy (fastest, cached)
//   Tier 2: Direct CSV download from storage.data.gov.my (reliable, no rate limits)
//   Tier 3: Static fallback (always works offline)
//
// v3 CHANGES:
//   - Three-tier fallback: API → CSV → Static
//   - parseDosmDate() for quarterly "2024-Q2" format
//   - Correct sort syntax "-date" instead of "date desc"
//   - CSV download integration from direct-download.ts

import { DOSM_REGISTRY, STATIC_FALLBACKS, ID_CORRECTIONS, type DatasetId, type DatasetConfig } from './registry';
import { guardFields, type FieldGuardResult } from './field-guard';
import { parseDosmDate } from './yaml-reality';
import { fetchDosmCSV } from './direct-download';
import { VERIFIED_STATIC_FALLBACKS } from './static-fallbacks-v2';

const BASE_URL = '/api/dosm'; // Proxied through our server route
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min default cache

// ── TYPES ──
export type DataStatus = 'loading' | 'live' | 'csv' | 'fallback' | 'error';
export type FetchTier = 'api' | 'csv' | 'static';

export interface DosmQueryOptions {
  limit?: number;
  sort?: 'asc' | 'desc';
  filters?: Record<string, string | number>;
}

export interface DosmDataResult<T = Record<string, unknown>> {
  raw: T[];
  latest: T;
  previous: T;
  history: T[];   // Last 12 data points, chronological
  config: DatasetConfig;
  fetchedAt: Date;
  latestValue: number;
  prevValue: number;
  change: number;
  changePct: number;
  trend: 'up' | 'down' | 'flat';
  min: number;
  max: number;
  avg: number;
  error?: string;
  // NEW: Status tracking with tier info
  status: DataStatus;
  tier: FetchTier;
  fieldGuard?: FieldGuardResult;
  correctedId?: string;
}

// ── IN-MEMORY CACHE ──
const cache = new Map<string, { data: DosmDataResult; expires: number }>();

function getCacheKey(datasetId: string, options: DosmQueryOptions): string {
  return `${datasetId}:${JSON.stringify(options)}`;
}

// ── ID CORRECTION ──
function resolveId(rawId: string): { id: string; corrected: boolean; originalId: string } {
  const corrected = ID_CORRECTIONS.get(rawId);
  if (corrected && corrected !== rawId) {
    console.warn(`[DoSM Client] ID corrected: "${rawId}" → "${corrected}"`);
    return { id: corrected, corrected: true, originalId: rawId };
  }
  return { id: rawId, corrected: false, originalId: rawId };
}

// ── STATIC FALLBACK ──
// Tries v2 verified fallbacks first, then original registry fallbacks
function getStaticFallback<T>(datasetId: string, config: DatasetConfig): DosmDataResult<T> | null {
  // Try v2 verified fallbacks first (correct series_type, quarterly date format)
  const v2Fallback = (VERIFIED_STATIC_FALLBACKS as Record<string, { data: Record<string, unknown>[] }>)[datasetId];
  if (v2Fallback?.data?.length) {
    const dataArr = v2Fallback.data as T[];
    return enrichData(dataArr, config, 'fallback');
  }

  // Fall back to original registry static fallbacks
  const fallbackData = (STATIC_FALLBACKS as Record<string, { data: Record<string, unknown>[] }>)[datasetId];
  if (fallbackData?.data?.length) {
    const dataArr = fallbackData.data as T[];
    return enrichData(dataArr, config, 'fallback');
  }

  return null;
}

// ── MAIN FETCH FUNCTION — THREE-TIER FALLBACK ──
export async function fetchDosmData<T = Record<string, unknown>>(
  datasetId: DatasetId | string,
  options: DosmQueryOptions = {}
): Promise<DosmDataResult<T>> {
  const config = DOSM_REGISTRY[datasetId as DatasetId];
  if (!config) {
    throw new DosmApiError(
      `Dataset "${datasetId}" not found in registry`,
      404,
      String(datasetId)
    );
  }

  const { id: resolvedId, corrected: wasCorrected, originalId } = resolveId(config.id);

  const cacheKey = getCacheKey(String(datasetId), options);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data as DosmDataResult<T>;
  }

  // ── TIER 1: API Proxy ──
  try {
    const params = new URLSearchParams();
    params.set('id', resolvedId);
    params.set('limit', String(options.limit ?? config.defaultLimit));
    // CORRECT SORT SYNTAX: use "-date" prefix for descending
    const sortDir = options.sort ?? 'desc';
    params.set('sort', sortDir === 'desc' ? `-${config.dateField}` : config.dateField);

    // Apply defaultFilter from config if not overridden
    const filters = {
      ...(config.defaultFilter ?? {}),
      ...(options.filters ?? {}),
    };
    Object.entries(filters).forEach(([k, v]) => {
      params.set(k, String(v));
    });

    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    // Get X-Fields from response header for field validation
    const actualFields = res.headers.get('X-Fields')?.split(',') ?? [];
    const correctedFromProxy = res.headers.get('X-ID-Corrected');

    if (res.ok) {
      const json = await res.json();
      const dataArr: T[] = Array.isArray(json) ? json : (json.data ?? []);

      if (dataArr.length > 0) {
        // Run field guard validation
        const fieldGuard = guardFields(
          dataArr as Record<string, unknown>[],
          String(datasetId),
          { valueField: config.valueField, dateField: config.dateField, groupField: config.groupField }
        );

        if (!fieldGuard.safe) {
          console.warn(
            `[DoSM Client] Field mismatch for "${datasetId}":`,
            fieldGuard.suggestion
          );
        }

        // Sort using DoSM-aware date parser (handles "2024-Q2" format)
        const sorted = [...dataArr].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
          const dateA = parseDosmDate(String(a[config.dateField] ?? '')).getTime();
          const dateB = parseDosmDate(String(b[config.dateField] ?? '')).getTime();
          return dateB - dateA;
        });

        const result = enrichData<T>(sorted, config, 'live', fieldGuard);
        if (wasCorrected || correctedFromProxy) {
          (result as DosmDataResult).correctedId = correctedFromProxy ?? resolvedId;
        }
        (result as DosmDataResult).tier = 'api';

        // Cache the result
        cache.set(cacheKey, {
          data: result,
          expires: Date.now() + Math.min(config.refreshMs, CACHE_TTL_MS),
        });

        return result as DosmDataResult<T>;
      }
    }

    // API returned non-OK or empty data — fall through to Tier 2
    const errJson = await res.json().catch(() => ({ error: res.statusText }));
    console.warn(`[DoSM Client] API tier failed for "${datasetId}": HTTP ${res.status}`);
  } catch (apiErr: unknown) {
    const message = apiErr instanceof Error ? apiErr.message : 'API fetch error';
    console.warn(`[DoSM Client] API tier failed for "${datasetId}": ${message}`);
  }

  // ── TIER 2: Direct CSV Download ──
  try {
    const csvFilters: Record<string, string> = {};
    const filters = {
      ...(config.defaultFilter ?? {}),
      ...(options.filters ?? {}),
    };
    Object.entries(filters).forEach(([k, v]) => {
      csvFilters[k] = String(v);
    });

    const csvResult = await fetchDosmCSV(resolvedId, config.valueField, config.dateField, {
      limit: options.limit ?? config.defaultLimit,
      filters: csvFilters,
    });

    if (csvResult.data.length > 0) {
      console.log(`[DoSM Client] CSV tier success for "${datasetId}": ${csvResult.data.length} rows from ${csvResult.url}`);

      const result = enrichData(csvResult.data as T[], config, 'csv');
      (result as DosmDataResult).tier = 'csv';

      cache.set(cacheKey, {
        data: result,
        expires: Date.now() + Math.min(config.refreshMs, CACHE_TTL_MS),
      });

      return result as DosmDataResult<T>;
    }
  } catch (csvErr: unknown) {
    const message = csvErr instanceof Error ? csvErr.message : 'CSV fetch error';
    console.warn(`[DoSM Client] CSV tier failed for "${datasetId}": ${message}`);
  }

  // ── TIER 3: Static Fallback ──
  const fallback = getStaticFallback<T>(resolvedId, config);
  if (fallback) {
    console.warn(`[DoSM Client] Using static fallback for "${datasetId}"`);

    // Apply filters to static data
    let data = fallback.raw as T[];
    if (options.filters || config.defaultFilter) {
      const filters = {
        ...(config.defaultFilter ?? {}),
        ...(options.filters ?? {}),
      };
      data = data.filter((row: Record<string, unknown>) =>
        Object.entries(filters).every(
          ([k, v]) => String(row[k]).toLowerCase() === String(v).toLowerCase()
        )
      ) as T[];

      if (data.length > 0) {
        const enriched = enrichData(data, config, 'fallback');
        (enriched as DosmDataResult).tier = 'static';
        return enriched as DosmDataResult<T>;
      }
    }

    (fallback as DosmDataResult).tier = 'static';
    return { ...fallback, error: 'API and CSV unavailable, using static fallback' } as DosmDataResult<T>;
  }

  // Total failure — no data available at any tier
  const emptyResult = createEmptyResult(config, 'All fetch tiers failed — API, CSV, and static fallback unavailable');
  cache.set(cacheKey, { data: emptyResult, expires: Date.now() + CACHE_TTL_MS });
  return emptyResult as DosmDataResult<T>;
}

// ── FETCH MULTIPLE DATASETS IN PARALLEL ──
export async function fetchMany(
  datasets: Array<{ id: DatasetId; options?: DosmQueryOptions }>
): Promise<Record<string, DosmDataResult | null>> {
  const results = await Promise.allSettled(
    datasets.map(d => fetchDosmData(d.id, d.options ?? {}))
  );

  return Object.fromEntries(
    datasets.map((d, i) => [
      d.id,
      results[i].status === 'fulfilled' ? results[i].value : null,
    ])
  );
}

// ── ENRICHMENT ──
function enrichData<T>(
  sorted: T[],
  config: DatasetConfig,
  status: DataStatus = 'live',
  fieldGuard?: FieldGuardResult
): DosmDataResult<T> {
  const valueField = config.valueField;
  const latest = sorted[0];
  const previous = sorted[1] ?? sorted[0];
  const history = sorted.slice(0, 12).reverse();

  const values = sorted
    .map((d: unknown) => parseFloat(String((d as Record<string, unknown>)[valueField] ?? 0)) || 0)
    .filter(v => !isNaN(v));

  const latestValue = parseFloat(String((latest as Record<string, unknown>)[valueField] ?? 0)) || 0;
  const prevValue = parseFloat(String((previous as Record<string, unknown>)[valueField] ?? 0)) || 0;
  const change = parseFloat((latestValue - prevValue).toFixed(4));
  const changePct = prevValue !== 0
    ? parseFloat(((change / Math.abs(prevValue)) * 100).toFixed(2))
    : 0;

  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;
  const avg = values.length > 0
    ? parseFloat((values.reduce((s, v) => s + v, 0) / values.length).toFixed(4))
    : 0;

  const trend: DosmDataResult['trend'] =
    changePct > 0.1 ? 'up' :
    changePct < -0.1 ? 'down' : 'flat';

  return {
    raw: sorted,
    latest,
    previous,
    history,
    config,
    fetchedAt: new Date(),
    latestValue,
    prevValue,
    change,
    changePct,
    trend,
    min,
    max,
    avg,
    status,
    tier: status === 'live' ? 'api' : status === 'csv' ? 'csv' : 'static',
    fieldGuard,
  };
}

function createEmptyResult(config: DatasetConfig, error?: string): DosmDataResult {
  const empty = {} as Record<string, unknown>;
  empty[config.dateField] = new Date().toISOString();
  empty[config.valueField] = 0;
  return {
    raw: [empty as Record<string, unknown>],
    latest: empty as Record<string, unknown>,
    previous: empty as Record<string, unknown>,
    history: [empty as Record<string, unknown>],
    config,
    fetchedAt: new Date(),
    latestValue: 0,
    prevValue: 0,
    change: 0,
    changePct: 0,
    trend: 'flat',
    min: 0,
    max: 0,
    avg: 0,
    error: error ?? 'No data returned from API',
    status: 'error',
    tier: 'static',
  };
}

// ── CLEAR CACHE ──
export function clearCache(datasetId?: string): void {
  if (datasetId) {
    for (const key of cache.keys()) {
      if (key.startsWith(datasetId)) cache.delete(key);
    }
  } else {
    cache.clear();
  }
}

// ── CUSTOM ERROR ──
export class DosmApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public datasetId: string
  ) {
    super(message);
    this.name = 'DosmApiError';
  }
}
