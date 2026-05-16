'use client';

import { motion } from 'framer-motion';
import {
  Users, TrendingUp, ArrowUpRight, ArrowDownRight, Briefcase, Database,
} from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';

interface QuickStatsBarProps {
  lang: Lang;
}

interface StatItem {
  icon: React.ElementType;
  label_en: string;
  label_ms: string;
  value: string;
  trend: number;
  color: string;
}

const STATS: StatItem[] = [
  { icon: Users, label_en: 'Population', label_ms: 'Penduduk', value: '34.3M', trend: 1.1, color: '#06b6d4' },
  { icon: TrendingUp, label_en: 'GDP', label_ms: 'KDNK', value: 'RM 1.68T', trend: 4.5, color: '#f59e0b' },
  { icon: ArrowUpRight, label_en: 'Growth', label_ms: 'Pertumbuhan', value: '4.5%', trend: 0.5, color: '#10b981' },
  { icon: Briefcase, label_en: 'Unemployment', label_ms: 'Pengangguran', value: '3.4%', trend: -0.3, color: '#8b5cf6' },
  { icon: Database, label_en: 'Datasets', label_ms: 'Set Data', value: '287', trend: 12, color: '#ec4899' },
];

export function QuickStatsBar({ lang }: QuickStatsBarProps) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl"
    >
      <div
        className="h-10 rounded-lg border-t border-x border-b flex items-center justify-between px-1 cursor-pointer transition-shadow duration-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        style={{
          background: 'rgba(10,14,26,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'rgba(6,182,212,0.2)',
          borderTopColor: 'rgba(6,182,212,0.4)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 1px rgba(6,182,212,0.2)',
        }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={lang === 'ms' ? 'Tatal ke atas' : 'Scroll to top'}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      >
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend >= 0 ? ArrowUpRight : ArrowDownRight;
          const trendColor = stat.trend >= 0 ? '#10b981' : '#ef4444';

          return (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2.5 py-1 transition-all duration-150 hover:bg-cyan-950/20 rounded"
            >
              <Icon size={11} style={{ color: stat.color, flexShrink: 0 }} />
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono tracking-wider hidden sm:inline" style={{ color: 'rgba(6,182,212,0.4)' }}>
                  {lang === 'ms' ? stat.label_ms : stat.label_en}
                </span>
                <span className="text-[10px] font-mono font-bold" style={{ color: '#e0f7fa' }}>
                  {stat.value}
                </span>
                <TrendIcon size={8} style={{ color: trendColor, flexShrink: 0 }} />
              </div>
            </div>
          );
        })}

        {/* Scroll hint */}
        <div className="flex items-center gap-0.5 px-1.5 flex-shrink-0">
          <span className="text-[7px] font-mono" style={{ color: 'rgba(6,182,212,0.25)' }}>
            ↑ TOP
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default QuickStatsBar;
