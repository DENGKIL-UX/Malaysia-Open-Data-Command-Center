'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, ArrowRight, ArrowUp, ArrowDown, Minus, Users, TrendingUp, Baby, Briefcase, Database } from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';

// ─── Yearly Data ────────────────────────────────────────────────────
const yearlyData: Record<number, {
  population: number; gdp: number; gdpGrowth: number;
  births: number; unemployment: number; datasets: number;
}> = {
  2020: { population: 32.7, gdp: 1.42, gdpGrowth: -5.3, births: 478, unemployment: 4.6, datasets: 252 },
  2021: { population: 33.0, gdp: 1.49, gdpGrowth: 3.7, births: 468, unemployment: 4.7, datasets: 261 },
  2022: { population: 33.2, gdp: 1.56, gdpGrowth: 3.7, births: 462, unemployment: 3.8, datasets: 270 },
  2023: { population: 33.5, gdp: 1.61, gdpGrowth: 4.5, births: 458, unemployment: 3.6, datasets: 278 },
  2024: { population: 33.8, gdp: 1.68, gdpGrowth: 5.1, births: 455, unemployment: 3.4, datasets: 287 },
};

type MetricId = 'population' | 'gdp' | 'gdpGrowth' | 'births' | 'unemployment' | 'datasets';

const METRICS: {
  id: MetricId;
  label_en: string;
  label_ms: string;
  icon: React.ElementType;
  color: string;
  unit: string;
  formatValue: (v: number) => string;
  higherIsBetter: boolean;
  isPercentagePoint: boolean;
}[] = [
  {
    id: 'population',
    label_en: 'Population',
    label_ms: 'Populasi',
    icon: Users,
    color: '#06b6d4',
    unit: 'M',
    formatValue: (v) => `${v.toFixed(1)}M`,
    higherIsBetter: true,
    isPercentagePoint: false,
  },
  {
    id: 'gdp',
    label_en: 'GDP',
    label_ms: 'KDNK',
    icon: TrendingUp,
    color: '#f59e0b',
    unit: 'RM T',
    formatValue: (v) => `RM ${v.toFixed(2)}T`,
    higherIsBetter: true,
    isPercentagePoint: false,
  },
  {
    id: 'gdpGrowth',
    label_en: 'GDP Growth',
    label_ms: 'Pertumbuhan KDNK',
    icon: TrendingUp,
    color: '#10b981',
    unit: '%',
    formatValue: (v) => `${v.toFixed(1)}%`,
    higherIsBetter: true,
    isPercentagePoint: true,
  },
  {
    id: 'births',
    label_en: 'Births',
    label_ms: 'Kelahiran',
    icon: Baby,
    color: '#ec4899',
    unit: 'K',
    formatValue: (v) => `${v}K`,
    higherIsBetter: true,
    isPercentagePoint: false,
  },
  {
    id: 'unemployment',
    label_en: 'Unemployment',
    label_ms: 'Pengangguran',
    icon: Briefcase,
    color: '#8b5cf6',
    unit: '%',
    formatValue: (v) => `${v.toFixed(1)}%`,
    higherIsBetter: false,
    isPercentagePoint: true,
  },
  {
    id: 'datasets',
    label_en: 'Datasets',
    label_ms: 'Set Data',
    icon: Database,
    color: '#ec4899',
    unit: '',
    formatValue: (v) => v.toString(),
    higherIsBetter: true,
    isPercentagePoint: false,
  },
];

