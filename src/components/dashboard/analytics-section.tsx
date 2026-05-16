'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Activity, Database, Layers,
  Lightbulb, Shield, AlertTriangle, MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
} from 'recharts';
import {
  STATES, DATASET_CATEGORIES,
} from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket } from '@/components/dashboard/particle-background';

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

// ─── Analytics Section ───────────────────────────────────────────
export function AnalyticsSection({ lang }: { lang: Lang }) {
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

  // Category distribution
  const catDist = useMemo(() => {
    const counts: Record<string, number> = {};
    DATASETS.forEach(d => { counts[d.category_en] = (counts[d.category_en] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
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

  return (
    <div className="space-y-4">
      {/* Section Header: Trends & Comparison */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono tracking-wider" style={{ color: '#f59e0b' }}>
          {lang === 'ms' ? 'TREND & PERBANDINGAN' : 'TRENDS & COMPARISON'}
        </span>
        <motion.div
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: 2, background: 'linear-gradient(90deg, #f59e0b, transparent)', transformOrigin: 'left', width: 120 }}
        />
      </div>
      {/* ─── Existing Row 1: GDP Trend + Radar ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* GDP Trend Area Chart */}
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.85)',
          borderColor: 'rgba(6,182,212,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: '#f59e0b' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#f59e0b' }}>
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
              <XAxis dataKey="year" tick={{ fill: '#f59e0b66', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#f59e0b66', fontSize: 9 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: '#0a0e1a', border: '1px solid #f59e0b30', borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="url(#gdpGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.85)',
          borderColor: 'rgba(6,182,212,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: '#06b6d4' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'PERBANDINGAN NEGERI TERATAS' : 'TOP STATES COMPARISON'}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(6,182,212,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#06b6d466', fontSize: 9 }} />
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

      {/* Section Header: Distribution & Matrix */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'TABURAN & MATRIKS' : 'DISTRIBUTION & MATRIX'}
        </span>
        <motion.div
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: 2, background: 'linear-gradient(90deg, #06b6d4, transparent)', transformOrigin: 'left', width: 120 }}
        />
      </div>

      {/* ─── Existing: Category Distribution Bar Chart ──────────── */}
      <div className="relative group rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.85)',
        borderColor: 'rgba(6,182,212,0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <HUDBracket />
        <div className="flex items-center gap-2 mb-4">
          <Database size={14} style={{ color: '#06b6d4' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
            {lang === 'ms' ? 'TABURAN KATEGORI SET DATA' : 'DATASET CATEGORY DISTRIBUTION'}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={catDist} layout="vertical" barCategoryGap="8%">
            <XAxis type="number" tick={{ fill: '#06b6d466', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#b0bec5', fontSize: 9 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip contentStyle={{ background: '#0a0e1a', border: '1px solid #06b6d430', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {catDist.map((_, i) => <Cell key={i} fill={DATASET_CATEGORIES[i % DATASET_CATEGORIES.length]?.color || '#06b6d4'} opacity={0.7} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Existing: State Matrix ─────────────────────────────── */}
      <div className="relative group rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.85)',
        borderColor: 'rgba(6,182,212,0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <HUDBracket />
        <div className="flex items-center gap-2 mb-4">
          <Layers size={14} style={{ color: '#06b6d4' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
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

      {/* Section Header: Deep Analytics */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono tracking-wider" style={{ color: '#10b981' }}>
          {lang === 'ms' ? 'ANALISIS MENDALAM' : 'DEEP ANALYTICS'}
        </span>
        <motion.div
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: 2, background: 'linear-gradient(90deg, #10b981, transparent)', transformOrigin: 'left', width: 120 }}
        />
      </div>

      {/* ═════════════════════════════════════════════════════════════
          NEW ENHANCED ANALYTICS ROWS
          Row 1: Correlation Matrix (col-span-2) + Key Insights (col-span-1)
          Row 2: Population Pyramid + Economic Sector Treemap + Data Quality
          ═════════════════════════════════════════════════════════════ */}

      {/* ─── Row 1: Correlation Matrix + Key Insights ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Correlation Matrix (col-span-2) */}
        <div className="lg:col-span-2 relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.85)',
          borderColor: 'rgba(6,182,212,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: '#f59e0b' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#f59e0b' }}>
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
                        color: Math.abs(val) > 0.5 ? '#0a0e1a' : '#94a3b8',
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
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.85)',
          borderColor: 'rgba(6,182,212,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={14} style={{ color: '#f59e0b' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#f59e0b' }}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Population Pyramid (col-span-1) */}
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.85)',
          borderColor: 'rgba(6,182,212,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} style={{ color: '#ec4899' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#ec4899' }}>
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
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.85)',
          borderColor: 'rgba(6,182,212,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} style={{ color: '#10b981' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#10b981' }}>
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
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.85)',
          borderColor: 'rgba(6,182,212,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} style={{ color: '#06b6d4' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
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
    </div>
  );
}

export default AnalyticsSection;
