'use client';

import { STATES, MALAYSIA_TOTALS, type StateData } from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import type { Lang } from '@/lib/dashboard-types';

// ─── Design Tokens (mirrors src/engine/visual/styles.ts) ────────────
const DT = {
  bg: { primary: '#080C14', card: '#0D1220', cardAlt: '#111827' },
  accent: {
    population: '#06b6d4',
    gdp: '#f59e0b',
    demography: '#10b981',
    healthcare: '#ec4899',
    environment: '#22c55e',
    education: '#3b82f6',
    default: '#06b6d4',
  },
  text: {
    hero: '#FFFFFF',
    primary: '#E2E8F0',
    secondary: '#94A3B8',
    muted: '#64748B',
    dim: '#475569',
    accent: '#06b6d4',
  },
  border: {
    subtle: 'rgba(6,182,212,0.08)',
    light: 'rgba(6,182,212,0.15)',
    medium: 'rgba(6,182,212,0.25)',
  },
};

// ─── Sources (mirrors API route) ────────────────────────────────────
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

// ─── Translations ───────────────────────────────────────────────────
const T = {
  en: {
    title: 'MALAYSIA OPEN DATA COMMAND CENTER',
    subtitle: 'National Data Infographic',
    population: 'Population',
    gdp: 'GDP',
    datasets: 'Datasets',
    populationByState: 'POPULATION BY STATE',
    gdpByState: 'GDP BY STATE',
    vitalStats: 'VITAL STATISTICS',
    births: 'Live Births',
    deaths: 'Deaths',
    unemployment: 'Unemployment',
    healthcare: 'HEALTHCARE',
    environment: 'ENVIRONMENT',
    education: 'EDUCATION',
    healthcareDesc: 'Healthcare data covers infant immunisation, blood donations, hospital beds, and healthcare staffing from KKM.',
    environmentDesc: 'Environmental data covers air pollution, water access, electricity consumption, and forest reserves from DOSM and NRES.',
    educationDesc: 'Education data covers school enrolment, teachers, university lecturers, and school completion rates from KPM.',
    dataSources: 'DATA SOURCES & DATE RANGES',
    source: 'data.gov.my',
    cc: 'CC BY 4.0',
    disclaimer: 'Data sourced from data.gov.my open data. Values may be estimates subject to revision.',
  },
  ms: {
    title: 'PUSAT PERINTAH DATA TERBUKA MALAYSIA',
    subtitle: 'Infografik Data Nasional',
    population: 'Penduduk',
    gdp: 'KDNK',
    datasets: 'Set Data',
    populationByState: 'PENDUDUK MENGIKUT NEGERI',
    gdpByState: 'KDNK MENGIKUT NEGERI',
    vitalStats: 'STATISTIK VITAL',
    births: 'Kelahiran',
    deaths: 'Kematian',
    unemployment: 'Pengangguran',
    healthcare: 'KESIHATAN',
    environment: 'ALAM SEKITAR',
    education: 'PENDIDIKAN',
    healthcareDesc: 'Data penjagaan kesihatan merangkumi imunisasi bayi, penenderaan darah, katil hospital, dan kakitangan kesihatan dari KKM.',
    environmentDesc: 'Data alam sekitar merangkumi pencemaran udara, akses air, penggunaan elektrik, dan rizab hutan dari DOSM dan NRES.',
    educationDesc: 'Data pendidikan merangkumi pendaftaran sekolah, guru, pensyarah universiti, dan kadar tamat sekolah dari KPM.',
    dataSources: 'SUMBER DATA & JULAT TARIKH',
    source: 'data.gov.my',
    cc: 'CC BY 4.0',
    disclaimer: 'Data diperoleh daripada data.gov.my. Nilai mungkin anggaran tertakluk kepada semakan.',
  },
};

// ─── Helpers ────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '6,182,212';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

function cardBg(color: string, opacity = 0.04): string {
  return `rgba(${hexToRgb(color)},${opacity})`;
}

function borderAcc(color: string, opacity = 0.12): string {
  return `rgba(${hexToRgb(color)},${opacity})`;
}

function formatHeroNumber(value: number, type: 'population' | 'currency' | 'percentage' | 'raw'): string {
  switch (type) {
    case 'population':
      if (value >= 1000) return `${(value / 1000).toFixed(1)}M`;
      return `${value}K`;
    case 'currency':
      if (value >= 1000000) return `RM${(value / 1000000).toFixed(2)}T`;
      if (value >= 1000) return `RM${(value / 1000).toFixed(1)}B`;
      return `RM${value}M`;
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'raw':
      return value.toLocaleString();
    default:
      return value.toString();
  }
}

