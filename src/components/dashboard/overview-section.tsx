'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate as motionAnimate } from 'framer-motion';
import {
  Users, TrendingUp, Briefcase, Database,
  BarChart3, Activity, Zap, MapPin, Layers, Globe, Clock,
  ShieldCheck, RefreshCw, PieChart as PieChartIcon, CheckCircle2,
  DollarSign,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList, CartesianGrid,
} from 'recharts';
import {
  STATES, DATASET_CATEGORIES,
} from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';
import { KPICard } from '@/components/dashboard/kpi-card';
import { DataEnginePulse } from '@/components/dashboard/data-engine-pulse';
import { StateMiniCards } from '@/components/dashboard/state-mini-cards';
import { HealthIndexWidget } from '@/components/dashboard/health-index';
import { DataSourceStats } from '@/components/dashboard/data-source-stats';
import { DataActivityFeed } from '@/components/dashboard/data-activity-feed';
import { DataDiscoveryEngine } from '@/components/dashboard/data-discovery-engine';
import { ProgressTracker } from '@/components/dashboard/progress-tracker';
import { DataInsightsEngine } from '@/components/dashboard/data-insights-engine';
import { DataSnapshotWidget } from '@/components/dashboard/data-snapshot-widget';
import { AnimatedBorderCard } from '@/components/dashboard/animated-border-card';
import { DataFlowLines } from '@/components/dashboard/data-flow-lines';
import { DataExplorerModal } from '@/components/dashboard/data-explorer-modal';
import { YoYComparisonPanel } from '@/components/dashboard/yoy-comparison-panel';
import { DataFreshnessPanel } from '@/components/dashboard/data-freshness-panel';
import { useLiveData } from '@/components/dashboard/live-data-provider';
import type { DataStatus } from '@/lib/dosm/client';

// ─── Stagger container variants ─────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

