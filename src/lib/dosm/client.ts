// src/lib/dosm/client.ts
// Client for api.data.gov.my/data-catalogue
// Handles fetching, caching, error handling, ID correction, static fallbacks, and data enrichment

import { DOSM_REGISTRY, STATIC_FALLBACKS, ID_CORRECTIONS, type DatasetId, type DatasetConfig } from './registry';
import { guardFields, type FieldGuardResult } from './field-guard';

const BASE_URL = '/api/dosm'; // Proxied through our server route
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min default cache

// ── TYPES ──
export type DataStatus = 'loading' | 'live' | 'fallback' | 'error';

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
  // NEW: Status tracking
  status: DataStatus;
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
function getStaticFallback<T>(datasetId: string, config: DatasetConfig): DosmDataResult<T> | null {
  const fallbackData = (STATIC_FALLBACKS as Record<string, { data: Record<string, unknown>[] }>)[datasetId];

  if (!fallbackData?.data?.length) {
    return null;
  }

  const dataArr = fallbackData.data as T[];
  return enrichData(dataArr, config, 'fallback', undefined);
}

// ── MAIN FETCH FUNCTION ──
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

  // Build query params for our proxy
  const params = new URLSearchParams();
  params.set('id', resolvedId);
  params.set('limit', String(options.limit ?? config.defaultLimit));
  if (options.sort) {
    params.set('sort', options.sort);
  }

  // Apply defaultFilter from config if not overridden
  const filters = {
    ...(config.defaultFilter ?? {}),
    ...(options.filters ?? {}),
  };
  Object.entries(filters).forEach(([k, v]) => {
    params.set(k, String(v));
  });

  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: { 'Accept': 'application/json' },
    });

    // Get X-Fields from response header for field validation
    const actualFields = res.headers.get('X-Fields')?.split(',') ?? [];
    const correctedFromProxy = res.headers.get('X-ID-Corrected');

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({ error: res.statusText }));
      const errMsg = (errJson as Record<string, string>).diagnosis
        ?? (errJson as Record<string, string>).error
        ?? `HTTP ${res.status}`;

      console.warn(`[DoSM Client] API error for "${datasetId}": ${errMsg}`);

      // Try static fallback
      const fallback = getStaticFallback<T>(resolvedId, config);
      if (fallback) {
        return { ...fallback, error: errMsg, status: 'fallback' } as DosmDataResult<T>;
      }

      // No fallback available
      const emptyResult = createEmptyResult(config, errMsg);
      cache.set(cacheKey, { data: emptyResult, expires: Date.now() + CACHE_TTL_MS });
      return emptyResult as DosmDataResult<T>;
    }

    const json = await res.json();
    const dataArr: T[] = Array.isArray(json) ? json : (json.data ?? []);

    if (dataArr.length === 0) {
      // API returned empty data — try static fallback
      const fallback = getStaticFallback<T>(resolvedId, config);
      if (fallback) {
        return { ...fallback, status: 'fallback', error: 'API returned empty data, using static fallback' } as DosmDataResult<T>;
      }

      const emptyResult = createEmptyResult(config, 'No data returned from API');
      cache.set(cacheKey, { data: emptyResult, expires: Date.now() + CACHE_TTL_MS });
      return emptyResult as DosmDataResult<T>;
    }

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

    // Sort by date descending (latest first)
    const sorted = [...dataArr].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const dateA = new Date(String(a[config.dateField] ?? 0)).getTime();
      const dateB = new Date(String(b[config.dateField] ?? 0)).getTime();
      return dateB - dateA;
    });

    const result = enrichData<T>(sorted, config, 'live', fieldGuard);
    if (wasCorrected || correctedFromProxy) {
      (result as DosmDataResult).correctedId = correctedFromProxy ?? resolvedId;
    }

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      expires: Date.now() + Math.min(config.refreshMs, CACHE_TTL_MS),
    });

    return result as DosmDataResult<T>;
  } catch (err) {
    if (err instanceof DosmApiError) throw err;

    const message = err instanceof Error ? err.message : 'Unknown error';
    console.warn(`[DoSM Client] Network error for "${datasetId}": ${message}`);

    // Try static fallback
    const fallback = getStaticFallback<T>(resolvedId, config);
    if (fallback) {
      return { ...fallback, error: message, status: 'fallback' } as DosmDataResult<T>;
    }

    const emptyResult = createEmptyResult(config, message);
    cache.set(cacheKey, { data: emptyResult, expires: Date.now() + CACHE_TTL_MS });
    return emptyResult as DosmDataResult<T>;
  }
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
