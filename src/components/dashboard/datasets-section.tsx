'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Search, ChevronLeft, ChevronRight,
  Globe, X, ExternalLink, Clock, Calendar, Tag, FileDown, Database, Users,
  ArrowRight, Filter, Hash,
} from 'lucide-react';
import { DataSourceBadge } from '@/components/dashboard/data-source-badge';
import { DataFreshnessIndicator } from '@/components/dashboard/data-freshness-indicator';
import { GitHubSourceLink } from '@/components/dashboard/github-source-link';
import { DATASET_CATEGORIES, FREQUENCY_COLORS } from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import type { Lang } from '@/lib/dashboard-types';

// ─── Animated Counter Hook ──────────────────────────────────────
function useAnimatedCounter(target: number, duration = 600) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (prevTarget.current === target) return;
    prevTarget.current = target;
    const start = count;
    const diff = target - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, count]);

  return count;
}

// ─── Dataset Detail Drawer ───────────────────────────────────────
function DatasetDetailDrawer({ dataset, lang, onClose }: {
  dataset: typeof DATASETS[0]; lang: Lang; onClose: () => void;
}) {
  const getCategoryColor = (cat: string) => {
    const found = DATASET_CATEGORIES.find(c => c.en === cat);
    return found?.color || '#64748b';
  };
  const catColor = getCategoryColor(dataset.category_en);
  const freqColor = FREQUENCY_COLORS[dataset.frequency] || '#64748b';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md overflow-y-auto custom-scrollbar border-l"
        style={{
          background: '#0a0e1a',
          borderColor: 'rgba(6,182,212,0.15)',
          boxShadow: '-20px 0 60px rgba(6,182,212,0.1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-4 border-b" style={{ background: 'rgba(10,14,26,0.98)', borderColor: 'rgba(6,182,212,0.12)' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <div className="text-xs font-mono tracking-wider mb-1" style={{ color: catColor }}>
                {lang === 'ms' ? dataset.category_ms : dataset.category_en} / {lang === 'ms' ? dataset.subcategory_ms : dataset.subcategory_en}
              </div>
              <h3 className="text-sm font-bold" style={{ color: '#e0f7fa' }}>
                {lang === 'ms' ? dataset.title_ms : dataset.title_en}
              </h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-cyan-950/30 flex-shrink-0">
              <X size={16} style={{ color: 'rgba(6,182,212,0.5)' }} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Description */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(6,182,212,0.03)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <FileText size={12} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'PENERANGAN' : 'DESCRIPTION'}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#b8c5d4' }}>
              {lang === 'ms' ? dataset.description_ms : dataset.description_en}
            </p>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-[9px] px-2 py-1 rounded font-mono" style={{
              background: `${catColor}15`,
              color: catColor,
              border: `1px solid ${catColor}30`,
            }}>
              <Tag size={9} />
              {lang === 'ms' ? dataset.category_ms : dataset.category_en}
            </span>
            <span className="flex items-center gap-1 text-[9px] px-2 py-1 rounded font-mono" style={{
              background: `${freqColor}15`,
              color: freqColor,
              border: `1px solid ${freqColor}30`,
            }}>
              <Clock size={9} />
              {dataset.frequency}
            </span>
            <DataSourceBadge source="github_meta" lang={lang} />
            <DataFreshnessIndicator lastUpdated={dataset.last_updated} lang={lang} />
          </div>

          {/* Geography */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Globe size={12} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'LIPUTAN GEOGRAFI' : 'GEOGRAPHY COVERAGE'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dataset.geography.length > 0 ? dataset.geography.map(g => (
                <span key={g} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{
                  background: 'rgba(6,182,212,0.08)',
                  color: '#06b6d4',
                  border: '1px solid rgba(6,182,212,0.15)',
                }}>
                  {g}
                </span>
              )) : (
                <span className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>—</span>
              )}
            </div>
          </div>

          {/* Demography */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Users size={12} style={{ color: '#ec4899' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#ec4899' }}>
                {lang === 'ms' ? 'PECAHAN DEMOGRAFI' : 'DEMOGRAPHY BREAKDOWN'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dataset.demography.length > 0 ? dataset.demography.map(d => (
                <span key={d} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{
                  background: 'rgba(236,72,153,0.08)',
                  color: '#ec4899',
                  border: '1px solid rgba(236,72,153,0.15)',
                }}>
                  {d}
                </span>
              )) : (
                <span className="text-[9px] font-mono" style={{ color: 'rgba(236,72,153,0.3)' }}>
                  {lang === 'ms' ? 'Tiada pecahan' : 'No breakdown'}
                </span>
              )}
            </div>
          </div>

          {/* Data Sources */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Database size={12} style={{ color: '#f59e0b' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#f59e0b' }}>
                {lang === 'ms' ? 'SUMBER DATA' : 'DATA SOURCE'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dataset.data_source.map(src => (
                <span key={src} className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold" style={{
                  background: 'rgba(245,158,11,0.08)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.15)',
                }}>
                  {src}
                </span>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar size={12} style={{ color: '#10b981' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#10b981' }}>
                {lang === 'ms' ? 'JULAT DATA' : 'DATA TIME RANGE'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold" style={{ color: '#e0f7fa' }}>{dataset.dataset_begin}</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(16,185,129,0.2)' }}>
                <ArrowRight size={10} className="mx-auto -mt-[5px]" style={{ color: '#10b981' }} />
              </div>
              <span className="text-sm font-mono font-bold" style={{ color: '#e0f7fa' }}>{dataset.dataset_end}</span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={12} style={{ color: '#8b5cf6' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#8b5cf6' }}>
                {lang === 'ms' ? 'KEMAS KINI TERAKHIR' : 'LAST UPDATED'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono" style={{ color: '#e0f7fa' }}>{dataset.last_updated}</span>
              <DataFreshnessIndicator lastUpdated={dataset.last_updated} lang={lang} size="md" />
            </div>
          </div>

          {/* Download Links */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <FileDown size={12} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'MUAT TURUN' : 'DOWNLOAD'}
              </span>
            </div>
            <div className="space-y-2">
              <a
                href={dataset.link_parquet}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-mono transition-all hover:border-cyan-500/30"
                style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}
              >
                <Download size={12} />
                <span>Parquet</span>
                <span className="ml-auto text-[8px] opacity-50">{dataset.id}.parquet</span>
              </a>
              <a
                href={dataset.link_csv}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-mono transition-all hover:border-cyan-500/30"
                style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}
              >
                <Download size={12} />
                <span>CSV</span>
                <span className="ml-auto text-[8px] opacity-50">{dataset.id}.csv</span>
              </a>
              <a
                href={`https://data.gov.my/data-catalogue/${dataset.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-mono transition-all hover:border-cyan-500/30"
                style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
              >
                <ExternalLink size={12} />
                <span>data.gov.my</span>
                <span className="ml-auto text-[8px] opacity-50">{dataset.id}</span>
              </a>
            </div>
          </div>

          {/* GitHub Source Link */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <ExternalLink size={12} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'SUMBER LUAR' : 'EXTERNAL SOURCES'}
              </span>
            </div>
            <GitHubSourceLink datasetId={dataset.id} lang={lang} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Datasets Section ────────────────────────────────────────────
export function DatasetsSection({ lang }: { lang: Lang }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [freqFilter, setFreqFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedDataset, setSelectedDataset] = useState<typeof DATASETS[0] | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const perPage = 20;

  const filtered = useMemo(() => {
    let result = DATASETS;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.title_en.toLowerCase().includes(q) || d.title_ms.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) || d.description_en.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'ALL') result = result.filter(d => d.category_en === categoryFilter);
    if (freqFilter !== 'ALL') result = result.filter(d => d.frequency === freqFilter);
    return result;
  }, [search, categoryFilter, freqFilter]);

  const animatedCount = useAnimatedCounter(filtered.length);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const categories = useMemo(() => ['ALL', ...new Set(DATASETS.map(d => d.category_en))].sort(), []);
  const frequencies = useMemo(() => ['ALL', ...new Set(DATASETS.map(d => d.frequency))].sort(), []);

  const getCategoryColor = (cat: string) => {
    const found = DATASET_CATEGORIES.find(c => c.en === cat);
    return found?.color || '#64748b';
  };

  return (
    <div className="space-y-4" role="region" aria-label="Data catalogue">
      {/* Section Header: Data Catalogue */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'KATALOG DATA' : 'DATA CATALOGUE'}
        </span>
        <motion.div
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: 2, background: 'linear-gradient(90deg, #06b6d4, transparent)', transformOrigin: 'left', width: 120 }}
        />
      </div>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(6,182,212,0.5)' }} />
          <input
            type="text"
            placeholder={lang === 'ms' ? 'Cari set data...' : 'Search datasets...'}
            aria-label="Search datasets"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-4 py-2 rounded-md border text-xs font-mono transition-all duration-300"
            style={{
              background: 'rgba(10,14,26,0.9)',
              borderColor: searchFocused ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.15)',
              color: '#e0f7fa',
              boxShadow: searchFocused ? '0 0 12px rgba(6,182,212,0.15), 0 0 4px rgba(6,182,212,0.1)' : 'none',
            }}
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            aria-label="Filter by category"
            onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-md border text-xs font-mono transition-all duration-200 appearance-none pr-8"
            style={{
              background: categoryFilter !== 'ALL' ? 'rgba(6,182,212,0.1)' : 'rgba(10,14,26,0.9)',
              borderColor: categoryFilter !== 'ALL' ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.15)',
              color: '#06b6d4',
              boxShadow: categoryFilter !== 'ALL' ? '0 0 8px rgba(6,182,212,0.1)' : 'none',
            }}
          >
            {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? (lang === 'ms' ? 'Semua Kategori' : 'All Categories') : c}</option>)}
          </select>
          <Filter size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(6,182,212,0.4)' }} />
        </div>
        <div className="relative">
          <select
            value={freqFilter}
            aria-label="Filter by frequency"
            onChange={e => { setFreqFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-md border text-xs font-mono transition-all duration-200 appearance-none pr-8"
            style={{
              background: freqFilter !== 'ALL' ? 'rgba(6,182,212,0.1)' : 'rgba(10,14,26,0.9)',
              borderColor: freqFilter !== 'ALL' ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.15)',
              color: '#06b6d4',
              boxShadow: freqFilter !== 'ALL' ? '0 0 8px rgba(6,182,212,0.1)' : 'none',
            }}
          >
            {frequencies.map(f => <option key={f} value={f}>{f === 'ALL' ? (lang === 'ms' ? 'Semua Frekuensi' : 'All Frequencies') : f}</option>)}
          </select>
          <Filter size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(6,182,212,0.4)' }} />
        </div>
      </div>

      {/* Results count with animated badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
            {lang === 'ms' ? 'set data dijumpai' : 'datasets found'}
          </span>
          <span
            className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(6,182,212,0.1)',
              color: '#06b6d4',
              border: '1px solid rgba(6,182,212,0.2)',
              boxShadow: '0 0 8px rgba(6,182,212,0.08)',
            }}
          >
            <Hash size={9} />
            {animatedCount}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(6,182,212,0.12)',
      }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.12)' }}>
                <th className="text-left px-3 py-2 font-mono tracking-wider" style={{ color: '#06b6d4' }}>#</th>
                <th className="text-left px-3 py-2 font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'TAJUK' : 'TITLE'}
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider hidden md:table-cell" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'KATEGORI' : 'CATEGORY'}
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'FREKUENSI' : 'FREQ'}
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider hidden lg:table-cell" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'GEOGRAFI' : 'GEO'}
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider hidden lg:table-cell" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'TAHUN' : 'YEARS'}
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                  <ExternalLink size={10} />
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((d, i) => {
                const catColor = getCategoryColor(d.category_en);
                return (
                  <tr
                    key={d.id}
                    className="transition-all duration-200 cursor-pointer group"
                    style={{
                      borderBottom: '1px solid rgba(6,182,212,0.05)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(6,182,212,0.015)',
                      borderLeft: '2px solid transparent',
                    }}
                    onClick={() => setSelectedDataset(d)}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.06)';
                      (e.currentTarget as HTMLElement).style.borderLeft = `2px solid ${catColor}80`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(6,182,212,0.015)';
                      (e.currentTarget as HTMLElement).style.borderLeft = '2px solid transparent';
                    }}
                  >
                    <td className="px-3 py-2 font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium group-hover:text-cyan-300 transition-colors" style={{ color: '#e0f7fa' }}>
                        {lang === 'ms' ? d.title_ms : d.title_en}
                      </div>
                      <div className="text-[9px] opacity-70 mt-0.5 truncate max-w-xs" style={{ color: '#b8c5d4' }}>
                        {lang === 'ms' ? d.description_ms : d.description_en}
                      </div>
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{
                        background: `${getCategoryColor(d.category_en)}15`,
                        color: getCategoryColor(d.category_en),
                        border: `1px solid ${getCategoryColor(d.category_en)}30`,
                      }}>
                        {lang === 'ms' ? d.category_ms : d.category_en}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{
                        background: `${FREQUENCY_COLORS[d.frequency] || '#64748b'}15`,
                        color: FREQUENCY_COLORS[d.frequency] || '#64748b',
                      }}>
                        {d.frequency}
                      </span>
                    </td>
                    <td className="px-3 py-2 hidden lg:table-cell">
                      <span className="text-[9px] font-mono" style={{ color: '#b8c5d4' }}>
                        {d.geography.join(', ') || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2 hidden lg:table-cell font-mono" style={{ color: '#b8c5d4' }}>
                      {d.dataset_begin}–{d.dataset_end}
                    </td>
                    <td className="px-3 py-2">
                      <a
                        href={`https://data.gov.my/data-catalogue/${d.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded hover:bg-cyan-950/30"
                        style={{ color: '#06b6d4' }}
                      >
                        <ExternalLink size={8} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs font-mono disabled:opacity-30"
          style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}
        >
          <ChevronLeft size={12} /> {lang === 'ms' ? 'Sebelum' : 'Prev'}
        </button>
        <span className="text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
          {lang === 'ms' ? 'Halaman' : 'Page'} {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs font-mono disabled:opacity-30"
          style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}
        >
          {lang === 'ms' ? 'Seterusnya' : 'Next'} <ChevronRight size={12} />
        </button>
      </div>

      {/* Dataset Detail Drawer */}
      <AnimatePresence>
        {selectedDataset && (
          <DatasetDetailDrawer
            dataset={selectedDataset}
            lang={lang}
            onClose={() => setSelectedDataset(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default DatasetsSection;
