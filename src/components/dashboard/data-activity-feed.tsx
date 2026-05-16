'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, TrendingUp, Plus, AlertTriangle, Search,
  Activity, Filter,
} from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket } from '@/components/dashboard/particle-background';

// ─── Types ────────────────────────────────────────────────────────
type ActivityType = 'SYNC' | 'UPDATE' | 'NEW' | 'ALERT' | 'QUERY';
type ActivityStatus = 'SUCCESS' | 'PENDING' | 'PROCESSING';

interface FeedEntry {
  id: string;
  time: string;
  type: ActivityType;
  status: ActivityStatus;
  desc_en: string;
  desc_ms: string;
  ref: string;
}

interface DataActivityFeedProps {
  lang: Lang;
}

// ─── Constants ────────────────────────────────────────────────────
const TYPE_CONFIG: Record<ActivityType, { icon: React.ElementType; color: string; label_en: string; label_ms: string }> = {
  SYNC:   { icon: RefreshCw,     color: '#06b6d4', label_en: 'Sync',   label_ms: 'Selaras' },
  UPDATE: { icon: TrendingUp,    color: '#f59e0b', label_en: 'Update', label_ms: 'Kemas Kini' },
  NEW:    { icon: Plus,          color: '#10b981', label_en: 'New',    label_ms: 'Baru' },
  ALERT:  { icon: AlertTriangle, color: '#ef4444', label_en: 'Alert',  label_ms: 'Amaran' },
  QUERY:  { icon: Search,        color: '#8b5cf6', label_en: 'Query',  label_ms: 'Pertanyaan' },
};

const STATUS_CONFIG: Record<ActivityStatus, { color: string; animate: boolean }> = {
  SUCCESS:    { color: '#10b981', animate: false },
  PENDING:    { color: '#f59e0b', animate: false },
  PROCESSING: { color: '#06b6d4', animate: true  },
};

