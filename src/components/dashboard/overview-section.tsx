'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Baby, Heart, Briefcase, Database,
  BarChart3, Activity, Zap, MapPin, Layers, Globe, Clock,
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
import { DataInsightsEngine } from '@/components/dashboard/data-insights-engine';
import { DataSnapshotWidget } from '@/components/dashboard/data-snapshot-widget';
import { AnimatedBorderCard } from '@/components/dashboard/animated-border-card';
import { DataFlowLines } from '@/components/dashboard/data-flow-lines';
import { DataExplorerModal } from '@/components/dashboard/data-explorer-modal';
import { YoYComparisonPanel } from '@/components/dashboard/yoy-comparison-panel';

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

// ─── Overview Section ─────────────────────────────────────────────
export function OverviewSection({ lang }: { lang: Lang }) {
  const [explorerMetric, setExplorerMetric] = useState<'population' | 'gdp' | 'gdpGrowth' | 'births' | 'unemployment' | 'datasets' | null>(null);

  const kpis = [
    { icon: Users, label: lang === 'ms' ? 'Penduduk' : 'Population', value: '34.3M', unit: lang === 'ms' ? 'orang' : 'people', change: 1.1, color: '#06b6d4', sparkline: [32.4, 32.7, 33.0, 33.2, 33.4, 33.6, 33.8], trendValue: '+2.3%' },
    { icon: TrendingUp, label: lang === 'ms' ? 'KDNK' : 'GDP', value: 'RM 1.68T', unit: '', change: 4.5, color: '#f59e0b', sparkline: [1.42, 1.49, 1.56, 1.61, 1.65, 1.68, 1.72], trendValue: '+2.5%' },
    { icon: Baby, label: lang === 'ms' ? 'Kelahiran' : 'Births', value: '602.9K', unit: '', change: -2.3, color: '#10b981', sparkline: [488, 492, 478, 468, 462, 458, 455], trendValue: '-1.2%' },
    { icon: Heart, label: lang === 'ms' ? 'Kematian' : 'Deaths', value: '159.7K', unit: '', change: 1.8, color: '#ef4444', sparkline: [155, 157, 159, 160, 158, 159, 160], trendValue: '+1.8%' },
    { icon: Briefcase, label: lang === 'ms' ? 'Pengangguran' : 'Unemployment', value: '3.4', unit: '%', change: -0.3, color: '#8b5cf6', sparkline: [3.3, 3.4, 4.6, 4.7, 3.8, 3.6, 3.4], trendValue: '-3.4%' },
    { icon: Database, label: lang === 'ms' ? 'Set Data' : 'Datasets', value: '287', unit: '', change: 12, color: '#ec4899', sparkline: [245, 252, 261, 270, 278, 283, 287], trendValue: '+1.4%' },
  ];

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
        return { name, value, color: cat?.color || '#64748b' };
      })
      .sort((a, b) => b.value - a.value);
  }, []);

  const PIE_COLORS = ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#64748b', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Data Flow Lines Overlay */}
      <DataFlowLines enabled={true} />
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border p-6 mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(16,185,129,0.04), rgba(10,14,26,0.95))',
          borderColor: 'rgba(6,182,212,0.15)',
          animation: 'border-glow 3s ease-in-out infinite',
          boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.06)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{
          background: 'radial-gradient(circle at top right, #06b6d4, transparent 70%)',
        }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5" style={{
          background: 'radial-gradient(circle at bottom left, #10b981, transparent 70%)',
        }} />
        {/* Animated grid lines in background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.8) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} style={{ color: '#06b6d4' }} />
            <div>
              <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.4)' }}>
                {lang === 'ms' ? 'PENGANALISIS DATA NASIONAL' : 'NATIONAL DATA INTELLIGENCE'}
              </span>
              <SectionHeaderLine color="#06b6d4" delay={0.3} />
            </div>
            <motion.span
              className="text-[8px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              v3.0
            </motion.span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{
            color: '#e0f7fa',
            textShadow: '0 0 20px rgba(6,182,212,0.3)',
          }}>
            {lang === 'ms' ? 'Pusat Perintah Data Malaysia' : 'Malaysia Data Command Center'}
          </h2>
          <p className="text-sm opacity-80 max-w-2xl" style={{ color: '#b8c5d4' }}>
            {lang === 'ms'
              ? 'Papan pemuka kecerdasan gred SaaS premium yang dikuasakan sepenuhnya oleh data.gov.my data terbuka. 287+ set data merentasi 18 kategori.'
              : 'A premium SaaS-grade intelligence dashboard powered entirely by data.gov.my open data. 287+ datasets across 18 categories.'
            }
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.15)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400">LIVE DATA</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border" style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.15)' }}>
              <MapPin size={10} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] font-mono" style={{ color: '#06b6d4' }}>16 STATES + 3 FT</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.15)' }}>
              <Layers size={10} style={{ color: '#f59e0b' }} />
              <span className="text-[10px] font-mono" style={{ color: '#f59e0b' }}>6 LAYERS</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border" style={{ background: 'rgba(139,92,246,0.06)', borderColor: 'rgba(139,92,246,0.15)' }}>
              <Globe size={10} style={{ color: '#8b5cf6' }} />
              <span className="text-[10px] font-mono" style={{ color: '#8b5cf6' }}>18 CATEGORIES</span>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatedDivider />

      {/* Data Snapshot Widget */}
      <DataSnapshotWidget lang={lang} />

      <AnimatedDivider />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <div key={i} data-flow={i === 0 ? 'kpi-population' : i === 1 ? 'kpi-gdp' : undefined}>
            <KPICard {...kpi} lang={lang} onClick={() => {
              const metricKeys: ('population' | 'gdp' | 'gdpGrowth' | 'births' | 'unemployment' | 'datasets')[] = ['population', 'gdp', 'gdpGrowth', 'births', 'unemployment', 'datasets'];
              setExplorerMetric(metricKeys[i]);
            }} />
          </div>
        ))}
      </div>

      <AnimatedDivider />

      {/* Row: Data Engine + State Cards + Health Index */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <ResponsiveContainer width="100%" height={260}>
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
            <ResponsiveContainer width="100%" height={200}>
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
              <span className="text-[8px] font-mono tracking-widest" style={{ color: '#06b6d4' }}>DATASETS</span>
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

      {/* Row: Category Heat Blocks + Data Sources + Timeline */}
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
        {/* Category Heat Blocks */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'BLOK KATEGORI' : 'CATEGORY BLOCKS'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {catStats.slice(0, 18).map((cat) => (
              <div
                key={cat.name}
                className="rounded p-1.5 text-center cursor-default transition-all duration-200 hover:scale-110"
                style={{
                  background: `${cat.color}12`,
                  border: `1px solid ${cat.color}20`,
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 12px ${cat.color}30`; e.currentTarget.style.borderColor = `${cat.color}50`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${cat.color}20`; }}
              >
                <div className="text-[10px] font-mono font-bold" style={{ color: cat.color }}>{cat.value}</div>
                <div className="text-[7px] font-mono truncate" style={{ color: '#b0bec5' }}>{cat.name}</div>
              </div>
            ))}
          </div>
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
                <div key={i} className="flex items-start gap-2.5 py-1.5 px-2 rounded transition-all duration-200 hover:bg-cyan-950/20" style={{
                  borderLeft: i === 0 ? '2px solid #06b6d4' : '2px solid rgba(6,182,212,0.08)',
                }} onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#06b6d460'; e.currentTarget.style.background = 'rgba(6,182,212,0.06)'; }} onMouseLeave={e => { e.currentTarget.style.borderLeftColor = i === 0 ? '#06b6d4' : 'rgba(6,182,212,0.08)'; e.currentTarget.style.background = ''; }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{
                    background: dotColor,
                    boxShadow: i === 0 ? `0 0 6px ${dotColor}60` : 'none',
                  }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: dotColor }}>{event.date}</span>
                      {i === 0 && (
                        <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{
                          background: 'rgba(6,182,212,0.15)', color: '#06b6d4',
                        }}>LATEST</span>
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
