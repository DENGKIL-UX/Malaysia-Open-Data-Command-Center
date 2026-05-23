'use client';

import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Activity, Database, Layers,
  Lightbulb, Shield, AlertTriangle, MapPin,
  CheckCircle2, Users, Globe, ArrowRight, Zap,
  Clock, Server, GitBranch, Eye,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
  LabelList, CartesianGrid,
} from 'recharts';
import {
  STATES, DATASET_CATEGORIES, MAP_LAYERS,
} from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import type { Lang } from '@/lib/dashboard-types';
import { useCopilot } from '@/hooks/useCopilot';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';
import { DataQualityDashboard } from '@/components/dashboard/data-quality-dashboard';


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

// ─── Animated Section Divider ────────────────────────────────────
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

// ─── Helper: Pearson Correlation ────────────────────────────────
function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}

// ─── Helper: Correlation color interpolation ────────────────────
function correlationColor(value: number): string {
  // -1 = red, 0 = yellow, +1 = green
  const v = Math.max(-1, Math.min(1, value));
  if (v < 0) {
    // red → yellow
    const t = (v + 1); // 0 to 1
    const r = Math.round(255);
    const g = Math.round(t * 255);
    const b = Math.round(0);
    return `rgb(${r},${g},${b})`;
  } else {
    // yellow → green
    const t = v; // 0 to 1
    const r = Math.round((1 - t) * 255);
    const g = Math.round(255);
    const b = Math.round(0);
    return `rgb(${r},${g},${b})`;
  }
}

// ─── Scan Beam Overlay (for chart hover effect) ─────────────────
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