// Pool of activity entries for random generation
const ENTRY_POOL: Omit<FeedEntry, 'id' | 'time'>[] = [
  { type: 'SYNC',   status: 'SUCCESS',    desc_en: 'Population data synced',                          desc_ms: 'Data penduduk diselaraskan',                        ref: 'population_state' },
  { type: 'UPDATE', status: 'SUCCESS',    desc_en: 'GDP estimates refreshed',                         desc_ms: 'Anggaran KDNK disegarkan',                          ref: 'gdp_state_real_supply' },
  { type: 'NEW',    status: 'SUCCESS',    desc_en: 'New dataset available: CPI Regional',             desc_ms: 'Set data baru tersedia: CPI Wilayah',               ref: 'cpi_regional' },
  { type: 'ALERT',  status: 'PENDING',    desc_en: 'Labour force data update pending',                desc_ms: 'Kemas kini data tenaga buruh menunggu',             ref: 'labour_force' },
  { type: 'QUERY',  status: 'SUCCESS',    desc_en: 'Analytics query completed',                       desc_ms: 'Pertanyaan analitik selesai',                       ref: 'analytics' },
  { type: 'SYNC',   status: 'PROCESSING', desc_en: 'Syncing demographic data from DOSM',              desc_ms: 'Menyelaraskan data demografi dari DOSM',            ref: 'demography' },
  { type: 'UPDATE', status: 'SUCCESS',    desc_en: 'Trade statistics Q1 2025 updated',                desc_ms: 'Statistik perdagangan Q1 2025 dikemas kini',        ref: 'trade_stats' },
  { type: 'ALERT',  status: 'PENDING',    desc_en: 'Healthcare data ingestion delayed',               desc_ms: 'Pengingesan data penjagaan kesihatan tertangguh',   ref: 'healthcare' },
  { type: 'NEW',    status: 'SUCCESS',    desc_en: 'New dataset: Household Income Survey',            desc_ms: 'Set data baru: Survei Pendapatan Isi Rumah',        ref: 'household_income' },
  { type: 'QUERY',  status: 'PROCESSING', desc_en: 'Running aggregation on state metrics',            desc_ms: 'Menjalankan pengagregatan pada metrik negeri',      ref: 'state_metrics' },
  { type: 'SYNC',   status: 'SUCCESS',    desc_en: 'Financial markets data synced',                   desc_ms: 'Data pasaran kewangan diselaraskan',                ref: 'financial_markets' },
  { type: 'UPDATE', status: 'SUCCESS',    desc_en: 'Environment quality index refreshed',             desc_ms: 'Indeks kualiti alam sekitar disegarkan',            ref: 'environment' },
  { type: 'NEW',    status: 'SUCCESS',    desc_en: 'New dataset: Education Statistics 2024',          desc_ms: 'Set data baru: Statistik Pendidikan 2024',          ref: 'education_stats' },
  { type: 'ALERT',  status: 'PENDING',    desc_en: 'CPI data validation pending review',              desc_ms: 'Pengesahan data CPI menunggu semakan',              ref: 'cpi_national' },
  { type: 'QUERY',  status: 'SUCCESS',    desc_en: 'Cross-state comparison query completed',          desc_ms: 'Pertanyaan perbandingan antara negeri selesai',     ref: 'comparison' },
  { type: 'SYNC',   status: 'SUCCESS',    desc_en: 'Transport statistics data synced',                desc_ms: 'Data statistik pengangkutan diselaraskan',          ref: 'transport' },
  { type: 'UPDATE', status: 'PROCESSING', desc_en: 'Updating poverty line indicators',                desc_ms: 'Mengemas kini penunjuk garis kemiskinan',           ref: 'poverty_line' },
  { type: 'NEW',    status: 'SUCCESS',    desc_en: 'New dataset: Public Safety Records',              desc_ms: 'Set data baru: Rekod Keselamatan Awam',             ref: 'public_safety' },
  { type: 'SYNC',   status: 'SUCCESS',    desc_en: 'Births and deaths registry synced',               desc_ms: 'Daftar kelahiran dan kematian diselaraskan',        ref: 'vital_statistics' },
  { type: 'UPDATE', status: 'SUCCESS',    desc_en: 'GDP by state (real supply) refreshed',            desc_ms: 'KDNK mengikut negeri (bekalan sebenar) disegarkan', ref: 'gdp_state_real_supply' },
];

// Time labels for initial entries
const TIME_LABELS = [
  '2 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago',
  '18 min ago', '23 min ago', '28 min ago', '35 min ago', '42 min ago',
  '1 hour ago', '1 hour ago', '1.5 hours ago', '2 hours ago', '2 hours ago',
  '3 hours ago', '3 hours ago', '4 hours ago', '5 hours ago', '6 hours ago',
];

let entryCounter = 0;
function nextId(): string {
  entryCounter += 1;
  return `feed-${entryCounter}`;
}

