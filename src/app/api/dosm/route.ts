// src/app/api/dosm/route.ts
// Server proxy for api.data.gov.my/data-catalogue
// Adds: caching, error handling, CORS

import { NextRequest, NextResponse } from 'next/server';

const UPSTREAM = 'https://api.data.gov.my/data-catalogue';
const CACHE_SECS = 300; // 5 min server cache

// Simple in-memory cache for server-side
const memCache = new Map<string, { body: string; expires: number }>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const datasetId = searchParams.get('id');

  if (!datasetId) {
    return NextResponse.json(
      { error: "Parameter 'id' is required" },
      { status: 400 }
    );
  }

  const cacheKey = searchParams.toString();

  // Serve from cache
  const hit = memCache.get(cacheKey);
  if (hit && hit.expires > Date.now()) {
    return new NextResponse(hit.body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
        'X-Dataset': datasetId,
        'Cache-Control': `public, s-maxage=${CACHE_SECS}`,
      },
    });
  }

  // Forward to data.gov.my
  try {
    const upstream = new URL(UPSTREAM);
    searchParams.forEach((v, k) => upstream.searchParams.set(k, v));

    const res = await fetch(upstream.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MalaysiaOpenDataCommandCenter/1.0 (+data.gov.my)',
      },
      next: { revalidate: CACHE_SECS },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[DoSM Proxy] Upstream error ${res.status}:`, text.substring(0, 200));

      return NextResponse.json(
        { error: `DoSM API returned ${res.status}`, dataset: datasetId },
        { status: res.status }
      );
    }

    const body = await res.text();

    // Cache the response
    memCache.set(cacheKey, {
      body,
      expires: Date.now() + CACHE_SECS * 1000,
    });

    // Clean old cache entries (simple GC)
    if (memCache.size > 200) {
      const now = Date.now();
      for (const [k, v] of memCache.entries()) {
        if (v.expires < now) memCache.delete(k);
      }
    }

    return new NextResponse(body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
        'X-Dataset': datasetId,
        'X-Source': 'api.data.gov.my/data-catalogue',
        'Cache-Control': `public, s-maxage=${CACHE_SECS}`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[DoSM Proxy] Network error:', message);

    return NextResponse.json(
      { error: 'Unable to connect to api.data.gov.my', detail: message, dataset: datasetId },
      { status: 502 }
    );
  }
}
