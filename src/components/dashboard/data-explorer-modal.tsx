'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, TrendingUp, Baby, Briefcase, Database,
  ArrowUpRight, ArrowDownRight, Trophy, Minus,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { STATES, MALAYSIA_TOTALS } from '@/lib/data/malaysia-data';
import { HUDBracket } from '@/components/dashboard/particle-background';

// ─── Types ──────────────────────────────────────────────────────────
type MetricKey = 'population' | 'gdp' | 'gdpGrowth' | 'births' | 'unemployment' | 'datasets';

interface DataExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  metricKey: MetricKey;
  lang: 'en' | 'ms';
}

// ─── Metric Config ──────────────────────────────────────────────────
const METRIC_CONFIG: Record<MetricKey, {
  icon: React.ElementType;
  label_en: string;
  label_ms: string;
  unit: string;
  color: string;
  formatValue: (v: number) => string;
  higherIsBetter: boolean;
}> = {
  population: {
    icon: Users,
    label_en: 'Population',
    label_ms: 'Populasi',
    unit: "'000",
    color: '#06b6d4',
    formatValue: (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}M` : `${v.toFixed(0)}K`,
    higherIsBetter: true,
  },
  gdp: {
    icon: TrendingUp,
    label_en: 'Gross Domestic Product',
    label_ms: 'Keluaran Dalam Negeri',
    unit: 'RM M',
    color: '#f59e0b',
    formatValue: (v) => v >= 1000000 ? `RM ${(v / 1000000).toFixed(2)}T` : v >= 1000 ? `RM ${(v / 1000).toFixed(1)}B` : `RM ${v.toFixed(0)}M`,
    higherIsBetter: true,
  },
  gdpGrowth: {
    icon: TrendingUp,
    label_en: 'GDP Growth Rate',
    label_ms: 'Kadar Pertumbuhan KDNK',
    unit: '%',
    color: '#10b981',
    formatValue: (v) => `${v.toFixed(1)}%`,
    higherIsBetter: true,
  },
  births: {
    icon: Baby,
    label_en: 'Births',
    label_ms: 'Kelahiran',
    unit: "'000",
    color: '#ec4899',
    formatValue: (v) => `${v.toFixed(1)}K`,
    higherIsBetter: true,
  },
  unemployment: {
    icon: Briefcase,
    label_en: 'Unemployment Rate',
    label_ms: 'Kadar Pengangguran',
    unit: '%',
    color: '#8b5cf6',
    formatValue: (v) => `${v.toFixed(1)}%`,
    higherIsBetter: false,
  },
  datasets: {
    icon: Database,
    label_en: 'Available Datasets',
    label_ms: 'Set Data Tersedia',
    unit: '',
    color: '#ec4899',
    formatValue: (v) => v.toString(),
    higherIsBetter: true,
  },
};

// ─── Simulated Time-Series Data Generator ───────────────────────────
function generateTimeSeries(metricKey: MetricKey): Record<string, { year: number; value: number; change: number }[]> {
  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const multipliers: Record<MetricKey, number[]> = {
    population: [0.94, 0.96, 0.97, 0.98, 0.99, 1.0],
    gdp: [0.89, 0.85, 0.91, 0.96, 0.98, 1.0],
    gdpGrowth: [4.3, -5.3, 3.7, 3.7, 4.5, 5.1],
    births: [1.08, 1.05, 1.0, 0.97, 0.95, 0.93],
    unemployment: [3.3, 3.4, 4.6, 4.2, 3.8, 3.4],
    datasets: [0.88, 0.91, 0.94, 0.97, 0.99, 1.0],
  };

  const result: Record<string, { year: number; value: number; change: number }[]> = {};

  // National data
  result['national'] = years.map((year, i) => {
    const multi = multipliers[metricKey];
    let value: number;
    if (metricKey === 'gdpGrowth') {
      value = multi[i];
    } else if (metricKey === 'unemployment') {
      value = multi[i];
    } else {
      const currentVal = MALAYSIA_TOTALS[metricKey as keyof typeof MALAYSIA_TOTALS] as number;
      value = currentVal * multi[i];
    }
    const prevVal = i > 0
      ? (metricKey === 'gdpGrowth' || metricKey === 'unemployment'
        ? multi[i - 1]
        : (MALAYSIA_TOTALS[metricKey as keyof typeof MALAYSIA_TOTALS] as number) * multi[i - 1])
      : value;
    const change = prevVal !== 0 ? ((value - prevVal) / Math.abs(prevVal)) * 100 : 0;
    return { year, value, change };
  });

  // State data
  STATES.forEach(state => {
    const stateKey = state.id;
    const currentVal = state[metricKey as keyof typeof state] as number;
    const baseMulti = multipliers[metricKey];

    // Add state-specific offset for variety
    const stateOffsets: Record<string, number> = {};
    STATES.forEach(s => {
      stateOffsets[s.id] = (Math.random() - 0.5) * 0.04;
    });

    result[stateKey] = years.map((year, i) => {
      let value: number;
      if (metricKey === 'gdpGrowth') {
        value = baseMulti[i] + (currentVal - 4.5) * 0.8 + (stateOffsets[stateKey] || 0) * 10;
      } else if (metricKey === 'unemployment') {
        value = baseMulti[i] + (currentVal - 3.4) * 0.7 + (stateOffsets[stateKey] || 0) * 5;
      } else {
        value = currentVal * (baseMulti[i] + (stateOffsets[stateKey] || 0));
      }
      const prevVal = i > 0
        ? (metricKey === 'gdpGrowth' || metricKey === 'unemployment'
          ? baseMulti[i - 1] + (currentVal - 4.5) * 0.8 + (stateOffsets[stateKey] || 0) * 10
          : currentVal * (baseMulti[i - 1] + (stateOffsets[stateKey] || 0)))
        : value;
      const change = prevVal !== 0 ? ((value - prevVal) / Math.abs(prevVal)) * 100 : 0;
      return { year, value, change };
    });
  });

  return result;
}

// ─── Data Explorer Modal ────────────────────────────────────────────
export function DataExplorerModal({ isOpen, onClose, metricKey, lang }: DataExplorerProps) {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const config = METRIC_CONFIG[metricKey];
  const Icon = config.icon;

  // Generate time-series data once
  const timeSeriesData = useMemo(() => generateTimeSeries(metricKey), [metricKey]);

  // Get chart data for selected state or national
  const chartData = useMemo(() => {
    const key = selectedStateId || 'national';
    return timeSeriesData[key] || timeSeriesData['national'];
  }, [selectedStateId, timeSeriesData]);

  // Current value
  const currentValue = chartData[chartData.length - 1]?.value ?? 0;

  // YoY change
  const yoyChange = chartData[chartData.length - 1]?.change ?? 0;

  // 5-Year CAGR
  const cagr = useMemo(() => {
    if (chartData.length < 2) return 0;
    const firstVal = chartData[0].value;
    const lastVal = chartData[chartData.length - 1].value;
    if (firstVal <= 0) return 0;
    const years = chartData.length - 1;
    return (Math.pow(lastVal / firstVal, 1 / years) - 1) * 100;
  }, [chartData]);

  // National rank for selected state
  const nationalRank = useMemo(() => {
    if (!selectedStateId) return null;
    const sorted = [...STATES].sort((a, b) => {
      const aVal = a[metricKey as keyof typeof a] as number;
      const bVal = b[metricKey as keyof typeof b] as number;
      return config.higherIsBetter ? bVal - aVal : aVal - bVal;
    });
    return sorted.findIndex(s => s.id === selectedStateId) + 1;
  }, [selectedStateId, metricKey, config.higherIsBetter]);

  // Sorted states for ranking table
  const sortedStates = useMemo(() => {
    return [...STATES].sort((a, b) => {
      const aVal = a[metricKey as keyof typeof a] as number;
      const bVal = b[metricKey as keyof typeof b] as number;
      return config.higherIsBetter ? bVal - aVal : aVal - bVal;
    });
  }, [metricKey, config.higherIsBetter]);

  // Max value for bar width calculation
  const maxValue = useMemo(() => {
    const vals = sortedStates.map(s => s[metricKey as keyof typeof s] as number);
    return Math.max(...vals);
  }, [sortedStates, metricKey]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const formatVal = useCallback((v: number) => {
    if (metricKey === 'population') return `${(v / 1000).toFixed(1)}M`;
    if (metricKey === 'gdp') return v >= 1000000 ? `RM ${(v / 1000000).toFixed(2)}T` : v >= 1000 ? `RM ${(v / 1000).toFixed(1)}B` : `RM ${v.toFixed(0)}M`;
    if (metricKey === 'gdpGrowth' || metricKey === 'unemployment') return `${v.toFixed(1)}%`;
    if (metricKey === 'births') return `${v.toFixed(1)}K`;
    return v.toFixed(0);
  }, [metricKey]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#ffd700'; // Gold
    if (rank === 2) return '#c0c0c0'; // Silver
    if (rank === 3) return '#cd7f32'; // Bronze
    return '#64748b';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full sm:max-w-4xl sm:mx-4 max-h-[92vh] overflow-y-auto custom-scrollbar rounded-t-xl sm:rounded-xl border"
            style={{
              background: 'rgba(10,14,26,0.97)',
              borderColor: 'rgba(6,182,212,0.2)',
              boxShadow: `0 0 40px ${config.color}15, 0 0 80px rgba(0,0,0,0.6)`,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <HUDBracket />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110"
              style={{
                background: 'rgba(10,14,26,0.8)',
                borderColor: 'rgba(6,182,212,0.2)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Close"
            >
              <X size={14} style={{ color: '#06b6d4' }} />
            </button>

            <div className="p-4 sm:p-6 space-y-4">
              {/* ─── Header ────────────────────────────────────────── */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  background: `${config.color}15`,
                  border: `1px solid ${config.color}25`,
                }}>
                  <Icon size={20} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono tracking-wider" style={{ color: config.color }}>
                    {lang === 'ms' ? config.label_ms : config.label_en}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold font-mono" style={{
                      color: '#e0f7fa',
                      textShadow: `0 0 20px ${config.color}30`,
                    }}>
                      {config.formatValue(currentValue)}
                    </span>
                    <span className="text-xs font-mono" style={{ color: '#64748b' }}>{config.unit}</span>
                    {selectedStateId && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{
                        background: `${config.color}15`,
                        color: config.color,
                        border: `1px solid ${config.color}25`,
                      }}>
                        {STATES.find(s => s.id === selectedStateId)?.name || selectedStateId}
                      </span>
                    )}
                  </div>
                  {/* Mini sparkline from chart data */}
                  <div className="mt-1">
                    <svg width="100" height="20" viewBox="0 0 100 20">
                      <defs>
                        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={config.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      {chartData.length >= 2 && (() => {
                        const vals = chartData.map(d => d.value);
                        const min = Math.min(...vals);
                        const max = Math.max(...vals);
                        const range = max - min || 1;
                        const pathD = vals.map((v, i) => {
                          const x = (i / (vals.length - 1)) * 100;
                          const y = 18 - ((v - min) / range) * 16;
                          return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                        }).join(' ');
                        return (
                          <>
                            <path d={`${pathD} L100,20 L0,20 Z`} fill="url(#sparkGrad)" />
                            <path d={pathD} fill="none" stroke={config.color} strokeWidth={1.5} />
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>
              </div>

              {/* ─── Top Stats Row ─────────────────────────────────── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    label_en: 'Current Value',
                    label_ms: 'Nilai Semasa',
                    value: config.formatValue(currentValue),
                    sub: config.unit,
                    color: config.color,
                  },
                  {
                    label_en: 'YoY Change',
                    label_ms: 'Perubahan TtT',
                    value: `${yoyChange >= 0 ? '+' : ''}${yoyChange.toFixed(1)}%`,
                    sub: '',
                    color: yoyChange >= 0 ? (config.higherIsBetter ? '#10b981' : '#ef4444') : (config.higherIsBetter ? '#ef4444' : '#10b981'),
                  },
                  {
                    label_en: '5-Year CAGR',
                    label_ms: 'CAGR 5 Tahun',
                    value: `${cagr >= 0 ? '+' : ''}${cagr.toFixed(1)}%`,
                    sub: '',
                    color: cagr >= 0 ? (config.higherIsBetter ? '#10b981' : '#ef4444') : (config.higherIsBetter ? '#ef4444' : '#10b981'),
                  },
                  {
                    label_en: 'National Rank',
                    label_ms: 'Kedudukan Negara',
                    value: nationalRank ? `#${nationalRank}` : (lang === 'ms' ? 'Nasional' : 'National'),
                    sub: nationalRank ? `/ ${STATES.length}` : '',
                    color: nationalRank ? getRankColor(nationalRank) : '#06b6d4',
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="rounded-lg border p-3"
                    style={{
                      background: 'rgba(10,14,26,0.6)',
                      borderColor: `${stat.color}20`,
                      borderLeft: `2px solid ${stat.color}40`,
                    }}
                  >
                    <div className="text-[8px] font-mono tracking-wider mb-1" style={{ color: '#64748b' }}>
                      {lang === 'ms' ? stat.label_ms : stat.label_en}
                    </div>
                    <div className="text-lg font-bold font-mono" style={{
                      color: stat.color,
                      textShadow: `0 0 10px ${stat.color}30`,
                    }}>
                      {stat.value}
                    </div>
                    {stat.sub && (
                      <div className="text-[8px] font-mono" style={{ color: '#64748b' }}>{stat.sub}</div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* ─── Main Chart Area ───────────────────────────────── */}
              <div className="rounded-lg border p-4" style={{
                background: 'rgba(10,14,26,0.6)',
                borderColor: 'rgba(6,182,212,0.12)',
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
                    <span className="text-xs font-mono tracking-wider" style={{ color: config.color }}>
                      {lang === 'ms' ? 'TREND MENGIKUT MASA' : 'TIME-SERIES TREND'}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono" style={{ color: '#64748b' }}>
                    {selectedStateId
                      ? (STATES.find(s => s.id === selectedStateId)?.name || selectedStateId)
                      : (lang === 'ms' ? 'Keseluruhan Negara' : 'National Aggregate')
                    }
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`areaGrad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={config.color} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={config.color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="year"
                      tick={{ fill: '#a0b0c0', fontSize: 10, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                      label={{
                        value: lang === 'ms' ? 'Tahun' : 'Year',
                        position: 'insideBottom',
                        offset: -5,
                        style: { fill: '#64748b', fontSize: 9, fontFamily: 'monospace' },
                      }}
                    />
                    <YAxis
                      tick={{ fill: '#a0b0c0', fontSize: 9, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                      width={60}
                      tickFormatter={(v: number) => formatVal(v)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0]?.payload as { year?: number; value?: number; change?: number };
                        return (
                          <div style={{
                            background: 'rgba(10,14,26,0.97)',
                            border: `1px solid ${config.color}30`,
                            borderRadius: '8px',
                            boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 15px ${config.color}15`,
                            padding: '8px 12px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                          }}>
                            <div style={{ color: config.color, fontWeight: 'bold', marginBottom: '4px' }}>
                              {data?.year || label}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: config.color }} />
                              <span style={{ color: '#b8c5d4' }}>{lang === 'ms' ? 'Nilai' : 'Value'}:</span>
                              <span style={{ color: '#e0f7fa', fontWeight: 600 }}>{formatVal(data?.value ?? 0)}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: (data?.change ?? 0) >= 0 ? '#10b981' : '#ef4444' }} />
                              <span style={{ color: '#b8c5d4' }}>{lang === 'ms' ? 'Perubahan' : 'Change'}:</span>
                              <span style={{ color: (data?.change ?? 0) >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                {((data?.change ?? 0) >= 0 ? '+' : '')}{data?.change?.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={config.color}
                      strokeWidth={2}
                      fill={`url(#areaGrad-${metricKey})`}
                      dot={{ fill: config.color, r: 3, strokeWidth: 0 }}
                      activeDot={{ fill: config.color, r: 5, stroke: '#0a0e1a', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* ─── Ranking Table ─────────────────────────────────── */}
              <div className="rounded-lg border p-4" style={{
                background: 'rgba(10,14,26,0.6)',
                borderColor: 'rgba(6,182,212,0.12)',
              }}>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={14} style={{ color: '#f59e0b' }} />
                  <span className="text-xs font-mono tracking-wider" style={{ color: '#f59e0b' }}>
                    {lang === 'ms' ? 'KEDUDUKAN NEGERI' : 'STATE RANKING'}
                  </span>
                </div>
                <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar">
                  {sortedStates.map((state, i) => {
                    const stateVal = state[metricKey as keyof typeof state] as number;
                    const barWidth = maxValue > 0 ? (stateVal / maxValue) * 100 : 0;
                    const isSelected = selectedStateId === state.id;
                    const rank = i + 1;
                    const rankColor = getRankColor(rank);

                    return (
                      <motion.div
                        key={state.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all duration-200"
                        style={{
                          background: isSelected ? `${config.color}15` : 'transparent',
                          borderLeft: isSelected ? `2px solid ${config.color}` : '2px solid transparent',
                        }}
                        onClick={() => setSelectedStateId(isSelected ? null : state.id)}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(6,182,212,0.05)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        {/* Rank */}
                        <div className="w-6 text-center flex-shrink-0">
                          {rank <= 3 ? (
                            <span className="text-[10px] font-mono font-bold" style={{ color: rankColor, textShadow: `0 0 6px ${rankColor}40` }}>
                              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono" style={{ color: '#64748b' }}>{rank}</span>
                          )}
                        </div>

                        {/* State Name */}
                        <div className="w-24 sm:w-32 flex-shrink-0 truncate">
                          <span className="text-[10px] font-mono" style={{ color: isSelected ? config.color : '#b0bec5' }}>
                            {lang === 'ms' ? state.name_ms : state.name}
                          </span>
                        </div>

                        {/* Bar Indicator */}
                        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: `${config.color}08` }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: isSelected
                                ? `linear-gradient(90deg, ${config.color}, ${config.color}80)`
                                : `linear-gradient(90deg, ${config.color}60, ${config.color}20)`,
                              boxShadow: isSelected ? `0 0 6px ${config.color}40` : 'none',
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ duration: 0.6, delay: i * 0.03 }}
                          />
                        </div>

                        {/* Value */}
                        <div className="w-16 sm:w-20 text-right flex-shrink-0">
                          <span className="text-[10px] font-mono font-bold" style={{
                            color: isSelected ? config.color : '#e0f7fa',
                          }}>
                            {formatVal(stateVal)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DataExplorerModal;
