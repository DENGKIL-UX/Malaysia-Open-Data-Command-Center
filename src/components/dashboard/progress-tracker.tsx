'use client';

import { motion } from 'framer-motion';
import {
  Trophy, Clock, MapPin, BarChart3,
} from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';

// ─── Types ────────────────────────────────────────────────────────
interface ProgressTrackerProps {
  lang: Lang;
}

// ─── Achievement Data ─────────────────────────────────────────────
const ACHIEVEMENTS = [
  {
    id: 'first-look',
    icon: '🌟',
    name_en: 'First Look',
    name_ms: 'Pandangan Pertama',
    desc_en: 'Viewed first dataset',
    desc_ms: 'Melihat set data pertama',
    unlocked: true,
    progress: 1,
    target: 1,
  },
  {
    id: 'data-scout',
    icon: '🔍',
    name_en: 'Data Scout',
    name_ms: 'Pengakap Data',
    desc_en: 'Viewed 10 datasets',
    desc_ms: 'Melihat 10 set data',
    unlocked: true,
    progress: 10,
    target: 10,
  },
  {
    id: 'analyst',
    icon: '📊',
    name_en: 'Analyst',
    name_ms: 'Penganalisis',
    desc_en: 'Viewed 25 datasets',
    desc_ms: 'Melihat 25 set data',
    unlocked: true,
    progress: 25,
    target: 25,
  },
  {
    id: 'cartographer',
    icon: '🗺️',
    name_en: 'Cartographer',
    name_ms: 'Pembuat Peta',
    desc_en: 'Explored all map layers',
    desc_ms: 'Menerokai semua lapisan peta',
    unlocked: true,
    progress: 6,
    target: 6,
  },
  {
    id: 'explorer',
    icon: '🏆',
    name_en: 'Explorer',
    name_ms: 'Penjelajah',
    desc_en: 'Viewed 50 datasets',
    desc_ms: 'Melihat 50 set data',
    unlocked: false,
    progress: 45,
    target: 50,
  },
  {
    id: 'data-master',
    icon: '👑',
    name_en: 'Data Master',
    name_ms: 'Pakar Data',
    desc_en: 'Viewed 100 datasets',
    desc_ms: 'Melihat 100 set data',
    unlocked: false,
    progress: 45,
    target: 100,
  },
];

// ─── Component ────────────────────────────────────────────────────
export function ProgressTracker({ lang }: ProgressTrackerProps) {
  const exploredCount = 45;
  const totalDatasets = 287;
  const progressPct = ((exploredCount / totalDatasets) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative group rounded-xl border p-5"
      style={{
        background: 'linear-gradient(180deg, rgba(6,182,212,0.03) 0%, rgba(10,14,26,0.85) 30%)',
        borderColor: 'rgba(6,182,212,0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.06)',
      }}
    >
      <HUDBracket />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={16} style={{ color: '#f59e0b' }} />
        <div>
          <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#f59e0b', textShadow: '0 0 8px rgba(245,158,11,0.4)' }}>
            {lang === 'ms' ? 'KEMAJUAN PENEROKAAN' : 'EXPLORATION PROGRESS'}
          </span>
          <SectionHeaderLine color="#f59e0b" delay={0.2} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono" style={{ color: '#b0bec5' }}>
            {lang === 'ms' ? 'Set Data Diterokai' : 'Datasets Explored'}: <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>{exploredCount}</span>/{totalDatasets}
          </span>
          <span className="text-[9px] font-mono font-bold" style={{ color: '#10b981' }}>{progressPct}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{
          background: 'rgba(10,14,26,0.6)',
          border: '1px solid rgba(6,182,212,0.1)',
        }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #10b981)',
              boxShadow: '0 0 8px rgba(6,182,212,0.4)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          />
        </div>
        <div className="text-[8px] font-mono mt-1" style={{ color: 'rgba(6,182,212,0.4)' }}>
          {lang === 'ms' ? 'Teruskan penerokaan!' : 'Keep exploring!'}
        </div>
      </div>

      {/* Achievement Badges Row */}
      <div className="mb-4">
        <div className="text-[9px] font-mono tracking-wider mb-2" style={{ color: 'rgba(245,158,11,0.5)' }}>
          {lang === 'ms' ? 'LOKING PENCAPAIAN' : 'ACHIEVEMENTS'}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {ACHIEVEMENTS.map((badge, i) => (
            <motion.div
              key={badge.id}
              className="flex flex-col items-center gap-1 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center text-base"
                style={{
                  background: badge.unlocked ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.08)',
                  border: `2px solid ${badge.unlocked ? '#f59e0b' : 'rgba(100,116,139,0.2)'}`,
                  boxShadow: badge.unlocked ? '0 0 10px rgba(245,158,11,0.2)' : 'none',
                  opacity: badge.unlocked ? 1 : 0.4,
                }}
                animate={badge.unlocked ? {
                  boxShadow: [
                    '0 0 10px rgba(245,158,11,0.2)',
                    '0 0 16px rgba(245,158,11,0.35)',
                    '0 0 10px rgba(245,158,11,0.2)',
                  ],
                } : {}}
                transition={badge.unlocked ? {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                } : {}}
                title={lang === 'ms' ? badge.desc_ms : badge.desc_en}
              >
                {badge.icon}
              </motion.div>
              <span className="text-[7px] font-mono text-center max-w-[48px] truncate" style={{
                color: badge.unlocked ? '#f59e0b' : 'rgba(100,116,139,0.4)',
              }}>
                {lang === 'ms' ? badge.name_ms : badge.name_en}
              </span>
              {!badge.unlocked && (
                <span className="text-[7px] font-mono" style={{ color: 'rgba(100,116,139,0.35)' }}>
                  {badge.progress}/{badge.target}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Session Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Clock, label_en: 'Time Today', label_ms: 'Masa Hari Ini', value: '12m', color: '#06b6d4' },
          { icon: MapPin, label_en: 'States Viewed', label_ms: 'Negeri Dilihat', value: '8/19', color: '#f59e0b' },
          { icon: BarChart3, label_en: 'Charts Generated', label_ms: 'Carta Dijana', value: '3', color: '#10b981' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md"
              style={{
                background: 'rgba(10,14,26,0.4)',
                border: '1px solid rgba(6,182,212,0.06)',
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <Icon size={12} style={{ color: stat.color, flexShrink: 0 }} />
              <div className="min-w-0">
                <div className="text-[8px] font-mono truncate" style={{ color: 'rgba(148,163,184,0.5)' }}>
                  {lang === 'ms' ? stat.label_ms : stat.label_en}
                </div>
                <div className="text-[11px] font-mono font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default ProgressTracker;