// ─── Component ────────────────────────────────────────────────────
export function DataActivityFeed({ lang }: DataActivityFeedProps) {
  const [entries, setEntries] = useState<FeedEntry[]>(() => {
    return ENTRY_POOL.slice(0, 18).map((e, i) => ({
      ...e,
      id: nextId(),
      time: TIME_LABELS[i] || `${i + 2} min ago`,
    }));
  });
  const [filter, setFilter] = useState<ActivityType | 'ALL'>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-generate new entries every 8-12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const poolEntry = ENTRY_POOL[Math.floor(Math.random() * ENTRY_POOL.length)];
      const newEntry: FeedEntry = {
        ...poolEntry,
        id: nextId(),
        time: 'Just now',
      };
      setEntries(prev => [newEntry, ...prev.slice(0, 49)]); // max 50 entries
    }, 8000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to top when new entry arrives
  const scrollToTop = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      scrollToTop();
    }
  }, [entries.length, scrollToTop]);

  // Filter entries
  const filtered = filter === 'ALL' ? entries : entries.filter(e => e.type === filter);

  const filterTabs: { id: ActivityType | 'ALL'; label_en: string; label_ms: string }[] = [
    { id: 'ALL', label_en: 'All', label_ms: 'Semua' },
    { id: 'SYNC', label_en: 'Sync', label_ms: 'Selaras' },
    { id: 'UPDATE', label_en: 'Update', label_ms: 'Kemas Kini' },
    { id: 'NEW', label_en: 'New', label_ms: 'Baru' },
    { id: 'ALERT', label_en: 'Alert', label_ms: 'Amaran' },
  ];

  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'rgba(10,14,26,0.95)',
      borderColor: 'rgba(6,182,212,0.12)',
    }}>
      <HUDBracket />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: '#06b6d4' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
            {lang === 'ms' ? 'SUAPAN AKTIVITI DATA LANGSUNG' : 'LIVE DATA ACTIVITY FEED'}
          </span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#10b981' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter size={10} style={{ color: 'rgba(6,182,212,0.4)' }} />
          <span className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
            {filtered.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {filterTabs.map(tab => {
          const isActive = filter === tab.id;
          const tabColor = tab.id === 'ALL' ? '#06b6d4' : TYPE_CONFIG[tab.id].color;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="px-2 py-1 rounded text-[9px] font-mono tracking-wider transition-all cursor-pointer"
              style={{
                background: isActive ? `${tabColor}18` : 'transparent',
                border: `1px solid ${isActive ? `${tabColor}40` : 'rgba(6,182,212,0.08)'}`,
                color: isActive ? tabColor : 'rgba(148,163,184,0.5)',
              }}
            >
              {lang === 'ms' ? tab.label_ms : tab.label_en}
            </button>
          );
        })}
      </div>

      {/* Feed Entries */}
      <div
        ref={scrollRef}
        className="max-h-72 overflow-y-auto custom-scrollbar space-y-0.5"
      >
        <AnimatePresence initial={false}>
          {filtered.map((entry) => {
            const typeCfg = TYPE_CONFIG[entry.type];
            const statusCfg = STATUS_CONFIG[entry.status];
            const Icon = typeCfg.icon;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-center gap-2 px-2 py-1.5 rounded transition-colors hover:bg-cyan-950/20"
                style={{
                  borderLeft: `2px solid ${typeCfg.color}40`,
                }}
              >
                {/* Type Icon */}
                <Icon size={11} style={{ color: typeCfg.color, flexShrink: 0 }} />

                {/* Status Dot */}
                <div className="relative flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusCfg.color }} />
                  {statusCfg.animate && (
                    <motion.div
                      className="absolute inset-0 w-1.5 h-1.5 rounded-full"
                      style={{ background: statusCfg.color }}
                      animate={{ opacity: [1, 0, 1], scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Description */}
                <span className="text-[10px] font-mono flex-1 min-w-0 truncate" style={{ color: '#c0d0e0' }}>
                  {lang === 'ms' ? entry.desc_ms : entry.desc_en}
                </span>

                {/* Reference */}
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded flex-shrink-0" style={{
                  background: 'rgba(6,182,212,0.06)',
                  color: 'rgba(6,182,212,0.5)',
                  border: '1px solid rgba(6,182,212,0.08)',
                }}>
                  {entry.ref}
                </span>

                {/* Time */}
                <span className="text-[8px] font-mono whitespace-nowrap flex-shrink-0" style={{ color: 'rgba(148,163,184,0.4)' }}>
                  {entry.time}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-6">
            <Search size={16} style={{ color: 'rgba(6,182,212,0.2)', margin: '0 auto 8px' }} />
            <span className="text-[10px] font-mono" style={{ color: 'rgba(148,163,184,0.3)' }}>
              {lang === 'ms' ? 'Tiada aktiviti untuk ditunjukkan' : 'No activity to display'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataActivityFeed;
