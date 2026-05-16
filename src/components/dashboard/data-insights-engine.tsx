'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Briefcase, ArrowUpRight, Database, Activity, Zap,
} from 'lucide-react';
import { DATASETS } from '@/lib/data/datasets';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';

// ─── Insight Card ─────────────────────────────────────────────────
interface InsightCardData {
  id: string;
  icon: React.ElementType;
  color: string;
  title_en: string;
  title_ms: string;
  desc_en: string;
  desc_ms: string;
  viz: React.ReactNode;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ─── Mini Visualizations ──────────────────────────────────────────

function EconomicBarViz() {
  // Selangor vs KL vs Others GDP contribution
  const selangor = 21.6;
  const kl = 14.8;
  const others = 100 - selangor - kl;
  return (
    <div className="flex items-end gap-1.5 h-10 mt-2">
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-6 rounded-t" style={{ height: `${selangor * 0.38}px`, background: 'linear-gradient(180deg, #f59e0b, #f59e0b60)' }} />
        <span className="text-[7px] font-mono" style={{ color: '#f59e0b' }}>SGR</span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-6 rounded-t" style={{ height: `${kl * 0.38}px`, background: 'linear-gradient(180deg, #f59e0bcc, #f59e0b40)' }} />
        <span className="text-[7px] font-mono" style={{ color: '#f59e0b' }}>KUL</span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-6 rounded-t" style={{ height: `${others * 0.38}px`, background: 'linear-gradient(180deg, #f59e0b66, #f59e0b20)' }} />
        <span className="text-[7px] font-mono" style={{ color: '#64748b' }}>OTH</span>
      </div>
      <div className="ml-1.5 flex flex-col justify-end">
        <span className="text-[9px] font-mono font-bold" style={{ color: '#f59e0b' }}>36.4%</span>
        <span className="text-[7px] font-mono" style={{ color: '#64748b' }}>GDP</span>
      </div>
    </div>
  );
}

function DensityGapViz() {
  // KL density vs Sarawak density
  const klDensity = 7984;
  const swkDensity = 23;
  const maxBar = 50;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-[7px] font-mono w-6" style={{ color: '#ec4899' }}>KUL</span>
        <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(236,72,153,0.1)' }}>
          <div className="h-full rounded-full" style={{ width: '100%', background: 'linear-gradient(90deg, #ec4899, #ec489960)' }} />
        </div>
        <span className="text-[8px] font-mono" style={{ color: '#ec4899' }}>7,984/km²</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[7px] font-mono w-6" style={{ color: '#64748b' }}>SRK</span>
        <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(236,72,153,0.05)' }}>
          <div className="h-full rounded-full" style={{ width: `${(swkDensity / klDensity) * 100}%`, background: 'linear-gradient(90deg, #ec489940, #ec489915)' }} />
        </div>
        <span className="text-[8px] font-mono" style={{ color: '#64748b' }}>23/km²</span>
      </div>
      <div className="text-center">
        <span className="text-[9px] font-mono font-bold" style={{ color: '#ec4899' }}>160×</span>
      </div>
    </div>
  );
}

function EmploymentRangeViz() {
  // Range from 2.1% to 5.2%
  const min = 2.1;
  const max = 5.2;
  const range = max - min;
  return (
    <div className="mt-2">
      <div className="relative h-3 rounded-full" style={{ background: 'rgba(16,185,129,0.1)' }}>
        <div className="absolute inset-y-0 rounded-full" style={{
          left: `${((min - 1) / range) * 100}%`,
          right: `${((6 - max) / range) * 100}%`,
          background: 'linear-gradient(90deg, #10b98140, #10b981, #10b98140)',
        }} />
        {/* Selangor marker */}
        <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border" style={{
          left: `${((2.8 - 1) / range) * 100}%`,
          background: '#10b981',
          borderColor: '#10b981',
          transform: 'translate(-50%, -50%)',
        }} />
        {/* Sabah marker */}
        <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border" style={{
          left: `${((5.2 - 1) / range) * 100}%`,
          background: '#ef4444',
          borderColor: '#ef4444',
          transform: 'translate(-50%, -50%)',
        }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[8px] font-mono" style={{ color: '#10b981' }}>2.1% SGR</span>
        <span className="text-[8px] font-mono" style={{ color: '#ef4444' }}>5.2% SBH</span>
      </div>
    </div>
  );
}

