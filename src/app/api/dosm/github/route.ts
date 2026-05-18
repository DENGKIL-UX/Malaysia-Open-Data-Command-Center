import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// In-memory cache with 1-hour TTL for GitHub metadata
// ---------------------------------------------------------------------------
interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

const githubCache = new Map<string, CacheEntry<unknown>>();
const GITHUB_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of githubCache) {
    if (now - entry.cachedAt > GITHUB_CACHE_TTL_MS) {
      githubCache.delete(key);
    }
  }
}

const CACHE_HEADERS_HIT = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  'X-Cache-Status': 'HIT',
} as const;

const CACHE_HEADERS_MISS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  'CDN-Cache-Control': 'public, s-maxage=3600',
  'X-Cache-Status': 'MISS',
} as const;

// ---------------------------------------------------------------------------
// GitHub API helpers
// ---------------------------------------------------------------------------
const GITHUB_API_BASE = 'https://api.github.com/repos/data-gov-my/datagovmy-meta';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/data-gov-my/datagovmy-meta/main';

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  // Optional token for higher rate limits
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// GET handler — supports two modes:
//   ?action=index   → list all dataset IDs from data-catalogue directory
//   ?id=<datasetId>  → fetch metadata JSON for a single dataset
// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');

  // ── Mode 1: Catalogue index ──────────────────────────────────────
  if (action === 'index') {
    return handleCatalogueIndex();
  }

  // ── Mode 2: Single dataset metadata ──────────────────────────────
  if (!id) {
    return NextResponse.json(
      { error: 'Missing required query param: id or action=index' },
      { status: 400 },
    );
  }

  // Validate id to prevent path traversal
  if (id.includes('/') || id.includes('..') || id.includes('\\')) {
    return NextResponse.json(
      { error: 'Invalid dataset ID' },
      { status: 400 },
    );
  }

  return handleDatasetMeta(id);
}

// ---------------------------------------------------------------------------
// Catalogue index — fetches directory listing from GitHub API
// ---------------------------------------------------------------------------
async function handleCatalogueIndex(): Promise<Response> {
  const cacheKey = '__catalogue_index__';

  purgeExpired();
  const cached = githubCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached.data, {
      status: 200,
      headers: CACHE_HEADERS_HIT,
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12_000);

    const res = await fetch(
      `${GITHUB_API_BASE}/contents/data-catalogue?ref=main`,
      {
        signal: controller.signal,
        headers: githubHeaders(),
      },
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch catalogue index from GitHub (HTTP ${res.status})`,
          hint: 'The GitHub API may be rate-limited. Try again later.',
        },
        { status: 502 },
      );
    }

    const contents = (await res.json()) as Array<{
      name: string;
      type: string;
      sha: string;
      size: number;
    }>;

    // Each subdirectory in data-catalogue/ is a dataset
    const datasetIds = contents
      .filter((entry) => entry.type === 'dir')
      .map((entry) => entry.name)
      .sort();

    const result = {
      datasets: datasetIds,
      count: datasetIds.length,
      source: 'github',
      fetchedAt: new Date().toISOString(),
    };

    githubCache.set(cacheKey, { data: result, cachedAt: Date.now() });

    return NextResponse.json(result, {
      status: 200,
      headers: CACHE_HEADERS_MISS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to fetch catalogue index from GitHub',
        details: message,
        hint: 'The GitHub API may be temporarily unavailable.',
      },
      { status: 504 },
    );
  }
}

// ---------------------------------------------------------------------------
// Single dataset metadata — fetches JSON from GitHub raw content
// ---------------------------------------------------------------------------
async function handleDatasetMeta(id: string): Promise<Response> {
  purgeExpired();
  const cached = githubCache.get(id);
  if (cached) {
    return NextResponse.json(cached.data, {
      status: 200,
      headers: CACHE_HEADERS_HIT,
    });
  }

  const githubUrl = `${GITHUB_RAW_BASE}/data-catalogue/${encodeURIComponent(id)}/${encodeURIComponent(id)}.json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(githubUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Dataset metadata not found on GitHub (HTTP ${res.status})`,
          id,
          hint: 'Check that the dataset ID is correct. Browse available datasets at https://github.com/data-gov-my/datagovmy-meta/tree/main/data-catalogue',
        },
        { status: 404 },
      );
    }

    const data = (await res.json()) as Record<string, unknown>;

    // Add source indicator and fetched timestamp
    const result = {
      ...data,
      _source: 'github',
      _fetched_at: new Date().toISOString(),
    } as Record<string, unknown>;

    // Store in cache
    githubCache.set(id, { data: result, cachedAt: Date.now() });

    return NextResponse.json(result, {
      status: 200,
      headers: CACHE_HEADERS_MISS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to fetch metadata from GitHub',
        details: message,
        id,
        hint: 'The GitHub metadata service may be temporarily unavailable. Try again later.',
      },
      { status: 504 },
    );
  }
}
