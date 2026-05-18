// API Route: Infographic Data Provider
// POST /api/infographic/generate
//
// Returns structured data (JSON) for client-side infographic rendering
// via html-to-image. Supports two modes:
//   1. 'dataset' — live DoSM data for a specific dataset
//   2. 'overview' — static national statistics overview

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getExportDimensions } from '@/engine/visual/renderer';
import { STATES, MALAYSIA_TOTALS } from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import { GROUND_TRUTH_REGISTRY } from '@/lib/dosm/ground-truth-registry';
import type { GroundTruthDataset } from '@/lib/dosm/ground-truth-registry';

// ─── Source attribution for overview mode ────────────────────────

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

// ─── Fetch live data from internal DoSM proxy ───────────────────

async function fetchLiveDatasetData(config: GroundTruthDataset, requestOrigin: string): Promise<{
  records: Record<string, unknown>[];
  tier: 'LIVE' | 'CSV' | 'STATIC';
}> {
  const filterParams = config.defaultFilter
    ? '&' + Object.entries(config.defaultFilter)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&')
    : '';

  const url = `/api/dosm?id=${config.apiId}&limit=16${filterParams}`;

  try {
    const res = await fetch(`${requestOrigin}${url}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return { records: [], tier: 'STATIC' };
    }

    const data = await res.json();

    if (data && typeof data === 'object' && !Array.isArray(data) && data.error) {
      return { records: [], tier: 'STATIC' };
    }

    const records = Array.isArray(data) ? data : data?.data ?? [];

    const sourceHeader = res.headers.get('X-Source') ?? '';
    const tier: 'LIVE' | 'CSV' | 'STATIC' = sourceHeader.includes('csv')
      ? 'CSV'
      : records.length > 0 ? 'LIVE' : 'STATIC';

    return { records, tier };
  } catch {
    return { records: [], tier: 'STATIC' };
  }
}

// ─── Process live records into infographic data ─────────────────

function processDatasetRecords(
  records: Record<string, unknown>[],
  config: GroundTruthDataset,
) {
  if (records.length === 0) {
    return {
      latestValue: null,
      previousValue: null,
      changePercent: null,
      sparklineData: [],
      sparklineLabels: [],
      latestDate: '—',
    };
  }

  const dateField = config.dateField;
  const valueField = config.valueField;

  const sorted = [...records].sort((a, b) => {
    const da = String(a[dateField] ?? '');
    const db = String(b[dateField] ?? '');
    return db.localeCompare(da);
  });

  const latest = sorted[0];
  const previous = sorted.length > 1 ? sorted[1] : null;

  const latestValue = latest ? Number(latest[valueField]) : null;
  const previousValue = previous ? Number(previous[valueField]) : null;

  let changePercent: number | null = null;
  if (latestValue !== null && previousValue !== null && previousValue !== 0) {
    changePercent = ((latestValue - previousValue) / Math.abs(previousValue)) * 100;
  }

  const sparkRecords = sorted.slice(0, 12).reverse();
  const sparklineData = sparkRecords.map(r => Number(r[valueField]) || 0);
  const sparklineLabels = sparkRecords.map(r => {
    const d = String(r[dateField] ?? '');
    if (d.includes('T')) return d.split('T')[0];
    if (d.includes('-Q')) return d;
    return d.substring(0, 10);
  });

  const latestDate = String(latest[dateField] ?? '—');
  const displayDate = latestDate.includes('T') ? latestDate.split('T')[0] : latestDate;

  return {
    latestValue: latestValue !== null && !isNaN(latestValue) ? latestValue : null,
    previousValue: previousValue !== null && !isNaN(previousValue) ? previousValue : null,
    changePercent,
    sparklineData,
    sparklineLabels,
    latestDate: displayDate,
  };
}

// ─── Main handler ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lang = 'en',
      selectedLayers = ['population', 'gdp', 'demography'],
      format = '16:9',
      datasetId,
    } = body;

    if (format !== '16:9' && format !== '9:16') {
      return NextResponse.json({ error: 'Invalid format. Use "16:9" or "9:16"' }, { status: 400 });
    }

    const dimensions = getExportDimensions(format);

    // ═══ DATASET MODE: Return live DoSM data for client-side rendering ═══
    if (datasetId && typeof datasetId === 'string') {
      const config = GROUND_TRUTH_REGISTRY[datasetId as keyof typeof GROUND_TRUTH_REGISTRY] as GroundTruthDataset | undefined;

      if (!config) {
        return NextResponse.json(
          {
            error: `Unknown dataset: "${datasetId}"`,
            availableDatasets: Object.keys(GROUND_TRUTH_REGISTRY),
          },
          { status: 400 }
        );
      }

      const requestOrigin = new URL(request.url).origin;
      const { records, tier } = await fetchLiveDatasetData(config, requestOrigin);
      const processed = processDatasetRecords(records, config);

      // Return structured data for client-side rendering
      return NextResponse.json({
        mode: 'dataset',
        engine: 'client-side',
        lang: lang === 'ms' ? 'ms' : 'en',
        format,
        dimensions,
        dataset: {
          id: config.apiId,
          category: config.category,
          frequency: config.frequency,
          geography: config.geography,
          unit: config.unit,
          title_en: config.title_en,
          title_ms: config.title_ms,
          dataTier: tier,
          recordCount: records.length,
          ...processed,
        },
      }, {
        headers: {
          'X-Data-Tier': tier,
          'X-Dataset-Id': config.apiId,
          'X-Dataset-Category': config.category,
        },
      });
    }

    // ═══ OVERVIEW MODE: Return static data for client-side rendering ═══
    const validLayers = ['population', 'gdp', 'demography', 'healthcare', 'environment', 'education'];
    const filteredLayers = selectedLayers.filter((l: string) => validLayers.includes(l));
    if (filteredLayers.length === 0) {
      return NextResponse.json({ error: 'No valid layers selected' }, { status: 400 });
    }

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

    // Return structured data for client-side rendering
    return NextResponse.json({
      mode: 'overview',
      engine: 'client-side',
      lang: lang === 'ms' ? 'ms' : 'en',
      format,
      dimensions,
      selectedLayers: filteredLayers,
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
    });
  } catch (error) {
    console.error('Infographic data error:', error);
    return NextResponse.json(
      { error: 'Failed to prepare infographic data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
