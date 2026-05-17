'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Clock, Activity, RefreshCw } from 'lucide-react';
import { COMMAND_CENTER_KPIS, type DatasetId } from '@/lib/dosm/registry';
import { useLiveData } from '@/components/dashboard/live-data-provider';
import type { DataStatus } from '@/lib/dosm/client';
import type { Lang } from '@/lib/dashboard-types';

// ─── Status Config ─────────────────────────────────────────────────
const TIER_CONFIG: Record<DataStatus, { color: string; label: string; tier: string; animate: boolean }> = {
  loading:  { color: '#6b7280', label: 'LOADING', tier: '—', animate: true },
  live:     { color: '#10B981', label: 'API',     tier: 'API', animate: true },
  csv:      { color: '#06B6D4', label: 'CSV',     tier: 'CSV', animate: true },
  fallback: { color: '#F59E0B', label: 'STATIC',  tier: 'Static', animate: false },
  error:    { color: '#EF4444', label: 'ERROR',    tier: '—', animate: false },
};

// ─── KPI Registry Labels ───────────────────────────────────────────
const KPI_LABELS: Record<string, string> = {
  gdp_growth: 'GDP Growth Rate',
  gdp_qtr: 'GDP Absolute',
  cpi_headline: 'CPI Headline',
  labour_monthly: 'Labour Force',
  trade_monthly: 'Trade Balance',
  fuelprice: 'Fuel Prices',
  exchange_rate: 'Exchange Rate',
  population_malaysia: 'Population',
};

const KPI_LABELS_BM: Record<string, string> = {
  gdp_growth: 'Kadar Pertumbuhan KDNK',
  gdp_qtr: 'KDNK Mutlak',
  cpi_headline: 'IHP Utama',
  labour_monthly: 'Tenaga Buruh',
  trade_monthly: 'Imbangan Perdagangan',
  fuelprice: 'Harga Bahan Api',
  exchange_rate: 'Kadar Pertukaran',
  population_malaysia: 'Penduduk',
};

// ─── Relative Time ─────────────────────────────────────────────────
function formatRelativeTime(date: Date | null, lang: Lang): string {
  if (!date) return '—';
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 10) return lang === 'ms' ? 'Baru saja' : 'Just now';
  if (seconds < 60) return lang === 'ms' ? `${seconds}s lalu` : `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return lang === 'ms' ? `${minutes}m lalu` : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return lang === 'ms' ? `${hours}j lalu` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return lang === 'ms' ? `${days}h lalu` : `${days}d ago`;
}

// ─── Status Dot ────────────────────────────────────────────────────
function StatusDot({ color, animate }: { color: string; animate: boolean }) {
  if (animate) {
    return (
      <span className="relative inline-flex items-center justify-center w-2 h-2 flex-shrink-0">
        <motion.span
          className="absolute w-2 h-2 rounded-full"
          style={{ border: `1px solid ${color}40` }}
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}60` }}
        />
      </span>
    );
  }

  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: color, boxShadow: `0 0 3px ${color}40` }}
    />
  );
}