// ─── Analytics Section ───────────────────────────────────────────
export function AnalyticsSection({ lang, onNavigateGeoMap }: { lang: Lang; onNavigateGeoMap?: (stateId?: string, layer?: string) => void }) {
  const { registerView } = useCopilot();

  // Register view context for copilot
  useEffect(() => {
    registerView('analytics', { chartType: 'trend' });
  }, [registerView]);

  // State comparison radar chart
  const topStates = STATES.slice().sort((a, b) => b.population - a.population).slice(0, 5);
  const radarData = [
    { metric: 'Population', ...Object.fromEntries(topStates.map(s => [s.abbr, Math.round(s.population / 71)])) },
    { metric: 'GDP', ...Object.fromEntries(topStates.map(s => [s.abbr, Math.round(s.gdp / 3624)])) },
    { metric: 'Births', ...Object.fromEntries(topStates.map(s => [s.abbr, Math.round(s.births / 1.18)])) },
    { metric: 'Growth', ...Object.fromEntries(topStates.map(s => [s.abbr, Math.round(s.gdpGrowth * 10)])) },
  ];

  const RADAR_COLORS = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

  // Area chart - GDP trend (simulated)
  const gdpTrend = [
    { year: '2019', value: 1510 }, { year: '2020', value: 1430 },
    { year: '2021', value: 1500 }, { year: '2022', value: 1590 },
    { year: '2023', value: 1640 }, { year: '2024', value: 1682 },
  ];

  // GDP Growth Rate data
  const gdpGrowthRateData = useMemo(() => [
    { year: '2019', rate: 4.4, rateLabel: '4.4%' },
    { year: '2020', rate: -5.3, rateLabel: '-5.3%' },
    { year: '2021', rate: 3.3, rateLabel: '3.3%' },
    { year: '2022', rate: 8.7, rateLabel: '8.7%' },
    { year: '2023', rate: 3.7, rateLabel: '3.7%' },
    { year: '2024', rate: 4.5, rateLabel: '4.5%' },
  ], []);

  // Sector Contribution data
  const sectorContributionData = useMemo(() => [
    { name: lang === 'ms' ? 'Perkhidmatan' : 'Services', nameMs: 'Perkhidmatan', value: 58, valueLabel: '58%' },
    { name: lang === 'ms' ? 'Pembuatan' : 'Manufacturing', nameMs: 'Pembuatan', value: 23, valueLabel: '23%' },
    { name: lang === 'ms' ? 'Perlombongan' : 'Mining', nameMs: 'Perlombongan', value: 7, valueLabel: '7%' },
    { name: lang === 'ms' ? 'Pertanian' : 'Agriculture', nameMs: 'Pertanian', value: 7, valueLabel: '7%' },
    { name: lang === 'ms' ? 'Pembinaan' : 'Construction', nameMs: 'Pembinaan', value: 5, valueLabel: '5%' },
  ], [lang]);

  // Category distribution
  const catDist = useMemo(() => {
    const counts: Record<string, number> = {};
    DATASETS.forEach(d => { counts[d.category_en] = (counts[d.category_en] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, valueLabel: `${value}` }))
      .sort((a, b) => b.value - a.value);
  }, []);

  // State matrix data
  const stateMatrix = STATES.slice().sort((a, b) => b.population - a.population).slice(0, 10);

  // ─── NEW: Correlation Matrix ──────────────────────────────────
  const correlationMetrics = useMemo(() => {
    const metricKeys = ['population', 'gdp', 'gdpGrowth', 'births', 'deaths', 'unemployment'] as const;
    const metricLabels = [
      lang === 'ms' ? 'Penduduk' : 'Population',
      'GDP',
      lang === 'ms' ? 'Pertumbuhan' : 'Growth',
      lang === 'ms' ? 'Kelahiran' : 'Births',
      lang === 'ms' ? 'Kematian' : 'Deaths',
      lang === 'ms' ? 'Pengangguran' : 'Unemployment',
    ];
    const metricShort = ['POP', 'GDP', 'GRW', 'BIR', 'DTH', 'UNM'];

    // Extract values for each metric across all 16 states
    const values: Record<string, number[]> = {};
    for (const key of metricKeys) {
      values[key] = STATES.map(s => {
        const v = s[key];
        return typeof v === 'number' ? v : 0;
      });
    }

    // Calculate correlation matrix
    const matrix: number[][] = [];
    for (let i = 0; i < metricKeys.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < metricKeys.length; j++) {
        row.push(pearsonCorrelation(values[metricKeys[i]], values[metricKeys[j]]));
      }
      matrix.push(row);
    }

    return { metricLabels, metricShort, matrix };
  }, [lang]);

  // ─── NEW: Population Pyramid Data ─────────────────────────────
  const populationPyramid = useMemo(() => {
    // Simulated Malaysia population pyramid (young population profile)
    const ageGroups = [
      { range: '0-4', male: 1240, female: 1180 },
      { range: '5-9', male: 1320, female: 1260 },
      { range: '10-14', male: 1380, female: 1310 },
      { range: '15-19', male: 1410, female: 1340 },
      { range: '20-24', male: 1560, female: 1490 },
      { range: '25-29', male: 1680, female: 1640 },
      { range: '30-34', male: 1720, female: 1700 },
      { range: '35-39', male: 1580, female: 1570 },
      { range: '40-44', male: 1340, female: 1350 },
      { range: '45-49', male: 1120, female: 1150 },
      { range: '50-54', male: 940, female: 980 },
      { range: '55-59', male: 740, female: 800 },
      { range: '60-64', male: 560, female: 620 },
      { range: '65-69', male: 380, female: 440 },
      { range: '70-74', male: 240, female: 300 },
      { range: '75-79', male: 130, female: 180 },
      { range: '80+', male: 70, female: 120 },
    ];
    return ageGroups.map(g => ({
      ageGroup: g.range,
      ageGroupMs: g.range,
      male: -g.male, // Negative for left side
      maleAbs: g.male,
      female: g.female,
    }));
  }, []);

  // ─── NEW: Economic Sector Treemap Data ────────────────────────
  const sectorData = useMemo(() => [
    { name: lang === 'ms' ? 'Perkhidmatan' : 'Services', value: 58, color: '#06b6d4' },
    { name: lang === 'ms' ? 'Pembuatan' : 'Manufacturing', value: 23, color: '#f59e0b' },
    { name: lang === 'ms' ? 'Perlombongan' : 'Mining', value: 7, color: '#8b5cf6' },
    { name: lang === 'ms' ? 'Pertanian' : 'Agriculture', value: 7, color: '#10b981' },
    { name: lang === 'ms' ? 'Pembinaan' : 'Construction', value: 5, color: '#ec4899' },
  ], [lang]);

  // ─── NEW: Key Insights ────────────────────────────────────────
  const insights = useMemo(() => [
    {
      icon: TrendingUp,
      color: '#f59e0b',
      text_en: 'Selangor contributes 21.6% of national GDP',
      text_ms: 'Selangor menyumbang 21.6% KDNK negara',
    },
    {
      icon: MapPin,
      color: '#06b6d4',
      text_en: 'W.P. Kuala Lumpur has 7,983 people per km\u00B2',
      text_ms: 'W.P. Kuala Lumpur mempunyai 7,983 orang per km\u00B2',
    },
    {
      icon: AlertTriangle,
      color: '#ef4444',
      text_en: 'Sabah has the highest unemployment at 5.2%',
      text_ms: 'Sabah mempunyai pengangguran tertinggi iaitu 5.2%',
    },
    {
      icon: TrendingUp,
      color: '#10b981',
      text_en: 'Penang has the highest GDP growth at 5.8%',
      text_ms: 'Pulau Pinang mempunyai pertumbuhan KDNK tertinggi iaitu 5.8%',
    },
    {
      icon: MapPin,
      color: '#8b5cf6',
      text_en: 'Sarawak is the largest state by area (124,450 km\u00B2)',
      text_ms: 'Sarawak ialah negeri terbesar mengikut keluasan (124,450 km\u00B2)',
    },
  ], []);

  // ─── NEW: Data Quality Metrics ────────────────────────────────
  const qualityMetrics = useMemo(() => [
    {
      label_en: 'Coverage', label_ms: 'Liputan',
      value: 98, color: '#10b981',
    },
    {
      label_en: 'Freshness', label_ms: 'Kesegaran',
      value: 87, color: '#f59e0b',
    },
    {
      label_en: 'Completeness', label_ms: 'Kelengkapan',
      value: 95, color: '#10b981',
    },
    {
      label_en: 'Consistency', label_ms: 'Konsistensi',
      value: 91, color: '#06b6d4',
    },
  ], []);

  const SECTOR_COLORS = ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#ec4899'];

  // ─── Region Aggregates ────────────────────────────────────────
  const regionAgg = useMemo(() => {
    const pen = STATES.filter(s => s.region === 'peninsular');
    const east = STATES.filter(s => s.region === 'east_malaysia');
    const agg = (arr: typeof STATES) => ({
      pop: arr.reduce((a, s) => a + s.population, 0),
      gdp: arr.reduce((a, s) => a + s.gdp, 0),
      avgGrowth: arr.reduce((a, s) => a + s.gdpGrowth, 0) / arr.length,
      avgUnemp: arr.reduce((a, s) => a + s.unemployment, 0) / arr.length,
      totalArea: arr.reduce((a, s) => a + s.area, 0),
      count: arr.length,
    });
    return { peninsular: agg(pen), east: agg(east) };
  }, []);

  // ─── GDP Per Capita Ranking ───────────────────────────────────
  const gdpPerCapita = useMemo(() =>
    STATES.map(s => ({
      ...s,
      gdpPerCapita: Math.round((s.gdp * 1000) / s.population),
      regionColor: s.region === 'peninsular' ? '#06b6d4' : '#f59e0b',
    })).sort((a, b) => b.gdpPerCapita - a.gdpPerCapita).slice(0, 10)
  , []);

  // ─── All States GDP Per Capita ────────────────────────────────
  const allStatesPC = useMemo(() =>
    STATES.map(s => ({
      ...s,
      gdpPerCapita: Math.round((s.gdp * 1000) / s.population),
      regionColor: s.region === 'peninsular' ? '#06b6d4' : '#f59e0b',
    })).sort((a, b) => b.gdpPerCapita - a.gdpPerCapita)
  , []);

  // ─── Top 5 GDP States ─────────────────────────────────────────
  const top5Gdp = useMemo(() =>
    STATES.slice().sort((a, b) => b.gdp - a.gdp).slice(0, 5)
  , []);

  // ─── Geospatial Layers ────────────────────────────────────────
  const geoLayers = useMemo(() => MAP_LAYERS.map(l => ({
    ...l,
    desc_en: l.id === 'population' ? 'Population distribution across states'
      : l.id === 'gdp' ? 'GDP output by state (RM millions)'
      : l.id === 'births' ? 'Live births per state'
      : l.id === 'deaths' ? 'Mortality statistics by state'
      : l.id === 'unemployment' ? 'Labour market unemployment rates'
      : 'Open dataset coverage by state',
    desc_ms: l.id === 'population' ? 'Taburan penduduk merentasi negeri'
      : l.id === 'gdp' ? 'Pengeluaran KDNK mengikut negeri (RM juta)'
      : l.id === 'births' ? 'Kelahiran hidup mengikut negeri'
      : l.id === 'deaths' ? 'Statistik kematian mengikut negeri'
      : l.id === 'unemployment' ? 'Kadar pengangguran pasaran buruh'
      : 'Liputan set data terbuka mengikut negeri',
  })), []);

  // ─── Data Pipeline Sources ────────────────────────────────────
  const dataSources = useMemo(() => [
    { id: 'datagov', label: 'data.gov.my', records: 287, status: 'active', lastSync: '2m ago', color: '#06b6d4' },
    { id: 'dosm', label: 'DOSM', records: 142, status: 'active', lastSync: '15m ago', color: '#f59e0b' },
    { id: 'bnm', label: 'BNM', records: 38, status: 'active', lastSync: '1h ago', color: '#10b981' },
    { id: 'kkm', label: 'KKM', records: 24, status: 'active', lastSync: '3h ago', color: '#ec4899' },
    { id: 'jdn', label: 'JDN', records: 19, status: 'active', lastSync: '30m ago', color: '#8b5cf6' },
  ], []);

  return (
    <div className="space-y-6" role="region" aria-label="Data analytics">
      {/* Section Header: Trends & Comparison */}
      <div className="flex items-center gap-3">
        <div>
          <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#f59e0b', textShadow: '0 0 8px rgba(245,158,11,0.4)' }}>
            {lang === 'ms' ? 'TREND & PERBANDINGAN' : 'TRENDS & COMPARISON'}
          </span>
          <SectionHeaderLine color="#f59e0b" delay={0.2} />
        </div>
      </div>
      {/* ─── Existing Row 1: GDP Trend + Radar ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GDP Trend Area Chart */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#f59e0b" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#f59e0b' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
              {lang === 'ms' ? 'TREND KDNK (RM B)' : 'GDP TREND (RM B)'}
            </span>
          </div>
      <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={gdpTrend}>
              <defs>
                <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.06)" />
              <XAxis dataKey="year" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} />
              <YAxis tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} width={40} />
              <Tooltip contentStyle={{
                background: 'rgba(10,14,26,0.97)',
                border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(245,158,11,0.1)',
                padding: '8px 12px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#e0f7fa',
              }} itemStyle={{ color: '#b8c5d4', padding: '2px 0' }} labelStyle={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="url(#gdpGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#06b6d4" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'PERBANDINGAN NEGERI TERATAS' : 'TOP STATES COMPARISON'}
            </span>
          </div>
      <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(6,182,212,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#8899aa', fontSize: 9 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              {topStates.map((s, i) => (
                <Radar key={s.id} name={s.abbr} dataKey={s.abbr} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.1} />
              ))}
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {topStates.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: RADAR_COLORS[i] }} />
                <span className="text-[9px] font-mono" style={{ color: '#b0bec5' }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GDP Growth Rate + Sector Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GDP Growth Rate Bar Chart */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#10b981" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#10b981' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#10b981' }}>
              {lang === 'ms' ? 'KADAR PERTUMBUHAN KDNK' : 'GDP GROWTH RATE'}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200} >
            <BarChart data={gdpGrowthRateData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.06)" />
              <XAxis dataKey="year" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} />
              <YAxis tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} width={40} domain={[-8, 10]} />
              <Tooltip contentStyle={{
                background: 'rgba(10,14,26,0.97)',
                border: '1px solid rgba(6,182,212,0.25)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                padding: '8px 12px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#e0f7fa',
              }} itemStyle={{ color: '#b8c5d4' }} labelStyle={{ color: '#10b981', fontWeight: 'bold' }} />
              <Bar dataKey="rate" radius={[4,4,0,0]}>
                {gdpGrowthRateData.map((d, i) => (
                  <Cell key={i} fill={d.rate >= 0 ? '#f59e0b' : '#ef4444'} opacity={0.8} />
                ))}
                <LabelList dataKey="rateLabel" position="top" fill="#b8c5d4" fontSize={9} fontFamily="monospace" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Contribution Horizontal Bar Chart */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#8b5cf6" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Layers size={14} style={{ color: '#8b5cf6' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#8b5cf6' }}>
              {lang === 'ms' ? 'SUMBANGAN SEKTOR KDNK' : 'GDP SECTOR CONTRIBUTION'}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200} >
            <BarChart data={sectorContributionData} layout="vertical" barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.06)" />
              <XAxis type="number" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#b0bec5', fontSize: 9 }} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} width={100} />
              <Tooltip contentStyle={{
                background: 'rgba(10,14,26,0.97)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                padding: '8px 12px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#e0f7fa',
              }} itemStyle={{ color: '#b8c5d4' }} labelStyle={{ color: '#8b5cf6', fontWeight: 'bold' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {sectorContributionData.map((_, i) => (
                  <Cell key={i} fill={SECTOR_COLORS[i]} opacity={0.75} />
                ))}
                <LabelList dataKey="valueLabel" position="right" fill="#b8c5d4" fontSize={9} fontFamily="monospace" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AnimatedDivider color="#06b6d4" />

      {/* Section Header: Distribution & Matrix */}
      <div className="flex items-center gap-3">
        <div>
          <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.4)' }}>
            {lang === 'ms' ? 'TABURAN & MATRIKS' : 'DISTRIBUTION & MATRIX'}
          </span>
          <SectionHeaderLine color="#06b6d4" delay={0.2} />
        </div>
      </div>

      {/* ─── Existing: Category Distribution Bar Chart ──────────── */}
      <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
        <ScanBeamOverlay color="#06b6d4" />
        <HUDBracket />
        <div className="flex items-center gap-2 mb-4">
          <Database size={14} style={{ color: '#06b6d4' }} />
          <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
            {lang === 'ms' ? 'TABURAN KATEGORI SET DATA' : 'DATASET CATEGORY DISTRIBUTION'}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={280} >
          <BarChart data={catDist} layout="vertical" barCategoryGap="8%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.06)" />
            <XAxis type="number" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#b8c5d4', fontSize: 9 }} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} width={120} />
            <Tooltip contentStyle={{
              background: 'rgba(10,14,26,0.97)',
              border: '1px solid rgba(6,182,212,0.25)',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(6,182,212,0.1)',
              padding: '8px 12px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#e0f7fa',
            }} itemStyle={{ color: '#b8c5d4', padding: '2px 0' }} labelStyle={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {catDist.map((_, i) => <Cell key={i} fill={DATASET_CATEGORIES[i % DATASET_CATEGORIES.length]?.color || '#06b6d4'} opacity={0.7} />)}
              <LabelList dataKey="valueLabel" position="right" fill="#b8c5d4" fontSize={9} fontFamily="monospace" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Existing: State Matrix ─────────────────────────────── */}
      <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
        <ScanBeamOverlay color="#06b6d4" />
        <HUDBracket />
        <div className="flex items-center gap-2 mb-4">
          <Layers size={14} style={{ color: '#06b6d4' }} />
          <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
            {lang === 'ms' ? 'MATRIKS METRIK NEGERI' : 'STATE METRICS MATRIX'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
                <th className="text-left px-2 py-1.5" style={{ color: '#06b6d4' }}>STATE</th>
                <th className="text-right px-2 py-1.5" style={{ color: '#06b6d4' }}>POP</th>
                <th className="text-right px-2 py-1.5" style={{ color: '#f59e0b' }}>GDP</th>
                <th className="text-right px-2 py-1.5" style={{ color: '#10b981' }}>GROWTH</th>
                <th className="text-right px-2 py-1.5" style={{ color: '#ec4899' }}>BIRTHS</th>
                <th className="text-right px-2 py-1.5" style={{ color: '#ef4444' }}>DEATHS</th>
                <th className="text-right px-2 py-1.5" style={{ color: '#8b5cf6' }}>UNEMP</th>
              </tr>
            </thead>
            <tbody>
              {stateMatrix.map(s => (
                <tr key={s.id} className="hover:bg-cyan-950/20" style={{ borderBottom: '1px solid rgba(6,182,212,0.04)' }}>
                  <td className="px-2 py-1.5" style={{ color: '#e0f7fa' }} title={s.name}>{s.abbr}</td>
                  <td className="text-right px-2 py-1.5" style={{ color: '#06b6d4' }}>{s.population.toLocaleString()}</td>
                  <td className="text-right px-2 py-1.5" style={{ color: '#f59e0b' }}>{(s.gdp/1000).toFixed(1)}B</td>
                  <td className="text-right px-2 py-1.5" style={{ color: '#10b981' }}>{s.gdpGrowth}%</td>
                  <td className="text-right px-2 py-1.5" style={{ color: '#ec4899' }}>{s.births}</td>
                  <td className="text-right px-2 py-1.5" style={{ color: '#ef4444' }}>{s.deaths}</td>
                  <td className="text-right px-2 py-1.5" style={{ color: '#8b5cf6' }}>{s.unemployment}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatedDivider color="#10b981" />

      {/* Section Header: Deep Analytics */}
      <div className="flex items-center gap-3">
        <div>
          <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#10b981', textShadow: '0 0 8px rgba(16,185,129,0.4)' }}>
            {lang === 'ms' ? 'ANALISIS MENDALAM' : 'DEEP ANALYTICS'}
          </span>
          <SectionHeaderLine color="#10b981" delay={0.2} />
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          NEW ENHANCED ANALYTICS ROWS
          Row 1: Correlation Matrix (col-span-2) + Key Insights (col-span-1)
          Row 2: Population Pyramid + Economic Sector Treemap + Data Quality
          ═════════════════════════════════════════════════════════════ */}

      {/* ─── Row 1: Correlation Matrix + Key Insights ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Correlation Matrix (col-span-2) */}
        <div className="lg:col-span-2 relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#f59e0b" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: '#f59e0b' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
              {lang === 'ms' ? 'MATRIKS KORELASI METRIK' : 'METRIC CORRELATION MATRIX'}
            </span>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header row */}
              <div className="flex">
                <div className="w-16 flex-shrink-0" />
                {correlationMetrics.metricShort.map((label, i) => (
                  <div key={label} className="flex-1 text-center text-[8px] font-mono py-1" style={{ color: '#b0bec5' }}>
                    {label}
                  </div>
                ))}
              </div>
              {/* Data rows */}
              {correlationMetrics.matrix.map((row, i) => (
                <div key={i} className="flex">
                  <div className="w-16 flex-shrink-0 text-[8px] font-mono flex items-center justify-end pr-2" style={{ color: '#b0bec5' }}>
                    {correlationMetrics.metricShort[i]}
                  </div>
                  {row.map((val, j) => (
                    <div
                      key={j}
                      className="flex-1 flex items-center justify-center aspect-square min-h-[36px] m-[1px] rounded-sm"
                      style={{
                        background: correlationColor(val),
                        opacity: 0.75,
                      }}
                      title={`${correlationMetrics.metricLabels[i]} ↔ ${correlationMetrics.metricLabels[j]}: ${val.toFixed(3)}`}
                    >
                      <span className="text-[8px] font-mono font-bold" style={{
                        color: Math.abs(val) > 0.5 ? '#0a0e1a' : '#b8c5d4',
                        textShadow: Math.abs(val) > 0.5 ? 'none' : '0 0 2px rgba(0,0,0,0.5)',
                      }}>
                        {val.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-[8px] font-mono" style={{ color: '#ef4444' }}>-1</span>
            <div className="flex h-2 w-32 rounded-sm overflow-hidden">
              {Array.from({ length: 20 }, (_, i) => {
                const v = -1 + (i * 2) / 19;
                return <div key={i} className="flex-1" style={{ background: correlationColor(v), opacity: 0.75 }} />;
              })}
            </div>
            <span className="text-[8px] font-mono" style={{ color: '#10b981' }}>+1</span>
            <span className="text-[8px] font-mono ml-2" style={{ color: '#b0bec5' }}>
              {lang === 'ms' ? 'Faktor Korelasi' : 'Correlation Coefficient'}
            </span>
          </div>

          {/* Full metric labels below */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
            {correlationMetrics.metricShort.map((short, i) => (
              <span key={short} className="text-[7px] font-mono" style={{ color: '#b0bec5' }}>
                {short} = {correlationMetrics.metricLabels[i]}
              </span>
            ))}
          </div>
        </div>

        {/* Key Insights Panel (col-span-1) */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#f59e0b" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={14} style={{ color: '#f59e0b' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
              {lang === 'ms' ? 'PANDUAN UTAMA' : 'KEY INSIGHTS'}
            </span>
          </div>

          <div className="space-y-3">
            {insights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex items-start gap-2.5 p-2 rounded-md border"
                  style={{
                    background: `${insight.color}08`,
                    borderColor: `${insight.color}20`,
                  }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon size={12} style={{ color: insight.color }} />
                  </div>
                  <span className="text-[10px] font-mono leading-relaxed" style={{
                    color: '#e0f7fa',
                    textShadow: `0 0 8px ${insight.color}30`,
                  }}>
                    {lang === 'ms' ? insight.text_ms : insight.text_en}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Row 2: Population Pyramid + Treemap + Data Quality ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Population Pyramid (col-span-1) */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#ec4899" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} style={{ color: '#ec4899' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#ec4899' }}>
              {lang === 'ms' ? 'PIRAMID POPULASI' : 'POPULATION PYRAMID'}
            </span>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: '#06b6d4' }} />
              <span className="text-[8px] font-mono" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'Lelaki' : 'Male'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: '#ec4899' }} />
              <span className="text-[8px] font-mono" style={{ color: '#ec4899' }}>
                {lang === 'ms' ? 'Perempuan' : 'Female'}
              </span>
            </div>
          </div>

          {/* Custom Horizontal Bar Chart */}
          <div className="space-y-0">
            {populationPyramid.map((group, i) => {
              const maxVal = 1800; // max absolute value for scaling
              const maleWidth = (group.maleAbs / maxVal) * 100;
              const femaleWidth = (group.female / maxVal) * 100;
              return (
                <div key={i} className="flex items-center gap-0" style={{ height: '12px' }}>
                  {/* Male bar (left, right-aligned) */}
                  <div className="w-[40%] flex justify-end pr-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maleWidth}%` }}
                      transition={{ delay: i * 0.03, duration: 0.6, ease: 'easeOut' }}
                      className="h-2.5 rounded-l-sm"
                      style={{ background: 'linear-gradient(to right, #06b6d480, #06b6d4)' }}
                    />
                  </div>
                  {/* Age label (center) */}
                  <div className="w-[20%] text-center text-[6px] font-mono flex-shrink-0" style={{ color: '#b0bec5' }}>
                    {group.ageGroup}
                  </div>
                  {/* Female bar (right, left-aligned) */}
                  <div className="w-[40%] flex pl-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${femaleWidth}%` }}
                      transition={{ delay: i * 0.03, duration: 0.6, ease: 'easeOut' }}
                      className="h-2.5 rounded-r-sm"
                      style={{ background: 'linear-gradient(to right, #ec4899, #ec489940)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Axis labels */}
          <div className="flex mt-1">
            <div className="w-[40%] text-center text-[7px] font-mono" style={{ color: '#06b6d466' }}>
              {lang === 'ms' ? "← Lelaki ('000)" : "← Male ('000)"}
            </div>
            <div className="w-[20%]" />
            <div className="w-[40%] text-center text-[7px] font-mono" style={{ color: '#ec489966' }}>
              {lang === 'ms' ? "Perempuan ('000) →" : "Female ('000) →"}
            </div>
          </div>
        </div>

        {/* Economic Sector Treemap (col-span-1) */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#10b981" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} style={{ color: '#10b981' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#10b981' }}>
              {lang === 'ms' ? 'SEKTOR EKONOMI' : 'ECONOMIC SECTORS'}
            </span>
          </div>

          {/* Custom Treemap Layout */}
          <div className="relative w-full" style={{ height: '220px' }}>
            {/* Services - 58% - takes up left half */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="absolute rounded-md border flex flex-col items-center justify-center"
              style={{
                left: 0, top: 0,
                width: '56%', height: '100%',
                background: `${sectorData[0].color}15`,
                borderColor: `${sectorData[0].color}30`,
              }}
            >
              <span className="text-lg font-mono font-bold" style={{ color: sectorData[0].color }}>
                58%
              </span>
              <span className="text-[9px] font-mono mt-0.5" style={{ color: '#e0f7fa' }}>
                {sectorData[0].name}
              </span>
            </motion.div>

            {/* Manufacturing - 23% - takes up top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="absolute rounded-md border flex flex-col items-center justify-center"
              style={{
                right: 0, top: 0,
                width: '42%', height: '55%',
                background: `${sectorData[1].color}15`,
                borderColor: `${sectorData[1].color}30`,
              }}
            >
              <span className="text-base font-mono font-bold" style={{ color: sectorData[1].color }}>
                23%
              </span>
              <span className="text-[8px] font-mono mt-0.5" style={{ color: '#e0f7fa' }}>
                {sectorData[1].name}
              </span>
            </motion.div>

            {/* Bottom-right row: Mining, Agriculture, Construction */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute rounded-md border flex flex-col items-center justify-center"
              style={{
                right: '28%', top: '57%',
                width: '14%', height: '41%',
                background: `${sectorData[2].color}15`,
                borderColor: `${sectorData[2].color}30`,
              }}
            >
              <span className="text-[10px] font-mono font-bold" style={{ color: sectorData[2].color }}>
                7%
              </span>
              <span className="text-[6px] font-mono mt-0.5 text-center px-0.5" style={{ color: '#e0f7fa' }}>
                {sectorData[2].name}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="absolute rounded-md border flex flex-col items-center justify-center"
              style={{
                right: '14%', top: '57%',
                width: '14%', height: '41%',
                background: `${sectorData[3].color}15`,
                borderColor: `${sectorData[3].color}30`,
              }}
            >
              <span className="text-[10px] font-mono font-bold" style={{ color: sectorData[3].color }}>
                7%
              </span>
              <span className="text-[6px] font-mono mt-0.5 text-center px-0.5" style={{ color: '#e0f7fa' }}>
                {sectorData[3].name}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute rounded-md border flex flex-col items-center justify-center"
              style={{
                right: 0, top: '57%',
                width: '14%', height: '41%',
                background: `${sectorData[4].color}15`,
                borderColor: `${sectorData[4].color}30`,
              }}
            >
              <span className="text-[10px] font-mono font-bold" style={{ color: sectorData[4].color }}>
                5%
              </span>
              <span className="text-[6px] font-mono mt-0.5 text-center px-0.5" style={{ color: '#e0f7fa' }}>
                {sectorData[4].name}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Data Quality Score (col-span-1) */}
        <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#06b6d4" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'SKOR KUALITI DATA' : 'DATA QUALITY SCORE'}
            </span>
          </div>

          {/* Overall Score */}
          <div className="flex flex-col items-center mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-4xl font-mono font-bold"
              style={{
                color: '#10b981',
                textShadow: '0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.2)',
              }}
            >
              94
            </motion.div>
            <span className="text-[9px] font-mono tracking-wider" style={{ color: '#b0bec5' }}>
              / 100
            </span>
            <span className="text-[8px] font-mono mt-1" style={{ color: '#10b981' }}>
              {lang === 'ms' ? 'KESELURUHAN' : 'OVERALL'}
            </span>
          </div>

          {/* Individual Metrics */}
          <div className="space-y-3">
            {qualityMetrics.map((metric, i) => (
              <div key={metric.label_en}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono" style={{ color: '#b0bec5' }}>
                    {lang === 'ms' ? metric.label_ms : metric.label_en}
                  </span>
                  <span className="text-[9px] font-mono font-bold" style={{ color: metric.color }}>
                    {metric.value}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${metric.color}80, ${metric.color})`,
                      boxShadow: `0 0 6px ${metric.color}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quality Badge */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <CheckCircle2 size={10} style={{ color: '#10b981' }} />
            <span className="text-[8px] font-mono" style={{ color: '#10b981' }}>
              {lang === 'ms' ? 'Kualiti Data Tinggi' : 'High Data Quality'}
            </span>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION A: STATES & FEDERAL TERRITORIES
          ═════════════════════════════════════════════════════════════ */}
      <AnimatedDivider color="#f59e0b" />

      <div className="flex items-center gap-3">
        <div>
          <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#f59e0b', textShadow: '0 0 8px rgba(245,158,11,0.4)' }}>
            {lang === 'ms' ? 'NEGERI & WILAYAH PERSEKUTUAN' : 'STATES & FEDERAL TERRITORIES'}
          </span>
          <SectionHeaderLine color="#f59e0b" delay={0.2} />
        </div>
      </div>

      {/* ─── Row 1: Region Comparison ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peninsular Malaysia */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="relative group rounded-xl border p-5" style={premiumCardStyle({ borderLeftWidth: '3px', borderLeftColor: '#06b6d4' })}>
          <ScanBeamOverlay color="#06b6d4" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Globe size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'SEMANJUNG MALAYSIA' : 'PENINSULAR MALAYSIA'}
            </span>
            <span className="text-[8px] font-mono ml-auto px-1.5 py-0.5 rounded" style={{ background: '#06b6d415', color: '#06b6d4', border: '1px solid #06b6d420' }}>{regionAgg.peninsular.count} {lang === 'ms' ? 'negeri' : 'states'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>{lang === 'ms' ? 'Populasi' : 'Population'}</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>{(regionAgg.peninsular.pop / 1000).toFixed(1)}M</div>
              <div className="w-full h-1 rounded-full mt-1" style={{ background: '#06b6d415' }}><div className="h-full rounded-full" style={{ width: `${(regionAgg.peninsular.pop / 34300) * 100}%`, background: '#06b6d4' }} /></div>
            </div>
            <div>
              <div className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>GDP</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#f59e0b' }}>RM {(regionAgg.peninsular.gdp / 1000).toFixed(0)}B</div>
              <div className="w-full h-1 rounded-full mt-1" style={{ background: '#f59e0b15' }}><div className="h-full rounded-full" style={{ width: `${(regionAgg.peninsular.gdp / 1682000) * 100}%`, background: '#f59e0b' }} /></div>
            </div>
            <div>
              <div className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>{lang === 'ms' ? 'Pertumbuhan Avg' : 'Avg Growth'}</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#10b981' }}>{regionAgg.peninsular.avgGrowth.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>{lang === 'ms' ? 'Pengangguran Avg' : 'Avg Unemp'}</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#ef4444' }}>{regionAgg.peninsular.avgUnemp.toFixed(1)}%</div>
            </div>
          </div>
        </motion.div>

        {/* East Malaysia */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative group rounded-xl border p-5" style={premiumCardStyle({ borderLeftWidth: '3px', borderLeftColor: '#f59e0b' })}>
          <ScanBeamOverlay color="#f59e0b" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Globe size={14} style={{ color: '#f59e0b' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
              {lang === 'ms' ? 'MALAYSIA TIMUR' : 'EAST MALAYSIA'}
            </span>
            <span className="text-[8px] font-mono ml-auto px-1.5 py-0.5 rounded" style={{ background: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b20' }}>{regionAgg.east.count} {lang === 'ms' ? 'negeri' : 'states'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>{lang === 'ms' ? 'Populasi' : 'Population'}</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>{(regionAgg.east.pop / 1000).toFixed(1)}M</div>
              <div className="w-full h-1 rounded-full mt-1" style={{ background: '#06b6d415' }}><div className="h-full rounded-full" style={{ width: `${(regionAgg.east.pop / 34300) * 100}%`, background: '#06b6d4' }} /></div>
            </div>
            <div>
              <div className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>GDP</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#f59e0b' }}>RM {(regionAgg.east.gdp / 1000).toFixed(0)}B</div>
              <div className="w-full h-1 rounded-full mt-1" style={{ background: '#f59e0b15' }}><div className="h-full rounded-full" style={{ width: `${(regionAgg.east.gdp / 1682000) * 100}%`, background: '#f59e0b' }} /></div>
            </div>
            <div>
              <div className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>{lang === 'ms' ? 'Pertumbuhan Avg' : 'Avg Growth'}</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#10b981' }}>{regionAgg.east.avgGrowth.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>{lang === 'ms' ? 'Pengangguran Avg' : 'Avg Unemp'}</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#ef4444' }}>{regionAgg.east.avgUnemp.toFixed(1)}%</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Row 2: GDP Per Capita Ranking ───────────────────────── */}
      <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
        <ScanBeamOverlay color="#f59e0b" />
        <HUDBracket />
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} style={{ color: '#f59e0b' }} />
          <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
            {lang === 'ms' ? 'KEDUDUKAN KDNK PER KAPITA' : 'GDP PER CAPITA RANKING'}
          </span>
          {onNavigateGeoMap && (
            <button onClick={() => onNavigateGeoMap(undefined, 'gdp')} className="ml-auto flex items-center gap-1 px-2 py-1 rounded border text-[8px] font-mono transition-all duration-200 hover:scale-105" style={{ background: '#f59e0b10', borderColor: '#f59e0b25', color: '#f59e0b' }}>
              <MapPin size={8} /> {lang === 'ms' ? 'Lihat Peta' : 'View on Map'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: '#06b6d4' }} /><span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>{lang === 'ms' ? 'Semenanjung' : 'Peninsular'}</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} /><span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>{lang === 'ms' ? 'Timur' : 'East'}</span></div>
        </div>
        <ResponsiveContainer width="100%" height={280} >
          <BarChart data={gdpPerCapita} layout="vertical" barCategoryGap="8%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.06)" />
            <XAxis type="number" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} />
            <YAxis type="category" dataKey="abbr" tick={{ fill: '#b0bec5', fontSize: 9 }} axisLine={CHART_AXIS_LINE} tickLine={CHART_TICK_LINE} width={35} />
            <Tooltip contentStyle={{ background: 'rgba(10,14,26,0.97)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', padding: '8px 12px', fontSize: '11px', fontFamily: 'monospace', color: '#e0f7fa' }} itemStyle={{ color: '#b8c5d4' }} labelStyle={{ color: '#f59e0b', fontWeight: 'bold' }} formatter={(v: number) => [`RM ${v.toLocaleString()}`, lang === 'ms' ? 'KDNK Per Kapita' : 'GDP Per Capita']} />
            <Bar dataKey="gdpPerCapita" radius={[0, 4, 4, 0]}>
              {gdpPerCapita.map((s, i) => <Cell key={i} fill={s.regionColor} opacity={0.75} />)}
              <LabelList dataKey="gdpPerCapita" position="right" fill="#b8c5d4" fontSize={8} fontFamily="monospace" formatter={(v: number) => `RM ${v.toLocaleString()}`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Row 3: State Detail Cards Grid ──────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {allStatesPC.map((state, i) => (
          <motion.div
            key={state.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="relative group rounded-lg border p-3"
            style={premiumCardStyle({ borderLeftWidth: '3px', borderLeftColor: state.regionColor })}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10px] font-mono font-bold" style={{ color: '#e0f7fa' }}>{state.abbr}</span>
              <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ background: state.region === 'peninsular' ? '#06b6d415' : '#f59e0b15', color: state.regionColor, border: `1px solid ${state.regionColor}25` }}>
                {state.region === 'peninsular' ? 'PEN' : 'EAST'}
              </span>
            </div>
            <div className="text-[7px] font-mono mb-1" style={{ color: '#b0bec5' }}>{lang === 'ms' ? state.name_ms : state.name}</div>
            <div className="text-base font-mono font-bold mb-1" style={{ color: '#f59e0b', textShadow: '0 0 8px rgba(245,158,11,0.3)' }}>
              RM {state.gdpPerCapita.toLocaleString()}
            </div>
            <div className="text-[7px] font-mono" style={{ color: '#b0bec5' }}>{lang === 'ms' ? 'KDNK per kapita' : 'GDP per capita'}</div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              <div className="text-center">
                <div className="text-[7px] font-mono" style={{ color: '#06b6d4' }}>{state.density.toFixed(0)}</div>
                <div className="text-[5px] font-mono" style={{ color: '#b0bec566' }}>{lang === 'ms' ? 'Ketumpatan' : 'Density'}</div>
              </div>
              <div className="text-center">
                <div className="text-[7px] font-mono" style={{ color: '#10b981' }}>{state.gdpGrowth}%</div>
                <div className="text-[5px] font-mono" style={{ color: '#b0bec566' }}>{lang === 'ms' ? 'Pertumbuhan' : 'Growth'}</div>
              </div>
              <div className="text-center">
                <div className="text-[7px] font-mono" style={{ color: '#ef4444' }}>{state.unemployment}%</div>
                <div className="text-[5px] font-mono" style={{ color: '#b0bec566' }}>{lang === 'ms' ? 'Ganggur' : 'Unemp'}</div>
              </div>
            </div>
            {onNavigateGeoMap && (
              <button onClick={() => onNavigateGeoMap(state.id, 'population')} className="mt-2 w-full flex items-center justify-center gap-1 px-1.5 py-1 rounded border text-[7px] font-mono transition-all duration-200 hover:scale-105" style={{ background: '#06b6d408', borderColor: '#06b6d420', color: '#06b6d4' }}>
                <MapPin size={7} /> {lang === 'ms' ? 'Lihat Peta' : 'View on Map'}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION B: GEOSPATIAL INSIGHTS
          ═════════════════════════════════════════════════════════════ */}
      <AnimatedDivider color="#06b6d4" />

      <div className="flex items-center gap-3">
        <div>
          <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.4)' }}>
            {lang === 'ms' ? 'PANDUAN GEORUANG' : 'GEOSPATIAL INSIGHTS'}
          </span>
          <SectionHeaderLine color="#06b6d4" delay={0.2} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Layers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#06b6d4" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Layers size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'LAPISAN PETA' : 'MAP LAYERS'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {geoLayers.map((layer, i) => {
              const layerIcon = layer.id === 'population' ? Users : layer.id === 'gdp' ? TrendingUp : layer.id === 'births' ? Activity : layer.id === 'deaths' ? Shield : layer.id === 'unemployment' ? Database : Layers;
              const LayerIcon = layerIcon;
              return (
                <motion.button
                  key={layer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onNavigateGeoMap?.(undefined, layer.id)}
                  className="flex flex-col items-start p-2.5 rounded-lg border text-left transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: '#06b6d408', borderColor: '#06b6d415' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d435'; e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#06b6d415'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <LayerIcon size={10} style={{ color: '#06b6d4' }} />
                    <span className="text-[9px] font-mono font-semibold" style={{ color: '#e0f7fa' }}>{lang === 'ms' ? layer.label_ms : layer.label_en}</span>
                  </div>
                  <span className="text-[7px] font-mono leading-tight" style={{ color: '#b0bec5' }}>{lang === 'ms' ? layer.desc_ms : layer.desc_en}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#f59e0b" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} style={{ color: '#f59e0b' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
              {lang === 'ms' ? 'NAVIGASI PANTAS' : 'QUICK NAVIGATION'}
            </span>
          </div>
          <div className="space-y-2">
            {top5Gdp.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => onNavigateGeoMap?.(s.id, 'gdp')}
                className="w-full flex items-center gap-2 p-2 rounded-md border text-left transition-all duration-200 hover:scale-[1.02]"
                style={{ background: `${i === 0 ? '#f59e0b' : '#06b6d4'}08`, borderColor: `${i === 0 ? '#f59e0b' : '#06b6d4'}15` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b35'; e.currentTarget.style.boxShadow = '0 0 8px rgba(245,158,11,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${i === 0 ? '#f59e0b' : '#06b6d4'}15`; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span className="text-[9px] font-mono font-bold w-4 text-center" style={{ color: '#f59e0b' }}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-mono font-semibold truncate" style={{ color: '#e0f7fa' }}>{lang === 'ms' ? s.name_ms : s.name}</div>
                  <div className="text-[7px] font-mono" style={{ color: '#b0bec5' }}>RM {(s.gdp / 1000).toFixed(1)}B</div>
                </div>
                <ArrowRight size={10} style={{ color: '#06b6d4' }} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION C: DATA ONTOLOGY & LINEAGE
          ═════════════════════════════════════════════════════════════ */}
      <AnimatedDivider color="#10b981" />

      <div className="flex items-center gap-3">
        <div>
          <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#10b981', textShadow: '0 0 8px rgba(16,185,129,0.4)' }}>
            {lang === 'ms' ? 'ONTOLOGI & KETURUNAN DATA' : 'DATA ONTOLOGY & LINEAGE'}
          </span>
          <SectionHeaderLine color="#10b981" delay={0.2} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Pipeline */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#10b981" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <GitBranch size={14} style={{ color: '#10b981' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#10b981' }}>
              {lang === 'ms' ? 'TALIAN PAIP DATA' : 'DATA PIPELINE'}
            </span>
          </div>

          {/* SVG Flow Diagram */}
          <div className="relative w-full overflow-x-auto" style={{ minHeight: '180px' }}>
            <svg width="100%" height="180" viewBox="0 0 700 180" className="block">
              {/* Source Stage */}
              <text x="40" y="18" fontSize="8" fontFamily="monospace" fill="#06b6d4" fontWeight="bold">{lang === 'ms' ? 'SUMBER' : 'SOURCE'}</text>
              {['data.gov.my', 'DOSM', 'BNM', 'KKM', 'JDN'].map((label, i) => (
                <g key={label}>
                  <rect x={10 + i * 86} y={28} width={76} height={32} rx={6} fill={`${dataSources[i].color}15`} stroke={`${dataSources[i].color}30`} strokeWidth={1} />
                  <text x={48 + i * 86} y={48} fontSize="7" fontFamily="monospace" fill={dataSources[i].color} textAnchor="middle">{label}</text>
                </g>
              ))}

              {/* Animated dots: Source → Processing */}
              {[0, 1, 2, 3, 4].map(i => (
                <circle key={`sp${i}`} r={2} fill={dataSources[i].color} opacity={0.8}>
                  <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={`M${48 + i * 86},60 L${200 + i * 20},85`} />
                </circle>
              ))}

              {/* Processing Stage */}
              <text x="230" y="78" fontSize="8" fontFamily="monospace" fill="#f59e0b" fontWeight="bold">{lang === 'ms' ? 'PEMPROSESAN' : 'PROCESSING'}</text>
              {[
                { label: lang === 'ms' ? 'Pengesahan' : 'Validation', color: '#f59e0b' },
                { label: lang === 'ms' ? 'Transformasi' : 'Transform', color: '#f59e0b' },
                { label: lang === 'ms' ? 'Pengkayaan' : 'Enrichment', color: '#f59e0b' },
              ].map((proc, i) => (
                <g key={proc.label}>
                  <rect x={160 + i * 130} y={88} width={110} height={28} rx={6} fill={`${proc.color}10`} stroke={`${proc.color}25`} strokeWidth={1} />
                  <text x={215 + i * 130} y={106} fontSize="8" fontFamily="monospace" fill={proc.color} textAnchor="middle">{proc.label}</text>
                </g>
              ))}

              {/* Animated dots: Processing → Output */}
              {[0, 1, 2].map(i => (
                <circle key={`po${i}`} r={2} fill="#f59e0b" opacity={0.8}>
                  <animateMotion dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" path={`M${215 + i * 130},116 L${140 + i * 130},145`} />
                </circle>
              ))}

              {/* Output Stage */}
              <text x="240" y="140" fontSize="8" fontFamily="monospace" fill="#10b981" fontWeight="bold">{lang === 'ms' ? 'OUTPUT' : 'OUTPUT'}</text>
              {[
                { label: lang === 'ms' ? 'Papan Pemuka' : 'Dashboard', color: '#10b981' },
                { label: lang === 'ms' ? 'Analitik' : 'Analytics', color: '#10b981' },
                { label: lang === 'ms' ? 'Eksport' : 'Export', color: '#10b981' },
                { label: lang === 'ms' ? 'Infografik' : 'Infographic', color: '#10b981' },
              ].map((out, i) => (
                <g key={out.label}>
                  <rect x={70 + i * 145} y={148} width={130} height={26} rx={6} fill={`${out.color}10`} stroke={`${out.color}25`} strokeWidth={1} />
                  <text x={135 + i * 145} y={165} fontSize="8" fontFamily="monospace" fill={out.color} textAnchor="middle">{out.label}</text>
                </g>
              ))}

              {/* Connecting lines */}
              <line x1="48" y1="60" x2="200" y2="88" stroke="#06b6d420" strokeWidth={1} strokeDasharray="3,3" />
              <line x1="134" y1="60" x2="220" y2="88" stroke="#f59e0b20" strokeWidth={1} strokeDasharray="3,3" />
              <line x1="220" y1="60" x2="240" y2="88" stroke="#10b98120" strokeWidth={1} strokeDasharray="3,3" />
              <line x1="306" y1="60" x2="280" y2="88" stroke="#ec489920" strokeWidth={1} strokeDasharray="3,3" />
              <line x1="392" y1="60" x2="340" y2="88" stroke="#8b5cf620" strokeWidth={1} strokeDasharray="3,3" />
              <line x1="215" y1="116" x2="140" y2="148" stroke="#f59e0b20" strokeWidth={1} strokeDasharray="3,3" />
              <line x1="345" y1="116" x2="285" y2="148" stroke="#f59e0b20" strokeWidth={1} strokeDasharray="3,3" />
              <line x1="475" y1="116" x2="430" y2="148" stroke="#10b98120" strokeWidth={1} strokeDasharray="3,3" />
            </svg>
          </div>
        </motion.div>

        {/* Source Registry */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
          <ScanBeamOverlay color="#8b5cf6" />
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Server size={14} style={{ color: '#8b5cf6' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#8b5cf6' }}>
              {lang === 'ms' ? 'DAFTAR SUMBER' : 'SOURCE REGISTRY'}
            </span>
          </div>
          <div className="space-y-2.5">
            {dataSources.map((src, i) => (
              <motion.div
                key={src.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2 p-2 rounded-md border"
                style={{ background: `${src.color}08`, borderColor: `${src.color}15` }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-2 h-2 rounded-full" style={{ background: src.color, boxShadow: `0 0 4px ${src.color}60` }} />
                  <motion.div className="absolute inset-0 w-2 h-2 rounded-full" style={{ border: `1px solid ${src.color}40` }} animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-semibold" style={{ color: src.color }}>{src.label}</span>
                    <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ background: `${src.color}15`, color: src.color }}>{src.records} {lang === 'ms' ? 'set data' : 'datasets'}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={6} style={{ color: '#b0bec566' }} />
                    <span className="text-[7px] font-mono" style={{ color: '#b0bec566' }}>{lang === 'ms' ? 'Disemak' : 'Synced'} {src.lastSync}</span>
                  </div>
                </div>
                <Eye size={10} style={{ color: `${src.color}60` }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      {/* ═════════════════════════════════════════════════════════════
          DATA QUALITY SECTION
          Added as Task 5: Data source health, freshness, reliability
          ═════════════════════════════════════════════════════════════ */}
      <AnimatedDivider color="#f59e0b" />

      <DataQualityDashboard lang={lang} />
    </div>
  );
}

export default AnalyticsSection;
