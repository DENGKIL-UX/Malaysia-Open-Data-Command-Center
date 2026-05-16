import { NextResponse } from 'next/server';

// Edge runtime — compatible with Cloudflare Pages Workers
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const layer = searchParams.get('layer') || 'states';

  const fileMap: Record<string, string> = {
    states: '/geodata/states.geojson',
    districts: '/geodata/districts.geojson',
    parlimen: '/geodata/parlimen.geojson',
  };

  const filePath = fileMap[layer];
  if (!filePath) {
    return NextResponse.json({ error: 'Invalid layer' }, { status: 400 });
  }

  try {
    // Fetch static asset from origin — works on Node.js, Cloudflare Pages, and Vercel
    const assetUrl = new URL(filePath, request.url);
    const response = await fetch(assetUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}: ${response.status}`);
    }

    const data = await response.text();
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
