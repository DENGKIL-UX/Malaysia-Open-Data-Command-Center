// API Route: Generate infographic PNG/SVG using Satori + Sharp
// POST /api/infographic/generate
// Supports two modes:
//   1. Overview mode (default) — generates multi-layer overview infographic using static data
//   2. Dataset mode — when `datasetId` is provided, fetches live DoSM data
//      and generates a single-dataset infographic with live data tier info
// On Cloudflare Workers, falls back to SVG output (sharp unavailable)

export const runtime = 'edge';

import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { render, getExportDimensions } from '@/engine/visual/renderer';
import { OverviewTemplate16x9, OverviewTemplate9x16 } from '@/engine/visual/templates/overview';
import type { InfographicData } from '@/engine/visual/templates/overview';
import { STATES, MALAYSIA_TOTALS } from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import { GROUND_TRUTH_REGISTRY } from '@/lib/dosm/ground-truth-registry';
import type { GroundTruthDataset } from '@/lib/dosm/ground-truth-registry';
import { DESIGN_TOKENS, cardBackground, borderAccent } from '@/engine/visual/styles';
import { auditTrail } from '@/engine/audit/trail';

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

// ─── Category accent color map ──────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Economy: '#f59e0b',
  Prices: '#ef4444',
  Labour: '#8b5cf6',
  Trade: '#06b6d4',
  Finance: '#10b981',
  Demography: '#06b6d4',
  Households: '#ec4899',
  Healthcare: '#ec4899',
  Environment: '#22c55e',
  Transport: '#f97316',
  Safety: '#ef4444',
  Education: '#3b82f6',
  Agriculture: '#84cc16',
  Digital: '#a855f7',
  Industry: '#64748b',
};

// ─── Dataset-specific infographic template ───────────────────────

interface DatasetInfographicData {
  lang: 'en' | 'ms';
  format: '16:9' | '9:16';
  config: GroundTruthDataset;
  latestValue: number | null;
  previousValue: number | null;
  changePercent: number | null;
  sparklineData: number[];
  sparklineLabels: string[];
  latestDate: string;
  dataTier: 'LIVE' | 'CSV' | 'STATIC';
}

