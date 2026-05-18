// src/app/api/dosm/csv/route.ts
// Server-side CSV proxy for storage.dosm.gov.my
// Fetches CSV on the server side and returns parsed JSON.
//
// v5 CHANGES:
//   - CRITICAL: Added `export const runtime = "edge"` — without this,
//     Cloudflare Workers returns 404 for ALL API route requests
//   - Added `export const dynamic = "force-dynamic"` to prevent static caching
//   - Use getCsvUrl() from csv-urls.ts for correct per-category URLs
//   - Remove `next: { revalidate }` (not supported on Cloudflare Workers)
//   - Fall back to legacy storage.data.gov.my URL when mapping URL fails

// ═══════════════════════════════════════════════════════════════
// CRITICAL: These two lines MUST be at the top of the file.
// Without them, Cloudflare Workers returns 404 for this route.
// ═══════════════════════════════════════════════════════════════
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { parseDosmDate } from '@/lib/dosm/yaml-reality';
import { ID_CORRECTIONS } from '@/lib/dosm/ground-truth-registry';
import { getCsvUrl } from '@/lib/dosm/csv-urls';

const CSV_BASE_FALLBACK = 'https://storage.data.gov.my/data-catalogue'; // Legacy fallback
const CACHE_SECS = 300; // 5 min server cache
const TIMEOUT_MS = 15_000; // 15-second upstream timeout (CSV files can be large)

// ── In-memory cache ──────────────────────────────────────────────
interface CsvCacheEntry {
  body: string;
  fields: string;
  recordCount: number;
  correctedId?: string;
  expires: number;
}

const memCache = new Map<string, CsvCacheEntry>();

// ── Minimal CSV Parser (respects quoted fields) ─────────────────
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseCSV(text: string): Record<string, unknown>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));

  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = parseCSVLine(line);
      const row: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        const raw = (values[i] ?? '').trim().replace(/^"|"$/g, '');
        // Auto-cast numbers
        if (raw !== '' && !isNaN(Number(raw))) {
          row[h] = Number(raw);
        } else {
          row[h] = raw;
        }
      });
      return row;
    })
    .filter(row => Object.keys(row).length > 0);
}

