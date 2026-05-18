'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, GitCompare, ChevronDown, ChevronUp, Download, FileImage,
  FileSpreadsheet, Check, Search, AlertTriangle, BarChart3,
  Table2, Sparkles, ArrowRight, Info,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { DATASETS } from '@/lib/data/datasets';
import { DOSM_REGISTRY } from '@/lib/dosm/registry';
import type { Lang } from '@/lib/dashboard-types';

// ─── Types ────────────────────────────────────────────────────────────
type ComparisonView = 'table' | 'chart';

interface ComparisonDataset {
  id: string;
  title_en: string;
  title_ms: string;
  category_en: string;
  category_ms: string;
  data_source: string[];
  last_updated: string;
  frequency: string;
  dataset_begin: number;
  dataset_end: number;
  geography: string[];
  demography: string[];
  description_en: string;
  description_ms: string;
  registryLabel?: string;
  registryLabelBM?: string;
  registryCategory?: string;
  registryCategoryBM?: string;
  granularity?: string;
  unit?: string;
  priority?: string;
  color?: string;
}

// ─── Constants ────────────────────────────────────────────────────────
const MIN_SELECTIONS = 2;
const MAX_SELECTIONS = 4;

const COMPARE_COLORS = ['#06b6d4', '#f59e0b', '#10b981', '#ec4899'];