function GrowthLeadersViz() {
  const leaders = [
    { name: 'PNG', name_ms: 'PNG', growth: 5.8, medal: '🥇' },
    { name: 'SGR', name_ms: 'SGR', growth: 5.6, medal: '🥈' },
    { name: 'JHR', name_ms: 'JHR', growth: 4.2, medal: '🥉' },
  ];
  return (
    <div className="mt-2 space-y-1.5">
      {leaders.map((l, i) => (
        <div key={l.name} className="flex items-center gap-2">
          <span className="text-xs">{l.medal}</span>
          <span className="text-[9px] font-mono w-6" style={{ color: '#06b6d4' }}>{l.name}</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, #06b6d4, #06b6d4${60 - i * 15})` }}
              initial={{ width: 0 }}
              animate={{ width: `${(l.growth / 6) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
            />
          </div>
          <span className="text-[9px] font-mono font-bold" style={{ color: '#06b6d4' }}>{l.growth}%</span>
        </div>
      ))}
    </div>
  );
}

function DataCoverageViz() {
  // Mini donut showing category distribution (top 5)
  const segments = [
    { pct: 42, color: '#06b6d4' },
    { pct: 18, color: '#f59e0b' },
    { pct: 14, color: '#8b5cf6' },
    { pct: 12, color: '#10b981' },
    { pct: 14, color: '#64748b' },
  ];
  const size = 40;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="mt-2 flex items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => {
          const segLength = (seg.pct / 100) * circumference;
          const currentOffset = offset;
          offset += segLength;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segLength} ${circumference - segLength}`}
              strokeDashoffset={-currentOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ opacity: 0.8 }}
            />
          );
        })}
      </svg>
      <div className="space-y-0.5">
        <div className="text-[9px] font-mono font-bold" style={{ color: '#8b5cf6' }}>287</div>
        <div className="text-[7px] font-mono" style={{ color: '#64748b' }}>datasets</div>
      </div>
    </div>
  );
}

function DemographicTrendViz() {
  // Declining trend line mini chart
  const points = [4.8, 4.6, 4.4, 4.2, 3.9, 3.7];
  const maxVal = 5.2;
  const minVal = 3.4;
  const range = maxVal - minVal;
  const w = 80;
  const h = 24;
  const pathD = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - minVal) / range) * h;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  return (
    <div className="mt-2">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <defs>
          <linearGradient id="declineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`${pathD} L${w},${h} L0,${h} Z`} fill="url(#declineGrad)" />
        <path d={pathD} fill="none" stroke="#ef4444" strokeWidth={1.5} />
        {points.map((p, i) => {
          const x = (i / (points.length - 1)) * w;
          const y = h - ((p - minVal) / range) * h;
          return <circle key={i} cx={x} cy={y} r={1.5} fill="#ef4444" />;
        })}
      </svg>
      <div className="flex justify-between mt-0.5">
        <span className="text-[7px] font-mono" style={{ color: '#64748b' }}>2019</span>
        <span className="text-[7px] font-mono" style={{ color: '#64748b' }}>2024</span>
      </div>
    </div>
  );
}

