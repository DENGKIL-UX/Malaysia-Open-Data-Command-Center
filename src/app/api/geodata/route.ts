import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const layer = searchParams.get('layer') || 'states';

  const fileMap: Record<string, string> = {
    states: path.join(process.cwd(), 'public', 'geodata', 'states.geojson'),
    districts: path.join(process.cwd(), 'public', 'geodata', 'districts.geojson'),
    parlimen: path.join(process.cwd(), 'public', 'geodata', 'parlimen.geojson'),
  };

  const filePath = fileMap[layer];
  if (!filePath) {
    return NextResponse.json({ error: 'Invalid layer' }, { status: 400 });
  }

  try {
    const data = await readFile(filePath, 'utf-8');
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