// ─── YoY Comparison Panel ───────────────────────────────────────────
export function YoYComparisonPanel({ lang }: { lang: Lang }) {
  const [yearA, setYearA] = useState(2023);
  const [yearB, setYearB] = useState(2024);

  const years = Object.keys(yearlyData).map(Number).sort();

  const comparisons = useMemo(() => {
    const dataA = yearlyData[yearA];
    const dataB = yearlyData[yearB];
    if (!dataA || !dataB) return [];

    return METRICS.map(metric => {
      const valA = dataA[metric.id];
      const valB = dataB[metric.id];
      const delta = valB - valA;

      let changeStr: string;
      let isPositive: boolean;

      if (metric.isPercentagePoint) {
        changeStr = `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}pp`;
        isPositive = metric.higherIsBetter ? delta >= 0 : delta <= 0;
      } else {
        const pctChange = valA !== 0 ? ((delta / Math.abs(valA)) * 100) : 0;
        changeStr = `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%`;
        isPositive = metric.higherIsBetter ? pctChange >= 0 : pctChange <= 0;
      }

      // Calculate bar width for the change magnitude (normalized)
      const maxDelta = Math.max(
        ...METRICS.map(m => {
          const d = Math.abs(dataB[m.id] - dataA[m.id]);
          return m.isPercentagePoint ? d : (dataA[m.id] !== 0 ? (d / Math.abs(dataA[m.id])) * 100 : 0);
        })
      );
      const thisDelta = metric.isPercentagePoint
        ? Math.abs(delta)
        : (valA !== 0 ? (Math.abs(delta) / Math.abs(valA)) * 100 : 0);
      const barWidth = maxDelta > 0 ? (thisDelta / maxDelta) * 100 : 0;

      return {
        ...metric,
        valA,
        valB,
        delta,
        changeStr,
        isPositive,
        barWidth,
      };
    });
  }, [yearA, yearB]);

  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'rgba(10,14,26,0.85)',
      borderColor: 'rgba(6,182,212,0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <HUDBracket />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <GitCompare size={14} style={{ color: '#06b6d4' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
            {lang === 'ms' ? 'PERBANDINGAN TAHUN-KE-TAHUN' : 'YEAR-OVER-YEAR COMPARISON'}
          </span>
          <SectionHeaderLine color="#06b6d4" delay={0.2} />
        </div>

        {/* Year Selectors */}
        <div className="flex items-center gap-2 ml-auto">
          <select
            value={yearA}
            onChange={e => setYearA(Number(e.target.value))}
            className="rounded border px-2 py-1 text-xs font-mono appearance-none cursor-pointer"
            style={{
              background: 'rgba(10,14,26,0.8)',
              borderColor: 'rgba(6,182,212,0.2)',
              color: '#06b6d4',
            }}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ArrowRight size={14} style={{ color: '#64748b' }} />
          <select
            value={yearB}
            onChange={e => setYearB(Number(e.target.value))}
            className="rounded border px-2 py-1 text-xs font-mono appearance-none cursor-pointer"
            style={{
              background: 'rgba(10,14,26,0.8)',
              borderColor: 'rgba(6,182,212,0.2)',
              color: '#06b6d4',
            }}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {comparisons.map((comp, i) => {
          const Icon = comp.icon;
          return (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-lg border p-3"
              style={{
                background: 'rgba(10,14,26,0.5)',
                borderColor: `${comp.color}15`,
              }}
            >
              {/* Metric Label */}
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={12} style={{ color: comp.color }} />
                <span className="text-[9px] font-mono tracking-wider font-bold" style={{ color: comp.color }}>
                  {lang === 'ms' ? comp.label_ms : comp.label_en}
                </span>
              </div>

              {/* Value Comparison */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 text-right">
                  <div className="text-sm font-bold font-mono" style={{ color: '#b0bec5' }}>
                    {comp.formatValue(comp.valA)}
                  </div>
                  <div className="text-[7px] font-mono" style={{ color: '#64748b' }}>{yearA}</div>
                </div>
                <div className="flex-shrink-0">
                  <ArrowRight size={12} style={{ color: '#475569' }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold font-mono" style={{ color: '#e0f7fa' }}>
                    {comp.formatValue(comp.valB)}
                  </div>
                  <div className="text-[7px] font-mono" style={{ color: '#64748b' }}>{yearB}</div>
                </div>
              </div>

              {/* Delta Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {comp.isPositive ? (
                    <ArrowUp size={10} style={{ color: '#10b981' }} />
                  ) : (
                    <ArrowDown size={10} style={{ color: '#ef4444' }} />
                  )}
                  <span className="text-[10px] font-mono font-bold" style={{
                    color: comp.isPositive ? '#10b981' : '#ef4444',
                  }}>
                    {comp.changeStr}
                  </span>
                </div>

                {/* Tiny bar showing change magnitude */}
                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: `${comp.color}10` }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: comp.isPositive
                        ? `linear-gradient(90deg, #10b98160, #10b981)`
                        : `linear-gradient(90deg, #ef444460, #ef4444)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(comp.barWidth, 100)}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.06 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default YoYComparisonPanel;
