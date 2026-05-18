'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Activity, Clock, Server, Wifi, WifiOff,
  AlertTriangle, CheckCircle2, BarChart3, Eye,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, LabelList, CartesianGrid,
} from 'recharts';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';
import type { DataSourceTier } from '@/lib/dosm/dosm-data-source';

// ─── Premium Card Style Helper ───────────────────────────────────
function premiumCardStyle(overrides?: Record<string, string>) {
  return {
    background: 'linear-gradient(180deg, rgba(6,182,212,0.03) 0%, rgba(10,14,26,0.85) 30%)',
    borderColor: 'rgba(6,182,212,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.06)',
    ...overrides,
  };
}

// ─── Chart Axis Styles ───────────────────────────────────────────
const CHART_AXIS_TICK = { fill: '#8899aa', fontSize: 9 };
const CHART_AXIS_LINE = { stroke: 'rgba(6,182,212,0.15)' };
const CHART_TICK_LINE = { stroke: 'rgba(6,182,212,0.15)' };

// ─── Animated Divider ────────────────────────────────────────────
function AnimatedDivider({ color = '#06b6d4' }: { color?: string }) {
  return (
    <div className="w-full h-px my-4" style={{ background: `linear-gradient(90deg, transparent, ${color}33, ${color}66, ${color}33, transparent)` }}>
      <motion.div
        className="h-full w-16"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        animate={{ x: ['-100px', 'calc(100% + 100px)'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// ─── Scan Beam Overlay ──────────────────────────────────────────
function ScanBeamOverlay({ color = '#06b6d4' }: { color?: string }) {
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <motion.div
        className="absolute top-0 bottom-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent, ${color}30, ${color}60, ${color}30, transparent)`,
          boxShadow: `0 0 8px ${color}40`,
        }}
        animate={{ left: ['0%', '100%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// ─── Status color helper ────────────────────────────────────────
type HealthStatus = 'healthy' | 'degraded' | 'offline';
function statusColor(status: HealthStatus): string {
  switch (status) {
    case 'healthy': return '#10b981';
    case 'degraded': return '#f59e0b';
    case 'offline': return '#ef4444';
  }
}

function statusLabel(status: HealthStatus, lang: Lang): string {
  switch (status) {
    case 'healthy': return lang === 'ms' ? 'SIHAT' : 'HEALTHY';
    case 'degraded': return lang === 'ms' ? 'TERJEJAS' : 'DEGRADED';
    case 'offline': return lang === 'ms' ? 'LUAR TALIAN' : 'OFFLINE';
  }
}

// ─── Freshness type ─────────────────────────────────────────────
type Freshness = 'FRESH' | 'RECENT' | 'STALE';
function freshnessColor(f: Freshness): string {
  switch (f) {
    case 'FRESH': return '#10b981';
    case 'RECENT': return '#f59e0b';
    case 'STALE': return '#ef4444';
  }
}

function freshnessLabel(f: Freshness, lang: Lang): string {
  switch (f) {
    case 'FRESH': return lang === 'ms' ? 'SEGAR' : 'FRESH';
    case 'RECENT': return lang === 'ms' ? 'TERKINI' : 'RECENT';
    case 'STALE': return lang === 'ms' ? 'LAMA' : 'STALE';
  }
}

// ─── Tier label helper ──────────────────────────────────────────
function tierLabel(tier: DataSourceTier, lang: Lang): string {
  const map: Record<DataSourceTier, { en: string; ms: string }> = {
    static_json: { en: 'Local Static', ms: 'Statik Tempatan' },
    github_meta: { en: 'GitHub Meta', ms: 'Meta GitHub' },
    dosm_storage: { en: 'DOSM Storage', ms: 'Storan DOSM' },
    dosm_api: { en: 'DOSM API', ms: 'API DOSM' },
    csv_fallback: { en: 'CSV Fallback', ms: 'CSV Sandaran' },
  };
  return map[tier]?.[lang] ?? tier;
}

// ─── Demo badge ─────────────────────────────────────────────────
function DemoBadge({ lang }: { lang: Lang }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
      style={{
        background: 'rgba(245,158,11,0.15)',
        border: '1px solid rgba(245,158,11,0.3)',
        color: '#f59e0b',
      }}
    >
      <AlertTriangle size={8} />
      DEMO
    </span>
  );
}

// ─── Data Source Health Grid ────────────────────────────────────
interface DataSourceHealth {
  tier: DataSourceTier;
  status: HealthStatus;
  responseTimeMs: number;
  lastFetch: string;
  successRate: number;
}

function DataSourceHealthGrid({ sources, lang }: { sources: DataSourceHealth[]; lang: Lang }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {sources.map((src, i) => {
        const color = statusColor(src.status);
        return (
          <motion.div
            key={src.tier}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-lg border p-3"
            style={{
              background: `${color}06`,
              borderColor: `${color}20`,
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                {src.status === 'healthy' ? (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Wifi size={10} style={{ color }} />
                  </motion.div>
                ) : src.status === 'degraded' ? (
                  <AlertTriangle size={10} style={{ color }} />
                ) : (
                  <WifiOff size={10} style={{ color }} />
                )}
                <span className="text-[9px] font-mono font-semibold" style={{ color }}>
                  {tierLabel(src.tier, lang)}
                </span>
              </div>
              <span
                className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-sm"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  color,
                }}
              >
                {statusLabel(src.status, lang)}
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-mono" style={{ color: '#8899aa' }}>
                  {lang === 'ms' ? 'Masa Tindak Balas' : 'Response Time'}
                </span>
                <span className="text-[9px] font-mono font-semibold" style={{ color: '#e0f7fa' }}>
                  {src.responseTimeMs}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-mono" style={{ color: '#8899aa' }}>
                  {lang === 'ms' ? 'Kadar Jayaan' : 'Success Rate'}
                </span>
                <span className="text-[9px] font-mono font-semibold" style={{ color: src.successRate >= 95 ? '#10b981' : src.successRate >= 80 ? '#f59e0b' : '#ef4444' }}>
                  {src.successRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-mono" style={{ color: '#8899aa' }}>
                  {lang === 'ms' ? 'Ambil Terakhir' : 'Last Fetch'}
                </span>
                <span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>
                  {src.lastFetch}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Dataset Freshness Matrix ───────────────────────────────────
interface DatasetFreshnessEntry {
  name_en: string;
  name_ms: string;
  lastUpdated: string;
  freshness: Freshness;
  tier: DataSourceTier;
}

function DatasetFreshnessMatrix({ datasets, lang }: { datasets: DatasetFreshnessEntry[]; lang: Lang }) {
  return (
    <div className="overflow-x-auto max-h-80 overflow-y-auto custom-scrollbar">
      <table className="w-full text-[9px] font-mono">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
            <th className="text-left px-2 py-1.5" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'SET DATA' : 'DATASET'}
            </th>
            <th className="text-center px-2 py-1.5" style={{ color: '#f59e0b' }}>
              {lang === 'ms' ? 'TERKINI' : 'UPDATED'}
            </th>
            <th className="text-center px-2 py-1.5" style={{ color: '#10b981' }}>
              {lang === 'ms' ? 'KESEGERAAN' : 'FRESHNESS'}
            </th>
            <th className="text-center px-2 py-1.5" style={{ color: '#8b5cf6' }}>
              {lang === 'ms' ? 'TIER' : 'TIER'}
            </th>
          </tr>
        </thead>
        <tbody>
          {datasets.map((ds, i) => {
            const fc = freshnessColor(ds.freshness);
            return (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="hover:bg-cyan-950/20"
                style={{ borderBottom: '1px solid rgba(6,182,212,0.04)' }}
              >
                <td className="px-2 py-1.5" style={{ color: '#e0f7fa' }} title={lang === 'ms' ? ds.name_ms : ds.name_en}>
                  <span className="block truncate max-w-[140px]">{lang === 'ms' ? ds.name_ms : ds.name_en}</span>
                </td>
                <td className="text-center px-2 py-1.5" style={{ color: '#b0bec5' }}>
                  {ds.lastUpdated}
                </td>
                <td className="text-center px-2 py-1.5">
                  <span
                    className="inline-flex items-center gap-1 text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-sm"
                    style={{
                      background: `${fc}12`,
                      border: `1px solid ${fc}30`,
                      color: fc,
                    }}
                  >
                    {ds.freshness === 'FRESH' && (
                      <motion.span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ background: fc }}
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    {freshnessLabel(ds.freshness, lang)}
                  </span>
                </td>
                <td className="text-center px-2 py-1.5" style={{ color: '#8b5cf6' }}>
                  <span className="text-[7px]">{tierLabel(ds.tier, lang)}</span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── API Performance Chart ──────────────────────────────────────
interface ApiPerformanceEntry {
  endpoint: string;
  endpointMs: string;
  responseTimeMs: number;
}

function ApiPerformanceChart({ data, lang }: { data: ApiPerformanceEntry[]; lang: Lang }) {
  const chartData = useMemo(() =>
    data.map(d => ({
      name: d.endpoint,
      label: d.endpointMs,
      value: d.responseTimeMs,
      valueLabel: `${d.responseTimeMs}ms`,
    }))
  , [data]);

  return (
    <ResponsiveContainer width="100%" height={160} role="img" aria-label="API response time bar chart">
      <BarChart data={chartData} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.06)" />
        <XAxis dataKey="label" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} />
        <YAxis tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} width={36} />
        <Tooltip contentStyle={{
          background: 'rgba(10,14,26,0.97)',
          border: '1px solid rgba(6,182,212,0.25)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          padding: '8px 12px',
          fontSize: '11px',
          fontFamily: 'monospace',
          color: '#e0f7fa',
        }} itemStyle={{ color: '#b8c5d4' }} labelStyle={{ color: '#06b6d4', fontWeight: 'bold' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((d, i) => {
            const fill = d.value < 300 ? '#10b981' : d.value < 800 ? '#f59e0b' : '#ef4444';
            return <Cell key={i} fill={fill} opacity={0.75} />;
          })}
          <LabelList dataKey="valueLabel" position="top" fill="#b8c5d4" fontSize={8} fontFamily="monospace" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Uptime Tracker ─────────────────────────────────────────────
function UptimeTracker({ uptimeData, lang }: { uptimeData: { hour: number; uptime: number }[]; lang: Lang }) {
  const overallUptime = useMemo(() => {
    const avg = uptimeData.reduce((a, b) => a + b.uptime, 0) / uptimeData.length;
    return Math.round(avg * 100) / 100;
  }, [uptimeData]);

  const uptimeColor = (val: number): string => {
    if (val >= 99.5) return '#10b981';
    if (val >= 95) return '#f59e0b';
    return '#ef4444';
  };

  const overallColor = uptimeColor(overallUptime);

  return (
    <div>
      {/* Overall uptime header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono" style={{ color: '#8899aa' }}>
            {lang === 'ms' ? '24J MASA HIDUP' : '24H UPTIME'}
          </span>
          <span className="text-[13px] font-mono font-bold" style={{ color: overallColor, textShadow: `0 0 8px ${overallColor}40` }}>
            {overallUptime.toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ background: '#10b981' }} />
            <span className="text-[6px] font-mono" style={{ color: '#b0bec5' }}>&gt;99.5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ background: '#f59e0b' }} />
            <span className="text-[6px] font-mono" style={{ color: '#b0bec5' }}>95-99%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ background: '#ef4444' }} />
            <span className="text-[6px] font-mono" style={{ color: '#b0bec5' }}>&lt;95%</span>
          </div>
        </div>
      </div>

      {/* Hourly grid */}
      <div className="flex gap-[2px] flex-wrap">
        {uptimeData.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="flex-1 min-w-[12px] h-7 rounded-sm flex items-center justify-center cursor-default"
            style={{
              background: `${uptimeColor(entry.uptime)}20`,
              border: `1px solid ${uptimeColor(entry.uptime)}30`,
            }}
            title={`${entry.hour}:00 — ${entry.uptime}% ${lang === 'ms' ? 'masa hidup' : 'uptime'}`}
          >
            <span className="text-[5px] font-mono" style={{ color: uptimeColor(entry.uptime) }}>
              {entry.uptime === 100 ? '●' : `${entry.uptime}`}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[6px] font-mono" style={{ color: '#8899aa' }}>00:00</span>
        <span className="text-[6px] font-mono" style={{ color: '#8899aa' }}>06:00</span>
        <span className="text-[6px] font-mono" style={{ color: '#8899aa' }}>12:00</span>
        <span className="text-[6px] font-mono" style={{ color: '#8899aa' }}>18:00</span>
        <span className="text-[6px] font-mono" style={{ color: '#8899aa' }}>23:00</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT: DataQualityDashboard
// ═══════════════════════════════════════════════════════════════════
export function DataQualityDashboard({ lang }: { lang: Lang }) {
  // ─── Data Source Health (simulated with realistic values) ──────
  const dataSourcesHealth = useMemo<DataSourceHealth[]>(() => [
    {
      tier: 'static_json',
      status: 'healthy',
      responseTimeMs: 12,
      lastFetch: lang === 'ms' ? '2 min lalu' : '2m ago',
      successRate: 100,
    },
    {
      tier: 'github_meta',
      status: 'healthy',
      responseTimeMs: 145,
      lastFetch: lang === 'ms' ? '5 min lalu' : '5m ago',
      successRate: 98,
    },
    {
      tier: 'dosm_storage',
      status: 'degraded',
      responseTimeMs: 2340,
      lastFetch: lang === 'ms' ? '18 min lalu' : '18m ago',
      successRate: 87,
    },
    {
      tier: 'dosm_api',
      status: 'degraded',
      responseTimeMs: 4200,
      lastFetch: lang === 'ms' ? '32 min lalu' : '32m ago',
      successRate: 72,
    },
  ], [lang]);

  // ─── Dataset Freshness (10 most important datasets) ───────────
  const datasetFreshness = useMemo<DatasetFreshnessEntry[]>(() => [
    { name_en: 'Population by State', name_ms: 'Penduduk mengikut Negeri', lastUpdated: '2025-02-20', freshness: 'FRESH', tier: 'github_meta' },
    { name_en: 'GDP Annual', name_ms: 'KDNK Tahunan', lastUpdated: '2025-02-15', freshness: 'FRESH', tier: 'dosm_api' },
    { name_en: 'CPI Headline', name_ms: 'IHP Utama', lastUpdated: '2025-02-18', freshness: 'FRESH', tier: 'dosm_api' },
    { name_en: 'Labour Force Monthly', name_ms: 'Tenaga Buruh Bulanan', lastUpdated: '2025-01-28', freshness: 'RECENT', tier: 'dosm_storage' },
    { name_en: 'Trade Monthly', name_ms: 'Perdagangan Bulanan', lastUpdated: '2025-02-10', freshness: 'FRESH', tier: 'dosm_api' },
    { name_en: 'Births Statistics', name_ms: 'Statistik Kelahiran', lastUpdated: '2024-12-15', freshness: 'RECENT', tier: 'github_meta' },
    { name_en: 'Deaths Statistics', name_ms: 'Statistik Kematian', lastUpdated: '2024-12-15', freshness: 'RECENT', tier: 'github_meta' },
    { name_en: 'Exchange Rates', name_ms: 'Kadar Pertukaran', lastUpdated: '2025-02-28', freshness: 'FRESH', tier: 'dosm_api' },
    { name_en: 'House Price Index', name_ms: 'Indeks Harga Rumah', lastUpdated: '2024-11-20', freshness: 'STALE', tier: 'dosm_storage' },
    { name_en: 'Hospital Beds', name_ms: 'Katil Hospital', lastUpdated: '2024-09-01', freshness: 'STALE', tier: 'static_json' },
  ], []);

  // ─── API Performance data ─────────────────────────────────────
  const apiPerformance = useMemo<ApiPerformanceEntry[]>(() => [
    {
      endpoint: '/api/dosm',
      endpointMs: lang === 'ms' ? '/api/dosm' : '/api/dosm',
      responseTimeMs: 245,
    },
    {
      endpoint: '/api/dosm/csv',
      endpointMs: lang === 'ms' ? '/api/dosm/csv' : '/api/dosm/csv',
      responseTimeMs: 710,
    },
    {
      endpoint: '/api/dosm/github',
      endpointMs: lang === 'ms' ? '/api/dosm/github' : '/api/dosm/github',
      responseTimeMs: 148,
    },
  ], [lang]);

  // ─── 24-hour Uptime data ──────────────────────────────────────
  const uptimeData = useMemo(() => {
    const hours = [];
    for (let h = 0; h < 24; h++) {
      // Simulated: most hours are 100%, some degraded
      const base = h >= 2 && h <= 4 ? 94.5 + Math.random() * 3 : h === 14 ? 97.2 : 99.5 + Math.random() * 0.5;
      hours.push({ hour: h, uptime: Math.min(100, Math.round(base * 100) / 100) });
    }
    return hours;
  }, []);

  return (
    <div className="space-y-6">
      {/* Section Header: Data Quality */}
      <div className="flex items-center gap-3">
        <div>
          <span
            className="text-[13px] font-bold font-mono tracking-[0.2em]"
            style={{ color: '#f59e0b', textShadow: '0 0 8px rgba(245,158,11,0.4)' }}
          >
            {lang === 'ms' ? 'KUALITI DATA' : 'DATA QUALITY'}
          </span>
          <SectionHeaderLine color="#f59e0b" delay={0.2} />
        </div>
        <DemoBadge lang={lang} />
      </div>

      {/* ─── Row 1: Data Source Health + Uptime Tracker ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Source Health Grid */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#06b6d4" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'KESIHATAN SUMBER DATA' : 'DATA SOURCE HEALTH'}
            </span>
          </div>
          <DataSourceHealthGrid sources={dataSourcesHealth} lang={lang} />
        </div>

        {/* Uptime Tracker */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#10b981" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: '#10b981' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#10b981' }}>
              {lang === 'ms' ? 'PENJEJAK MASA HIDUP' : 'UPTIME TRACKER'}
            </span>
          </div>
          <UptimeTracker uptimeData={uptimeData} lang={lang} />
        </div>
      </div>

      {/* ─── Row 2: API Performance + Dataset Freshness ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Performance Chart */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#f59e0b" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={14} style={{ color: '#f59e0b' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
              {lang === 'ms' ? 'PRESTASI API' : 'API PERFORMANCE'}
            </span>
          </div>
          <ApiPerformanceChart data={apiPerformance} lang={lang} />

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: '#10b981' }} />
              <span className="text-[7px] font-mono" style={{ color: '#b0bec5' }}>&lt;300ms</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: '#f59e0b' }} />
              <span className="text-[7px] font-mono" style={{ color: '#b0bec5' }}>300-800ms</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: '#ef4444' }} />
              <span className="text-[7px] font-mono" style={{ color: '#b0bec5' }}>&gt;800ms</span>
            </div>
          </div>
        </div>

        {/* Dataset Freshness Matrix */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#8b5cf6" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} style={{ color: '#8b5cf6' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#8b5cf6' }}>
              {lang === 'ms' ? 'MATRIKS KESEGERAAN SET DATA' : 'DATASET FRESHNESS MATRIX'}
            </span>
          </div>
          <DatasetFreshnessMatrix datasets={datasetFreshness} lang={lang} />

          {/* Freshness legend */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-2" style={{ borderTop: '1px solid rgba(6,182,212,0.06)' }}>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: '#10b981' }} />
              <span className="text-[7px] font-mono" style={{ color: '#b0bec5' }}>
                {lang === 'ms' ? 'SEGAR (<7 hari)' : 'FRESH (<7d)'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: '#f59e0b' }} />
              <span className="text-[7px] font-mono" style={{ color: '#b0bec5' }}>
                {lang === 'ms' ? 'TERKINI (<30 hari)' : 'RECENT (<30d)'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: '#ef4444' }} />
              <span className="text-[7px] font-mono" style={{ color: '#b0bec5' }}>
                {lang === 'ms' ? 'LAMA (>30 hari)' : 'STALE (>30d)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