const LABELS = {
  en: {
    title: 'Dataset Comparison Tool',
    subtitle: 'Compare datasets side by side',
    selectDatasets: 'Select Datasets to Compare',
    selectPlaceholder: 'Search datasets...',
    selected: 'Selected',
    of: 'of',
    max: 'max',
    min: 'min',
    remove: 'Remove',
    clear: 'Clear All',
    compare: 'Compare',
    tableView: 'Table',
    chartView: 'Chart',
    field: 'Field',
    title_field: 'Title',
    category: 'Category',
    dataSource: 'Data Source',
    lastUpdated: 'Last Updated',
    frequency: 'Frequency',
    coverageYears: 'Coverage Years',
    geography: 'Geography',
    demography: 'Demography',
    granularity: 'Granularity',
    unit: 'Unit',
    priority: 'Priority',
    records: 'Est. Records',
    similarityScore: 'Similarity Score',
    similarityDesc: 'Based on shared categories, data sources, and time range overlap',
    sharedCategory: 'Shared Category',
    sharedSource: 'Shared Source',
    timeOverlap: 'Time Overlap',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    noOverlap: 'No Overlap',
    exportPng: 'Export PNG',
    exportCsv: 'Export CSV',
    noDatasets: 'Select at least 2 datasets to compare',
    close: 'Close',
    years: 'yrs',
    overlap: 'overlap',
    none: 'None',
    na: '—',
  },
  ms: {
    title: 'Alat Perbandingan Set Data',
    subtitle: 'Bandingkan set data secara bersebelahan',
    selectDatasets: 'Pilih Set Data untuk Dibandingkan',
    selectPlaceholder: 'Cari set data...',
    selected: 'Dipilih',
    of: 'daripada',
    max: 'maks',
    min: 'min',
    remove: 'Buang',
    clear: 'Kosongkan Semua',
    compare: 'Bandingkan',
    tableView: 'Jadual',
    chartView: 'Carta',
    field: 'Medan',
    title_field: 'Tajuk',
    category: 'Kategori',
    dataSource: 'Sumber Data',
    lastUpdated: 'Kemas Kini Terakhir',
    frequency: 'Frekuensi',
    coverageYears: 'Julat Tahun',
    geography: 'Geografi',
    demography: 'Demografi',
    granularity: 'Butiran',
    unit: 'Unit',
    priority: 'Keutamaan',
    records: 'Anggaran Rekod',
    similarityScore: 'Skor Keserupaan',
    similarityDesc: 'Berdasarkan kategori berkongsi, sumber data, dan pertindihan julat masa',
    sharedCategory: 'Kategori Berkongsi',
    sharedSource: 'Sumber Berkongsi',
    timeOverlap: 'Pertindihan Masa',
    high: 'Tinggi',
    medium: 'Sederhana',
    low: 'Rendah',
    noOverlap: 'Tiada Pertindihan',
    exportPng: 'Eksport PNG',
    exportCsv: 'Eksport CSV',
    noDatasets: 'Pilih sekurang-kurangnya 2 set data untuk dibandingkan',
    close: 'Tutup',
    years: 'thn',
    overlap: 'pertindihan',
    none: 'Tiada',
    na: '—',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────

/** Enrich a DATASETS entry with DOSM_REGISTRY metadata */
function enrichDataset(raw: typeof DATASETS[0]): ComparisonDataset {
  // Find matching registry entry by id
  const regKey = Object.keys(DOSM_REGISTRY).find(
    k => DOSM_REGISTRY[k].id === raw.id || k === raw.id
  );
  const reg = regKey ? DOSM_REGISTRY[regKey] : undefined;

  return {
    id: raw.id,
    title_en: raw.title_en,
    title_ms: raw.title_ms,
    category_en: raw.category_en,
    category_ms: raw.category_ms,
    data_source: raw.data_source,
    last_updated: raw.last_updated,
    frequency: raw.frequency,
    dataset_begin: raw.dataset_begin,
    dataset_end: raw.dataset_end,
    geography: raw.geography,
    demography: raw.demography,
    description_en: raw.description_en,
    description_ms: raw.description_ms,
    registryLabel: reg?.label,
    registryLabelBM: reg?.labelBM,
    registryCategory: reg?.category,
    registryCategoryBM: reg?.categoryBM,
    granularity: reg?.granularity,
    unit: reg?.unit,
    priority: reg?.priority,
    color: reg?.color,
  };
}

/** Calculate estimated records based on frequency × years × breakdowns */
function estimateRecords(ds: ComparisonDataset): number {
  const years = ds.dataset_end - ds.dataset_begin + 1;
  const geoMultiplier = ds.geography.includes('DISTRICT') ? 150
    : ds.geography.includes('STATE') ? 16
    : ds.geography.includes('PARLIMEN') ? 222
    : ds.geography.includes('DUN') ? 600
    : 1;
  const demoMultiplier = ds.demography.length > 0
    ? ds.demography.reduce((acc, d) => {
        if (d === 'SEX') return acc * 2;
        if (d === 'ETHNICITY' || d === 'AGE') return acc * 5;
        if (d === 'NATIONALITY') return acc * 3;
        return acc * 2;
      }, 1)
    : 1;

  const freqMultiplier = ds.frequency === 'DAILY' ? 365
    : ds.frequency === 'WEEKLY' ? 52
    : ds.frequency === 'MONTHLY' ? 12
    : ds.frequency === 'QUARTERLY' ? 4
    : ds.frequency === 'YEARLY' ? 1
    : 1;

  return years * freqMultiplier * geoMultiplier * demoMultiplier;
}

/** Calculate time range overlap in years */
function timeOverlap(a: ComparisonDataset, b: ComparisonDataset): number {
  const start = Math.max(a.dataset_begin, b.dataset_begin);
  const end = Math.min(a.dataset_end, b.dataset_end);
  return Math.max(0, end - start + 1);
}

/** Calculate similarity score between two datasets (0–100) */
function calcSimilarity(a: ComparisonDataset, b: ComparisonDataset): {
  score: number;
  categoryMatch: boolean;
  sharedSources: string[];
  overlapYears: number;
} {
  // Category match (30 points)
  const categoryMatch = a.category_en === b.category_en;
  const categoryScore = categoryMatch ? 30 : 0;

  // Shared data sources (35 points)
  const sharedSources = a.data_source.filter(s => b.data_source.includes(s));
  const sourceScore = Math.min(35, Math.round((sharedSources.length / Math.max(a.data_source.length, b.data_source.length, 1)) * 35));

  // Time range overlap (35 points)
  const overlapYears = timeOverlap(a, b);
  const maxRange = Math.max(a.dataset_end - a.dataset_begin + 1, b.dataset_end - b.dataset_begin + 1);
  const overlapScore = maxRange > 0 ? Math.round((overlapYears / maxRange) * 35) : 0;

  return {
    score: Math.min(100, categoryScore + sourceScore + overlapScore),
    categoryMatch,
    sharedSources,
    overlapYears,
  };
}

/** Format number with K/M suffix */
function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ─── Dataset Selector Dropdown ────────────────────────────────────────
function DatasetSelector({
  datasets,
  selected,
  onToggle,
  lang,
}: {
  datasets: ComparisonDataset[];
  selected: string[];
  onToggle: (id: string) => void;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const t = LABELS[lang];

  const filtered = useMemo(() => {
    if (!search) return datasets;
    const q = search.toLowerCase();
    return datasets.filter(d =>
      d.title_en.toLowerCase().includes(q) ||
      d.title_ms.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.category_en.toLowerCase().includes(q)
    );
  }, [datasets, search]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md border text-xs font-mono transition-all"
        style={{
          background: 'rgba(10,14,26,0.9)',
          borderColor: open ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.15)',
          color: '#06b6d4',
          boxShadow: open ? '0 0 12px rgba(6,182,212,0.15)' : 'none',
        }}
      >
        <span className="flex items-center gap-2">
          <GitCompare size={12} />
          {t.selectDatasets}
          <span className="px-1.5 py-0.5 rounded-full text-[9px]" style={{
            background: selected.length >= MIN_SELECTIONS ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            color: selected.length >= MIN_SELECTIONS ? '#10b981' : '#f59e0b',
            border: `1px solid ${selected.length >= MIN_SELECTIONS ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
          }}>
            {selected.length} / {MAX_SELECTIONS}
          </span>
        </span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 rounded-lg border overflow-hidden"
            style={{
              background: '#0a0e1a',
              borderColor: 'rgba(6,182,212,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(6,182,212,0.1)',
            }}
          >
            {/* Search */}
            <div className="p-2 border-b" style={{ borderColor: 'rgba(6,182,212,0.1)' }}>
              <div className="relative">
                <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: 'rgba(6,182,212,0.4)' }} />
                <input
                  type="text"
                  placeholder={t.selectPlaceholder}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 rounded border text-xs font-mono"
                  style={{
                    background: 'rgba(10,14,26,0.9)',
                    borderColor: 'rgba(6,182,212,0.1)',
                    color: '#e0f7fa',
                  }}
                  autoFocus
                />
              </div>
            </div>

            {/* Dataset List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {filtered.map(ds => {
                const isSelected = selected.includes(ds.id);
                const canSelect = isSelected || selected.length < MAX_SELECTIONS;
                return (
                  <button
                    key={ds.id}
                    onClick={() => canSelect && onToggle(ds.id)}
                    disabled={!canSelect && !isSelected}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left transition-all"
                    style={{
                      background: isSelected ? 'rgba(6,182,212,0.08)' : 'transparent',
                      opacity: (!canSelect && !isSelected) ? 0.4 : 1,
                      borderBottom: '1px solid rgba(6,182,212,0.04)',
                      cursor: (!canSelect && !isSelected) ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => {
                      if (canSelect || isSelected) {
                        (e.currentTarget as HTMLElement).style.background = isSelected
                          ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.04)';
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = isSelected
                        ? 'rgba(6,182,212,0.08)' : 'transparent';
                    }}
                  >
                    <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border"
                      style={{
                        borderColor: isSelected ? COMPARE_COLORS[selected.indexOf(ds.id)] : 'rgba(6,182,212,0.2)',
                        background: isSelected ? `${COMPARE_COLORS[selected.indexOf(ds.id)]}20` : 'transparent',
                      }}
                    >
                      {isSelected && <Check size={10} style={{ color: COMPARE_COLORS[selected.indexOf(ds.id)] }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium truncate" style={{ color: '#e0f7fa' }}>
                        {lang === 'ms' ? ds.title_ms : ds.title_en}
                      </div>
                      <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
                        {ds.id} · {lang === 'ms' ? ds.category_ms : ds.category_en}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Similarity Score Display ─────────────────────────────────────────
function SimilarityPanel({
  datasets,
  lang,
}: {
  datasets: ComparisonDataset[];
  lang: Lang;
}) {
  const t = LABELS[lang];

  const comparisons = useMemo(() => {
    const results: { a: number; b: number; sim: ReturnType<typeof calcSimilarity> }[] = [];
    for (let i = 0; i < datasets.length; i++) {
      for (let j = i + 1; j < datasets.length; j++) {
        results.push({ a: i, b: j, sim: calcSimilarity(datasets[i], datasets[j]) });
      }
    }
    return results;
  }, [datasets]);

  if (datasets.length < 2) return null;

  return (
    <div className="rounded-lg border p-3" style={{
      background: 'rgba(10,14,26,0.95)',
      borderColor: 'rgba(6,182,212,0.12)',
    }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={12} style={{ color: '#f59e0b' }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#f59e0b' }}>
          {t.similarityScore}
        </span>
      </div>
      <p className="text-[9px] mb-3" style={{ color: 'rgba(245,158,11,0.5)' }}>
        {t.similarityDesc}
      </p>

      <div className="space-y-3">
        {comparisons.map((comp, idx) => (
          <div key={idx} className="rounded-md border p-2.5" style={{
            background: 'rgba(245,158,11,0.03)',
            borderColor: 'rgba(245,158,11,0.08)',
          }}>
            {/* Pair header */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COMPARE_COLORS[comp.a] }} />
              <span className="text-[9px] font-mono font-bold truncate max-w-[100px]" style={{ color: COMPARE_COLORS[comp.a] }}>
                {lang === 'ms' ? datasets[comp.a].title_ms : datasets[comp.a].title_en}
              </span>
              <ArrowRight size={8} style={{ color: 'rgba(245,158,11,0.3)' }} />
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COMPARE_COLORS[comp.b] }} />
              <span className="text-[9px] font-mono font-bold truncate max-w-[100px]" style={{ color: COMPARE_COLORS[comp.b] }}>
                {lang === 'ms' ? datasets[comp.b].title_ms : datasets[comp.b].title_en}
              </span>
              <span className="ml-auto text-sm font-mono font-bold" style={{
                color: comp.sim.score >= 70 ? '#10b981' : comp.sim.score >= 40 ? '#f59e0b' : '#ef4444',
              }}>
                {comp.sim.score}%
              </span>
            </div>

            {/* Score bar */}
            <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(245,158,11,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${comp.sim.score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: comp.sim.score >= 70
                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                    : comp.sim.score >= 40
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                    : 'linear-gradient(90deg, #ef4444, #f87171)',
                }}
              />
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-[8px] font-mono">
              <div className="text-center">
                <div style={{ color: comp.sim.categoryMatch ? '#10b981' : 'rgba(239,68,68,0.5)' }}>
                  {comp.sim.categoryMatch ? '✓' : '✗'}
                </div>
                <div style={{ color: 'rgba(245,158,11,0.4)' }}>{t.sharedCategory}</div>
              </div>
              <div className="text-center">
                <div style={{ color: comp.sim.sharedSources.length > 0 ? '#10b981' : 'rgba(239,68,68,0.5)' }}>
                  {comp.sim.sharedSources.length > 0 ? comp.sim.sharedSources.join(', ') : t.none}
                </div>
                <div style={{ color: 'rgba(245,158,11,0.4)' }}>{t.sharedSource}</div>
              </div>
              <div className="text-center">
                <div style={{ color: comp.sim.overlapYears > 0 ? '#10b981' : 'rgba(239,68,68,0.5)' }}>
                  {comp.sim.overlapYears > 0 ? `${comp.sim.overlapYears} ${t.years}` : t.noOverlap}
                </div>
                <div style={{ color: 'rgba(245,158,11,0.4)' }}>{t.timeOverlap}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Comparison Table View ────────────────────────────────────────────
function ComparisonTableView({
  datasets,
  lang,
}: {
  datasets: ComparisonDataset[];
  lang: Lang;
}) {
  const t = LABELS[lang];

  const rows = useMemo(() => [
    {
      field: t.title_field,
      values: datasets.map(d => lang === 'ms' ? d.title_ms : d.title_en),
    },
    {
      field: t.category,
      values: datasets.map(d => lang === 'ms' ? d.category_ms : d.category_en),
    },
    {
      field: t.dataSource,
      values: datasets.map(d => d.data_source.join(', ') || t.na),
    },
    {
      field: t.lastUpdated,
      values: datasets.map(d => d.last_updated || t.na),
    },
    {
      field: t.frequency,
      values: datasets.map(d => d.frequency || t.na),
    },
    {
      field: t.coverageYears,
      values: datasets.map(d => `${d.dataset_begin}–${d.dataset_end} (${d.dataset_end - d.dataset_begin + 1} ${t.years})`),
    },
    {
      field: t.geography,
      values: datasets.map(d => d.geography.join(', ') || t.na),
    },
    {
      field: t.demography,
      values: datasets.map(d => d.demography.join(', ') || t.na),
    },
    {
      field: t.granularity,
      values: datasets.map(d => d.granularity || t.na),
    },
    {
      field: t.unit,
      values: datasets.map(d => d.unit || t.na),
    },
    {
      field: t.priority,
      values: datasets.map(d => d.priority || t.na),
    },
    {
      field: t.records,
      values: datasets.map(d => formatNumber(estimateRecords(d))),
    },
  ], [datasets, lang, t]);

  return (
    <div className="overflow-x-auto custom-scrollbar rounded-lg border" style={{
      background: 'rgba(10,14,26,0.95)',
      borderColor: 'rgba(6,182,212,0.12)',
    }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.12)' }}>
            <th className="text-left px-3 py-2 font-mono tracking-wider sticky left-0 z-10" style={{
              color: '#06b6d4',
              background: 'rgba(10,14,26,0.98)',
              minWidth: '100px',
            }}>
              {t.field}
            </th>
            {datasets.map((ds, i) => (
              <th key={ds.id} className="text-left px-3 py-2 font-mono tracking-wider" style={{
                color: COMPARE_COLORS[i],
                minWidth: '180px',
                borderLeft: `2px solid ${COMPARE_COLORS[i]}30`,
              }}>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COMPARE_COLORS[i] }} />
                  <span className="truncate">{lang === 'ms' ? ds.title_ms : ds.title_en}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row.field} style={{
              borderBottom: '1px solid rgba(6,182,212,0.04)',
              background: ri % 2 === 0 ? 'transparent' : 'rgba(6,182,212,0.015)',
            }}>
              <td className="px-3 py-2 font-mono font-bold sticky left-0 z-10" style={{
                color: '#06b6d4',
                background: ri % 2 === 0 ? 'rgba(10,14,26,0.98)' : 'rgba(10,14,26,0.98)',
                fontSize: '10px',
              }}>
                {row.field}
              </td>
              {row.values.map((val, vi) => {
                // Check for matching values across columns
                const isMatch = row.values.length >= 2 && row.values.every(v => v === val) && val !== t.na;
                const isDiff = row.values.length >= 2 && !row.values.every(v => v === row.values[0]) && val !== t.na;

                return (
                  <td key={vi} className="px-3 py-2 font-mono" style={{
                    color: isMatch ? '#10b981' : isDiff ? '#e0f7fa' : '#94a3b8',
                    borderLeft: `2px solid ${COMPARE_COLORS[vi]}15`,
                    fontSize: '10px',
                  }}>
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Mini Sparkline ───────────────────────────────────────────────────
function MiniSparkline({
  color,
  begin,
  end,
  width = 120,
  height = 32,
}: {
  color: string;
  begin: number;
  end: number;
  width?: number;
  height?: number;
}) {
  // Generate a deterministic "data-like" sparkline from year range
  const points = useMemo(() => {
    const years = end - begin + 1;
    const pts: string[] = [];
    const step = width / Math.min(years, 30);
    for (let i = 0; i <= Math.min(years, 30); i++) {
      // Create a plausible curve
      const x = i * step;
      const progress = i / Math.min(years, 30);
      const baseY = height * 0.3 + Math.sin(progress * Math.PI * 2) * height * 0.2;
      const noise = Math.sin(i * 1.7 + begin * 0.3) * height * 0.08;
      const y = Math.max(2, Math.min(height - 2, height - baseY - noise));
      pts.push(`${x},${y}`);
    }
    return pts;
  }, [begin, end, width, height]);

  const areaPath = `M0,${height} L${points.map(p => p).join(' L')} L${width},${height} Z`;
  const linePath = `M${points.join(' L')}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${color.replace('#', '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
}

// ─── Comparison Chart View ────────────────────────────────────────────
function ComparisonChartView({
  datasets,
  lang,
}: {
  datasets: ComparisonDataset[];
  lang: Lang;
}) {
  const t = LABELS[lang];

  return (
    <div className="space-y-3">
      {datasets.map((ds, i) => (
        <motion.div
          key={ds.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-lg border p-3"
          style={{
            background: 'rgba(10,14,26,0.95)',
            borderColor: `${COMPARE_COLORS[i]}20`,
            borderLeft: `3px solid ${COMPARE_COLORS[i]}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: COMPARE_COLORS[i] }} />
              <span className="text-xs font-mono font-bold" style={{ color: COMPARE_COLORS[i] }}>
                {lang === 'ms' ? ds.title_ms : ds.title_en}
              </span>
            </div>
            <span className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
              {ds.dataset_begin}–{ds.dataset_end} ({ds.dataset_end - ds.dataset_begin + 1} {t.years})
            </span>
          </div>

          {/* Sparkline */}
          <MiniSparkline color={COMPARE_COLORS[i]} begin={ds.dataset_begin} end={ds.dataset_end} width={320} height={40} />

          {/* Quick stats row */}
          <div className="flex items-center gap-4 mt-2 text-[9px] font-mono">
            <span style={{ color: 'rgba(6,182,212,0.5)' }}>
              {t.category}: <span style={{ color: COMPARE_COLORS[i] }}>{lang === 'ms' ? ds.category_ms : ds.category_en}</span>
            </span>
            <span style={{ color: 'rgba(6,182,212,0.5)' }}>
              {t.frequency}: <span style={{ color: COMPARE_COLORS[i] }}>{ds.frequency}</span>
            </span>
            <span style={{ color: 'rgba(6,182,212,0.5)' }}>
              {t.records}: <span style={{ color: COMPARE_COLORS[i] }}>{formatNumber(estimateRecords(ds))}</span>
            </span>
          </div>
        </motion.div>
      ))}

      {/* Overlap Timeline */}
      {datasets.length >= 2 && (
        <div className="rounded-lg border p-3" style={{
          background: 'rgba(10,14,26,0.95)',
          borderColor: 'rgba(6,182,212,0.12)',
        }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={12} style={{ color: '#06b6d4' }} />
            <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'GARIS MASA PERTINDIHAN' : 'OVERLAP TIMELINE'}
            </span>
          </div>

          {/* Timeline visualization */}
          <div className="space-y-1.5">
            {datasets.map((ds, i) => {
              const globalMin = Math.min(...datasets.map(d => d.dataset_begin));
              const globalMax = Math.max(...datasets.map(d => d.dataset_end));
              const range = globalMax - globalMin + 1;
              const leftPct = ((ds.dataset_begin - globalMin) / range) * 100;
              const widthPct = ((ds.dataset_end - ds.dataset_begin + 1) / range) * 100;

              return (
                <div key={ds.id} className="flex items-center gap-2">
                  <span className="text-[8px] font-mono w-2" style={{ color: COMPARE_COLORS[i] }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 h-5 relative rounded-sm" style={{ background: 'rgba(6,182,212,0.04)' }}>
                    <motion.div
                      initial={{ width: 0, left: `${leftPct}%` }}
                      animate={{ width: `${widthPct}%`, left: `${leftPct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute top-0 h-full rounded-sm flex items-center px-1.5"
                      style={{
                        background: `${COMPARE_COLORS[i]}20`,
                        border: `1px solid ${COMPARE_COLORS[i]}40`,
                      }}
                    >
                      <span className="text-[8px] font-mono truncate" style={{ color: COMPARE_COLORS[i] }}>
                        {ds.dataset_begin}–{ds.dataset_end}
                      </span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Year axis */}
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2" />
            <div className="flex-1 flex justify-between text-[7px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
              <span>{Math.min(...datasets.map(d => d.dataset_begin))}</span>
              <span>{Math.max(...datasets.map(d => d.dataset_end))}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Comparison Tool ─────────────────────────────────────────────
export function DatasetComparisonTool({
  lang,
  isOpen,
  onClose,
  preselectedIds,
}: {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
  preselectedIds?: string[];
}) {
  const t = LABELS[lang];
  const contentRef = useRef<HTMLDivElement>(null);

  // All datasets enriched with registry data
  const allDatasets = useMemo(() => DATASETS.map(enrichDataset), []);

  // Selected dataset IDs
  const [selectedIds, setSelectedIds] = useState<string[]>(preselectedIds || []);

  // Update preselected when prop changes
  const [prevPreselected, setPrevPreselected] = useState(preselectedIds);
  if (preselectedIds !== prevPreselected) {
    setPrevPreselected(preselectedIds);
    setSelectedIds(preselectedIds || []);
  }

  // View mode
  const [viewMode, setViewMode] = useState<ComparisonView>('table');

  // Selected dataset objects
  const selectedDatasets = useMemo(
    () => selectedIds.map(id => allDatasets.find(d => d.id === id)).filter(Boolean) as ComparisonDataset[],
    [selectedIds, allDatasets]
  );

  const toggleDataset = useCallback((id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_SELECTIONS) return prev;
      return [...prev, id];
    });
  }, []);

  const clearAll = useCallback(() => setSelectedIds([]), []);

  // Export PNG
  const handleExportPng = useCallback(async () => {
    if (!contentRef.current) return;
    try {
      const dataUrl = await toPng(contentRef.current, {
        backgroundColor: '#0a0e1a',
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `dataset-comparison-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Silently fail
    }
  }, []);

  // Export CSV
  const handleExportCsv = useCallback(() => {
    if (selectedDatasets.length < 2) return;
    const fields = ['title', 'category', 'dataSource', 'lastUpdated', 'frequency', 'coverageYears', 'geography', 'demography', 'granularity', 'unit', 'priority', 'estRecords'];
    const fieldLabels: Record<string, string> = {
      title: t.title_field,
      category: t.category,
      dataSource: t.dataSource,
      lastUpdated: t.lastUpdated,
      frequency: t.frequency,
      coverageYears: t.coverageYears,
      geography: t.geography,
      demography: t.demography,
      granularity: t.granularity,
      unit: t.unit,
      priority: t.priority,
      estRecords: t.records,
    };

    const header = ['Field', ...selectedDatasets.map(d => lang === 'ms' ? d.title_ms : d.title_en)];
    const rows = fields.map(f => {
      return [
        fieldLabels[f] || f,
        ...selectedDatasets.map(d => {
          switch (f) {
            case 'title': return lang === 'ms' ? d.title_ms : d.title_en;
            case 'category': return lang === 'ms' ? d.category_ms : d.category_en;
            case 'dataSource': return d.data_source.join('; ');
            case 'lastUpdated': return d.last_updated;
            case 'frequency': return d.frequency;
            case 'coverageYears': return `${d.dataset_begin}-${d.dataset_end}`;
            case 'geography': return d.geography.join('; ');
            case 'demography': return d.demography.join('; ');
            case 'granularity': return d.granularity || '';
            case 'unit': return d.unit || '';
            case 'priority': return d.priority || '';
            case 'estRecords': return estimateRecords(d).toString();
            default: return '';
          }
        }),
      ];
    });

    const csvContent = [header, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.download = `dataset-comparison-${Date.now()}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [selectedDatasets, lang, t]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-4 md:inset-8 lg:inset-12 rounded-xl border overflow-hidden flex flex-col"
          style={{
            background: '#0a0e1a',
            borderColor: 'rgba(6,182,212,0.15)',
            boxShadow: '0 0 60px rgba(6,182,212,0.08), 0 0 120px rgba(0,0,0,0.5)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0" style={{
            background: 'rgba(6,182,212,0.03)',
            borderColor: 'rgba(6,182,212,0.12)',
          }}>
            <div className="flex items-center gap-3">
              <GitCompare size={16} style={{ color: '#06b6d4' }} />
              <div>
                <h2 className="text-sm font-bold" style={{ color: '#e0f7fa' }}>{t.title}</h2>
                <p className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Export buttons */}
              {selectedDatasets.length >= MIN_SELECTIONS && (
                <>
                  <button
                    onClick={handleExportPng}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[10px] font-mono transition-all hover:border-cyan-500/30"
                    style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}
                  >
                    <FileImage size={10} />
                    {t.exportPng}
                  </button>
                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[10px] font-mono transition-all hover:border-cyan-500/30"
                    style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}
                  >
                    <FileSpreadsheet size={10} />
                    {t.exportCsv}
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-cyan-950/30 transition-colors"
                style={{ color: 'rgba(6,182,212,0.5)' }}
                aria-label={t.close}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Toolbar: Selector + View toggle + Clear */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 px-4 py-3 border-b flex-shrink-0" style={{
            background: 'rgba(6,182,212,0.015)',
            borderColor: 'rgba(6,182,212,0.08)',
          }}>
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <DatasetSelector
                datasets={allDatasets}
                selected={selectedIds}
                onToggle={toggleDataset}
                lang={lang}
              />
            </div>

            {/* Selected chips */}
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedDatasets.map((ds, i) => (
                  <span
                    key={ds.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-mono"
                    style={{
                      background: `${COMPARE_COLORS[i]}10`,
                      color: COMPARE_COLORS[i],
                      border: `1px solid ${COMPARE_COLORS[i]}30`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: COMPARE_COLORS[i] }} />
                    <span className="truncate max-w-[120px]">{lang === 'ms' ? ds.title_ms : ds.title_en}</span>
                    <button
                      onClick={() => toggleDataset(ds.id)}
                      className="hover:opacity-70"
                      style={{ color: COMPARE_COLORS[i] }}
                    >
                      <X size={8} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAll}
                  className="text-[9px] font-mono px-2 py-1 rounded hover:bg-red-950/30"
                  style={{ color: 'rgba(239,68,68,0.6)' }}
                >
                  {t.clear}
                </button>
              </div>
            )}

            {/* View mode toggle */}
            {selectedDatasets.length >= MIN_SELECTIONS && (
              <div className="flex items-center rounded-md border overflow-hidden" style={{
                background: 'rgba(10,14,26,0.8)',
                borderColor: 'rgba(6,182,212,0.1)',
              }}>
                <button
                  onClick={() => setViewMode('table')}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[9px] font-mono transition-all"
                  style={{
                    background: viewMode === 'table' ? 'rgba(6,182,212,0.1)' : 'transparent',
                    color: viewMode === 'table' ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                  }}
                >
                  <Table2 size={10} />
                  {t.tableView}
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[9px] font-mono transition-all"
                  style={{
                    background: viewMode === 'chart' ? 'rgba(6,182,212,0.1)' : 'transparent',
                    color: viewMode === 'chart' ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                  }}
                >
                  <BarChart3 size={10} />
                  {t.chartView}
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar p-4" style={{ background: '#0a0e1a' }}>
            {selectedDatasets.length < MIN_SELECTIONS ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
                  background: 'rgba(6,182,212,0.05)',
                  border: '1px dashed rgba(6,182,212,0.2)',
                }}>
                  <GitCompare size={24} style={{ color: 'rgba(6,182,212,0.3)' }} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
                    {t.noDatasets}
                  </p>
                  <p className="text-[9px] font-mono mt-1" style={{ color: 'rgba(6,182,212,0.25)' }}>
                    {MIN_SELECTIONS}–{MAX_SELECTIONS} datasets required
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Similarity Panel */}
                <SimilarityPanel datasets={selectedDatasets} lang={lang} />

                {/* View content */}
                <AnimatePresence mode="wait">
                  {viewMode === 'table' ? (
                    <motion.div
                      key="table"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ComparisonTableView datasets={selectedDatasets} lang={lang} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chart"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ComparisonChartView datasets={selectedDatasets} lang={lang} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DatasetComparisonTool;