function computeSources(selectedLayers: string[]) {
  const allCategories = selectedLayers.flatMap(l => LAYER_CATEGORY_MAP[l] || []);
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
  return { activeSources: activeSources.slice(0, 8), minBegin, maxEnd };
}

// ─── Sub-components ─────────────────────────────────────────────────

function SectionCard({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: 12,
      borderRadius: 6,
      border: `1px solid ${color ? borderAcc(color, 0.12) : DT.border.subtle}`,
      background: color ? cardBg(color, 0.04) : DT.bg.card,
      gap: 6,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ icon, title, color }: { icon: string; title: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        fontFamily: '"JetBrains Mono", monospace',
        color: color,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
      }}>
        {title}
      </span>
    </div>
  );
}

function KpiCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 8px',
      borderRadius: 6,
      background: cardBg(color, 0.05),
      border: `1px solid ${borderAcc(color, 0.15)}`,
      flex: 1,
    }}>
      <div style={{
        fontSize: 28,
        fontWeight: 800,
        fontFamily: '"JetBrains Mono", monospace',
        color: color,
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 10,
        fontFamily: '"JetBrains Mono", monospace',
        color: DT.text.secondary,
        marginTop: 2,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
      }}>
        {label}
      </div>
    </div>
  );
}

function StateRow({ abbr, value, color }: { abbr: string; value: string; color: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: 4,
      background: cardBg(color, 0.03),
      border: `1px solid ${borderAcc(color, 0.08)}`,
    }}>
      <span style={{ fontSize: 9, fontFamily: '"JetBrains Mono", monospace', color: DT.text.secondary }}>
        {abbr}
      </span>
      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', color: '#E2E8F0' }}>
        {value}
      </span>
    </div>
  );
}

function StateGrid({ states, color, valueFn }: {
  states: StateData[];
  color: string;
  valueFn: (s: StateData) => string;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {states.map(s => (
        <StateRow key={s.id} abbr={s.abbr} value={valueFn(s)} color={color} />
      ))}
    </div>
  );
}

function DescriptionBlock({ text, color }: { text: string; color: string }) {
  return (
    <div style={{
      fontSize: 9,
      fontFamily: 'Inter, sans-serif',
      color: DT.text.secondary,
      lineHeight: 1.5,
      padding: '4px 8px',
      background: cardBg(color, 0.03),
      borderRadius: 4,
      border: `1px solid ${borderAcc(color, 0.08)}`,
    }}>
      {text}
    </div>
  );
}

function SourceBadge({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      padding: '3px 8px',
      borderRadius: 4,
      border: `1px solid ${DT.border.light}`,
      background: cardBg(color, 0.05),
      fontSize: 8,
      fontFamily: '"JetBrains Mono", monospace',
      color: color,
      fontWeight: 600,
    }}>
      {label}
    </div>
  );
}

// ─── Layer sections builder ─────────────────────────────────────────
function buildLayerSections(lang: Lang, selectedLayers: string[]) {
  const t = T[lang];
  const popStates = [...STATES].sort((a, b) => b.population - a.population).slice(0, 8);
  const gdpStates = [...STATES].sort((a, b) => b.gdp - a.gdp).slice(0, 8);
  const sections: React.ReactNode[] = [];

  if (selectedLayers.includes('population')) {
    sections.push(
      <SectionCard key="pop" color="#06b6d4">
        <SectionLabel icon="🧑" title={t.populationByState} color="#06b6d4" />
        <StateGrid states={popStates} color="#06b6d4" valueFn={s => `${(s.population / 1000).toFixed(1)}M`} />
      </SectionCard>
    );
  }

  if (selectedLayers.includes('gdp')) {
    sections.push(
      <SectionCard key="gdp" color="#f59e0b">
        <SectionLabel icon="💰" title={t.gdpByState} color="#f59e0b" />
        <StateGrid states={gdpStates} color="#f59e0b" valueFn={s => `RM${(s.gdp / 1000).toFixed(1)}B`} />
      </SectionCard>
    );
  }

  if (selectedLayers.includes('demography')) {
    sections.push(
      <SectionCard key="demo" color="#10b981">
        <SectionLabel icon="📊" title={t.vitalStats} color="#10b981" />
        <div style={{ display: 'flex', gap: 10 }}>
          <KpiCard value={`${MALAYSIA_TOTALS.births}K`} label={t.births} color="#10b981" />
          <KpiCard value={`${MALAYSIA_TOTALS.deaths}K`} label={t.deaths} color="#ef4444" />
          <KpiCard value={`${MALAYSIA_TOTALS.unemployment}%`} label={t.unemployment} color="#8b5cf6" />
        </div>
      </SectionCard>
    );
  }

  if (selectedLayers.includes('healthcare')) {
    sections.push(
      <SectionCard key="health" color="#ec4899">
        <SectionLabel icon="❤️" title={t.healthcare} color="#ec4899" />
        <DescriptionBlock text={t.healthcareDesc} color="#ec4899" />
      </SectionCard>
    );
  }

  if (selectedLayers.includes('environment')) {
    sections.push(
      <SectionCard key="env" color="#22c55e">
        <SectionLabel icon="🌿" title={t.environment} color="#22c55e" />
        <DescriptionBlock text={t.environmentDesc} color="#22c55e" />
      </SectionCard>
    );
  }

  if (selectedLayers.includes('education')) {
    sections.push(
      <SectionCard key="edu" color="#3b82f6">
        <SectionLabel icon="🎓" title={t.education} color="#3b82f6" />
        <DescriptionBlock text={t.educationDesc} color="#3b82f6" />
      </SectionCard>
    );
  }

  return sections;
}

