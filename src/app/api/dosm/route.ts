// src/app/api/dosm/route.ts
// Server proxy for api.data.gov.my/data-catalogue
// Adds: caching, ID correction, sort syntax fix, field introspection,
//       CSV fallback headers, diagnostics, CORS, timeout
//
// v4 CHANGES:
//   - CRITICAL: Added `export const runtime = "edge"` — without this,
//     Cloudflare Workers returns 404 for ALL API route requests
//   - Added `export const dynamic = "force-dynamic"` to prevent static caching
//   - Fix sort syntax: "date desc" → "-date" (API uses "-" prefix for desc)
//   - Add X-CSV-Download header pointing to storage.data.gov.my
//   - Better error diagnosis with CSV fallback suggestion
//   - Detailed field logging for debugging

// ═══════════════════════════════════════════════════════════════
// CRITICAL: These two lines MUST be at the top of the file.
// Without them, Cloudflare Workers returns 404 for this route.
// ═══════════════════════════════════════════════════════════════
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { ID_CORRECTIONS } from '@/lib/dosm/ground-truth-registry';
import { getCsvUrl } from '@/lib/dosm/csv-urls';

const UPSTREAM = 'https://api.data.gov.my/data-catalogue';
const CSV_BASE_FALLBACK = 'https://storage.data.gov.my/data-catalogue'; // Legacy fallback URL
const CACHE_SECS = 300; // 5 min server cache
const TIMEOUT_MS = 10_000; // 10-second upstream timeout

// ── In-memory cache with field metadata ────────────────────────
interface CacheEntry {
  body: string;
  fields: string;
  recordCount: number;
  correctedId?: string;
  expires: number;
}

const memCache = new Map<string, CacheEntry>();

// ── Known wrong IDs with specific suggestions ──────────────────
const WRONG_ID_SUGGESTIONS: Record<string, string> = {
  gdp_annual_nominal_supply: 'Use "gdp_annual" instead',
  gdp_qtr_nominal: 'Use "gdp_qtr" instead',
  gdp_state_real_supply: 'Use "gdp_state" instead',
  gdp_annual_real_supply_granular: 'Use "gdp_state" instead',
  labour_unemployment: 'Use "lfs_month" instead',
  labour_unemployment_state: 'Use "lfs_state" instead',
  lfs_state_sex: 'Use "lfs_state" instead',
  exchange_rate: 'Use "exchangerates_monthly" instead',
  exchangerates: 'Use "exchangerates_monthly" instead',
  cpi_headline_inflation: 'Inflation is computed from cpi_headline, not a separate dataset. Use "cpi_headline"',
  crime_district: 'Use "crime_index" instead',
  population_age: 'Use "population_malaysia" instead',
  births_annual: 'Use "births" instead',
  household_income: 'Use "hies_malaysia" instead',
  hh_income_state: 'Use "hies_state" instead',
  hh_poverty_state: 'Use "poverty_absolute" instead',
  trade_headline: 'Use "trade_monthly" instead',
  bop_balance: 'Use "bop" instead',
  fdi_flows: 'Use "fdi" instead',
  federal_finance_year_revenue: 'Use "federal_finance_year" with series_type filter instead',
};

// ── Helpers ────────────────────────────────────────────────────

function extractFieldsFromBody(body: string): { fields: string; recordCount: number } {
  try {
    const parsed = JSON.parse(body);
    const arr: unknown[] = Array.isArray(parsed) ? parsed : parsed?.data ?? [];
    if (arr.length === 0) {
      return { fields: '', recordCount: 0 };
    }
    const first = arr[0];
    if (first && typeof first === 'object' && first !== null) {
      const fieldNames = Object.keys(first).sort().join(',');
      return { fields: fieldNames, recordCount: arr.length };
    }
    return { fields: '', recordCount: arr.length };
  } catch {
    return { fields: '', recordCount: 0 };
  }
}