// ─── Data Freshness Panel ──────────────────────────────────────────
export function DataFreshnessPanel({ lang }: { lang: Lang }) {
  const { kpiMap, rawData, anyLoading } = useLiveData();
  const [now, setNow] = useState(Date.now());

  // Update relative times every 30s
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const rows = useMemo(() => {
    return COMMAND_CENTER_KPIS.map((id: DatasetId) => {
      const kpi = kpiMap[id];
      const rawResult = rawData[id];
      const status: DataStatus = kpi?.status ?? 'loading';
      const cfg = TIER_CONFIG[status];

      return {
        id,
        name: lang === 'ms' ? (KPI_LABELS_BM[id] ?? id) : (KPI_LABELS[id] ?? id),
        tier: cfg.tier,
        tierLabel: cfg.label,
        tierColor: cfg.color,
        animate: cfg.animate,
        lastFetched: kpi?.lastUpdated ?? null,
        recordCount: rawResult?.raw?.length ?? 0,
        status,
      };
    });
  }, [kpiMap, rawData, lang, now]);

  // Compute summary stats
  const summary = useMemo(() => {
    let live = 0, csv = 0, fallback = 0, errors = 0;
    for (const row of rows) {
      if (row.status === 'live') live++;
      else if (row.status === 'csv') csv++;
      else if (row.status === 'fallback') fallback++;
      else if (row.status === 'error') errors++;
    }
    return { live, csv, fallback, errors, total: rows.length };
  }, [rows]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative rounded-xl border overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(6,182,212,0.04) 0%, rgba(10,14,26,0.92) 30%)',
        borderColor: 'rgba(6,182,212,0.12)',
        backdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.06), 0 0 30px rgba(6,182,212,0.03)',
      }}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.5) 2px, rgba(6,182,212,0.5) 3px)`,
      }} />

      {/* Header */}
      <div className="relative px-4 py-3 border-b" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-bold font-mono tracking-[0.15em]" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.3)' }}>
              {lang === 'ms' ? 'PAPARAN KESEGARAN DATA' : 'DATA FRESHNESS BOARD'}
            </span>
            {anyLoading && (
              <motion.span
                className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(107,114,128,0.15)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.2)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                SYNC
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Summary pills */}
            <div className="flex items-center gap-2">
              {summary.live > 0 && (
                <span className="flex items-center gap-1 text-[8px] font-mono" style={{ color: '#10B981' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981', boxShadow: '0 0 4px rgba(16,185,129,0.5)' }} />
                  {summary.live} API
                </span>
              )}
              {summary.csv > 0 && (
                <span className="flex items-center gap-1 text-[8px] font-mono" style={{ color: '#06B6D4' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#06B6D4', boxShadow: '0 0 4px rgba(6,182,212,0.5)' }} />
                  {summary.csv} CSV
                </span>
              )}
              {summary.fallback > 0 && (
                <span className="flex items-center gap-1 text-[8px] font-mono" style={{ color: '#F59E0B' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F59E0B' }} />
                  {summary.fallback} {lang === 'ms' ? 'Statik' : 'Static'}
                </span>
              )}
              {summary.errors > 0 && (
                <span className="flex items-center gap-1 text-[8px] font-mono" style={{ color: '#EF4444' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#EF4444' }} />
                  {summary.errors} Err
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_80px_80px_60px_24px] gap-2 px-4 py-1.5 border-b" style={{ borderColor: 'rgba(6,182,212,0.06)', background: 'rgba(6,182,212,0.02)' }}>
        <span className="text-[8px] font-mono font-bold tracking-wider uppercase" style={{ color: '#06b6d499' }}>
          {lang === 'ms' ? 'Set Data' : 'Dataset'}
        </span>
        <span className="text-[8px] font-mono font-bold tracking-wider uppercase" style={{ color: '#06b6d499' }}>
          {lang === 'ms' ? 'Tahap' : 'Tier'}
        </span>
        <span className="text-[8px] font-mono font-bold tracking-wider uppercase" style={{ color: '#06b6d499' }}>
          {lang === 'ms' ? 'Kemas Kini' : 'Updated'}
        </span>
        <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-right" style={{ color: '#06b6d499' }}>
          {lang === 'ms' ? 'Rekod' : 'Recs'}
        </span>
        <span />
      </div>

      {/* Data Rows */}
      <div className="max-h-72 overflow-y-auto custom-scrollbar">
        {rows.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="grid grid-cols-[1fr_80px_80px_60px_24px] gap-2 px-4 py-2 items-center transition-all duration-200 cursor-default group"
            style={{
              borderBottom: i < rows.length - 1 ? '1px solid rgba(6,182,212,0.04)' : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(6,182,212,0.04)';
              e.currentTarget.style.borderLeftColor = row.tierColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }}
          >
            {/* Dataset name */}
            <div className="flex items-center gap-2 min-w-0">
              <Database size={10} className="flex-shrink-0 opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: row.tierColor }} />
              <div className="min-w-0">
                <div className="text-[10px] font-mono truncate group-hover:text-cyan-300 transition-colors" style={{ color: '#b8c5d4' }}>
                  {row.name}
                </div>
                <div className="text-[7px] font-mono truncate" style={{ color: '#06b6d460' }}>
                  {row.id}
                </div>
              </div>
            </div>

            {/* Tier */}
            <div className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm font-mono"
                style={{
                  background: `${row.tierColor}10`,
                  border: `1px solid ${row.tierColor}20`,
                }}
              >
                <StatusDot color={row.tierColor} animate={row.animate} />
                <span
                  className="text-[8px] font-bold tracking-wider"
                  style={{ color: row.tierColor, textShadow: `0 0 4px ${row.tierColor}25` }}
                >
                  {row.tierLabel}
                </span>
              </span>
            </div>

            {/* Last updated */}
            <div className="flex items-center gap-1">
              <Clock size={8} className="flex-shrink-0 opacity-30" style={{ color: '#06b6d4' }} />
              <span className="text-[9px] font-mono" style={{ color: row.lastFetched ? '#8899aa' : '#4a5568' }}>
                {formatRelativeTime(row.lastFetched, lang)}
              </span>
            </div>

            {/* Record count */}
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold" style={{ color: row.recordCount > 0 ? '#06b6d4' : '#4a5568' }}>
                {row.recordCount > 0 ? row.recordCount : '—'}
              </span>
            </div>

            {/* Status dot */}
            <div className="flex justify-center">
              <StatusDot color={row.tierColor} animate={row.animate} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer with refresh indicator */}
      <div className="px-4 py-2 border-t flex items-center justify-between" style={{ borderColor: 'rgba(6,182,212,0.06)', background: 'rgba(6,182,212,0.02)' }}>
        <div className="flex items-center gap-1.5">
          <RefreshCw size={9} style={{ color: '#06b6d460' }} />
          <span className="text-[8px] font-mono" style={{ color: '#06b6d460' }}>
            {lang === 'ms' ? 'Auto-segarkan setiap 5 minit' : 'Auto-refresh every 5 min'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono" style={{ color: '#06b6d440' }}>
            {summary.total} {lang === 'ms' ? 'set data' : 'datasets'}
          </span>
          <span className="text-[8px] font-mono" style={{ color: '#06b6d440' }}>│</span>
          <span className="text-[8px] font-mono" style={{ color: '#10B98180' }}>
            {summary.live + summary.csv}/{summary.total} {lang === 'ms' ? 'langsung' : 'live'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default DataFreshnessPanel;