// ─── 16:9 Landscape Template ────────────────────────────────────────
function Template16x9({ lang, selectedLayers }: { lang: Lang; selectedLayers: string[] }) {
  const t = T[lang];
  const layerSections = buildLayerSections(lang, selectedLayers);
  const { activeSources, minBegin, maxEnd } = computeSources(selectedLayers);

  const midPoint = Math.ceil(layerSections.length / 2);
  const leftSections = layerSections.slice(0, midPoint);
  const rightSections = layerSections.slice(midPoint);

  return (
    <div style={{
      width: 1920,
      height: 1080,
      background: DT.bg.primary,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      color: DT.text.primary,
      overflow: 'hidden',
    }}>
      {/* ═══ HEADER ═══ */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 16,
        marginBottom: 16,
        borderBottom: `1px solid ${DT.border.light}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{
            padding: '4px 16px',
            borderRadius: 6,
            border: '1px solid rgba(6,182,212,0.25)',
            background: 'rgba(6,182,212,0.06)',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 800,
            fontSize: 14,
            color: '#06b6d4',
            letterSpacing: '0.2em',
          }}>
            🇲🇾 MALAYSIA
          </div>
        </div>
        <div style={{
          fontSize: 9,
          fontFamily: '"JetBrains Mono", monospace',
          color: 'rgba(6,182,212,0.5)',
          letterSpacing: '0.3em',
          marginBottom: 2,
        }}>
          DATA.GOV.MY
        </div>
        <div style={{
          fontSize: 22,
          fontWeight: 800,
          fontFamily: 'Inter, sans-serif',
          color: '#06b6d4',
        }}>
          {t.title}
        </div>
        <div style={{
          fontSize: 10,
          fontFamily: '"JetBrains Mono", monospace',
          color: DT.text.secondary,
          marginTop: 2,
        }}>
          {t.subtitle} — {new Date().getFullYear()}
        </div>
      </div>

      {/* ═══ KPI ROW ═══ */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <KpiCard value={formatHeroNumber(MALAYSIA_TOTALS.population, 'population')} label={t.population} color="#06b6d4" />
        <KpiCard value={formatHeroNumber(MALAYSIA_TOTALS.gdp, 'currency')} label={t.gdp} color="#f59e0b" />
        <KpiCard value={`${MALAYSIA_TOTALS.datasets}`} label={t.datasets} color="#10b981" />
      </div>

      {/* ═══ TWO-COLUMN LAYOUT ═══ */}
      <div style={{ display: 'flex', flex: 1, gap: 16 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
          {leftSections}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
          {rightSections}
          {/* Data sources (always in right column bottom) */}
          <SectionCard color="#06b6d4">
            <SectionLabel icon="🏛️" title={t.dataSources} color="#06b6d4" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {activeSources.slice(0, 8).map(src => (
                <SourceBadge key={src.abbr} label={src.abbr} color="#06b6d4" />
              ))}
              <SourceBadge label={`${minBegin}–${maxEnd}`} color="#06b6d4" />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        marginTop: 12,
        borderTop: `1px solid ${DT.border.subtle}`,
      }}>
        <div style={{
          fontSize: 7,
          fontFamily: '"JetBrains Mono", monospace',
          color: DT.text.dim,
          maxWidth: '70%',
          lineHeight: 1.4,
        }}>
          {t.disclaimer}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 7, fontFamily: '"JetBrains Mono", monospace', color: DT.text.dim }}>
            {t.source}
          </span>
          <span style={{
            fontSize: 7,
            fontFamily: '"JetBrains Mono", monospace',
            color: '#06b6d4',
            padding: '2px 6px',
            borderRadius: 3,
            border: '1px solid rgba(6,182,212,0.2)',
            background: 'rgba(6,182,212,0.05)',
          }}>
            {t.cc}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── 9:16 Portrait Template ─────────────────────────────────────────
function Template9x16({ lang, selectedLayers }: { lang: Lang; selectedLayers: string[] }) {
  const t = T[lang];
  const layerSections = buildLayerSections(lang, selectedLayers);
  const { activeSources, minBegin, maxEnd } = computeSources(selectedLayers);

  return (
    <div style={{
      width: 1080,
      height: 1920,
      background: DT.bg.primary,
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      color: DT.text.primary,
      overflow: 'hidden',
    }}>
      {/* ═══ HEADER ═══ */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 14,
        marginBottom: 14,
        borderBottom: `1px solid ${DT.border.light}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{
            padding: '3px 12px',
            borderRadius: 6,
            border: '1px solid rgba(6,182,212,0.25)',
            background: 'rgba(6,182,212,0.06)',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 800,
            fontSize: 12,
            color: '#06b6d4',
            letterSpacing: '0.2em',
          }}>
            🇲🇾 MALAYSIA
          </div>
        </div>
        <div style={{
          fontSize: 8,
          fontFamily: '"JetBrains Mono", monospace',
          color: 'rgba(6,182,212,0.5)',
          letterSpacing: '0.3em',
          marginBottom: 2,
        }}>
          DATA.GOV.MY
        </div>
        <div style={{
          fontSize: 18,
          fontWeight: 800,
          fontFamily: 'Inter, sans-serif',
          color: '#06b6d4',
        }}>
          {t.title}
        </div>
        <div style={{
          fontSize: 9,
          fontFamily: '"JetBrains Mono", monospace',
          color: DT.text.secondary,
          marginTop: 2,
        }}>
          {t.subtitle} — {new Date().getFullYear()}
        </div>
      </div>

      {/* ═══ KPI ROW ═══ */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <KpiCard value={formatHeroNumber(MALAYSIA_TOTALS.population, 'population')} label={t.population} color="#06b6d4" />
        <KpiCard value={formatHeroNumber(MALAYSIA_TOTALS.gdp, 'currency')} label={t.gdp} color="#f59e0b" />
        <KpiCard value={`${MALAYSIA_TOTALS.datasets}`} label={t.datasets} color="#10b981" />
      </div>

      {/* ═══ LAYER CONTENT (single column) ═══ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {layerSections}
      </div>

      {/* ═══ DATA SOURCES ═══ */}
      <SectionCard color="#06b6d4">
        <SectionLabel icon="🏛️" title={t.dataSources} color="#06b6d4" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {activeSources.slice(0, 6).map(src => (
            <SourceBadge key={src.abbr} label={src.abbr} color="#06b6d4" />
          ))}
          <SourceBadge label={`${minBegin}–${maxEnd}`} color="#06b6d4" />
        </div>
      </SectionCard>

      {/* ═══ FOOTER ═══ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        marginTop: 8,
        borderTop: `1px solid ${DT.border.subtle}`,
      }}>
        <div style={{
          fontSize: 6,
          fontFamily: '"JetBrains Mono", monospace',
          color: DT.text.dim,
          maxWidth: '70%',
          lineHeight: 1.4,
        }}>
          {t.disclaimer}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 6, fontFamily: '"JetBrains Mono", monospace', color: DT.text.dim }}>
            {t.source}
          </span>
          <span style={{
            fontSize: 6,
            fontFamily: '"JetBrains Mono", monospace',
            color: '#06b6d4',
            padding: '1px 4px',
            borderRadius: 2,
            border: '1px solid rgba(6,182,212,0.2)',
            background: 'rgba(6,182,212,0.05)',
          }}>
            {t.cc}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────
export interface InfographicPreviewProps {
  lang: Lang;
  selectedLayers: string[];
  format: '16:9' | '9:16';
}

export function InfographicPreview({ lang, selectedLayers, format }: InfographicPreviewProps) {
  if (format === '9:16') {
    return <Template9x16 lang={lang} selectedLayers={selectedLayers} />;
  }
  return <Template16x9 lang={lang} selectedLayers={selectedLayers} />;
}
