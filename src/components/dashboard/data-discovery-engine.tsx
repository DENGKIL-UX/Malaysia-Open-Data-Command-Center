'use client';

import { motion } from 'framer-motion';
import {
  Compass, Flame, Sparkles, ArrowRight, Users, TrendingUp,
  Search, Heart, Briefcase, BarChart3, Shield, Leaf,
} from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';

// ─── Types ────────────────────────────────────────────────────────
interface DataDiscoveryEngineProps {
  lang: Lang;
  onNavigateDatasets?: (category?: string) => void;
}

// ─── Trending Data ────────────────────────────────────────────────
const TRENDING_DATASETS = [
  { rank: 1, title_en: 'Population by State', title_ms: 'Penduduk mengikut Negeri', category: 'Demography', category_ms: 'Demografi', hot: true },
  { rank: 2, title_en: 'GDP by State', title_ms: 'KDNK mengikut Negeri', category: 'National Accounts', category_ms: 'Akaun Negara', hot: true },
  { rank: 3, title_en: 'Labour Force Survey', title_ms: 'Survei Tenaga Buruh', category: 'Labour Markets', category_ms: 'Pasaran Buruh', hot: false },
  { rank: 4, title_en: 'Consumer Price Index', title_ms: 'Indeks Harga Pengguna', category: 'Prices', category_ms: 'Harga', hot: false },
  { rank: 5, title_en: 'Vital Statistics', title_ms: 'Statistik Utama', category: 'Demography', category_ms: 'Demografi', hot: false },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Demography': '#06b6d4',
  'National Accounts': '#f59e0b',
  'Labour Markets': '#8b5cf6',
  'Prices': '#ef4444',
  'Households': '#a855f7',
  'Economic Sectors': '#f97316',
  'Education': '#3b82f6',
  'Healthcare': '#ec4899',
  'Environment': '#22c55e',
};

// ─── Recommended Data ─────────────────────────────────────────────
const RECOMMENDED = [
  { title_en: 'Age Distribution 2024', title_ms: 'Taburan Umur 2024', reason_en: 'Based on Population data', reason_ms: 'Berdasarkan data Penduduk', category: 'Demography', category_ms: 'Demografi' },
  { title_en: 'Household Income', title_ms: 'Pendapatan Isi Rumah', reason_en: 'Related to GDP data', reason_ms: 'Berkaitan dengan data KDNK', category: 'Households', category_ms: 'Isi Rumah' },
  { title_en: 'Trade Statistics', title_ms: 'Statistik Perdagangan', reason_en: 'Frequently co-accessed', reason_ms: 'Sering diakses bersama', category: 'Economic Sectors', category_ms: 'Sektor Ekonomi' },
  { title_en: 'Education Enrollment', title_ms: 'Pendaftaran Pendidikan', reason_en: 'Popular in your category', reason_ms: 'Popular dalam kategori anda', category: 'Education', category_ms: 'Pendidikan' },
];

// ─── Quick Access Data ────────────────────────────────────────────
const QUICK_ACCESS = [
  { name_en: 'Demography', name_ms: 'Demografi', count: 166, icon: Users, color: '#06b6d4' },
  { name_en: 'National Accounts', name_ms: 'Akaun Negara', count: 24, icon: TrendingUp, color: '#f59e0b' },
  { name_en: 'Prices', name_ms: 'Harga', count: 18, icon: BarChart3, color: '#ef4444' },
  { name_en: 'Labour', name_ms: 'Buruh', count: 15, icon: Briefcase, color: '#8b5cf6' },
  { name_en: 'Healthcare', name_ms: 'Kesihatan', count: 12, icon: Heart, color: '#ec4899' },
  { name_en: 'Environment', name_ms: 'Alam Sekitar', count: 10, icon: Leaf, color: '#22c55e' },
];