function diagnoseError(err: unknown, datasetId: string): { message: string; status: number } {
  if (err instanceof Error) {
    if (err.name === 'AbortError') {
      return { message: 'Request timed out — api.data.gov.my did not respond within 10 seconds', status: 504 };
    }
    if (err.message.includes('ENOTFOUND') || err.message.includes('EAI_AGAIN')) {
      return { message: 'Cannot reach api.data.gov.my from this environment (DNS resolution failed)', status: 502 };
    }
    if (err.message.includes('ECONNREFUSED')) {
      return { message: 'Cannot reach api.data.gov.my — connection refused', status: 502 };
    }
    if (err.message.includes('ECONNRESET')) {
      return { message: 'Connection to api.data.gov.my was reset', status: 502 };
    }
    console.error(`[DoSM Proxy] Network error for "${datasetId}":`, err.message);
    return { message: `Unable to connect to api.data.gov.my: ${err.message}`, status: 502 };
  }
  return { message: 'Unknown error connecting to api.data.gov.my', status: 502 };
}

function buildHeaders(opts: {
  cacheStatus: 'HIT' | 'MISS';
  datasetId: string;
  correctedId?: string;
  fields?: string;
  recordCount?: number;
}): Record<string, string> {
  const csvUrl = getCsvUrl(opts.datasetId) ?? `https://storage.data.gov.my/data-catalogue/${opts.datasetId}.csv`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Cache': opts.cacheStatus,
    'X-Dataset': opts.datasetId,
    'X-Source': 'api.data.gov.my/data-catalogue',
    'X-CSV-Download': csvUrl,
    'Cache-Control': `public, s-maxage=${CACHE_SECS}`,
    'Access-Control-Allow-Origin': '*',
  };

  if (opts.correctedId && opts.correctedId !== opts.datasetId) {
    headers['X-ID-Corrected'] = opts.correctedId;
  }
  if (opts.fields) {
    headers['X-Fields'] = opts.fields;
  }
  if (opts.recordCount !== undefined) {
    headers['X-Record-Count'] = String(opts.recordCount);
  }

  return headers;
}

// ── Fix sort syntax ────────────────────────────────────────────
// Convert "date desc" → "-date" and "date asc" → "date"
function fixSortSyntax(searchParams: URLSearchParams): void {
  const rawSort = searchParams.get('sort');
  if (!rawSort) return;

  if (rawSort.endsWith(' desc')) {
    const field = rawSort.replace(' desc', '').trim();
    searchParams.set('sort', `-${field}`);
    console.log(`[DoSM Proxy] Sort syntax fixed: "${rawSort}" → "-${field}"`);
  } else if (rawSort.endsWith(' asc')) {
    const field = rawSort.replace(' asc', '').trim();
    searchParams.set('sort', field);
  }
  // Already correct: "-date" or "date" → leave as-is
}