function DatasetInfographicTemplate({ data }: { data: DatasetInfographicData }) {
  const { lang, config, latestValue, changePercent, sparklineData, sparklineLabels, latestDate, dataTier } = data;
  const accent = CATEGORY_COLORS[config.category] ?? '#06b6d4';
  const title = lang === 'ms' ? config.title_ms : config.title_en;
  const isLandscape = data.format === '16:9';
  const width = isLandscape ? 1920 : 1080;
  const height = isLandscape ? 1080 : 1920;

  // Format value display
  const formatValue = (val: number | null): string => {
    if (val === null) return '—';
    if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
    if (Math.abs(val) >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    if (Math.abs(val) < 1 && val !== 0) return val.toFixed(4);
    return val.toFixed(2);
  };

  const valueDisplay = formatValue(latestValue);
  const changeDisplay = changePercent !== null
    ? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`
    : '—';
  const changeColor = changePercent !== null
    ? (changePercent >= 0 ? '#10b981' : '#ef4444')
    : DESIGN_TOKENS.text.secondary;

  // Sparkline bars
  const maxSparkVal = Math.max(...sparklineData.map(Math.abs), 1);
  const sparkBars = sparklineData.slice(-12).map((v, i) => {
    const barHeight = Math.max(4, Math.abs(v) / maxSparkVal * 100);
    return { height: barHeight, value: v, label: sparklineLabels[sparklineData.slice(-12).length - 12 + i] ?? '' };
  });

  // Tier indicator styling
  const tierStyles: Record<string, { bg: string; border: string; color: string; label: string }> = {
    LIVE: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', color: '#10b981', label: 'LIVE' },
    CSV: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', color: '#06b6d4', label: 'CSV' },
    STATIC: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b', label: 'STATIC' },
  };
  const tier = tierStyles[dataTier] ?? tierStyles.STATIC;

  // Layout dimensions
  const headerH = isLandscape ? 160 : 200;
  const heroH = isLandscape ? 340 : 400;
  const sparkH = isLandscape ? 320 : 380;
  const footerH = isLandscape ? 80 : 120;
  const padX = isLandscape ? 48 : 36;
  const padY = isLandscape ? 32 : 28;

  return React.createElement('div', {
    style: {
      width,
      height,
      background: DESIGN_TOKENS.bg.primary,
      padding: padY,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: DESIGN_TOKENS.font.body,
      color: DESIGN_TOKENS.text.primary,
      overflow: 'hidden',
    },
  },
    // ═══ HEADER ═══
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: headerH - padY * 2,
        minHeight: 80,
        borderBottom: `1px solid ${DESIGN_TOKENS.border.light}`,
        paddingBottom: 16,
        marginBottom: 20,
      },
    },
      // Left: title block
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
      },
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: 8 },
        },
          React.createElement('div', {
            style: {
              padding: '3px 12px',
              borderRadius: 6,
              border: `1px solid ${borderAccent(accent, 0.25)}`,
              background: cardBackground(accent, 0.06),
              fontFamily: DESIGN_TOKENS.font.mono,
              fontWeight: 800,
              fontSize: 11,
              color: accent,
              letterSpacing: '0.2em',
            },
          }, '🇲🇾 MALAYSIA'),
          React.createElement('div', {
            style: {
              padding: '2px 10px',
              borderRadius: 4,
              border: `1px solid ${tier.border}`,
              background: tier.bg,
              fontFamily: DESIGN_TOKENS.font.mono,
              fontWeight: 700,
              fontSize: 9,
              color: tier.color,
              letterSpacing: '0.12em',
            },
          }, `● ${tier.label} DATA`),
        ),
        React.createElement('div', {
          style: {
            fontSize: isLandscape ? 28 : 24,
            fontWeight: 800,
            fontFamily: DESIGN_TOKENS.font.display,
            color: accent,
            marginTop: 8,
            lineHeight: 1.2,
          },
        }, title),
        React.createElement('div', {
          style: {
            fontSize: 10,
            fontFamily: DESIGN_TOKENS.font.mono,
            color: DESIGN_TOKENS.text.secondary,
            marginTop: 4,
          },
        }, `${config.category} · ${config.frequency} · ${config.geography}`),
      ),
      // Right: data tier badge
      React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 4,
        },
      },
        React.createElement('div', {
          style: {
            fontSize: 9,
            fontFamily: DESIGN_TOKENS.font.mono,
            color: DESIGN_TOKENS.text.dim,
          },
        }, 'DATA SOURCE'),
        React.createElement('div', {
          style: {
            fontSize: 12,
            fontFamily: DESIGN_TOKENS.font.mono,
            fontWeight: 700,
            color: accent,
          },
        }, 'api.data.gov.my'),
        React.createElement('div', {
          style: {
            fontSize: 8,
            fontFamily: DESIGN_TOKENS.font.mono,
            color: DESIGN_TOKENS.text.dim,
          },
        }, `ID: ${config.apiId}`),
      ),
    ),

    // ═══ HERO VALUE ═══
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: heroH,
        justifyContent: 'center',
        padding: `${isLandscape ? 24 : 16}px ${padX}px`,
        background: cardBackground(accent, 0.03),
        borderRadius: 8,
        border: `1px solid ${borderAccent(accent, 0.1)}`,
        marginBottom: 20,
      },
    },
      React.createElement('div', {
        style: {
          fontSize: 9,
          fontFamily: DESIGN_TOKENS.font.mono,
          color: DESIGN_TOKENS.text.dim,
          letterSpacing: '0.1em',
          marginBottom: 8,
        },
      }, lang === 'ms' ? 'NILAI TERKINI' : 'LATEST VALUE'),
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        },
      },
        React.createElement('div', {
          style: {
            fontSize: isLandscape ? 72 : 56,
            fontWeight: 800,
            fontFamily: DESIGN_TOKENS.font.mono,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          },
        }, valueDisplay),
        React.createElement('div', {
          style: {
            fontSize: isLandscape ? 20 : 16,
            fontFamily: DESIGN_TOKENS.font.mono,
            color: DESIGN_TOKENS.text.secondary,
            fontWeight: 600,
          },
        }, config.unit),
      ),
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginTop: 16,
        },
      },
        React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 6,
            background: cardBackground(changeColor, 0.1),
            border: `1px solid ${borderAccent(changeColor, 0.2)}`,
          },
        },
          React.createElement('span', {
            style: {
              fontSize: isLandscape ? 18 : 14,
              fontWeight: 700,
              fontFamily: DESIGN_TOKENS.font.mono,
              color: changeColor,
            },
          }, changeDisplay),
          React.createElement('span', {
            style: {
              fontSize: 9,
              fontFamily: DESIGN_TOKENS.font.mono,
              color: DESIGN_TOKENS.text.dim,
            },
          }, lang === 'ms' ? 'Sbn thn lalu' : 'YoY'),
        ),
        React.createElement('div', {
          style: {
            fontSize: 10,
            fontFamily: DESIGN_TOKENS.font.mono,
            color: DESIGN_TOKENS.text.dim,
          },
        }, lang === 'ms' ? `Tarikh: ${latestDate}` : `As of: ${latestDate}`),
      ),
    ),

    // ═══ SPARKLINE / MINI CHART ═══
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: `${isLandscape ? 16 : 12}px ${padX}px`,
        background: DESIGN_TOKENS.bg.card,
        borderRadius: 8,
        border: `1px solid ${DESIGN_TOKENS.border.subtle}`,
        marginBottom: 16,
      },
    },
      React.createElement('div', {
        style: {
          fontSize: 9,
          fontFamily: DESIGN_TOKENS.font.mono,
          color: DESIGN_TOKENS.text.dim,
          letterSpacing: '0.1em',
          marginBottom: 12,
        },
      }, lang === 'ms' ? 'TREND DATA' : 'DATA TREND'),
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'flex-end',
          gap: 6,
          height: sparkH - 80,
          padding: '0 4px',
        },
      },
        ...sparkBars.map((bar, i) =>
          React.createElement('div', {
            key: i,
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              gap: 4,
            },
          },
            React.createElement('div', {
              style: {
                width: '100%',
                height: bar.height,
                borderRadius: 3,
                background: i === sparkBars.length - 1
                  ? accent
                  : cardBackground(accent, 0.3),
                border: i === sparkBars.length - 1
                  ? `1px solid ${borderAccent(accent, 0.4)}`
                  : 'none',
              },
            }),
            React.createElement('span', {
              style: {
                fontSize: 7,
                fontFamily: DESIGN_TOKENS.font.mono,
                color: DESIGN_TOKENS.text.dim,
                whiteSpace: 'nowrap',
              },
            }, bar.label ? bar.label.substring(0, 7) : ''),
          )
        ),
      ),
      // Values row under bars
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: 6,
          padding: '8px 4px 0',
          borderTop: `1px solid ${DESIGN_TOKENS.border.subtle}`,
          marginTop: 8,
        },
      },
        ...sparkBars.map((bar, i) =>
          React.createElement('div', {
            key: `v${i}`,
            style: {
              flex: 1,
              textAlign: 'center' as const,
              fontSize: 7,
              fontFamily: DESIGN_TOKENS.font.mono,
              color: i === sparkBars.length - 1 ? accent : DESIGN_TOKENS.text.dim,
              fontWeight: i === sparkBars.length - 1 ? 700 : 400,
            },
          }, formatValue(bar.value))
        ),
      ),
    ),

    // ═══ FOOTER ═══
    React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTop: `1px solid ${DESIGN_TOKENS.border.subtle}`,
      },
    },
      React.createElement('div', {
        style: {
          fontSize: 7,
          fontFamily: DESIGN_TOKENS.font.mono,
          color: DESIGN_TOKENS.text.dim,
          maxWidth: '60%',
          lineHeight: 1.4,
        },
      }, lang === 'ms'
        ? `Data diperoleh daripada api.data.gov.my (${dataTier} tier). Nilai mungkin anggaran tertakluk kepada semakan.`
        : `Data sourced from api.data.gov.my (${dataTier} tier). Values may be estimates subject to revision.`),
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: 8 },
      },
        React.createElement('span', {
          style: {
            fontSize: 7,
            fontFamily: DESIGN_TOKENS.font.mono,
            color: DESIGN_TOKENS.text.dim,
          },
        }, 'data.gov.my'),
        React.createElement('span', {
          style: {
            fontSize: 7,
            fontFamily: DESIGN_TOKENS.font.mono,
            color: accent,
            padding: '2px 6px',
            borderRadius: 3,
            border: `1px solid ${borderAccent(accent, 0.2)}`,
            background: cardBackground(accent, 0.05),
          },
        }, 'CC BY 4.0'),
      ),
    ),
  );
}

// ─── Fetch live data from internal DoSM proxy ───────────────────

async function fetchLiveDatasetData(config: GroundTruthDataset, requestOrigin: string): Promise<{
  records: Record<string, unknown>[];
  tier: 'LIVE' | 'CSV' | 'STATIC';
}> {
  // Build filter params from defaultFilter
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
      console.warn(`[Infographic] DoSM proxy returned ${res.status} for ${config.apiId}, using STATIC tier`);
      return { records: [], tier: 'STATIC' };
    }

    const data = await res.json();

    // Handle error responses (may be objects with error field)
    if (data && typeof data === 'object' && !Array.isArray(data) && data.error) {
      console.warn(`[Infographic] DoSM proxy error for ${config.apiId}: ${data.error}`);
      return { records: [], tier: 'STATIC' };
    }

    const records = Array.isArray(data) ? data : data?.data ?? [];

    // Determine tier from response headers
    const sourceHeader = res.headers.get('X-Source') ?? '';
    const tier: 'LIVE' | 'CSV' | 'STATIC' = sourceHeader.includes('csv')
      ? 'CSV'
      : records.length > 0 ? 'LIVE' : 'STATIC';

    return { records, tier };
  } catch (err) {
    console.warn(`[Infographic] Failed to fetch live data for ${config.apiId}:`, err instanceof Error ? err.message : String(err));
    return { records: [], tier: 'STATIC' };
  }
}

// ─── Process live records into infographic data ─────────────────

function processDatasetRecords(
  records: Record<string, unknown>[],
  config: GroundTruthDataset,
): {
  latestValue: number | null;
  previousValue: number | null;
  changePercent: number | null;
  sparklineData: number[];
  sparklineLabels: string[];
  latestDate: string;
} {
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

  // Sort by date field descending (most recent first)
  const dateField = config.dateField;
  const valueField = config.valueField;

  const sorted = [...records].sort((a, b) => {
    const da = String(a[dateField] ?? '');
    const db = String(b[dateField] ?? '');
    return db.localeCompare(da); // descending
  });

  // Extract values
  const latest = sorted[0];
  const previous = sorted.length > 1 ? sorted[1] : null;

  const latestValue = latest ? Number(latest[valueField]) : null;
  const previousValue = previous ? Number(previous[valueField]) : null;

  // Calculate change %
  let changePercent: number | null = null;
  if (latestValue !== null && previousValue !== null && previousValue !== 0) {
    changePercent = ((latestValue - previousValue) / Math.abs(previousValue)) * 100;
  }

  // Build sparkline (reversed so oldest → newest)
  const sparkRecords = sorted.slice(0, 12).reverse();
  const sparklineData = sparkRecords.map(r => Number(r[valueField]) || 0);
  const sparklineLabels = sparkRecords.map(r => {
    const d = String(r[dateField] ?? '');
    // Shorten date labels
    if (d.includes('T')) return d.split('T')[0]; // "2024-01-01T00:00:00" → "2024-01-01"
    if (d.includes('-Q')) return d; // "2024-Q2" stays
    return d.substring(0, 10); // take first 10 chars
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

    // Validate format
    if (format !== '16:9' && format !== '9:16') {
      return NextResponse.json({ error: 'Invalid format. Use "16:9" or "9:16"' }, { status: 400 });
    }

    // ═══ DATASET MODE: Live DoSM data infographic ═══
    if (datasetId && typeof datasetId === 'string') {
      // Look up dataset config from ground truth registry
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

      // Fetch live data from DoSM API via internal proxy
      const requestOrigin = new URL(request.url).origin;
      const { records, tier } = await fetchLiveDatasetData(config, requestOrigin);
      const processed = processDatasetRecords(records, config);

      // Build the dataset infographic data
      const datasetInfographicData: DatasetInfographicData = {
        lang: lang === 'ms' ? 'ms' : 'en',
        format,
        config,
        latestValue: processed.latestValue,
        previousValue: processed.previousValue,
        changePercent: processed.changePercent,
        sparklineData: processed.sparklineData,
        sparklineLabels: processed.sparklineLabels,
        latestDate: processed.latestDate,
        dataTier: tier,
      };

      // Get dimensions
      const dimensions = getExportDimensions(format);

      // Render dataset template
      const template = DatasetInfographicTemplate({ data: datasetInfographicData });

      // Render to PNG or SVG
      let result;
      try {
        result = await render({
          width: dimensions.width,
          height: dimensions.height,
          element: template,
        });
      } catch (renderError) {
        const msg = renderError instanceof Error ? renderError.message : String(renderError);
        const isRuntimeError =
          msg.includes('not supported in this environment') ||
          msg.includes('runtime environment') ||
          msg.includes('Satori rendering') ||
          msg.includes('Font loading failed');
        if (isRuntimeError) {
          return NextResponse.json(
            {
              error: 'Infographic generation is not supported in this environment',
              details: msg,
            },
            { status: 501 }
          );
        }
        throw renderError;
      }

      // Build filename
      const ext = result.format === 'png' ? 'png' : 'svg';
      const filename = `dosm-${config.apiId}-${format.replace(':', 'x')}-${Date.now()}.${ext}`;

      // Audit trail (client-side only, wrap in try/catch)
      try {
        auditTrail.infographic(datasetId, format);
      } catch {
        // auditTrail uses localStorage, which is unavailable server-side — silently skip
      }

      // Return image response with data tier info in headers
      return new NextResponse(result.buffer, {
        status: 200,
        headers: {
          'Content-Type': result.contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'no-cache',
          'X-Image-Width': dimensions.width.toString(),
          'X-Image-Height': dimensions.height.toString(),
          'X-Image-Format': result.format,
          'X-Data-Tier': tier,
          'X-Dataset-Id': config.apiId,
          'X-Dataset-Category': config.category,
          'X-Dataset-Frequency': config.frequency,
          'X-Dataset-Records': String(records.length),
        },
      });
    }

    // ═══ OVERVIEW MODE: Existing static data infographic ═══
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

    // Render to PNG or SVG (depends on runtime)
    let result;
    try {
      result = await render({
        width: dimensions.width,
        height: dimensions.height,
        element: template,
      });
    } catch (renderError) {
      // Satori/sharp may fail on Cloudflare Workers or other edge runtimes
      const msg = renderError instanceof Error ? renderError.message : String(renderError);
      const isRuntimeError =
        msg.includes('not supported in this environment') ||
        msg.includes('runtime environment') ||
        msg.includes('Satori rendering') ||
        msg.includes('Font loading failed');
      if (isRuntimeError) {
        return NextResponse.json(
          {
            error: 'Infographic generation is not supported in this environment',
            details: msg,
          },
          { status: 501 }
        );
      }
      throw renderError; // re-throw unexpected errors
    }

    // Build filename with appropriate extension
    const ext = result.format === 'png' ? 'png' : 'svg';
    const filename = `malaysia-open-data-infographic-${format.replace(':', 'x')}-${Date.now()}.${ext}`;

    // Return image response
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-cache',
        'X-Image-Width': dimensions.width.toString(),
        'X-Image-Height': dimensions.height.toString(),
        'X-Image-Format': result.format,
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
