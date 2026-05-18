import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// In-memory cache with 1-hour TTL for GitHub metadata
// ---------------------------------------------------------------------------
interface GitHubCacheEntry {
  data: Record<string, unknown>;
  cachedAt: number;
}

const githubCache = new Map<string, GitHubCacheEntry>();
const GITHUB_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function purgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of githubCache) {
    if (now - entry.cachedAt > GITHUB_CACHE_TTL_MS) {
      githubCache.delete(key);
    }
  }
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { error: 'Missing required query param: id' },
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

  // Check cache first
  purgeExpired();
  const cached = githubCache.get(id);
  if (cached) {
    return NextResponse.json(cached.data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cache-Status': 'HIT',
      },
    });
  }

  // Fetch from GitHub raw content
  const githubUrl = `https://raw.githubusercontent.com/data-gov-my/datagovmy-meta/main/data-catalogue/${encodeURIComponent(id)}.json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(githubUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
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

    // Add source indicator
    const result = { ...data, _source: 'github' } as Record<string, unknown>;

    // Store in cache
    githubCache.set(id, {
      data: result,
      cachedAt: Date.now(),
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600',
        'X-Cache-Status': 'MISS',
      },
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