// ─── Animated Section Divider ────────────────────────────────────
function AnimatedDivider() {
  return (
    <div className="w-full h-px my-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.2), rgba(6,182,212,0.4), rgba(6,182,212,0.2), transparent)' }}>
      <motion.div
        className="h-full w-16"
        style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }}
        animate={{ x: ['-100px', 'calc(100% + 100px)'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// ─── Animated Counter Hook ──────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1400, decimals = 0) {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString());
  const [text, setText] = useState('0');

  useEffect(() => {
    const controls = motionAnimate(motionVal, target, {
      duration,
      ease: [0.22, 0.61, 0.36, 1],
    });
    const unsub = display.on('change', (v) => setText(v));
    return () => { controls.stop(); unsub(); };
  }, [target, duration, motionVal, display, decimals]);

  return text;
}

// ─── Circular Progress Ring ──────────────────────────────────────
function CircularProgressRing({ percentage, size = 56, strokeWidth = 4, color = '#06b6d4' }: {
  percentage: number; size?: number; strokeWidth?: number; color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const displayVal = useAnimatedCounter(percentage, 1600, 1);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${color}15`}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}50)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold font-mono" style={{ color, textShadow: `0 0 8px ${color}40` }}>
          {displayVal}%
        </span>
      </div>
    </div>
  );
}

// ─── Data Quality Score Card ─────────────────────────────────────
function DataQualityCard({ lang }: { lang: Lang }) {
  const qualityScore = 94.7;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative rounded-xl border p-5 flex items-center gap-5"
      style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(10,14,26,0.85) 50%)',
        borderColor: 'rgba(16,185,129,0.15)',
        backdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 0 0 rgba(16,185,129,0.08)',
        overflow: 'hidden',
      }}
    >
      <CircularProgressRing percentage={qualityScore} color="#10b981" size={64} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <ShieldCheck size={13} style={{ color: '#10b981' }} />
          <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#10b981' }}>
            {lang === 'ms' ? 'SKOR KUALITI DATA' : 'DATA QUALITY SCORE'}
          </span>
        </div>
        <div className="text-2xl font-bold font-mono" style={{ color: '#e0f7fa', textShadow: '0 0 12px rgba(16,185,129,0.3)' }}>
          94.7%
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <CheckCircle2 size={9} style={{ color: '#10b981' }} />
          <span className="text-[9px] font-mono" style={{ color: '#10b981aa' }}>
            {lang === 'ms' ? '272 / 287 set data disahkan' : '272 / 287 datasets verified'}
          </span>
        </div>
      </div>
      {/* Decorative corner glow */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10" style={{
        background: 'radial-gradient(circle at top right, #10b981, transparent)',
      }} />
    </motion.div>
  );
}

// ─── Last Data Update Card ────────────────────────────────────────
function LastDataUpdateCard({ lang }: { lang: Lang }) {
  const [timeAgo, setTimeAgo] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      const lastUpdateTime = new Date(now.getTime() - 12 * 60 * 1000 - 34 * 1000);
      const timeOpts: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kuala_Lumpur',
      };
      setLastUpdate(lastUpdateTime.toLocaleTimeString('en-GB', timeOpts));

      const diffMs = now.getTime() - lastUpdateTime.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffSec = Math.floor((diffMs % 60000) / 1000);
      setTimeAgo(lang === 'ms' ? `${diffMin}m ${diffSec}s lalu` : `${diffMin}m ${diffSec}s ago`);
    };

    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative rounded-xl border p-5 flex items-center gap-4"
      style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(10,14,26,0.85) 50%)',
        borderColor: 'rgba(6,182,212,0.15)',
        backdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.08)',
        overflow: 'hidden',
      }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{
        background: 'rgba(6,182,212,0.08)',
        border: '1px solid rgba(6,182,212,0.12)',
      }}>
        <RefreshCw size={18} style={{ color: '#06b6d4' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
            {lang === 'ms' ? 'KEMAS KINI TERAKHIR' : 'LAST DATA UPDATE'}
          </span>
        </div>
        <div className="text-xl font-bold font-mono" style={{ color: '#e0f7fa', textShadow: '0 0 10px rgba(6,182,212,0.3)' }}>
          {lastUpdate} <span className="text-[9px] font-normal opacity-40">MYT</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="relative w-2 h-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.6)' }} />
            <motion.div
              className="absolute inset-0 w-2 h-2 rounded-full"
              style={{ border: '1px solid rgba(16,185,129,0.5)' }}
              animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="text-[9px] font-mono" style={{ color: '#06b6d4aa' }}>{timeAgo}</span>
        </div>
      </div>
      {/* Decorative corner glow */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10" style={{
        background: 'radial-gradient(circle at top right, #06b6d4, transparent)',
      }} />
    </motion.div>
  );
}

// ─── Data Coverage Card ───────────────────────────────────────────
function DataCoverageCard({ lang }: { lang: Lang }) {
  const coveragePercent = 78.4;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative rounded-xl border p-5 flex items-center gap-5"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(10,14,26,0.85) 50%)',
        borderColor: 'rgba(245,158,11,0.15)',
        backdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 0 0 rgba(245,158,11,0.08)',
        overflow: 'hidden',
      }}
    >
      <CircularProgressRing percentage={coveragePercent} color="#f59e0b" size={64} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <PieChartIcon size={13} style={{ color: '#f59e0b' }} />
          <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
            {lang === 'ms' ? 'LIPUTAN DATA' : 'DATA COVERAGE'}
          </span>
        </div>
        <div className="text-2xl font-bold font-mono" style={{ color: '#e0f7fa', textShadow: '0 0 12px rgba(245,158,11,0.3)' }}>
          78.4%
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-[9px] font-mono" style={{ color: '#f59e0baa' }}>
            {lang === 'ms' ? '15 / 19 negeri & WP diliputi' : '15 / 19 states & FT covered'}
          </span>
        </div>
      </div>
      {/* Decorative corner glow */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10" style={{
        background: 'radial-gradient(circle at top right, #f59e0b, transparent)',
      }} />
    </motion.div>
  );
}

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

// ─── Category Progress Bar Component ────────────────────────────
function CategoryProgressBar({ cat, lang, index, maxVal }: {
  cat: { name: string; name_ms: string; value: number; color: string };
  lang: Lang;
  index: number;
  maxVal: number;
}) {
  const [hovered, setHovered] = useState(false);
  const pct = ((cat.value / 287) * 100).toFixed(1);
  const barWidth = (cat.value / maxVal) * 100;
  const displayName = lang === 'ms' ? cat.name_ms : cat.name;

  return (
    <motion.div
      className="group relative rounded-lg p-2.5 transition-colors duration-200"
      style={{
        background: hovered ? `${cat.color}08` : 'transparent',
        border: `1px solid ${hovered ? cat.color + '20' : 'transparent'}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variants={staggerItem}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color, boxShadow: `0 0 4px ${cat.color}40` }} />
          <span className="text-[10px] font-mono truncate" style={{ color: '#b8c5d4' }}>{displayName}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-[11px] font-mono font-bold" style={{ color: cat.color }}>{cat.value}</span>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
            background: `${cat.color}12`,
            color: `${cat.color}cc`,
            border: `1px solid ${cat.color}20`,
          }}>
            {pct}%
          </span>
        </div>
      </div>
      {/* Animated progress bar */}
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: `${cat.color}10` }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${cat.color}, ${cat.color}90)`,
            boxShadow: `0 0 8px ${cat.color}30`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 1.2, delay: 0.15 * index + 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        />
      </div>
      {/* Hover tooltip */}
      {hovered && (
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 px-2.5 py-1.5 rounded-lg font-mono text-[9px] whitespace-nowrap pointer-events-none"
          style={{
            background: 'rgba(10,14,26,0.97)',
            border: `1px solid ${cat.color}30`,
            boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 12px ${cat.color}15`,
            color: '#e0f7fa',
          }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {displayName}: {cat.value} {lang === 'ms' ? 'set data' : 'datasets'} ({pct}%)
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Overview Section ─────────────────────────────────────────────
export function OverviewSection({ lang, onNavigateDatasets }: { lang: Lang; onNavigateDatasets?: (category?: string) => void }) {
  const [explorerMetric, setExplorerMetric] = useState<'population' | 'gdp' | 'gdpGrowth' | 'births' | 'unemployment' | 'datasets' | null>(null);

  // ── Live Data from LiveDataProvider ──
  const { kpiMap, anyLoading, isLive, status } = useLiveData();

  // Map live KPI data to display format, with static fallbacks
  type KpiItem = { icon: typeof Users; label: string; value: number | string; unit: string; change: number; color: string; sparkline: number[]; trendValue: string; status?: DataStatus };

  const kpis: KpiItem[] = useMemo(() => {
    // Live data mapping: registry ID → display KPI
    const liveMap: Record<string, KpiItem> = {};
    for (const [id, kpi] of Object.entries(kpiMap)) {
      liveMap[id] = {
        icon: id === 'gdp_growth' || id === 'gdp_qtr' ? TrendingUp
          : id === 'cpi_headline' ? BarChart3
          : id === 'labour_monthly' ? Briefcase
          : id === 'trade_monthly' ? Globe
          : id === 'fuelprice' ? Zap
          : id === 'exchange_rate' ? DollarSign
          : id === 'population_malaysia' ? Users
          : Database,
        label: kpi.labelBM && lang === 'ms' ? kpi.labelBM : kpi.label,
        value: kpi.value,
        unit: kpi.unit,
        change: kpi.changePct,
        color: kpi.color,
        sparkline: kpi.sparkline,
        trendValue: `${kpi.changePct >= 0 ? '+' : ''}${kpi.changePct.toFixed(1)}%`,
        status: kpi.status,
      };
    }

    // Build ordered KPI list: prefer live data, fallback to static
    return [
      // GDP Growth Rate (primary KPI)
      liveMap.gdp_growth ?? { icon: TrendingUp, label: lang === 'ms' ? 'Pertumbuhan KDNK' : 'GDP Growth', value: '5.3', unit: '%', change: 5.3, color: '#00FFD4', sparkline: [3.0, 3.3, 2.9, 5.6, 7.4, 4.2, 5.9], trendValue: '+5.3%', status: 'fallback' as DataStatus },
      // Population
      liveMap.population_malaysia ?? { icon: Users, label: lang === 'ms' ? 'Penduduk' : 'Population', value: '33.9M', unit: lang === 'ms' ? 'orang' : 'people', change: 1.1, color: '#06b6d4', sparkline: [32.4, 32.7, 33.0, 33.2, 33.4, 33.6, 33.9], trendValue: '+1.1%', status: 'fallback' as DataStatus },
      // CPI / Inflation
      liveMap.cpi_headline ?? { icon: BarChart3, label: lang === 'ms' ? 'IHP' : 'CPI', value: '132.4', unit: lang === 'ms' ? 'indeks' : 'index', change: 2.0, color: '#f59e0b', sparkline: [130.9, 131.0, 131.2, 131.3, 131.5, 131.8, 132.4], trendValue: '+2.0%', status: 'fallback' as DataStatus },
      // Unemployment
      liveMap.labour_monthly ?? { icon: Briefcase, label: lang === 'ms' ? 'Pengangguran' : 'Unemployment', value: '3.4', unit: '%', change: -0.3, color: '#8b5cf6', sparkline: [3.3, 3.4, 4.6, 4.7, 3.8, 3.6, 3.4], trendValue: '-3.4%', status: 'fallback' as DataStatus },
      // Trade Balance
      liveMap.trade_monthly ?? { icon: Globe, label: lang === 'ms' ? 'Imbangan Perdagangan' : 'Trade Balance', value: 'RM 18.2B', unit: '', change: 12.5, color: '#06b6d4', sparkline: [12.9, 13.2, 14.4, 14.5, 15.6, 16.7, 18.2], trendValue: '+12.5%', status: 'fallback' as DataStatus },
      // Fuel Price
      liveMap.fuelprice ?? { icon: Zap, label: lang === 'ms' ? 'Harga Bahan Api' : 'Fuel Price', value: 'RM 2.05', unit: '/L', change: 0, color: '#84CC16', sparkline: [2.05, 2.05, 2.05, 2.05, 2.05, 2.05, 2.05], trendValue: '0.0%', status: 'fallback' as DataStatus },
    ];
  }, [kpiMap, lang]);

  // Top states bar chart data
  const topStatesData = STATES.slice()
    .sort((a, b) => b.population - a.population)
    .slice(0, 8)
    .map(s => ({ name: s.abbr, fullName: s.name, population: s.population, gdp: Math.round(s.gdp / 1000), popLabel: `${(s.population / 1000).toFixed(1)}M`, gdpLabel: `${Math.round(s.gdp / 1000)}B` }));

  // Frequency distribution for pie
  const freqDist = useMemo(() => {
    const counts: Record<string, number> = {};
    DATASETS.forEach(d => { counts[d.frequency] = (counts[d.frequency] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, pct: ((value / 287) * 100).toFixed(1) }));
  }, []);

  // Category stats for treemap
  const catStats = useMemo(() => {
    const counts: Record<string, number> = {};
    DATASETS.forEach(d => { counts[d.category_en] = (counts[d.category_en] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => {
        const cat = DATASET_CATEGORIES.find(c => c.en === name);
        return { name, name_ms: cat?.ms || name, value, color: cat?.color || '#64748b' };
      })
      .sort((a, b) => b.value - a.value);
  }, []);

  const PIE_COLORS = ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#64748b', '#ec4899'];
  const maxCatVal = catStats.length > 0 ? catStats[0].value : 1;

  return (
    <div className="space-y-6" role="region" aria-label="Dashboard overview">
      {/* Data Flow Lines Overlay */}
      <DataFlowLines enabled={true} />

      {/* ─── Hero Banner ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border p-6 md:p-8 mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(16,185,129,0.05) 40%, rgba(10,14,26,0.95) 100%)',
          borderColor: 'rgba(6,182,212,0.18)',
          boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.08), 0 0 40px rgba(6,182,212,0.05)',
        }}
      >
        {/* Animated scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.4 }}>
          <motion.div
            className="absolute left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.6) 20%, rgba(6,182,212,0.8) 50%, rgba(6,182,212,0.6) 80%, transparent 100%)' }}
            animate={{ top: ['-2%', '102%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Corner glows */}
        <div className="absolute top-0 right-0 w-72 h-72 opacity-[0.08]" style={{
          background: 'radial-gradient(circle at top right, #06b6d4, transparent 70%)',
        }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 opacity-[0.04]" style={{
          background: 'radial-gradient(circle at bottom left, #10b981, transparent 70%)',
        }} />

        {/* Animated grid lines in background */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.8) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />

        <div className="relative z-10">
          {/* Title row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} style={{ color: '#06b6d4' }} />
              <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.4)' }}>
                {lang === 'ms' ? 'PENGANALISIS DATA NASIONAL' : 'NATIONAL DATA INTELLIGENCE'}
              </span>
              <SectionHeaderLine color="#06b6d4" delay={0.3} />
            </div>
            <motion.span
              className="text-[8px] font-mono px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              v3.0
            </motion.span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3" style={{
            color: '#e0f7fa',
            textShadow: '0 0 20px rgba(6,182,212,0.3)',
          }}>
            {lang === 'ms' ? 'Pusat Perintah Data Terbuka Malaysia' : 'Malaysia Open Data Command Center'}
          </h2>
          <p className="text-sm md:text-base opacity-80 max-w-2xl mb-5" style={{ color: '#b8c5d4' }}>
            {lang === 'ms'
              ? 'Papan pemuka kecerdasan gred SaaS premium yang dikuasakan sepenuhnya oleh data.gov.my data terbuka. 287+ set data merentasi 18 kategori.'
              : 'A premium SaaS-grade intelligence dashboard powered entirely by data.gov.my open data. 287+ datasets across 18 categories.'
            }
          </p>

          {/* Stats badges — improved with prominent numbers */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
              style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(16,185,129,0.4)' }}
            >
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <motion.div
                  className="absolute inset-0 w-2 h-2 rounded-full"
                  style={{ border: '1px solid rgba(16,185,129,0.5)' }}
                  animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-[10px] md:text-[11px] font-mono font-bold text-emerald-400">
                {lang === 'ms' ? 'DATA LANGSUNG' : 'LIVE DATA'}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
              style={{ background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)' }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(6,182,212,0.4)' }}
            >
              <MapPin size={11} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] md:text-[11px] font-mono font-bold" style={{ color: '#06b6d4' }}>
                <span className="text-[13px]">19</span> {lang === 'ms' ? 'NEGERI + WP' : 'STATES + FT'}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
              style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)' }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(245,158,11,0.4)' }}
            >
              <Layers size={11} style={{ color: '#f59e0b' }} />
              <span className="text-[10px] md:text-[11px] font-mono font-bold" style={{ color: '#f59e0b' }}>
                <span className="text-[13px]">6</span> {lang === 'ms' ? 'LAPISAN' : 'LAYERS'}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
              style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.2)' }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(139,92,246,0.4)' }}
            >
              <Globe size={11} style={{ color: '#8b5cf6' }} />
              <span className="text-[10px] md:text-[11px] font-mono font-bold" style={{ color: '#8b5cf6' }}>
                <span className="text-[13px]">18</span> {lang === 'ms' ? 'KATEGORI' : 'CATEGORIES'}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatedDivider />

      {/* Data Snapshot Widget */}
      <DataSnapshotWidget lang={lang} onMetricClick={(metric) => {
        const metricMap: Record<string, 'population' | 'gdp' | 'gdpGrowth' | 'births' | 'unemployment' | 'datasets'> = {
          population: 'population',
          gdp: 'gdp',
          births: 'births',
          density: 'population',
        };
        const mapped = metricMap[metric];
        if (mapped) setExplorerMetric(mapped);
      }} />

      <AnimatedDivider />

      {/* ─── KPI Grid with staggered entry ────────────────────────── */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        role="group"
        aria-label="Key performance indicators"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {kpis.map((kpi, i) => (
          <motion.div key={i} variants={staggerItem} data-flow={i === 0 ? 'kpi-population' : i === 1 ? 'kpi-gdp' : undefined}>
            <KPICard {...kpi} lang={lang} status={kpi.status} onClick={() => {
              const metricKeys: ('population' | 'gdp' | 'gdpGrowth' | 'births' | 'unemployment' | 'datasets')[] = ['population', 'gdp', 'gdpGrowth', 'births', 'unemployment', 'datasets'];
              setExplorerMetric(metricKeys[i]);
            }} />
          </motion.div>
        ))}
      </motion.div>

      <AnimatedDivider />

      {/* Data Freshness Panel — Command Center Status Board */}
      <DataFreshnessPanel lang={lang} />

      <AnimatedDivider />

      {/* Data Quality, Last Update & Coverage Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataQualityCard lang={lang} />
        <LastDataUpdateCard lang={lang} />
        <DataCoverageCard lang={lang} />
      </div>

      <AnimatedDivider />

      {/* Row: Data Engine + State Cards + Health Index + Progress Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <AnimatedBorderCard>
          <div data-flow="data-engine">
            <DataEnginePulse lang={lang} />
          </div>
        </AnimatedBorderCard>
        <div data-flow="state-cards">
          <StateMiniCards lang={lang} onStateClick={() => setExplorerMetric('population')} />
        </div>
        <AnimatedBorderCard accentColor="#ec4899">
          <div data-flow="health-index">
            <HealthIndexWidget lang={lang} />
          </div>
        </AnimatedBorderCard>
        <ProgressTracker lang={lang} />
      </div>

      <AnimatedDivider />

      {/* Charts Row */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.4)' }}>
              {lang === 'ms' ? 'ANALISIS DATA' : 'DATA ANALYSIS'}
            </span>
            <SectionHeaderLine color="#06b6d4" delay={0.2} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Top States */}
        <AnimatedBorderCard className="lg:col-span-2">
          <div data-flow="chart-popgdp">
          <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <HUDBracket />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={14} style={{ color: '#06b6d4' }} />
              <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'PENDUDUK & KDNK MENGIKUT NEGERI' : 'POPULATION & GDP BY STATE'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: '#06b6d4' }} />
                <span className="text-[8px] font-mono" style={{ color: '#a0b0c0' }}>POP</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
                <span className="text-[8px] font-mono" style={{ color: '#a0b0c0' }}>GDP</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260} role="img" aria-label="Bar chart showing population and GDP by state">
            <BarChart data={topStatesData} barCategoryGap="20%">
              <defs>
                <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="gdpBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.06)" />
              <XAxis dataKey="name" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} />
              <YAxis yAxisId="left" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} width={50} label={{ value: lang === 'ms' ? "Penduduk ('000)" : "Population ('000)", angle: -90, position: 'insideLeft', style: { fill: '#8899aa', fontSize: 9 } }} />
              <YAxis yAxisId="right" orientation="right" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} width={50} label={{ value: lang === 'ms' ? 'KDNK (RM B)' : 'GDP (RM B)', angle: 90, position: 'insideRight', style: { fill: '#8899aa', fontSize: 9 } }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0]?.payload as { fullName?: string; population?: number; gdp?: number; name?: string };
                  return (
                    <div style={{
                      background: 'rgba(10,14,26,0.97)',
                      border: '1px solid rgba(6,182,212,0.25)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(6,182,212,0.1)',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}>
                      <div style={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}>
                        {data?.fullName || label}
                      </div>
                      {payload.map((item, idx) => {
                        const isPop = item.dataKey === 'population';
                        const dotColor = isPop ? '#06b6d4' : '#f59e0b';
                        const itemLabel = isPop
                          ? (lang === 'ms' ? 'Penduduk' : 'Population')
                          : (lang === 'ms' ? 'KDNK (RM B)' : 'GDP (RM B)');
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                            <span style={{ color: '#b8c5d4', fontSize: '11px' }}>{itemLabel}:</span>
                            <span style={{ color: '#e0f7fa', fontWeight: 600 }}>{Number(item.value).toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              <Bar yAxisId="left" dataKey="population" fill="url(#popGrad)" radius={[4,4,0,0]}>
                <LabelList dataKey="popLabel" position="top" fill="#b8c5d4" fontSize={9} fontFamily="monospace" />
              </Bar>
              <Bar yAxisId="right" dataKey="gdp" fill="url(#gdpBarGrad)" radius={[4,4,0,0]}>
                <LabelList dataKey="gdpLabel" position="top" fill="#b8c5d4" fontSize={9} fontFamily="monospace" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
          </div>
        </AnimatedBorderCard>

        {/* Pie Chart - Frequency */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'FREKUENSI DATA' : 'DATA FREQUENCY'}
            </span>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={200} role="img" aria-label="Pie chart showing data frequency distribution">
              <PieChart>
                <Pie data={freqDist} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={2} stroke="none">
                  {freqDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  <LabelList dataKey="pct" position="outside" fill="#e0f7fa" fontSize={9} stroke="none" formatter={(v: string) => `${v}%`} />
                </Pie>
                <Tooltip contentStyle={{
                  background: 'rgba(10,14,26,0.97)',
                  border: '1px solid rgba(6,182,212,0.25)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(6,182,212,0.1)',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }} itemStyle={{ color: '#b8c5d4', padding: '2px 0' }} labelStyle={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-4px' }}>
              <span className="text-2xl font-bold font-mono" style={{ color: '#e0f7fa', textShadow: '0 0 12px rgba(6,182,212,0.4)' }}>287</span>
              <span className="text-[8px] font-mono tracking-widest" style={{ color: '#06b6d4' }}>{lang === 'ms' ? 'SET DATA' : 'DATASETS'}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 justify-center">
            {freqDist.map((d, i) => {
              const pct = ((d.value / 287) * 100).toFixed(1);
              return (
                <div key={i} className="flex items-center gap-1.5 transition-all duration-200 hover:scale-105 cursor-default" style={{
                  padding: '2px 6px',
                  borderRadius: 4,
                }} onMouseEnter={e => { e.currentTarget.style.background = `${PIE_COLORS[i % PIE_COLORS.length]}10`; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <div className="w-2.5 h-2.5 rounded-full transition-all duration-200" style={{ background: PIE_COLORS[i % PIE_COLORS.length], boxShadow: `0 0 4px ${PIE_COLORS[i % PIE_COLORS.length]}40` }} />
                  <span className="text-[9px] font-mono" style={{ color: '#b0bec5' }}>{d.name}</span>
                  <span className="text-[9px] font-mono font-bold" style={{ color: PIE_COLORS[i % PIE_COLORS.length] }}>{d.value}</span>
                  <span className="text-[8px] font-mono" style={{ color: '#8899aa' }}>({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatedDivider />

      {/* Data Insights Engine */}
      <DataInsightsEngine lang={lang} />

      <AnimatedDivider />

      {/* Year-over-Year Comparison Panel */}
      <YoYComparisonPanel lang={lang} />

      <AnimatedDivider />

      {/* Row: Category Progress Bars + Data Sources + Timeline */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.4)' }}>
              {lang === 'ms' ? 'KATALOG & KEMAS KINI' : 'CATALOG & UPDATES'}
            </span>
            <SectionHeaderLine color="#06b6d4" delay={0.2} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Category Progress Bars (Enhanced) ─────────────────── */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Layers size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'AGIHAN KATEGORI' : 'CATEGORY DISTRIBUTION'}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
              background: 'rgba(6,182,212,0.08)',
              color: '#06b6d4',
              border: '1px solid rgba(6,182,212,0.12)',
            }}>
              {lang === 'ms' ? '18 kategori' : '18 categories'}
            </span>
          </div>
          <motion.div
            className="space-y-1 max-h-[340px] overflow-y-auto custom-scrollbar pr-1"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {catStats.slice(0, 18).map((cat, i) => (
              <CategoryProgressBar
                key={cat.name}
                cat={cat}
                lang={lang}
                index={i}
                maxVal={maxCatVal}
              />
            ))}
          </motion.div>
        </div>

        {/* Data Source Stats */}
        <DataSourceStats lang={lang} />

        {/* Timeline */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'GARIS MASA KEMAS KINI DATA' : 'DATA UPDATE TIMELINE'}
            </span>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
            {[
              { date: '2025-07', en: 'Population estimates updated to 2025', ms: 'Anggaran penduduk dikemas kini ke 2025', type: 'census' },
              { date: '2025-04', en: 'Q1 2025 GDP data released', ms: 'Data KDNK Q1 2025 dikeluarkan', type: 'gdp' },
              { date: '2025-03', en: 'Labour Force Survey Q1 2025', ms: 'Survei Tenaga Buruh Q1 2025', type: 'labour' },
              { date: '2025-01', en: 'CPI Annual Inflation 2024 released', ms: 'Inflasi Tahunan CPI 2024 dikeluarkan', type: 'prices' },
              { date: '2024-11', en: 'Vital Statistics 2024 published', ms: 'Statistik Utama 2024 diterbitkan', type: 'vital' },
              { date: '2024-08', en: 'GDP by State 2023 updated', ms: 'KDNK mengikut Negeri 2023 dikemas kini', type: 'gdp' },
              { date: '2024-07', en: 'Household Income Survey 2023', ms: 'Survei Pendapatan Isi Rumah 2023', type: 'household' },
              { date: '2024-06', en: 'Environmental Quality Report', ms: 'Laporan Kualiti Alam Sekitar', type: 'environment' },
            ].map((event, i) => {
              const typeColors: Record<string, string> = {
                census: '#06b6d4', gdp: '#f59e0b', labour: '#8b5cf6', prices: '#ef4444',
                vital: '#ec4899', household: '#10b981', environment: '#22c55e',
              };
              const dotColor = typeColors[event.type] || '#06b6d4';
              return (
                <div key={i} className="flex items-start gap-2.5 py-1.5 px-2 rounded transition-all duration-200 hover:bg-cyan-950/20 relative" style={{
                  borderLeft: i === 0 ? '2px solid #06b6d4' : '2px solid rgba(6,182,212,0.08)',
                }} onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#06b6d460'; e.currentTarget.style.background = 'rgba(6,182,212,0.06)'; }} onMouseLeave={e => { e.currentTarget.style.borderLeftColor = i === 0 ? '#06b6d4' : 'rgba(6,182,212,0.08)'; e.currentTarget.style.background = ''; }}>
                  <div className="relative mt-1 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                      background: dotColor,
                      boxShadow: i === 0 ? `0 0 6px ${dotColor}60` : 'none',
                    }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: dotColor }}>{event.date}</span>
                      {i === 0 && (
                        <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{
                          background: 'rgba(6,182,212,0.15)', color: '#06b6d4',
                        }}>{lang === 'ms' ? 'TERKINI' : 'LATEST'}</span>
                      )}
                    </div>
                    <span className="text-[10px] block truncate" style={{ color: '#b0bec5' }}>
                      {lang === 'ms' ? event.ms : event.en}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatedDivider />

      {/* Live Data Activity Feed */}
      <div data-flow="activity-feed">
        <DataActivityFeed lang={lang} />
      </div>

      <AnimatedDivider />

      {/* Data Discovery Engine */}
      <DataDiscoveryEngine lang={lang} onNavigateDatasets={onNavigateDatasets} />

      {/* Data Explorer Modal */}
      <DataExplorerModal
        key={explorerMetric}
        isOpen={explorerMetric !== null}
        onClose={() => setExplorerMetric(null)}
        metricKey={explorerMetric ?? 'population'}
        lang={lang}
      />
    </div>
  );
}

export default OverviewSection;