// ── Main handler ───────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let datasetId = searchParams.get('id');

  if (!datasetId) {
    return NextResponse.json(
      {
        error: "Parameter 'id' diperlukan",
        example: '/api/dosm?id=gdp_qtr&series_type=growth_yoy&limit=8&sort=-date',
        docs: 'https://developer.data.gov.my',
      },
      { status: 400 }
    );
  }

  // ── ID Correction ──────────────────────────────────────
  const corrected = ID_CORRECTIONS.get(datasetId);
  if (corrected && corrected !== datasetId) {
    console.log(`[DoSM] ID corrected: "${datasetId}" → "${corrected}"`);
    searchParams.set('id', corrected);
    datasetId = corrected;
  }

  // ── Fix Sort Syntax ────────────────────────────────────
  fixSortSyntax(searchParams);

  const cacheKey = searchParams.toString();

  // ── Serve from cache ───────────────────────────────────
  const hit = memCache.get(cacheKey);
  if (hit && hit.expires > Date.now()) {
    return new NextResponse(hit.body, {
      headers: buildHeaders({
        cacheStatus: 'HIT',
        datasetId,
        correctedId: hit.correctedId,
        fields: hit.fields,
        recordCount: hit.recordCount,
      }),
    });
  }

  // ── Fetch with AbortController timeout ─────────────────
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = new URL(UPSTREAM);
    searchParams.forEach((v, k) => upstream.searchParams.set(k, v));

    const res = await fetch(upstream.toString(), {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'MalaysiaOpenDataCommandCenter/3.0 (+data.gov.my)',
      },
      signal: controller.signal,
    });

    // ── Upstream returned non-2xx ─────────────────────────
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[DoSM Proxy] Upstream error ${res.status} for "${datasetId}":`, text.substring(0, 200));

      if (res.status === 404) {
        const suggestion = WRONG_ID_SUGGESTIONS[datasetId];
        const csvUrl = getCsvUrl(datasetId);
        return NextResponse.json(
          {
            error: `Dataset "${datasetId}" not found on api.data.gov.my`,
            suggestion: suggestion ?? 'Check the dataset ID at https://data.gov.my/data-catalogue',
            dataset: datasetId,
            csvFallback: csvUrl ?? `${CSV_BASE_FALLBACK}/${datasetId}.csv`,
            csvAvailable: csvUrl !== null,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: `DoSM API returned HTTP ${res.status}`,
          dataset: datasetId,
          upstreamBody: text.substring(0, 200),
          csvFallback: getCsvUrl(datasetId) ?? `${CSV_BASE_FALLBACK}/${datasetId}.csv`,
        },
        { status: res.status }
      );
    }

    const body = await res.text();

    // ── Parse JSON ────────────────────────────────────────
    let parsed: unknown;
    try {
      parsed = JSON.parse(body);
    } catch {
      console.error(`[DoSM Proxy] Upstream returned invalid JSON for "${datasetId}":`, body.substring(0, 200));
      return NextResponse.json(
        {
          error: 'Upstream returned invalid JSON — api.data.gov.my may be experiencing issues',
          dataset: datasetId,
          rawPreview: body.substring(0, 200),
          csvFallback: getCsvUrl(datasetId) ?? `${CSV_BASE_FALLBACK}/${datasetId}.csv`,
        },
        { status: 502 }
      );
    }

    // Determine the data array
    const dataArray: unknown[] = Array.isArray(parsed) ? parsed : (parsed as Record<string, unknown>)?.data ?? [];

    if (dataArray.length === 0) {
      const suggestion = WRONG_ID_SUGGESTIONS[datasetId];
      console.warn(`[DoSM Proxy] Empty response for "${datasetId}" — dataset ID likely does not exist or filters excluded all rows`);

      return NextResponse.json(
        {
          error: `Empty response for dataset "${datasetId}" — ID may not exist or filters excluded all rows`,
          suggestion: suggestion ?? 'Verify the dataset ID at https://data.gov.my/data-catalogue',
          dataset: datasetId,
          recordCount: 0,
          csvFallback: getCsvUrl(datasetId) ?? `${CSV_BASE_FALLBACK}/${datasetId}.csv`,
        },
        { status: 404 }
      );
    }

    // ── Extract fields and record count ───────────────────
    const { fields, recordCount } = extractFieldsFromBody(body);

    // Log successful fetch with field info
    console.log(
      `[DoSM ✅] ${datasetId} | ${recordCount} records | fields: ${fields} | filters: ${JSON.stringify(Object.fromEntries(searchParams.entries()))}`
    );

    // ── Cache the response with metadata ──────────────────
    memCache.set(cacheKey, {
      body,
      fields,
      recordCount,
      correctedId: corrected ?? undefined,
      expires: Date.now() + CACHE_SECS * 1000,
    });

    // Simple GC: evict expired entries when cache grows
    if (memCache.size > 200) {
      const now = Date.now();
      for (const [k, v] of memCache.entries()) {
        if (v.expires < now) memCache.delete(k);
      }
    }

    return new NextResponse(body, {
      headers: buildHeaders({
        cacheStatus: 'MISS',
        datasetId,
        correctedId: corrected ?? undefined,
        fields,
        recordCount,
      }),
    });
  } catch (err: unknown) {
    // ── Diagnose common failures ──────────────────────────
    const { message, status } = diagnoseError(err, datasetId);
    return NextResponse.json(
      {
        error: message,
        dataset: datasetId,
        csvFallback: getCsvUrl(datasetId) ?? `${CSV_BASE_FALLBACK}/${datasetId}.csv`,
        note: 'If API is unreachable, try the CSV fallback URL or use client-side fetchDosmCSV()',
      },
      { status }
    );
  } finally {
    clearTimeout(timeout);
  }
}
