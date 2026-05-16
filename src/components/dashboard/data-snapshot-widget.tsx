'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Lang } from '@/lib/dashboard-types';
import { SectionHeaderLine } from '@/components/dashboard/particle-background';

// ─── Types ────────────────────────────────────────────────────────
interface DataSnapshotWidgetProps {
  lang: Lang;
  onMetricClick?: (metric: string) => void;
}

// ─── Sparkline SVG ────────────────────────────────────────────────
function Sparkline({ data, color, width = 24, height = 12 }: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
    </svg>
  );
}

// ─── Metric Box ───────────────────────────────────────────────────
function MetricBox({ label, value, trend, trendColor, sparkData, sparkColor, tooltip, onClick }: {
  label: string;
  value: string;
  trend: string;
  trendColor: string;
  sparkData: number[];
  sparkColor: string;
  tooltip: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
      style={{
        background: hovered ? 'rgba(10,14,26,0.4)' : 'rgba(10,14,26,0.6)',
        border: `1px solid ${hovered ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.08)'}`,
        boxShadow: hovered ? '0 0 12px rgba(6,182,212,0.15)' : 'none',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      title={tooltip}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[9px] font-mono tracking-wide" style={{ color: '#64748b' }}>{label}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold font-mono" style={{ color: '#e0f7fa' }}>{value}</span>
          <span className="text-[9px] font-mono font-bold" style={{ color: trendColor }}>{trend}</span>
        </div>
      </div>
      <div className="flex-shrink-0 opacity-60">
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
    </motion.div>
  );
}

// ─── Data Snapshot Widget ─────────────────────────────────────────
export function DataSnapshotWidget({ lang, onMetricClick }: DataSnapshotWidgetProps) {
  const metrics = [
    {
      key: 'population',
      label: lang === 'ms' ? 'Penduduk' : 'Population',
      value: '33.8M',
      trend: '↑',
      trendColor: '#10b981',
      sparkData: [31.2, 31.8, 32.3, 32.7, 33.2, 33.8],
      sparkColor: '#10b981',
      tooltip: lang === 'ms'
        ? 'Jumlah penduduk Malaysia (anggaran 2024) — Klik untuk menerokai'
        : 'Total population of Malaysia (2024 est.) — Click to explore',
    },
    {
      key: 'gdp',
      label: lang === 'ms' ? 'KDNK' : 'GDP',
      value: 'RM1.68T',
      trend: '↑',
      trendColor: '#10b981',
      sparkData: [1.42, 1.48, 1.52, 1.56, 1.62, 1.68],
      sparkColor: '#f59e0b',
      tooltip: lang === 'ms'
        ? 'Keluaran Dalam Negara Kasar pada harga semasa — Klik untuk menerokai'
        : 'Gross Domestic Product at current prices — Click to explore',
    },
    {
      key: 'births',
      label: lang === 'ms' ? 'Kelahiran' : 'Births',
      value: '455K',
      trend: '↓',
      trendColor: '#ef4444',
      sparkData: [500, 490, 478, 468, 460, 455],
      sparkColor: '#ef4444',
      tooltip: lang === 'ms'
        ? 'Jumlah kelahiran hidup yang didaftarkan — Klik untuk menerokai'
        : 'Total live births registered — Click to explore',
    },
    {
      key: 'density',
      label: lang === 'ms' ? 'Ketumpatan' : 'Density',
      value: '99/km²',
      trend: '↑',
      trendColor: '#10b981',
      sparkData: [95, 96, 96.5, 97, 98, 99],
      sparkColor: '#06b6d4',
      tooltip: lang === 'ms'
        ? 'Purata ketumpatan penduduk per km² — Klik untuk menerokai'
        : 'Average population density per km² — Click to explore',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.4)' }}>
          {lang === 'ms' ? 'PETIKA DATA' : 'DATA SNAPSHOT'}
        </span>
        <SectionHeaderLine color="#06b6d4" delay={0.2} />
      </div>
      <div className="flex gap-2 max-h-20">
        {metrics.map((m, i) => (
          <MetricBox
            key={i}
            label={m.label}
            value={m.value}
            trend={m.trend}
            trendColor={m.trendColor}
            sparkData={m.sparkData}
            sparkColor={m.sparkColor}
            tooltip={m.tooltip}
            onClick={() => onMetricClick?.(m.key)}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default DataSnapshotWidget;