// ─── Component ────────────────────────────────────────────────────
export function DataDiscoveryEngine({ lang, onNavigateDatasets }: DataDiscoveryEngineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
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
        <Compass size={16} style={{ color: '#06b6d4' }} />
        <div>
          <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.4)' }}>
            {lang === 'ms' ? 'PENERIMAAN DATA' : 'DATA DISCOVERY'}
          </span>
          <SectionHeaderLine color="#06b6d4" delay={0.2} />
        </div>
        <span className="text-[9px] font-mono ml-2" style={{ color: 'rgba(6,182,212,0.4)' }}>
          {lang === 'ms' ? 'Set data yang disyorkan & pandangan trend' : 'Recommended datasets & trending insights'}
        </span>
      </div>

      {/* 3-Column Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Column 1: Trending Now */}
        <div className="rounded-lg border p-3" style={{
          background: 'rgba(10,14,26,0.5)',
          borderColor: 'rgba(6,182,212,0.08)',
        }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Flame size={12} style={{ color: '#f59e0b' }} />
            <span className="text-[10px] font-bold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
              {lang === 'ms' ? 'SEDANG TREND' : 'TRENDING NOW'}
            </span>
          </div>
          <div className="space-y-1.5">
            {TRENDING_DATASETS.map((ds, i) => {
              const catColor = CATEGORY_COLORS[ds.category] || '#64748b';
              const rankColors = ['#f59e0b', '#94a3b8', '#cd7f32', '#64748b', '#64748b'];
              return (
                <motion.button
                  key={i}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all cursor-pointer"
                  style={{
                    background: 'rgba(10,14,26,0.4)',
                    border: '1px solid rgba(6,182,212,0.06)',
                  }}
                  onClick={() => onNavigateDatasets?.(ds.category)}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(6,182,212,0.06)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Rank Badge */}
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold font-mono"
                    style={{
                      background: `${rankColors[i]}20`,
                      color: rankColors[i],
                      border: `1px solid ${rankColors[i]}30`,
                    }}
                  >
                    {ds.rank}
                  </span>

                  {/* Title + Category */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono truncate" style={{ color: '#e0f7fa' }}>
                        {lang === 'ms' ? ds.title_ms : ds.title_en}
                      </span>
                      {ds.hot && (
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Flame size={10} style={{ color: '#f59e0b' }} />
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
                      <span className="text-[8px] font-mono" style={{ color: catColor }}>
                        {lang === 'ms' ? ds.category_ms : ds.category}
                      </span>
                    </div>
                  </div>

                  <ArrowRight size={10} style={{ color: 'rgba(6,182,212,0.3)', flexShrink: 0 }} />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Recommended For You */}
        <div className="rounded-lg border p-3" style={{
          background: 'rgba(10,14,26,0.5)',
          borderColor: 'rgba(6,182,212,0.08)',
        }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={12} style={{ color: '#10b981' }} />
            <span className="text-[10px] font-bold font-mono tracking-wider" style={{ color: '#10b981' }}>
              {lang === 'ms' ? 'DIGALAKKAN UNTUK ANDA' : 'RECOMMENDED FOR YOU'}
            </span>
          </div>
          <div className="space-y-2">
            {RECOMMENDED.map((rec, i) => {
              const catColor = CATEGORY_COLORS[rec.category] || '#64748b';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-md border p-2.5"
                  style={{
                    background: 'rgba(10,14,26,0.4)',
                    borderColor: 'rgba(6,182,212,0.06)',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <Sparkles size={10} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono font-medium" style={{ color: '#e0f7fa' }}>
                        {lang === 'ms' ? rec.title_ms : rec.title_en}
                      </div>
                      <div className="text-[8px] font-mono mt-0.5" style={{ color: 'rgba(148,163,184,0.5)' }}>
                        {lang === 'ms' ? rec.reason_ms : rec.reason_en}
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span
                          className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                          style={{
                            background: `${catColor}15`,
                            color: catColor,
                            border: `1px solid ${catColor}25`,
                          }}
                        >
                          {lang === 'ms' ? rec.category_ms : rec.category}
                        </span>
                        <button
                          onClick={() => onNavigateDatasets?.(rec.category)}
                          className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[8px] font-mono cursor-pointer transition-all"
                          style={{
                            background: 'rgba(6,182,212,0.06)',
                            border: '1px solid rgba(6,182,212,0.2)',
                            color: '#06b6d4',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(6,182,212,0.15)';
                            e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)';
                            e.currentTarget.style.boxShadow = '0 0 8px rgba(6,182,212,0.2)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(6,182,212,0.06)';
                            e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {lang === 'ms' ? 'Lihat' : 'View'}
                          <ArrowRight size={8} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Quick Access */}
        <div className="rounded-lg border p-3" style={{
          background: 'rgba(10,14,26,0.5)',
          borderColor: 'rgba(6,182,212,0.08)',
        }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Search size={12} style={{ color: '#06b6d4' }} />
            <span className="text-[10px] font-bold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'AKSES PANTAS' : 'QUICK ACCESS'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACCESS.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={i}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-md border cursor-pointer transition-all"
                  style={{
                    background: `${cat.color}08`,
                    borderColor: `${cat.color}15`,
                  }}
                  onClick={() => onNavigateDatasets?.(cat.name_en)}
                  whileHover={{ scale: 1.05, backgroundColor: `${cat.color}15` }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${cat.color}35`;
                    e.currentTarget.style.boxShadow = `0 0 10px ${cat.color}20`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = `${cat.color}15`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon size={16} style={{ color: cat.color }} />
                  <span className="text-[9px] font-mono font-medium text-center" style={{ color: '#e0f7fa' }}>
                    {lang === 'ms' ? cat.name_ms : cat.name_en}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: cat.color }}>
                    {cat.count} {lang === 'ms' ? 'set data' : 'datasets'}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <button
            onClick={() => onNavigateDatasets?.()}
            className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border text-[10px] font-mono font-bold tracking-wider cursor-pointer transition-all"
            style={{
              background: 'rgba(6,182,212,0.06)',
              borderColor: 'rgba(6,182,212,0.2)',
              color: '#06b6d4',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(6,182,212,0.12)';
              e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(6,182,212,0.06)';
              e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {lang === 'ms' ? 'LIHAT SEMUA 287' : 'VIEW ALL 287'}
            <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default DataDiscoveryEngine;