// ── Build response headers ───────────────────────────────────────
function buildHeaders(opts: {
  cacheStatus: 'HIT' | 'MISS';
  datasetId: string;
  correctedId?: string;
  fields?: string;
  recordCount?: number;
}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Cache': opts.cacheStatus,
    'X-Dataset': opts.datasetId,
    'X-Source': 'storage.dosm.gov.my/csv-proxy',
    'X-CSV-Original': getCsvUrl(opts.datasetId) ?? `${CSV_BASE_FALLBACK}/${opts.datasetId}.csv`,
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

// ── Process CSV text into a filtered, sorted, limited JSON response ──
function processCsvResponse(
  csvText: string,
  datasetId: string,
  correctedId: string | undefined,
  filterParams: Record<string, string>,
  sortFieldParam: string | null,
  sortAscParam: string | null,
  limitParam: string | null,
  cacheKey: string,
): NextResponse | null {
  const allData = parseCSV(csvText);

  if (allData.length === 0) {
    return null; // Caller handles empty CSV
  }

  // ── Apply filters from query params ───────────────────
  let filtered = allData;
  if (Object.keys(filterParams).length > 0) {
    filtered = allData.filter(row =>
      Object.entries(filterParams).every(
        ([k, v]) => String(row[k]).toLowerCase() === v.toLowerCase()
      )
    );
  }

  // ── Sort by date field (default: descending = latest first) ──
  const sortField = sortFieldParam || 'date';
  const sortAsc = sortAscParam === 'true';
  const dateField = filtered.length > 0 && filtered[0][sortField] !== undefined
    ? sortField
    : 'date';

  const sorted = [...filtered].sort((a, b) => {
    try {
      const dateA = parseDosmDate(String(a[dateField]))?.getTime() ?? 0;
      const dateB = parseDosmDate(String(b[dateField]))?.getTime() ?? 0;
      return sortAsc ? dateA - dateB : dateB - dateA;
    } catch {
      return 0;
    }
  });

  // ── Apply limit ───────────────────────────────────────
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  const limited = limit ? sorted.slice(0, limit) : sorted;

  // ── Extract field names for diagnostic header ─────────
  const fields = Object.keys(allData[0] ?? {}).sort().join(',');

  const responseBody = JSON.stringify(limited);

  // ── Cache the response ────────────────────────────────
  memCache.set(cacheKey, {
    body: responseBody,
    fields,
    recordCount: limited.length,
    correctedId: correctedId ?? undefined,
    expires: Date.now() + CACHE_SECS * 1000,
  });

  // Simple GC: evict expired entries when cache grows
  if (memCache.size > 200) {
    const now = Date.now();
    for (const [k, v] of memCache.entries()) {
      if (v.expires < now) memCache.delete(k);
    }
  }

  console.log(
    `[DoSM CSV ✅] ${datasetId} | ${limited.length}/${allData.length} records | fields: ${fields} | filters: ${JSON.stringify(filterParams)}`
  );

  return new NextResponse(responseBody, {
    headers: buildHeaders({
      cacheStatus: 'MISS',
      datasetId,
      correctedId: correctedId ?? undefined,
      fields,
      recordCount: limited.length,
    }),
  });
}

// ── Main handler ─────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let datasetId = searchParams.get('id');

  if (!datasetId) {
    return NextResponse.json(
      {
        error: "Parameter 'id' diperlukan for CSV proxy",
        example: '/api/dosm/csv?id=exchangerates_monthly',
      },
      { status: 400 }
    );
  }

  // ── ID Correction ──────────────────────────────────────
  const corrected = ID_CORRECTIONS.get(datasetId);
  if (corrected && corrected !== datasetId) {
    console.log(`[DoSM CSV Proxy] ID corrected: "${datasetId}" → "${corrected}"`);
    searchParams.set('id', corrected);
    datasetId = corrected;
  }

  // ── Extract filter params (everything except 'id') ─────
  const filterParams: Record<string, string> = {};
  const limitParam = searchParams.get('limit');
  const sortFieldParam = searchParams.get('sortField');
  const sortAscParam = searchParams.get('sortAsc');

  searchParams.forEach((v, k) => {
    if (k !== 'id' && k !== 'limit' && k !== 'sortField' && k !== 'sortAsc') {
      filterParams[k] = v;
    }
  });

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

  // ── Resolve CSV URL: prefer storage.dosm.gov.my mapping, fall back to legacy URL ──
  const csvUrl = getCsvUrl(datasetId) ?? `${CSV_BASE_FALLBACK}/${datasetId}.csv`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Try primary URL first (storage.dosm.gov.my if mapped, or legacy)
    let res = await fetch(csvUrl, {
      headers: {
        Accept: 'text/csv, text/plain',
        'User-Agent': 'MalaysiaOpenDataCommandCenter/3.0 (+data.gov.my)',
      },
      signal: controller.signal,
    });

    // ── If primary URL fails and we used the mapping, try the legacy URL as fallback ──
    if (!res.ok && getCsvUrl(datasetId)) {
      console.warn(`[DoSM CSV Proxy] Primary URL failed (${res.status}), trying legacy URL`);
      const legacyUrl = `${CSV_BASE_FALLBACK}/${datasetId}.csv`;
      res = await fetch(legacyUrl, {
        headers: {
          Accept: 'text/csv, text/plain',
          'User-Agent': 'MalaysiaOpenDataCommandCenter/3.0 (+data.gov.my)',
        },
        signal: controller.signal,
      });
    }

    if (!res.ok) {
      console.error(`[DoSM CSV Proxy] Fetch failed: HTTP ${res.status} for ${csvUrl}`);
      return NextResponse.json(
        {
          error: `CSV download failed: HTTP ${res.status}`,
          dataset: datasetId,
          csvUrl,
        },
        { status: res.status }
      );
    }

    const csvText = await res.text();
    const result = processCsvResponse(
      csvText, datasetId, corrected ?? undefined,
      filterParams, sortFieldParam, sortAscParam, limitParam, cacheKey,
    );

    if (!result) {
      return NextResponse.json(
        {
          error: `Empty CSV for dataset "${datasetId}"`,
          dataset: datasetId,
          csvUrl,
        },
        { status: 404 }
      );
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error fetching CSV';
    console.error(`[DoSM CSV Proxy] Error for "${datasetId}":`, message);

    return NextResponse.json(
      {
        error: `CSV proxy error: ${message}`,
        dataset: datasetId,
        csvUrl,
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
