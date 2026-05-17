// API Route: Generate infographic PNG using Satori + Sharp
// POST /api/infographic/generate

import { NextRequest, NextResponse } from 'next/server';
import { renderToPng, getExportDimensions } from '@/engine/visual/renderer';
import { OverviewTemplate16x9, OverviewTemplate9x16 } from '@/engine/visual/templates/overview';
import type { InfographicData } from '@/engine/visual/templates/overview';
import { STATES, MALAYSIA_TOTALS } from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';

const INFOGRAPHIC_SOURCES = [
  { abbr: 'DOSM', full_en: 'Dept. of Statistics Malaysia', full_ms: 'Jabatan Perangkaan Malaysia' },
  { abbr: 'BNM', full_en: 'Bank Negara Malaysia', full_ms: 'Bank Negara Malaysia' },
  { abbr: 'KKM', full_en: 'Ministry of Health Malaysia', full_ms: 'Kementerian Kesihatan Malaysia' },
  { abbr: 'JPN', full_en: 'National Registration Dept.', full_ms: 'Jabatan Pendaftaran Negara' },
  { abbr: 'MOT', full_en: 'Ministry of Transport', full_ms: 'Kementerian Pengangkutan' },
  { abbr: 'KD', full_en: 'Ministry of Digital', full_ms: 'Kementerian Digital' },
  { abbr: 'JDN', full_en: 'National Data Dept.', full_ms: 'Jabatan Data Negara' },
  { abbr: 'KPM', full_en: 'Ministry of Education', full_ms: 'Kementerian Pendidikan' },
  { abbr: 'NRES', full_en: 'Ministry of Natural Resources', full_ms: 'Kementerian Sumber Asli' },
  { abbr: 'data.gov.my', full_en: 'Malaysia Open Data Portal', full_ms: 'Portal Data Terbuka Malaysia' },
];

const LAYER_CATEGORY_MAP: Record<string, string[]> = {
  population: ['Demography'],
  gdp: ['National Accounts'],
  demography: ['Demography'],
  healthcare: ['Healthcare'],
  environment: ['Environment'],
  education: ['Education'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lang = 'en',
      selectedLayers = ['population', 'gdp', 'demography'],
      format = '16:9',
    } = body;

    // Validate format
    if (format !== '16:9' && format !== '9:16') {
      return NextResponse.json({ error: 'Invalid format. Use "16:9" or "9:16"' }, { status: 400 });
    }

    // Validate layers
    const validLayers = ['population', 'gdp', 'demography', 'healthcare', 'environment', 'education'];
    const filteredLayers = selectedLayers.filter((l: string) => validLayers.includes(l));
    if (filteredLayers.length === 0) {
      return NextResponse.json({ error: 'No valid layers selected' }, { status: 400 });
    }

    // Compute date range from selected layers
    const allCategories = filteredLayers.flatMap((l: string) => LAYER_CATEGORY_MAP[l] || []);
    const matchingDatasets = DATASETS.filter(d => allCategories.includes(d.category_en));
    let minBegin = 9999, maxEnd = 0;
    const sourceSet = new Set<string>();
    for (const d of matchingDatasets) {
      if (d.dataset_begin < minBegin) minBegin = d.dataset_begin;
      if (d.dataset_end > maxEnd) maxEnd = d.dataset_end;
      d.data_source.forEach(s => sourceSet.add(s));
    }
    if (minBegin === 9999) { minBegin = 2020; maxEnd = 2025; }

    const activeSources = INFOGRAPHIC_SOURCES.filter(s => sourceSet.has(s.abbr) || s.abbr === 'data.gov.my');

    // Build the infographic data
    const infographicData: InfographicData = {
      lang: lang === 'ms' ? 'ms' : 'en',
      selectedLayers: filteredLayers,
      format,
      states: STATES,
      totals: {
        population: MALAYSIA_TOTALS.population,
        gdp: MALAYSIA_TOTALS.gdp,
        gdpGrowth: MALAYSIA_TOTALS.gdpGrowth,
        births: MALAYSIA_TOTALS.births,
        deaths: MALAYSIA_TOTALS.deaths,
        unemployment: MALAYSIA_TOTALS.unemployment,
        datasets: MALAYSIA_TOTALS.datasets,
      },
      sources: activeSources,
      dateRange: { minBegin, maxEnd },
    };

    // Get dimensions
    const dimensions = getExportDimensions(format);

    // Render template
    const template = format === '16:9'
      ? OverviewTemplate16x9({ data: infographicData })
      : OverviewTemplate9x16({ data: infographicData });

    // Render to PNG
    const pngBuffer = await renderToPng({
      width: dimensions.width,
      height: dimensions.height,
      element: template,
    });

    // Return PNG response
    return new NextResponse(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="malaysia-open-data-infographic-${format.replace(':', 'x')}-${Date.now()}.png"`,
        'Cache-Control': 'no-cache',
        'X-Image-Width': dimensions.width.toString(),
        'X-Image-Height': dimensions.height.toString(),
      },
    });
  } catch (error) {
    console.error('Infographic generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate infographic', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
