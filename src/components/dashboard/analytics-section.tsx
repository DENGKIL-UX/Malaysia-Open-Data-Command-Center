'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Activity, Database, Layers,
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* GDP Trend Area Chart */}
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.95)',
          borderColor: 'rgba(6,182,212,0.12)',
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
          background: 'rgba(10,14,26,0.95)',
          borderColor: 'rgba(6,182,212,0.12)',
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
                <span className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution Bar Chart */}
      <div className="relative group rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(6,182,212,0.12)',
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
            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip contentStyle={{ background: '#0a0e1a', border: '1px solid #06b6d430', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {catDist.map((_, i) => <Cell key={i} fill={DATASET_CATEGORIES[i % DATASET_CATEGORIES.length]?.color || '#06b6d4'} opacity={0.7} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* State Matrix */}
      <div className="relative group rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(6,182,212,0.12)',
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
                  <td className="px-2 py-1.5" style={{ color: '#e0f7fa' }}>{s.abbr}</td>
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
    </div>
  );
}

export default AnalyticsSection;