// ─── Data Insights Engine ─────────────────────────────────────────
export function DataInsightsEngine({ lang }: { lang: Lang }) {
  const agencies = useMemo(() => {
    const counts: Record<string, number> = {};
    DATASETS.forEach(d => { d.data_source.forEach(s => { counts[s] = (counts[s] || 0) + 1; }); });
    return Object.keys(counts).length;
  }, []);

  const insights: InsightCardData[] = [
    {
      id: 'economic-powerhouse',
      icon: TrendingUp,
      color: '#f59e0b',
      title_en: 'Economic Powerhouse',
      title_ms: 'Kuasa Ekonomi',
      desc_en: 'Selangor & KL contribute 36.4% of national GDP',
      desc_ms: 'Selangor & KL menyumbang 36.4% KDNK negara',
      viz: <EconomicBarViz />,
    },
    {
      id: 'density-gap',
      icon: Users,
      color: '#ec4899',
      title_en: 'Population Density Gap',
      title_ms: 'Jurang Ketumpatan Penduduk',
      desc_en: 'WP Kuala Lumpur is 160× denser than Sarawak',
      desc_ms: 'WP Kuala Lumpur 160× lebih padat daripada Sarawak',
      viz: <DensityGapViz />,
    },
    {
      id: 'employment-divide',
      icon: Briefcase,
      color: '#10b981',
      title_en: 'Employment Divide',
      title_ms: 'Pembahagian Pekerjaan',
      desc_en: 'Unemployment ranges from 2.1% (Selangor) to 5.2% (Sabah)',
      desc_ms: 'Pengangguran daripada 2.1% (Selangor) hingga 5.2% (Sabah)',
      viz: <EmploymentRangeViz />,
    },
    {
      id: 'growth-leaders',
      icon: ArrowUpRight,
      color: '#06b6d4',
      title_en: 'Growth Leaders',
      title_ms: 'Pemimpin Pertumbuhan',
      desc_en: 'Top 3 GDP growth: Penang 5.8%, Selangor 5.2%, Johor 4.8%',
      desc_ms: '3 Teratas Pertumbuhan KDNK: Pulau Pinang 5.8%, Selangor 5.2%, Johor 4.8%',
      viz: <GrowthLeadersViz />,
    },
    {
      id: 'data-coverage',
      icon: Database,
      color: '#8b5cf6',
      title_en: 'Data Coverage',
      title_ms: 'Liputan Data',
      desc_en: `287 datasets across 18 categories from ${agencies} agencies`,
      desc_ms: `287 set data merentasi 18 kategori daripada ${agencies} agensi`,
      viz: <DataCoverageViz />,
    },
    {
      id: 'demographic-trend',
      icon: Activity,
      color: '#ef4444',
      title_en: 'Demographic Trend',
      title_ms: 'Trend Demografi',
      desc_en: 'Birth rate declining 1.2% annually since 2019',
      desc_ms: 'Kadar kelahiran menurun 1.2% setahun sejak 2019',
      viz: <DemographicTrendViz />,
    },
  ];

  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'rgba(10,14,26,0.85)',
      borderColor: 'rgba(6,182,212,0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <HUDBracket />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Zap size={14} style={{ color: '#06b6d4' }} />
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap size={14} style={{ color: '#06b6d4' }} />
          </motion.div>
        </div>
        <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'ENJIN PANDANGAN DATA' : 'DATA INSIGHTS ENGINE'}
        </span>
        <SectionHeaderLine color="#06b6d4" delay={0.3} />
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] font-mono text-emerald-400">AI ACTIVE</span>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {insights.map((insight) => {
          const IconComp = insight.icon;
          return (
            <motion.div
              key={insight.id}
              variants={staggerItem}
              whileHover={{ scale: 1.02, boxShadow: `0 0 15px ${insight.color}20` }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="rounded-lg p-3 cursor-default"
              style={{
                background: 'rgba(10,14,26,0.6)',
                borderLeft: `3px solid ${insight.color}`,
                border: `1px solid ${insight.color}15`,
                borderLeftWidth: '3px',
                borderLeftColor: insight.color,
              }}
            >
              <div className="flex items-start gap-2.5">
                {/* Icon with colored background circle */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                  background: `${insight.color}15`,
                }}>
                  <IconComp size={14} style={{ color: insight.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono font-bold tracking-wide" style={{ color: insight.color }}>
                    {lang === 'ms' ? insight.title_ms : insight.title_en}
                  </div>
                  <div className="text-[9px] font-mono mt-0.5 leading-relaxed" style={{ color: '#b0bec5' }}>
                    {lang === 'ms' ? insight.desc_ms : insight.desc_en}
                  </div>
                </div>
              </div>
              {/* Mini visualization */}
              <div className="mt-1">
                {insight.viz}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default DataInsightsEngine;
