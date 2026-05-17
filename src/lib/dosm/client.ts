// src/lib/dosm/client.ts
// Client for api.data.gov.my/data-catalogue
// Handles fetching, caching, error handling, and data enrichment

import { DOSM_REGISTRY, type DatasetId, type DatasetConfig } from './registry';

const BASE_URL = '/api/dosm'; // Proxied through our server route
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min default cache

// ── TYPES ──
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
}

// ── IN-MEMORY CACHE ──
const cache = new Map<string, { data: DosmDataResult; expires: number }>();

function getCacheKey(datasetId: string, options: DosmQueryOptions): string {
  return `${datasetId}:${JSON.stringify(options)}`;
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

  const cacheKey = getCacheKey(String(datasetId), options);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data as DosmDataResult<T>;
  }

  // Build query params for our proxy
  const params = new URLSearchParams();
  params.set('id', config.id);
  params.set('limit', String(options.limit ?? config.defaultLimit));
  if (options.sort) {
    params.set('sort', options.sort);
  }
  if (options.filters) {
    Object.entries(options.filters).forEach(([k, v]) => {
      params.set(k, String(v));
    });
  }

  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new DosmApiError(
        `Fetch failed: ${res.status} ${res.statusText} — ${body}`,
        res.status,
        String(datasetId)
      );
    }

    const json = await res.json();
    const dataArr: T[] = Array.isArray(json) ? json : (json.data ?? []);

    if (dataArr.length === 0) {
      const emptyResult = createEmptyResult(config);
      cache.set(cacheKey, { data: emptyResult, expires: Date.now() + CACHE_TTL_MS });
      return emptyResult as DosmDataResult<T>;
    }

    // Sort by date descending (latest first)
    const sorted = [...dataArr].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const dateA = new Date(String(a[config.dateField] ?? 0)).getTime();
      const dateB = new Date(String(b[config.dateField] ?? 0)).getTime();
      return dateB - dateA;
    });

    const result = enrichData(sorted as T[], config);

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      expires: Date.now() + Math.min(config.refreshMs, CACHE_TTL_MS),
    });

    return result as DosmDataResult<T>;
  } catch (err) {
    if (err instanceof DosmApiError) throw err;
    throw new DosmApiError(
      `Network error: ${err instanceof Error ? err.message : 'Unknown'}`,
      0,
      String(datasetId)
    );
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
function enrichData<T>(sorted: T[], config: DatasetConfig): DosmDataResult<T> {
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
  };
}

function createEmptyResult(config: DatasetConfig): DosmDataResult {
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
    error: 'No data returned from API',
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
