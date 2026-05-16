'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, Baby, Heart, Briefcase, Database,
  BarChart3, Map, LayoutDashboard, FileText, Download,
  Search, Filter, ChevronLeft, ChevronRight, Globe,
  ChevronDown, X, Printer, Info, AlertTriangle,
  ExternalLink, Clock, MapPin, Layers, Settings,
  ArrowUpRight, ArrowDownRight, Activity, Zap,
  HelpCircle, BookOpen, Shield, Languages,
  Scale, ArrowRight, Calendar, Tag, FileDown,
  Command, ArrowUp, ArrowDown, CornerDownLeft,
  Bell, Wifi, RefreshCw, Copyright,
} from 'lucide-react';
import dynamic from 'next/dynamic';

import BootSequence from '@/components/dashboard/boot-sequence';
import Header from '@/components/dashboard/header';
import {
  STATES, MALAYSIA_TOTALS, MAP_LAYERS, DATASET_CATEGORIES,
  FREQUENCY_COLORS, FAQ_DATA, DISCLAIMERS, CITATIONS,
} from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

// Dynamic import for map (avoid SSR issues)
const MalaysiaMap = dynamic(() => import('@/components/map/malaysia-map'), { ssr: false });

type TabId = 'overview' | 'geomap' | 'datasets' | 'analytics';
type LayerId = 'population' | 'gdp' | 'births' | 'deaths' | 'unemployment' | 'datasets';
type Lang = 'en' | 'ms';

// ─── Particle Background ─────────────────────────────────────────
function ParticleBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1,
      opacity: 0.1 + Math.random() * 0.3,
      duration: 30 + Math.random() * 30,
      delay: Math.random() * -60,
      driftX: (Math.random() - 0.5) * 20,
      driftY: (Math.random() - 0.5) * 20,
    })), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes particle-drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(var(--drift-x), var(--drift-y)); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: '#06b6d4',
            opacity: p.opacity,
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
            animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── HUD Bracket Decoration ──────────────────────────────────────
function HUDBracket() {
  return (
    <>
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300 pointer-events-none" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300 pointer-events-none" />
    </>
  );
}

// ─── KPI Card Component ─────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, unit, change, color, lang }: {
  icon: React.ElementType; label: string; value: string; unit: string;
  change?: number; color: string; lang: Lang;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg p-4 border backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, rgba(10,14,26,0.95), rgba(10,14,26,0.8))`,
        borderColor: `${color}25`,
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{
        background: `radial-gradient(circle at top right, ${color}, transparent)`,
      }} />
      <div className="flex items-start justify-between mb-2">
        <Icon size={18} style={{ color }} />
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-mono ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold font-mono" style={{ color: '#e0f7fa' }}>
        {value}
        <span className="text-xs font-normal ml-1 opacity-50">{unit}</span>
      </div>
      <div className="text-[10px] font-mono mt-1 tracking-wider uppercase opacity-60" style={{ color }}>
        {label}
      </div>
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{
        background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
      }} />
    </motion.div>
  );
}

// ─── Animated Counter Hook ──────────────────────────────────────────
function useAnimatedValue(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// ─── Real-time Engine Pulse ───────────────────────────────────────
function DataEnginePulse({ lang }: { lang: Lang }) {
  const [pulse, setPulse] = useState(0);
  const [throughput, setThroughput] = useState(0);
  const [latency, setLatency] = useState(0);
  const animPop = useAnimatedValue(34300);

  useEffect(() => {
    const iv = setInterval(() => {
      setPulse(p => (p + 1) % 60);
      setThroughput(Math.floor(120 + Math.random() * 80));
      setLatency(Math.floor(8 + Math.random() * 12));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(10,14,26,0.95))',
      borderColor: 'rgba(6,182,212,0.15)',
    }}>
      <HUDBracket />
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <Activity size={14} style={{ color: '#06b6d4' }} />
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Activity size={14} style={{ color: '#06b6d4' }} />
          </motion.div>
        </div>
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'ENJIN DATA MASA NYATA' : 'REAL-TIME DATA ENGINE'}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] font-mono text-emerald-400">ACTIVE</span>
        </div>
      </div>

      {/* Throughput Waveform */}
      <div className="flex items-end gap-px h-8 mb-3">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-300"
            style={{
              height: `${Math.max(8, Math.sin((pulse + i) * 0.3) * 50 + 50)}%`,
              background: `linear-gradient(180deg, #06b6d4${Math.round(40 + Math.sin((pulse + i) * 0.3) * 30).toString(16).padStart(2, '0')}, rgba(6,182,212,0.05))`,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-sm font-bold font-mono" style={{ color: '#06b6d4' }}>{throughput}</div>
          <div className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
            {lang === 'ms' ? 'REQ/MIN' : 'REQ/MIN'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono" style={{ color: '#10b981' }}>{latency}ms</div>
          <div className="text-[8px] font-mono" style={{ color: 'rgba(16,185,129,0.5)' }}>
            {lang === 'ms' ? 'KELENGKAPAN' : 'LATENCY'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono" style={{ color: '#f59e0b' }}>99.9%</div>
          <div className="text-[8px] font-mono" style={{ color: 'rgba(245,158,11,0.5)' }}>
            {lang === 'ms' ? 'KEBOLEHUPAYAAN' : 'UPTIME'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Health Index Widget ──────────────────────────────────────────
function HealthIndexWidget({ lang }: { lang: Lang }) {
  const indices = [
    { label_en: 'Healthcare', label_ms: 'Kesihatan', value: 78, color: '#ec4899', icon: '🏥' },
    { label_en: 'Environment', label_ms: 'Alam Sekitar', value: 65, color: '#22c55e', icon: '🌿' },
    { label_en: 'Education', label_ms: 'Pendidikan', value: 82, color: '#3b82f6', icon: '📚' },
    { label_en: 'Economy', label_ms: 'Ekonomi', value: 71, color: '#f59e0b', icon: '💰' },
    { label_en: 'Safety', label_ms: 'Keselamatan', value: 74, color: '#8b5cf6', icon: '🛡️' },
    { label_en: 'Digital', label_ms: 'Digital', value: 68, color: '#06b6d4', icon: '💻' },
  ];

  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'rgba(10,14,26,0.95)',
      borderColor: 'rgba(6,182,212,0.12)',
    }}>
      <HUDBracket />
      <div className="flex items-center gap-2 mb-3">
        <Heart size={14} style={{ color: '#ec4899' }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#ec4899' }}>
          {lang === 'ms' ? 'INDEKS KEBERKESANAN NEGARA' : 'NATIONAL PERFORMANCE INDEX'}
        </span>
      </div>
      <div className="space-y-2.5">
        {indices.map((idx) => (
          <div key={idx.label_en}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: '#94a3b8' }}>
                <span className="text-xs">{idx.icon}</span>
                {lang === 'ms' ? idx.label_ms : idx.label_en}
              </span>
              <span className="text-[10px] font-mono font-bold" style={{ color: idx.color }}>{idx.value}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${idx.value}%` }}
                transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                style={{
                  background: `linear-gradient(90deg, ${idx.color}60, ${idx.color})`,
                  boxShadow: `0 0 8px ${idx.color}40`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── State Mini-Cards Grid ────────────────────────────────────────
function StateMiniCards({ lang }: { lang: Lang }) {
  const topStates = STATES.slice().sort((a, b) => b.population - a.population).slice(0, 6);
  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'rgba(10,14,26,0.95)',
      borderColor: 'rgba(6,182,212,0.12)',
    }}>
      <HUDBracket />
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} style={{ color: '#06b6d4' }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'NEGERI TERATAS MENGIKUT PENDUDUK' : 'TOP STATES BY POPULATION'}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {topStates.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-md border p-3 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(6,182,212,${0.03 + i * 0.01}), rgba(10,14,26,0.95))`,
              borderColor: i === 0 ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.08)',
            }}
          >
            {/* Rank badge */}
            <div className="absolute top-1.5 right-1.5 text-[8px] font-mono px-1 py-0.5 rounded" style={{
              background: i < 3 ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.05)',
              color: i < 3 ? '#06b6d4' : 'rgba(6,182,212,0.4)',
            }}>
              #{i + 1}
            </div>
            <div className="text-xs font-bold mb-0.5" style={{ color: '#e0f7fa' }}>{s.name}</div>
            <div className="text-[9px] font-mono" style={{ color: '#06b6d4' }}>
              {s.population.toLocaleString()}k
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[8px] font-mono" style={{ color: '#10b981' }}>
                GDP {(s.gdp / 1000).toFixed(1)}B
              </span>
              <span className="text-[8px]" style={{ color: 'rgba(6,182,212,0.3)' }}>•</span>
              <span className="text-[8px] font-mono" style={{ color: s.gdpGrowth >= 4 ? '#10b981' : '#f59e0b' }}>
                {s.gdpGrowth}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Data Source Statistics ───────────────────────────────────────
function DataSourceStats({ lang }: { lang: Lang }) {
  const sourceStats = useMemo(() => {
    const counts: Record<string, { count: number; categories: Set<string> }> = {};
    DATASETS.forEach(d => {
      d.data_source.forEach(src => {
        if (!counts[src]) counts[src] = { count: 0, categories: new Set() };
        counts[src].count++;
        counts[src].categories.add(d.category_en);
      });
    });
    return Object.entries(counts)
      .map(([source, data]) => ({ source, count: data.count, categories: data.categories.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, []);

  const sourceColors: Record<string, string> = {
    DOSM: '#06b6d4', BNM: '#f59e0b', KKM: '#ec4899', JPJ: '#8b5cf6',
    KPM: '#3b82f6', KASA: '#22c55e', JDN: '#f97316', KD: '#64748b',
  };

  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'rgba(10,14,26,0.95)',
      borderColor: 'rgba(6,182,212,0.12)',
    }}>
      <HUDBracket />
      <div className="flex items-center gap-2 mb-3">
        <Database size={14} style={{ color: '#06b6d4' }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'AGENSI SUMBER DATA' : 'DATA SOURCE AGENCIES'}
        </span>
      </div>
      <div className="space-y-2">
        {sourceStats.map(s => {
          const color = sourceColors[s.source] || '#64748b';
          const maxCount = sourceStats[0]?.count || 1;
          return (
            <div key={s.source} className="flex items-center gap-2">
              <span className="text-[9px] font-mono w-10 text-right font-bold" style={{ color }}>{s.source}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(s.count / maxCount) * 100}%` }}
                  transition={{ duration: 1, delay: 0.1 }}
                  style={{
                    background: `linear-gradient(90deg, ${color}80, ${color})`,
                    boxShadow: `0 0 6px ${color}30`,
                  }}
                />
              </div>
              <span className="text-[8px] font-mono w-5 text-right" style={{ color: '#94a3b8' }}>{s.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Overview Section ─────────────────────────────────────────────
function OverviewSection({ lang }: { lang: Lang }) {
  const kpis = [
    { icon: Users, label: lang === 'ms' ? 'Penduduk' : 'Population', value: '34.3M', unit: "('000)", change: 1.1, color: '#06b6d4' },
    { icon: TrendingUp, label: lang === 'ms' ? 'KDNK' : 'GDP', value: '1.68T', unit: 'RM M', change: 4.5, color: '#f59e0b' },
    { icon: Baby, label: lang === 'ms' ? 'Kelahiran' : 'Births', value: '602.9', unit: "('000)", change: -2.3, color: '#10b981' },
    { icon: Heart, label: lang === 'ms' ? 'Kematian' : 'Deaths', value: '159.7', unit: "('000)", change: 1.8, color: '#ef4444' },
    { icon: Briefcase, label: lang === 'ms' ? 'Pengangguran' : 'Unemployment', value: '3.4', unit: '%', change: -0.3, color: '#8b5cf6' },
    { icon: Database, label: lang === 'ms' ? 'Set Data' : 'Datasets', value: '287', unit: '', change: 12, color: '#ec4899' },
  ];

  // Top states bar chart data
  const topStatesData = STATES.slice()
    .sort((a, b) => b.population - a.population)
    .slice(0, 8)
    .map(s => ({ name: s.abbr, population: s.population, gdp: Math.round(s.gdp / 1000) }));

  // Frequency distribution for pie
  const freqDist = useMemo(() => {
    const counts: Record<string, number> = {};
    DATASETS.forEach(d => { counts[d.frequency] = (counts[d.frequency] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // Category stats for treemap
  const catStats = useMemo(() => {
    const counts: Record<string, number> = {};
    DATASETS.forEach(d => { counts[d.category_en] = (counts[d.category_en] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => {
        const cat = DATASET_CATEGORIES.find(c => c.en === name);
        return { name, value, color: cat?.color || '#64748b' };
      })
      .sort((a, b) => b.value - a.value);
  }, []);

  const PIE_COLORS = ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#64748b', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-lg border p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(16,185,129,0.04), rgba(10,14,26,0.95))',
          borderColor: 'rgba(6,182,212,0.15)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{
          background: 'radial-gradient(circle at top right, #06b6d4, transparent 70%)',
        }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5" style={{
          background: 'radial-gradient(circle at bottom left, #10b981, transparent 70%)',
        }} />
        {/* Animated grid lines in background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.8) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} style={{ color: '#06b6d4' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'PENGANALISIS DATA NASIONAL' : 'NATIONAL DATA INTELLIGENCE'}
            </span>
            <motion.span
              className="text-[8px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              v3.0
            </motion.span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{
            color: '#e0f7fa',
            textShadow: '0 0 20px rgba(6,182,212,0.3)',
          }}>
            {lang === 'ms' ? 'Pusat Perintah Data Malaysia' : 'Malaysia Data Command Center'}
          </h2>
          <p className="text-sm opacity-60 max-w-2xl" style={{ color: '#94a3b8' }}>
            {lang === 'ms'
              ? 'Papan pemuka kecerdasan gred SaaS premium yang dikuasakan sepenuhnya oleh data.gov.my data terbuka. 287+ set data merentasi 18 kategori.'
              : 'A premium SaaS-grade intelligence dashboard powered entirely by data.gov.my open data. 287+ datasets across 18 categories.'
            }
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.15)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400">LIVE DATA</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border" style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.15)' }}>
              <MapPin size={10} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] font-mono" style={{ color: '#06b6d4' }}>16 STATES + 3 FT</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.15)' }}>
              <Layers size={10} style={{ color: '#f59e0b' }} />
              <span className="text-[10px] font-mono" style={{ color: '#f59e0b' }}>6 LAYERS</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border" style={{ background: 'rgba(139,92,246,0.06)', borderColor: 'rgba(139,92,246,0.15)' }}>
              <Globe size={10} style={{ color: '#8b5cf6' }} />
              <span className="text-[10px] font-mono" style={{ color: '#8b5cf6' }}>18 CATEGORIES</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <KPICard key={i} {...kpi} lang={lang} />
        ))}
      </div>

      {/* Row: Data Engine + State Cards + Health Index */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DataEnginePulse lang={lang} />
        <StateMiniCards lang={lang} />
        <HealthIndexWidget lang={lang} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart - Top States */}
        <div className="lg:col-span-2 relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.95)',
          borderColor: 'rgba(6,182,212,0.12)',
        }}>
          <HUDBracket />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={14} style={{ color: '#06b6d4' }} />
              <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'PENDUDUK & KDNK MENGIKUT NEGERI' : 'POPULATION & GDP BY STATE'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: '#06b6d4' }} />
                <span className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>POP</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
                <span className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>GDP</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topStatesData} barCategoryGap="20%">
              <defs>
                <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="gdpBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#06b6d466', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#06b6d466', fontSize: 9 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: '#0a0e1a', border: '1px solid #06b6d430', borderRadius: 8, fontSize: 11, boxShadow: '0 0 20px rgba(6,182,212,0.1)' }}
                labelStyle={{ color: '#06b6d4' }}
                itemStyle={{ color: '#e0f7fa' }}
              />
              <Bar dataKey="population" fill="url(#popGrad)" radius={[4,4,0,0]} />
              <Bar dataKey="gdp" fill="url(#gdpBarGrad)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Frequency */}
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.95)',
          borderColor: 'rgba(6,182,212,0.12)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: '#06b6d4' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'FREKUENSI DATA' : 'DATA FREQUENCY'}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={freqDist} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={2} stroke="none">
                {freqDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0a0e1a', border: '1px solid #06b6d430', borderRadius: 8, fontSize: 11, boxShadow: '0 0 20px rgba(6,182,212,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {freqDist.map((d, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Category Heat Blocks + Data Sources + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category Heat Blocks */}
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.95)',
          borderColor: 'rgba(6,182,212,0.12)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} style={{ color: '#06b6d4' }} />
            <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'BLOK KATEGORI' : 'CATEGORY BLOCKS'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {catStats.slice(0, 18).map((cat) => (
              <div
                key={cat.name}
                className="rounded p-1.5 text-center cursor-default transition-transform hover:scale-105"
                style={{
                  background: `${cat.color}12`,
                  border: `1px solid ${cat.color}20`,
                }}
              >
                <div className="text-[10px] font-mono font-bold" style={{ color: cat.color }}>{cat.value}</div>
                <div className="text-[7px] font-mono truncate" style={{ color: '#94a3b8' }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Source Stats */}
        <DataSourceStats lang={lang} />

        {/* Timeline */}
        <div className="relative group rounded-lg border p-4" style={{
          background: 'rgba(10,14,26,0.95)',
          borderColor: 'rgba(6,182,212,0.12)',
        }}>
          <HUDBracket />
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} style={{ color: '#06b6d4' }} />
            <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'GARIS MASA KEMAS KINI DATA' : 'DATA UPDATE TIMELINE'}
            </span>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
            {[
              { date: '2025-07', en: 'Population estimates updated to 2025', ms: 'Anggaran penduduk dikemas kini ke 2025', type: 'census' },
              { date: '2025-04', en: 'Q1 2025 GDP data released', ms: 'Data KDNK Q1 2025 dikeluarkan', type: 'gdp' },
              { date: '2025-03', en: 'Labour Force Survey Q1 2025', ms: 'Survei Tenaga Buruh Q1 2025', type: 'labour' },
              { date: '2025-01', en: 'CPI Annual Inflation 2024 released', ms: 'Inflasi Tahunan CPI 2024 dikeluarkan', type: 'prices' },
              { date: '2024-11', en: 'Vital Statistics 2024 published', ms: 'Statistik Utama 2024 diterbitkan', type: 'vital' },
              { date: '2024-08', en: 'GDP by State 2023 updated', ms: 'KDNK mengikut Negeri 2023 dikemas kini', type: 'gdp' },
              { date: '2024-07', en: 'Household Income Survey 2023', ms: 'Survei Pendapatan Isi Rumah 2023', type: 'household' },
              { date: '2024-06', en: 'Environmental Quality Report', ms: 'Laporan Kualiti Alam Sekitar', type: 'environment' },
            ].map((event, i) => {
              const typeColors: Record<string, string> = {
                census: '#06b6d4', gdp: '#f59e0b', labour: '#8b5cf6', prices: '#ef4444',
                vital: '#ec4899', household: '#10b981', environment: '#22c55e',
              };
              const dotColor = typeColors[event.type] || '#06b6d4';
              return (
                <div key={i} className="flex items-start gap-2.5 py-1.5 px-2 rounded transition-colors hover:bg-cyan-950/20" style={{
                  borderLeft: i === 0 ? '2px solid #06b6d4' : '2px solid rgba(6,182,212,0.08)',
                }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{
                    background: dotColor,
                    boxShadow: i === 0 ? `0 0 6px ${dotColor}60` : 'none',
                  }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: dotColor }}>{event.date}</span>
                      {i === 0 && (
                        <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{
                          background: 'rgba(6,182,212,0.15)', color: '#06b6d4',
                        }}>LATEST</span>
                      )}
                    </div>
                    <span className="text-[10px] block truncate" style={{ color: '#94a3b8' }}>
                      {lang === 'ms' ? event.ms : event.en}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GeoMap Section ──────────────────────────────────────────────
function GeoMapSection({ lang }: { lang: Lang }) {
  const [activeLayer, setActiveLayer] = useState<LayerId>('population');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [compareStateA, setCompareStateA] = useState('');
  const [compareStateB, setCompareStateB] = useState('');

  const selectedData = useMemo(() => STATES.find(s => s.id === selectedState), [selectedState]);
  const hoveredData = useMemo(() => STATES.find(s => s.id === hoveredState), [hoveredState]);

  return (
    <div className="space-y-4">
      {/* Layer Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {MAP_LAYERS.map(layer => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id as LayerId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-all border"
            style={{
              background: activeLayer === layer.id ? 'rgba(6,182,212,0.15)' : 'rgba(10,14,26,0.8)',
              borderColor: activeLayer === layer.id ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.1)',
              color: activeLayer === layer.id ? '#06b6d4' : 'rgba(6,182,212,0.5)',
              boxShadow: activeLayer === layer.id ? '0 0 15px rgba(6,182,212,0.1)' : 'none',
            }}
          >
            {layer.label_en}
            {activeLayer === layer.id && (
              <motion.div layoutId="layer-indicator" className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            )}
          </button>
        ))}
        {/* Compare Button */}
        <button
          onClick={() => setShowComparison(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-all border ml-auto"
          style={{
            background: 'rgba(16,185,129,0.1)',
            borderColor: 'rgba(16,185,129,0.3)',
            color: '#10b981',
          }}
        >
          <Scale size={12} />
          {lang === 'ms' ? 'Bandingkan' : 'Compare'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 rounded-lg border overflow-hidden" style={{
          background: '#0a0e1a',
          borderColor: 'rgba(6,182,212,0.12)',
          minHeight: '450px',
        }}>
          <MalaysiaMap
            activeLayer={activeLayer}
            selectedState={selectedState}
            onSelectState={setSelectedState}
            onHoverState={setHoveredState}
          />
        </div>

        {/* State Detail Panel */}
        <div className="space-y-3">
          {(selectedData || hoveredData) ? (
            <StateDetailPanel state={selectedData || hoveredData!} lang={lang} onClose={() => setSelectedState(null)} />
          ) : (
            <div className="rounded-lg border p-4 h-full flex flex-col items-center justify-center min-h-[300px]" style={{
              background: 'rgba(10,14,26,0.95)',
              borderColor: 'rgba(6,182,212,0.12)',
            }}>
              <MapPin size={24} style={{ color: 'rgba(6,182,212,0.3)' }} />
              <p className="text-xs font-mono mt-2 text-center" style={{ color: 'rgba(6,182,212,0.4)' }}>
                {lang === 'ms' ? 'Klik negeri pada peta untuk butiran' : 'Click a state on the map for details'}
              </p>
            </div>
          )}

          {/* Mini state ranking */}
          <div className="rounded-lg border p-3" style={{
            background: 'rgba(10,14,26,0.95)',
            borderColor: 'rgba(6,182,212,0.12)',
          }}>
            <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'KEDUDUKAN NEGERI' : 'STATE RANKING'} — {MAP_LAYERS.find(l => l.id === activeLayer)?.label_en?.toUpperCase()}
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
              {STATES.slice()
                .sort((a, b) => (b[activeLayer as keyof typeof b] as number) - (a[activeLayer as keyof typeof a] as number))
                .map((s, i) => {
                  const val = s[activeLayer as keyof typeof s] as number;
                  const maxVal = Math.max(...STATES.map(st => st[activeLayer as keyof typeof st] as number));
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedState(s.id)}
                      className="w-full flex items-center gap-2 py-1 px-2 rounded text-left hover:bg-cyan-950/30 transition-colors"
                    >
                      <span className="text-[9px] font-mono w-4 text-right" style={{ color: i < 3 ? '#06b6d4' : 'rgba(6,182,212,0.3)' }}>
                        {i + 1}
                      </span>
                      <span className="text-[10px] font-mono flex-1 truncate" style={{ color: selectedState === s.id ? '#06b6d4' : '#94a3b8' }}>
                        {s.abbr}
                      </span>
                      <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(6,182,212,0.1)' }}>
                        <div className="h-full rounded-full" style={{
                          width: `${(val / maxVal) * 100}%`,
                          background: i < 3 ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                        }} />
                      </div>
                      <span className="text-[9px] font-mono" style={{ color: '#e0f7fa' }}>
                        {typeof val === 'number' ? (activeLayer === 'unemployment' ? `${val}%` : activeLayer === 'gdp' ? `${(val/1000).toFixed(1)}B` : val.toLocaleString()) : val}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* State Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <StateComparisonModal
            lang={lang}
            stateA={compareStateA}
            stateB={compareStateB}
            setStateA={setCompareStateA}
            setStateB={setCompareStateB}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StateDetailPanel({ state, lang, onClose }: { state: typeof STATES[0]; lang: Lang; onClose: () => void }) {
  const metrics = [
    { key: 'population', label_en: 'Population', label_ms: 'Penduduk', unit: "'000", icon: Users, color: '#06b6d4' },
    { key: 'gdp', label_en: 'GDP', label_ms: 'KDNK', unit: 'RM M', icon: TrendingUp, color: '#f59e0b' },
    { key: 'gdpGrowth', label_en: 'GDP Growth', label_ms: 'Pertumbuhan KDNK', unit: '%', icon: ArrowUpRight, color: '#10b981' },
    { key: 'births', label_en: 'Births', label_ms: 'Kelahiran', unit: "'000", icon: Baby, color: '#ec4899' },
    { key: 'deaths', label_en: 'Deaths', label_ms: 'Kematian', unit: "'000", icon: Heart, color: '#ef4444' },
    { key: 'unemployment', label_en: 'Unemployment', label_ms: 'Pengangguran', unit: '%', icon: Briefcase, color: '#8b5cf6' },
    { key: 'datasets', label_en: 'Datasets', label_ms: 'Set Data', unit: '', icon: Database, color: '#06b6d4' },
    { key: 'area', label_en: 'Area', label_ms: 'Keluasan', unit: 'km²', icon: MapPin, color: '#64748b' },
    { key: 'density', label_en: 'Density', label_ms: 'Kepadatan', unit: '/km²', icon: Users, color: '#f97316' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-lg border p-4"
      style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(6,182,212,0.2)',
        boxShadow: '0 0 30px rgba(6,182,212,0.05)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-mono tracking-wider" style={{ color: 'rgba(6,182,212,0.5)' }}>
            {state.region === 'east_malaysia' ? 'EAST MALAYSIA' : 'PENINSULAR'}
          </div>
          <div className="text-lg font-bold" style={{ color: '#e0f7fa' }}>{state.name}</div>
          <div className="text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>{state.name_ms} • {state.abbr}</div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-cyan-950/30">
          <X size={14} style={{ color: 'rgba(6,182,212,0.5)' }} />
        </button>
      </div>

      <div className="space-y-2">
        {metrics.map(m => {
          const val = state[m.key as keyof typeof state] as number;
          return (
            <div key={m.key} className="flex items-center gap-2 py-1.5 px-2 rounded" style={{
              background: 'rgba(6,182,212,0.03)',
            }}>
              <m.icon size={12} style={{ color: m.color }} />
              <span className="text-[10px] font-mono flex-1" style={{ color: '#94a3b8' }}>
                {lang === 'ms' ? m.label_ms : m.label_en}
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: '#e0f7fa' }}>
                {m.key === 'gdp' ? `${(val/1000).toFixed(1)}B` : val.toLocaleString()}
                <span className="text-[8px] font-normal ml-0.5 opacity-50">{m.unit}</span>
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── State Comparison Modal ──────────────────────────────────────
function StateComparisonModal({ lang, stateA, stateB, setStateA, setStateB, onClose }: {
  lang: Lang; stateA: string; stateB: string;
  setStateA: (v: string) => void; setStateB: (v: string) => void;
  onClose: () => void;
}) {
  const dataA = useMemo(() => STATES.find(s => s.id === stateA), [stateA]);
  const dataB = useMemo(() => STATES.find(s => s.id === stateB), [stateB]);

  const comparisonMetrics = [
    { key: 'population', label_en: 'Population', label_ms: 'Penduduk', unit: "'000", color: '#06b6d4', lower: false },
    { key: 'gdp', label_en: 'GDP', label_ms: 'KDNK', unit: 'RM M', color: '#f59e0b', lower: false, format: (v: number) => `${(v/1000).toFixed(1)}B` },
    { key: 'gdpGrowth', label_en: 'GDP Growth', label_ms: 'Pertumbuhan KDNK', unit: '%', color: '#10b981', lower: false },
    { key: 'births', label_en: 'Births', label_ms: 'Kelahiran', unit: "'000", color: '#ec4899', lower: false },
    { key: 'deaths', label_en: 'Deaths', label_ms: 'Kematian', unit: "'000", color: '#ef4444', lower: true },
    { key: 'unemployment', label_en: 'Unemployment', label_ms: 'Pengangguran', unit: '%', color: '#8b5cf6', lower: true },
    { key: 'area', label_en: 'Area', label_ms: 'Keluasan', unit: 'km²', color: '#64748b', lower: false },
    { key: 'density', label_en: 'Density', label_ms: 'Kepadatan', unit: '/km²', color: '#f97316', lower: false },
  ];

  const getWinner = (key: string, valA: number, valB: number, lower: boolean) => {
    if (!dataA || !dataB) return 'none';
    if (valA === valB) return 'tie';
    return lower ? (valA < valB ? 'A' : 'B') : (valA > valB ? 'A' : 'B');
  };

  const getDiff = (valA: number, valB: number) => {
    if (valA === 0 && valB === 0) return 0;
    const base = Math.max(valA, valB);
    if (base === 0) return 0;
    return Math.abs(((valA - valB) / base) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border custom-scrollbar"
        style={{
          background: '#0a0e1a',
          borderColor: 'rgba(6,182,212,0.25)',
          boxShadow: '0 0 60px rgba(6,182,212,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* HUD brackets header */}
        <div className="relative p-4 border-b" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: '#06b6d4' }} />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: '#06b6d4' }} />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: '#06b6d4' }} />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: '#06b6d4' }} />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale size={16} style={{ color: '#06b6d4' }} />
              <span className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'PERBANDINGAN NEGERI' : 'STATE COMPARISON'}
              </span>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-cyan-950/30">
              <X size={16} style={{ color: 'rgba(6,182,212,0.5)' }} />
            </button>
          </div>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <label className="text-[10px] font-mono tracking-wider mb-1.5 block" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'NEGERI A' : 'STATE A'}
            </label>
            <select
              value={stateA}
              onChange={e => setStateA(e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-xs font-mono"
              style={{ background: 'rgba(10,14,26,0.9)', borderColor: 'rgba(6,182,212,0.2)', color: '#e0f7fa' }}
            >
              <option value="">{lang === 'ms' ? 'Pilih negeri...' : 'Select state...'}</option>
              {STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-mono tracking-wider mb-1.5 block" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'NEGERI B' : 'STATE B'}
            </label>
            <select
              value={stateB}
              onChange={e => setStateB(e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-xs font-mono"
              style={{ background: 'rgba(10,14,26,0.9)', borderColor: 'rgba(6,182,212,0.2)', color: '#e0f7fa' }}
            >
              <option value="">{lang === 'ms' ? 'Pilih negeri...' : 'Select state...'}</option>
              {STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Comparison Panel */}
        {dataA && dataB && (
          <div className="px-4 pb-4 space-y-2">
            {/* State Headers */}
            <div className="grid grid-cols-[1fr_60px_1fr] gap-2 mb-3">
              <div className="text-center p-2 rounded-md border" style={{ background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)' }}>
                <div className="text-xs font-mono tracking-wider" style={{ color: 'rgba(6,182,212,0.5)' }}>
                  {dataA.region === 'east_malaysia' ? 'EAST MY' : 'PENINSULAR'}
                </div>
                <div className="text-sm font-bold" style={{ color: '#06b6d4' }}>{dataA.name}</div>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(6,182,212,0.1)', color: 'rgba(6,182,212,0.5)' }}>VS</span>
              </div>
              <div className="text-center p-2 rounded-md border" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)' }}>
                <div className="text-xs font-mono tracking-wider" style={{ color: 'rgba(245,158,11,0.5)' }}>
                  {dataB.region === 'east_malaysia' ? 'EAST MY' : 'PENINSULAR'}
                </div>
                <div className="text-sm font-bold" style={{ color: '#f59e0b' }}>{dataB.name}</div>
              </div>
            </div>

            {/* Metrics */}
            {comparisonMetrics.map(m => {
              const valA = dataA[m.key as keyof typeof dataA] as number;
              const valB = dataB[m.key as keyof typeof dataB] as number;
              const winner = getWinner(m.key, valA, valB, m.lower);
              const diff = getDiff(valA, valB);
              const formatVal = (v: number) => m.format ? m.format(v) : v.toLocaleString();
              const maxVal = Math.max(valA, valB, 1);

              return (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md border p-2.5"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: `${m.color}15`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-wider" style={{ color: m.color }}>
                      {lang === 'ms' ? m.label_ms : m.label_en}
                    </span>
                    <span className="text-[9px] font-mono" style={{ color: diff > 0 ? '#10b981' : 'rgba(6,182,212,0.3)' }}>
                      {diff > 0 ? `${diff.toFixed(1)}% ${lang === 'ms' ? 'perbezaan' : 'diff'}` : (lang === 'ms' ? 'Sama' : 'Equal')}
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_60px_1fr] gap-2 items-center">
                    {/* State A value */}
                    <div className="text-right">
                      <span className={`text-sm font-mono font-bold ${winner === 'A' ? '' : ''}`} style={{
                        color: winner === 'A' ? '#10b981' : winner === 'B' ? '#94a3b8' : '#e0f7fa',
                        textShadow: winner === 'A' ? '0 0 10px rgba(16,185,129,0.4)' : 'none',
                      }}>
                        {formatVal(valA)}
                        <span className="text-[8px] font-normal ml-0.5 opacity-50">{m.unit}</span>
                      </span>
                    </div>
                    {/* Center bar comparison */}
                    <div className="flex flex-col items-center gap-0.5">
                      <ArrowRight size={10} style={{ color: 'rgba(6,182,212,0.3)', transform: 'rotate(0deg)' }} />
                      <div className="w-full h-1.5 flex gap-px">
                        <div className="flex-1 flex justify-end">
                          <div className="h-full rounded-l-sm" style={{
                            width: `${(valA / maxVal) * 100}%`,
                            background: winner === 'A' ? '#10b981' : '#06b6d4',
                            opacity: winner === 'A' ? 1 : 0.4,
                          }} />
                        </div>
                        <div className="w-px" style={{ background: 'rgba(6,182,212,0.2)' }} />
                        <div className="flex-1">
                          <div className="h-full rounded-r-sm" style={{
                            width: `${(valB / maxVal) * 100}%`,
                            background: winner === 'B' ? '#10b981' : '#f59e0b',
                            opacity: winner === 'B' ? 1 : 0.4,
                          }} />
                        </div>
                      </div>
                    </div>
                    {/* State B value */}
                    <div className="text-left">
                      <span className="text-sm font-mono font-bold" style={{
                        color: winner === 'B' ? '#10b981' : winner === 'A' ? '#94a3b8' : '#e0f7fa',
                        textShadow: winner === 'B' ? '0 0 10px rgba(16,185,129,0.4)' : 'none',
                      }}>
                        {formatVal(valB)}
                        <span className="text-[8px] font-normal ml-0.5 opacity-50">{m.unit}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {(!dataA || !dataB) && (
          <div className="p-8 text-center">
            <Scale size={32} className="mx-auto mb-3" style={{ color: 'rgba(6,182,212,0.2)' }} />
            <p className="text-xs font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
              {lang === 'ms' ? 'Pilih dua negeri untuk memulakan perbandingan' : 'Select two states to start comparison'}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Dataset Detail Drawer ───────────────────────────────────────
function DatasetDetailDrawer({ dataset, lang, onClose }: {
  dataset: typeof DATASETS[0]; lang: Lang; onClose: () => void;
}) {
  const getCategoryColor = (cat: string) => {
    const found = DATASET_CATEGORIES.find(c => c.en === cat);
    return found?.color || '#64748b';
  };
  const catColor = getCategoryColor(dataset.category_en);
  const freqColor = FREQUENCY_COLORS[dataset.frequency] || '#64748b';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md overflow-y-auto custom-scrollbar border-l"
        style={{
          background: '#0a0e1a',
          borderColor: 'rgba(6,182,212,0.15)',
          boxShadow: '-20px 0 60px rgba(6,182,212,0.1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-4 border-b" style={{ background: 'rgba(10,14,26,0.98)', borderColor: 'rgba(6,182,212,0.12)' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <div className="text-xs font-mono tracking-wider mb-1" style={{ color: catColor }}>
                {lang === 'ms' ? dataset.category_ms : dataset.category_en} / {lang === 'ms' ? dataset.subcategory_ms : dataset.subcategory_en}
              </div>
              <h3 className="text-sm font-bold" style={{ color: '#e0f7fa' }}>
                {lang === 'ms' ? dataset.title_ms : dataset.title_en}
              </h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-cyan-950/30 flex-shrink-0">
              <X size={16} style={{ color: 'rgba(6,182,212,0.5)' }} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Description */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(6,182,212,0.03)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <FileText size={12} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'PENERANGAN' : 'DESCRIPTION'}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
              {lang === 'ms' ? dataset.description_ms : dataset.description_en}
            </p>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-[9px] px-2 py-1 rounded font-mono" style={{
              background: `${catColor}15`,
              color: catColor,
              border: `1px solid ${catColor}30`,
            }}>
              <Tag size={9} />
              {lang === 'ms' ? dataset.category_ms : dataset.category_en}
            </span>
            <span className="flex items-center gap-1 text-[9px] px-2 py-1 rounded font-mono" style={{
              background: `${freqColor}15`,
              color: freqColor,
              border: `1px solid ${freqColor}30`,
            }}>
              <Clock size={9} />
              {dataset.frequency}
            </span>
          </div>

          {/* Geography */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Globe size={12} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'LIPUTAN GEOGRAFI' : 'GEOGRAPHY COVERAGE'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dataset.geography.length > 0 ? dataset.geography.map(g => (
                <span key={g} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{
                  background: 'rgba(6,182,212,0.08)',
                  color: '#06b6d4',
                  border: '1px solid rgba(6,182,212,0.15)',
                }}>
                  {g}
                </span>
              )) : (
                <span className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>—</span>
              )}
            </div>
          </div>

          {/* Demography */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Users size={12} style={{ color: '#ec4899' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#ec4899' }}>
                {lang === 'ms' ? 'PECAHAN DEMOGRAFI' : 'DEMOGRAPHY BREAKDOWN'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dataset.demography.length > 0 ? dataset.demography.map(d => (
                <span key={d} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{
                  background: 'rgba(236,72,153,0.08)',
                  color: '#ec4899',
                  border: '1px solid rgba(236,72,153,0.15)',
                }}>
                  {d}
                </span>
              )) : (
                <span className="text-[9px] font-mono" style={{ color: 'rgba(236,72,153,0.3)' }}>
                  {lang === 'ms' ? 'Tiada pecahan' : 'No breakdown'}
                </span>
              )}
            </div>
          </div>

          {/* Data Sources */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Database size={12} style={{ color: '#f59e0b' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#f59e0b' }}>
                {lang === 'ms' ? 'SUMBER DATA' : 'DATA SOURCE'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dataset.data_source.map(src => (
                <span key={src} className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold" style={{
                  background: 'rgba(245,158,11,0.08)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.15)',
                }}>
                  {src}
                </span>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar size={12} style={{ color: '#10b981' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#10b981' }}>
                {lang === 'ms' ? 'JULAT DATA' : 'DATA TIME RANGE'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold" style={{ color: '#e0f7fa' }}>{dataset.dataset_begin}</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(16,185,129,0.2)' }}>
                <ArrowRight size={10} className="mx-auto -mt-[5px]" style={{ color: '#10b981' }} />
              </div>
              <span className="text-sm font-mono font-bold" style={{ color: '#e0f7fa' }}>{dataset.dataset_end}</span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={12} style={{ color: '#8b5cf6' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#8b5cf6' }}>
                {lang === 'ms' ? 'KEMAS KINI TERAKHIR' : 'LAST UPDATED'}
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: '#e0f7fa' }}>{dataset.last_updated}</span>
          </div>

          {/* Download Links */}
          <div className="rounded-md border p-3" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <FileDown size={12} style={{ color: '#06b6d4' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'MUAT TURUN' : 'DOWNLOAD'}
              </span>
            </div>
            <div className="space-y-2">
              <a
                href={dataset.link_parquet}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-mono transition-all hover:border-cyan-500/30"
                style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}
              >
                <Download size={12} />
                <span>Parquet</span>
                <span className="ml-auto text-[8px] opacity-50">{dataset.id}.parquet</span>
              </a>
              <a
                href={dataset.link_csv}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-mono transition-all hover:border-cyan-500/30"
                style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}
              >
                <Download size={12} />
                <span>CSV</span>
                <span className="ml-auto text-[8px] opacity-50">{dataset.id}.csv</span>
              </a>
              <a
                href={`https://data.gov.my/data-catalogue/${dataset.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-mono transition-all hover:border-cyan-500/30"
                style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
              >
                <ExternalLink size={12} />
                <span>data.gov.my</span>
                <span className="ml-auto text-[8px] opacity-50">{dataset.id}</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Datasets Section ────────────────────────────────────────────
function DatasetsSection({ lang }: { lang: Lang }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [freqFilter, setFreqFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedDataset, setSelectedDataset] = useState<typeof DATASETS[0] | null>(null);
  const perPage = 20;

  const filtered = useMemo(() => {
    let result = DATASETS;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.title_en.toLowerCase().includes(q) || d.title_ms.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) || d.description_en.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'ALL') result = result.filter(d => d.category_en === categoryFilter);
    if (freqFilter !== 'ALL') result = result.filter(d => d.frequency === freqFilter);
    return result;
  }, [search, categoryFilter, freqFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const categories = useMemo(() => ['ALL', ...new Set(DATASETS.map(d => d.category_en))].sort(), []);
  const frequencies = useMemo(() => ['ALL', ...new Set(DATASETS.map(d => d.frequency))].sort(), []);

  const getCategoryColor = (cat: string) => {
    const found = DATASET_CATEGORIES.find(c => c.en === cat);
    return found?.color || '#64748b';
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(6,182,212,0.5)' }} />
          <input
            type="text"
            placeholder={lang === 'ms' ? 'Cari set data...' : 'Search datasets...'}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-md border text-xs font-mono"
            style={{
              background: 'rgba(10,14,26,0.9)',
              borderColor: 'rgba(6,182,212,0.15)',
              color: '#e0f7fa',
            }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-md border text-xs font-mono"
          style={{ background: 'rgba(10,14,26,0.9)', borderColor: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}
        >
          {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? (lang === 'ms' ? 'Semua Kategori' : 'All Categories') : c}</option>)}
        </select>
        <select
          value={freqFilter}
          onChange={e => { setFreqFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-md border text-xs font-mono"
          style={{ background: 'rgba(10,14,26,0.9)', borderColor: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}
        >
          {frequencies.map(f => <option key={f} value={f}>{f === 'ALL' ? (lang === 'ms' ? 'Semua Frekuensi' : 'All Frequencies') : f}</option>)}
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
          {filtered.length} {lang === 'ms' ? 'set data dijumpai' : 'datasets found'}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(6,182,212,0.12)',
      }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.12)' }}>
                <th className="text-left px-3 py-2 font-mono tracking-wider" style={{ color: '#06b6d4' }}>#</th>
                <th className="text-left px-3 py-2 font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'TAJUK' : 'TITLE'}
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider hidden md:table-cell" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'KATEGORI' : 'CATEGORY'}
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'FREKUENSI' : 'FREQ'}
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider hidden lg:table-cell" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'GEOGRAFI' : 'GEO'}
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider hidden lg:table-cell" style={{ color: '#06b6d4' }}>
                  YEARS
                </th>
                <th className="text-left px-3 py-2 font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                  <ExternalLink size={10} />
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={d.id} className="hover:bg-cyan-950/20 transition-colors cursor-pointer" style={{
                  borderBottom: '1px solid rgba(6,182,212,0.05)',
                }} onClick={() => setSelectedDataset(d)}>
                  <td className="px-3 py-2 font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium" style={{ color: '#e0f7fa' }}>
                      {lang === 'ms' ? d.title_ms : d.title_en}
                    </div>
                    <div className="text-[9px] opacity-50 mt-0.5 truncate max-w-xs" style={{ color: '#94a3b8' }}>
                      {lang === 'ms' ? d.description_ms : d.description_en}
                    </div>
                  </td>
                  <td className="px-3 py-2 hidden md:table-cell">
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{
                      background: `${getCategoryColor(d.category_en)}15`,
                      color: getCategoryColor(d.category_en),
                      border: `1px solid ${getCategoryColor(d.category_en)}30`,
                    }}>
                      {lang === 'ms' ? d.category_ms : d.category_en}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{
                      background: `${FREQUENCY_COLORS[d.frequency] || '#64748b'}15`,
                      color: FREQUENCY_COLORS[d.frequency] || '#64748b',
                    }}>
                      {d.frequency}
                    </span>
                  </td>
                  <td className="px-3 py-2 hidden lg:table-cell">
                    <span className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>
                      {d.geography.join(', ') || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2 hidden lg:table-cell font-mono" style={{ color: '#94a3b8' }}>
                    {d.dataset_begin}–{d.dataset_end}
                  </td>
                  <td className="px-3 py-2">
                    <a
                      href={`https://data.gov.my/data-catalogue/${d.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded hover:bg-cyan-950/30"
                      style={{ color: '#06b6d4' }}
                    >
                      <ExternalLink size={8} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs font-mono disabled:opacity-30"
          style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}
        >
          <ChevronLeft size={12} /> {lang === 'ms' ? 'Sebelum' : 'Prev'}
        </button>
        <span className="text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
          {lang === 'ms' ? 'Halaman' : 'Page'} {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs font-mono disabled:opacity-30"
          style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}
        >
          {lang === 'ms' ? 'Seterusnya' : 'Next'} <ChevronRight size={12} />
        </button>
      </div>

      {/* Dataset Detail Drawer */}
      <AnimatePresence>
        {selectedDataset && (
          <DatasetDetailDrawer
            dataset={selectedDataset}
            lang={lang}
            onClose={() => setSelectedDataset(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Analytics Section ───────────────────────────────────────────
function AnalyticsSection({ lang }: { lang: Lang }) {
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

// ─── Infographic Export Modal ────────────────────────────────────
function InfographicModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['population', 'gdp', 'births']);
  const [fontSize, setFontSize] = useState<'S' | 'M' | 'L'>('M');
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const layers = [
    { id: 'population', label_en: 'Population', label_ms: 'Penduduk', color: '#06b6d4' },
    { id: 'gdp', label_en: 'GDP & Economy', label_ms: 'KDNK & Ekonomi', color: '#f59e0b' },
    { id: 'demography', label_en: 'Demography', label_ms: 'Demografi', color: '#10b981' },
    { id: 'healthcare', label_en: 'Healthcare', label_ms: 'Kesihatan', color: '#ec4899' },
    { id: 'environment', label_en: 'Environment', label_ms: 'Alam Sekitar', color: '#22c55e' },
    { id: 'education', label_en: 'Education', label_ms: 'Pendidikan', color: '#3b82f6' },
  ];

  const toggleLayer = (id: string) => {
    setSelectedLayers(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (previewRef.current) {
        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          backgroundColor: '#0a0e1a',
          useCORS: true,
        });
        const link = document.createElement('a');
        link.download = `malaysia-data-infographic-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (e) {
      console.error('Export failed:', e);
    }
    setExporting(false);
  };

  const fs = fontSize === 'S' ? '10px' : fontSize === 'M' ? '12px' : '14px';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border custom-scrollbar"
        style={{
          background: '#0a0e1a',
          borderColor: 'rgba(6,182,212,0.2)',
          boxShadow: '0 0 60px rgba(6,182,212,0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
          <div className="flex items-center gap-2">
            <Printer size={16} style={{ color: '#06b6d4' }} />
            <span className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'EKSPOR INFOGRAFIK' : 'INFOGRAPHIC EXPORT'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-cyan-950/30">
            <X size={16} style={{ color: 'rgba(6,182,212,0.5)' }} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'PILIH LAPISAN' : 'SELECT LAYERS'}
              </div>
              <div className="space-y-1.5">
                {layers.map(l => (
                  <button
                    key={l.id}
                    onClick={() => toggleLayer(l.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md border text-left text-xs font-mono transition-all"
                    style={{
                      background: selectedLayers.includes(l.id) ? `${l.color}15` : 'rgba(10,14,26,0.8)',
                      borderColor: selectedLayers.includes(l.id) ? `${l.color}40` : 'rgba(6,182,212,0.1)',
                      color: selectedLayers.includes(l.id) ? l.color : '#94a3b8',
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-sm border" style={{
                      background: selectedLayers.includes(l.id) ? l.color : 'transparent',
                      borderColor: l.color,
                    }} />
                    {lang === 'ms' ? l.label_ms : l.label_en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'SAIZ FONT' : 'FONT SIZE'}
              </div>
              <div className="flex gap-2">
                {(['S', 'M', 'L'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className="px-3 py-1.5 rounded border text-xs font-mono"
                    style={{
                      background: fontSize === s ? 'rgba(6,182,212,0.15)' : 'rgba(10,14,26,0.8)',
                      borderColor: fontSize === s ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.1)',
                      color: fontSize === s ? '#06b6d4' : '#94a3b8',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={exporting || selectedLayers.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border text-xs font-mono font-bold disabled:opacity-30"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(16,185,129,0.1))',
                borderColor: 'rgba(6,182,212,0.3)',
                color: '#06b6d4',
              }}
            >
              <Download size={14} />
              {exporting
                ? (lang === 'ms' ? 'MENGEKSPORT...' : 'EXPORTING...')
                : (lang === 'ms' ? 'EKSPOR PNG (2x)' : 'EXPORT PNG (2x)')
              }
            </button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'PRATONTON' : 'PREVIEW'}
            </div>
            <div ref={previewRef} className="rounded-lg border p-6" style={{
              background: '#0a0e1a',
              borderColor: 'rgba(6,182,212,0.12)',
              fontSize: fs,
            }}>
              {/* Infographic Header */}
              <div className="text-center mb-6 pb-4" style={{ borderBottom: '1px solid rgba(6,182,212,0.15)' }}>
                <div className="text-[9px] font-mono tracking-[0.3em] mb-1" style={{ color: 'rgba(6,182,212,0.5)' }}>DATA.GOV.MY</div>
                <div className="text-xl font-bold" style={{ color: '#06b6d4', textShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
                  {lang === 'ms' ? 'PUSAT PERINTAH DATA MALAYSIA' : 'MALAYSIA DATA COMMAND CENTER'}
                </div>
                <div className="text-[10px] font-mono mt-1" style={{ color: '#94a3b8' }}>
                  {lang === 'ms' ? 'Infografik Data Nasional' : 'National Data Infographic'} — {new Date().getFullYear()}
                </div>
              </div>

              {/* Overview Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 rounded border" style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)' }}>
                  <div className="text-lg font-bold font-mono" style={{ color: '#06b6d4' }}>34.3M</div>
                  <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Penduduk' : 'Population'}</div>
                </div>
                <div className="text-center p-3 rounded border" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.1)' }}>
                  <div className="text-lg font-bold font-mono" style={{ color: '#f59e0b' }}>RM1.68T</div>
                  <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'KDNK' : 'GDP'}</div>
                </div>
                <div className="text-center p-3 rounded border" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.1)' }}>
                  <div className="text-lg font-bold font-mono" style={{ color: '#10b981' }}>287</div>
                  <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Set Data' : 'Datasets'}</div>
                </div>
              </div>

              {/* Selected Layers Content */}
              {selectedLayers.includes('population') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                    ▸ {lang === 'ms' ? 'PENDUDUK MENGIKUT NEGERI' : 'POPULATION BY STATE'}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {STATES.slice().sort((a,b) => b.population - a.population).slice(0, 8).map(s => (
                      <div key={s.id} className="p-1.5 rounded border" style={{ background: 'rgba(6,182,212,0.03)', borderColor: 'rgba(6,182,212,0.08)' }}>
                        <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{s.abbr}</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: '#e0f7fa' }}>{s.population.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLayers.includes('gdp') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#f59e0b' }}>
                    ▸ {lang === 'ms' ? 'KDNK MENGIKUT NEGERI' : 'GDP BY STATE'}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {STATES.slice().sort((a,b) => b.gdp - a.gdp).slice(0, 8).map(s => (
                      <div key={s.id} className="p-1.5 rounded border" style={{ background: 'rgba(245,158,11,0.03)', borderColor: 'rgba(245,158,11,0.08)' }}>
                        <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{s.abbr}</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: '#e0f7fa' }}>RM{(s.gdp/1000).toFixed(1)}B</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLayers.includes('demography') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#10b981' }}>
                    ▸ {lang === 'ms' ? 'STATISTIK VITAL' : 'VITAL STATISTICS'}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 p-2 rounded border text-center" style={{ background: 'rgba(16,185,129,0.03)', borderColor: 'rgba(16,185,129,0.08)' }}>
                      <div className="text-sm font-bold font-mono" style={{ color: '#10b981' }}>602.9k</div>
                      <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Kelahiran' : 'Births'}</div>
                    </div>
                    <div className="flex-1 p-2 rounded border text-center" style={{ background: 'rgba(239,68,68,0.03)', borderColor: 'rgba(239,68,68,0.08)' }}>
                      <div className="text-sm font-bold font-mono" style={{ color: '#ef4444' }}>159.7k</div>
                      <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Kematian' : 'Deaths'}</div>
                    </div>
                    <div className="flex-1 p-2 rounded border text-center" style={{ background: 'rgba(139,92,246,0.03)', borderColor: 'rgba(139,92,246,0.08)' }}>
                      <div className="text-sm font-bold font-mono" style={{ color: '#8b5cf6' }}>3.4%</div>
                      <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Pengangguran' : 'Unemployment'}</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedLayers.includes('healthcare') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#ec4899' }}>
                    ▸ {lang === 'ms' ? 'KESIHATAN' : 'HEALTHCARE'}
                  </div>
                  <div className="p-2 rounded border" style={{ background: 'rgba(236,72,153,0.03)', borderColor: 'rgba(236,72,153,0.08)' }}>
                    <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>
                      {lang === 'ms'
                        ? 'Data penjagaan kesihatan merangkumi imunisasi bayi, penendermaan darah, katil hospital, dan kakitangan kesihatan dari KKM.'
                        : 'Healthcare data covers infant immunisation, blood donations, hospital beds, and healthcare staffing from KKM.'
                      }
                    </div>
                  </div>
                </div>
              )}

              {selectedLayers.includes('environment') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#22c55e' }}>
                    ▸ {lang === 'ms' ? 'ALAM SEKITAR' : 'ENVIRONMENT'}
                  </div>
                  <div className="p-2 rounded border" style={{ background: 'rgba(34,197,94,0.03)', borderColor: 'rgba(34,197,94,0.08)' }}>
                    <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>
                      {lang === 'ms'
                        ? 'Data alam sekitar merangkumi pencemaran udara, akses air, penggunaan elektrik, dan rizab hutan dari DOSM dan KASA.'
                        : 'Environmental data covers air pollution, water access, electricity consumption, and forest reserves from DOSM and KASA.'
                      }
                    </div>
                  </div>
                </div>
              )}

              {selectedLayers.includes('education') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#3b82f6' }}>
                    ▸ {lang === 'ms' ? 'PENDIDIKAN' : 'EDUCATION'}
                  </div>
                  <div className="p-2 rounded border" style={{ background: 'rgba(59,130,246,0.03)', borderColor: 'rgba(59,130,246,0.08)' }}>
                    <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>
                      {lang === 'ms'
                        ? 'Data pendidikan merangkumi pendaftaran sekolah, guru, pensyarah universiti, dan kadar tamat sekolah dari KPM.'
                        : 'Education data covers school enrolment, teachers, university lecturers, and school completion rates from KPM.'
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Footer attribution */}
              <div className="mt-6 pt-4 text-center" style={{ borderTop: '1px solid rgba(6,182,212,0.1)' }}>
                <div className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
                  {lang === 'ms'
                    ? 'Data diperoleh daripada data.gov.my • Lesen CC BY 4.0 • Pusat Perintah Data Malaysia v3.0'
                    : 'Data sourced from data.gov.my • CC BY 4.0 License • Malaysia Data Command Center v3.0'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── FAQ & Info Section ──────────────────────────────────────────
function InfoSection({ lang }: { lang: Lang }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* FAQ */}
      <div className="rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(6,182,212,0.12)',
      }}>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={14} style={{ color: '#06b6d4' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
            {lang === 'ms' ? 'SOALAN LAZIM' : 'FREQUENTLY ASKED QUESTIONS'}
          </span>
        </div>
        <div className="space-y-2">
          {FAQ_DATA.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-2 px-3 rounded text-left text-xs transition-colors hover:bg-cyan-950/20"
                style={{ color: '#e0f7fa' }}
              >
                <span>{lang === 'ms' ? faq.q_ms : faq.q_en}</span>
                <ChevronDown size={12} style={{
                  color: '#06b6d4',
                  transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-2 text-[11px] leading-relaxed" style={{ color: '#94a3b8' }}>
                      {lang === 'ms' ? faq.a_ms : faq.a_en}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimers */}
      <div className="rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(245,158,11,0.12)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#f59e0b' }}>
            {lang === 'ms' ? 'PENAFIAN' : 'DISCLAIMERS'}
          </span>
        </div>
        <ul className="space-y-1.5">
          {(lang === 'ms' ? DISCLAIMERS.ms : DISCLAIMERS.en).map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: '#94a3b8' }}>
              <span style={{ color: '#f59e0b' }}>•</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      {/* Citations */}
      <div className="rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(16,185,129,0.12)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={14} style={{ color: '#10b981' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#10b981' }}>
            {lang === 'ms' ? 'SUMBER & PETIKAN' : 'SOURCES & CITATIONS'}
          </span>
        </div>
        <div className="space-y-2">
          {CITATIONS.map((c, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 px-2 rounded" style={{ background: 'rgba(16,185,129,0.03)' }}>
              <Shield size={10} className="mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
              <div>
                <div className="text-xs font-medium" style={{ color: '#e0f7fa' }}>{c.source}</div>
                <div className="text-[10px]" style={{ color: '#94a3b8' }}>{c.description}</div>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-mono inline-flex items-center gap-0.5" style={{ color: '#10b981' }}>
                  <ExternalLink size={8} /> {c.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Command Palette ──────────────────────────────────────────────
function CommandPalette({ lang, onClose, onAction }: {
  lang: Lang; onClose: () => void;
  onAction: (action: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const baseCommands = [
    { id: 'tab-overview', label_en: 'Go to Overview', label_ms: 'Pergi ke Gambaran', icon: LayoutDashboard, shortcut: '1' },
    { id: 'tab-geomap', label_en: 'Go to GeoMap', label_ms: 'Pergi ke PetaGeo', icon: Map, shortcut: '2' },
    { id: 'tab-datasets', label_en: 'Go to Datasets', label_ms: 'Pergi ke Set Data', icon: Database, shortcut: '3' },
    { id: 'tab-analytics', label_en: 'Go to Analytics', label_ms: 'Pergi ke Analitik', icon: BarChart3, shortcut: '4' },
    { id: 'toggle-lang', label_en: 'Toggle Language', label_ms: 'Tukar Bahasa', icon: Languages, shortcut: 'L' },
    { id: 'open-infographic', label_en: 'Open Infographic Export', label_ms: 'Buka Eksport Infografik', icon: Printer, shortcut: 'E' },
    { id: 'toggle-info', label_en: 'Toggle Info Panel', label_ms: 'Togol Panel Maklumat', icon: Info, shortcut: 'I' },
  ];

  const datasetCommands = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return DATASETS
      .filter(d => d.title_en.toLowerCase().includes(q) || d.title_ms.toLowerCase().includes(q))
      .slice(0, 20)
      .map(d => ({
        id: `dataset-${d.id}`,
        label_en: d.title_en,
        label_ms: d.title_ms,
        icon: FileText,
        shortcut: '',
        category: d.category_en,
      }));
  }, [query]);

  const allItems = useMemo(() => {
    const items: typeof baseCommands & { category?: string }[] = [...baseCommands];
    if (datasetCommands.length > 0) {
      items.push(...(datasetCommands as (typeof baseCommands & { category?: string })[]));
    }
    return items;
  }, [baseCommands, datasetCommands]);

  const filtered = useMemo(() => {
    if (!query) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(item =>
      item.label_en.toLowerCase().includes(q) ||
      item.label_ms.toLowerCase().includes(q) ||
      ('category' in item && item.category?.toLowerCase().includes(q))
    );
  }, [query, allItems]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onAction(filtered[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-lg rounded-lg border overflow-hidden"
        style={{
          background: 'rgba(8,12,24,0.98)',
          borderColor: 'rgba(6,182,212,0.3)',
          boxShadow: '0 0 40px rgba(6,182,212,0.15), 0 25px 50px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'rgba(6,182,212,0.15)' }}>
          <Command size={16} style={{ color: '#06b6d4' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'ms' ? 'Taip arahan atau cari set data...' : 'Type a command or search datasets...'}
            className="flex-1 bg-transparent outline-none text-sm font-mono"
            style={{ color: '#e0f7fa', caretColor: '#06b6d4' }}
          />
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.15)',
            color: 'rgba(6,182,212,0.5)',
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto custom-scrollbar py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search size={20} style={{ color: 'rgba(6,182,212,0.2)' }} className="mx-auto mb-2" />
              <p className="text-xs font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
                {lang === 'ms' ? 'Tiada hasil dijumpai' : 'No results found'}
              </p>
            </div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { onAction(item.id); onClose(); }}
                onMouseEnter={() => setSelectedIndex(i)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{
                  background: i === selectedIndex ? 'rgba(6,182,212,0.1)' : 'transparent',
                }}
              >
                <item.icon size={14} style={{ color: i === selectedIndex ? '#06b6d4' : 'rgba(6,182,212,0.4)' }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono block truncate" style={{
                    color: i === selectedIndex ? '#06b6d4' : '#e0f7fa',
                  }}>
                    {'category' in item && item.category ? (
                      <>
                        <span style={{ color: 'rgba(6,182,212,0.4)' }}>{item.category} › </span>
                        {lang === 'ms' ? item.label_ms : item.label_en}
                      </>
                    ) : (
                      lang === 'ms' ? item.label_ms : item.label_en
                    )}
                  </span>
                </div>
                {item.shortcut && (
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                    background: i === selectedIndex ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.05)',
                    border: '1px solid rgba(6,182,212,0.15)',
                    color: i === selectedIndex ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                  }}>{item.shortcut}</kbd>
                )}
                {i === selectedIndex && (
                  <CornerDownLeft size={12} style={{ color: 'rgba(6,182,212,0.3)' }} />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t" style={{ borderColor: 'rgba(6,182,212,0.1)' }}>
          <div className="flex items-center gap-1.5">
            <ArrowUp size={10} style={{ color: 'rgba(6,182,212,0.3)' }} />
            <ArrowDown size={10} style={{ color: 'rgba(6,182,212,0.3)' }} />
            <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
              {lang === 'ms' ? 'Navigasi' : 'Navigate'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CornerDownLeft size={10} style={{ color: 'rgba(6,182,212,0.3)' }} />
            <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
              {lang === 'ms' ? 'Pilih' : 'Select'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="text-[7px] font-mono px-1 py-0.5 rounded" style={{
              background: 'rgba(6,182,212,0.05)',
              border: '1px solid rgba(6,182,212,0.1)',
              color: 'rgba(6,182,212,0.3)',
            }}>ESC</kbd>
            <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
              {lang === 'ms' ? 'Tutup' : 'Close'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Keyboard Shortcuts Modal ─────────────────────────────────────
function KeyboardShortcutsModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const shortcuts = [
    { key: '1', action_en: 'Go to Overview', action_ms: 'Pergi ke Gambaran' },
    { key: '2', action_en: 'Go to GeoMap', action_ms: 'Pergi ke PetaGeo' },
    { key: '3', action_en: 'Go to Datasets', action_ms: 'Pergi ke Set Data' },
    { key: '4', action_en: 'Go to Analytics', action_ms: 'Pergi ke Analitik' },
    { key: 'L', action_en: 'Toggle Language (EN/MS)', action_ms: 'Tukar Bahasa (EN/MS)' },
    { key: 'I', action_en: 'Toggle Info Panel', action_ms: 'Togol Panel Maklumat' },
    { key: 'E', action_en: 'Open Infographic Export', action_ms: 'Buka Eksport Infografik' },
    { key: '⌘K / Ctrl+K', action_en: 'Open Command Palette', action_ms: 'Buka Palet Arahan' },
    { key: 'ESC', action_en: 'Close Modal / Palette', action_ms: 'Tutup Modal / Palet' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-lg border overflow-hidden"
        style={{
          background: 'rgba(8,12,24,0.98)',
          borderColor: 'rgba(6,182,212,0.3)',
          boxShadow: '0 0 40px rgba(6,182,212,0.15), 0 25px 50px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(6,182,212,0.15)' }}>
          <div className="flex items-center gap-2">
            <HelpCircle size={16} style={{ color: '#06b6d4' }} />
            <span className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'PINTASAN PAPAN KEKUNCI' : 'KEYBOARD SHORTCUTS'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-cyan-950/30 transition-colors">
            <X size={14} style={{ color: 'rgba(6,182,212,0.5)' }} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="px-5 py-3 space-y-0">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5" style={{
              borderBottom: i < shortcuts.length - 1 ? '1px solid rgba(6,182,212,0.06)' : 'none',
            }}>
              <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>
                {lang === 'ms' ? s.action_ms : s.action_en}
              </span>
              <kbd className="text-[10px] font-mono px-2 py-1 rounded" style={{
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.2)',
                color: '#06b6d4',
                boxShadow: '0 0 8px rgba(6,182,212,0.05)',
              }}>{s.key}</kbd>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t" style={{ borderColor: 'rgba(6,182,212,0.1)' }}>
          <p className="text-[9px] font-mono text-center" style={{ color: 'rgba(6,182,212,0.3)' }}>
            {lang === 'ms'
              ? 'Pintasan tidak aktif semasa menaip dalam medan input'
              : 'Shortcuts are disabled while typing in input fields'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────
export default function Home() {
  const [booted, setBooted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [lang, setLang] = useState<Lang>('en');
  const [showInfographic, setShowInfographic] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<number | null>(null);

  // Scroll listener for scroll-to-top button
  useEffect(() => {
    if (!booted) return;
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [booted]);

  // Live data alert notifications
  useEffect(() => {
    if (!booted) return;
    let alertIndex = 0;
    const interval = setInterval(() => {
      setCurrentAlert(alertIndex);
      alertIndex = (alertIndex + 1) % 5;
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setCurrentAlert(null);
      }, 3000);
    }, 15000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [booted]);

  // Command palette action handler
  const handleCommandAction = useCallback((action: string) => {
    switch (action) {
      case 'tab-overview': setActiveTab('overview'); break;
      case 'tab-geomap': setActiveTab('geomap'); break;
      case 'tab-datasets': setActiveTab('datasets'); break;
      case 'tab-analytics': setActiveTab('analytics'); break;
      case 'toggle-lang': setLang(l => l === 'en' ? 'ms' : 'en'); break;
      case 'open-infographic': setShowInfographic(true); break;
      case 'toggle-info': setShowInfo(v => !v); break;
      default:
        // Dataset commands — switch to datasets tab
        if (action.startsWith('dataset-')) {
          setActiveTab('datasets');
        }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;

      // Ctrl+K / Cmd+K — always works
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(v => !v);
        return;
      }

      // Escape — close modals
      if (e.key === 'Escape') {
        if (showCommandPalette) { setShowCommandPalette(false); return; }
        if (showShortcutsModal) { setShowShortcutsModal(false); return; }
        if (showInfographic) { setShowInfographic(false); return; }
        return;
      }

      // Don't handle other shortcuts when typing in input fields
      if (isInput) return;

      switch (e.key) {
        case '1': setActiveTab('overview'); break;
        case '2': setActiveTab('geomap'); break;
        case '3': setActiveTab('datasets'); break;
        case '4': setActiveTab('analytics'); break;
        case 'l': case 'L': setLang(l => l === 'en' ? 'ms' : 'en'); break;
        case 'i': case 'I': setShowInfo(v => !v); break;
        case 'e': case 'E': setShowInfographic(true); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette, showShortcutsModal, showInfographic]);

  const tabs: { id: TabId; icon: React.ElementType; label_en: string; label_ms: string }[] = [
    { id: 'overview', icon: LayoutDashboard, label_en: 'Overview', label_ms: 'Gambaran' },
    { id: 'geomap', icon: Map, label_en: 'GeoMap', label_ms: 'PetaGeo' },
    { id: 'datasets', icon: Database, label_en: 'Datasets', label_ms: 'Set Data' },
    { id: 'analytics', icon: BarChart3, label_en: 'Analytics', label_ms: 'Analitik' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#0a0e1a' }}>
      <ParticleBackground />
      {/* Boot Sequence */}
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {booted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          {/* Header */}
          <Header />

          {/* Navigation Bar */}
          <nav className="flex-shrink-0 border-b px-4" style={{
            background: 'rgba(10,14,26,0.95)',
            borderColor: 'rgba(6,182,212,0.1)',
          }}>
            <div className="flex items-center justify-between max-w-[1400px] mx-auto">
              <div className="flex items-center gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono tracking-wider transition-all"
                    style={{
                      color: activeTab === tab.id ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                    }}
                  >
                    <tab.icon size={14} />
                    <span className="hidden sm:inline">{lang === 'ms' ? tab.label_ms : tab.label_en}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
                          boxShadow: '0 0 10px rgba(6,182,212,0.5)',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {/* Language Toggle */}
                <button
                  onClick={() => setLang(l => l === 'en' ? 'ms' : 'en')}
                  className="flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                >
                  <Languages size={10} />
                  {lang === 'en' ? 'BM' : 'EN'}
                </button>

                {/* Infographic Export */}
                <button
                  onClick={() => setShowInfographic(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                >
                  <Printer size={10} />
                  <span className="hidden sm:inline">{lang === 'ms' ? 'Infografik' : 'Infographic'}</span>
                </button>

                {/* Info */}
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider"
                  style={{
                    background: showInfo ? 'rgba(6,182,212,0.1)' : 'rgba(10,14,26,0.8)',
                    borderColor: showInfo ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                >
                  <Info size={10} />
                  <span className="hidden sm:inline">{lang === 'ms' ? 'Maklumat' : 'Info'}</span>
                </button>

                {/* Keyboard Shortcuts Help */}
                <button
                  onClick={() => setShowShortcutsModal(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                  title={lang === 'ms' ? 'Pintasan Papan Kekunci (?)' : 'Keyboard Shortcuts (?)'}
                >
                  <HelpCircle size={10} />
                  <span className="hidden sm:inline">?</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-4 py-4 max-w-[1400px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && <OverviewSection lang={lang} />}
                {activeTab === 'geomap' && <GeoMapSection lang={lang} />}
                {activeTab === 'datasets' && <DatasetsSection lang={lang} />}
                {activeTab === 'analytics' && <AnalyticsSection lang={lang} />}
              </motion.div>
            </AnimatePresence>

            {/* Info Section (shown below main content when toggled) */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <InfoSection lang={lang} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Enhanced Footer */}
          <footer className="mt-auto flex-shrink-0" style={{ background: 'rgba(10,14,26,0.98)' }}>
            {/* Top decorative gradient line */}
            <div className="h-px w-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.1)' }}>
              <motion.div
                className="h-full w-1/3"
                style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }}
                animate={{ x: ['-100%', '400%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            <div className="px-4 py-5">
              <div className="max-w-[1400px] mx-auto">
                {/* Grid layout — 4 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Column 1: Branding */}
                  <div>
                    <div className="text-xs font-mono font-bold tracking-wider mb-1" style={{
                      color: '#06b6d4',
                      textShadow: '0 0 10px rgba(6,182,212,0.4)',
                    }}>
                      MALAYSIA DATA COMMAND CENTER
                    </div>
                    <div className="text-[10px] font-mono mb-2" style={{ color: 'rgba(6,182,212,0.4)' }}>
                      Powered by data.gov.my
                    </div>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                      background: 'rgba(6,182,212,0.1)',
                      color: '#06b6d4',
                      border: '1px solid rgba(6,182,212,0.2)',
                    }}>
                      v3.0
                    </span>
                  </div>

                  {/* Column 2: Quick Stats */}
                  <div>
                    <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: 'rgba(6,182,212,0.5)' }}>
                      QUICK STATS
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-mono">
                      <span style={{ color: '#06b6d4' }}>287 <span style={{ color: 'rgba(6,182,212,0.4)' }}>Datasets</span></span>
                      <span style={{ color: '#f59e0b' }}>18 <span style={{ color: 'rgba(245,158,11,0.4)' }}>Categories</span></span>
                      <span style={{ color: '#10b981' }}>19 <span style={{ color: 'rgba(16,185,129,0.4)' }}>States/FT</span></span>
                      <span style={{ color: '#8b5cf6' }}>6 <span style={{ color: 'rgba(139,92,246,0.4)' }}>Data Layers</span></span>
                    </div>
                  </div>

                  {/* Column 3: Data Sources */}
                  <div>
                    <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: 'rgba(6,182,212,0.5)' }}>
                      DATA SOURCES
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'DOSM', color: '#06b6d4' },
                        { name: 'BNM', color: '#f59e0b' },
                        { name: 'KKM', color: '#ec4899' },
                        { name: 'JDN', color: '#8b5cf6' },
                      ].map(src => (
                        <span key={src.name} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                          background: `${src.color}10`,
                          border: `1px solid ${src.color}20`,
                          color: src.color,
                        }}>
                          <Database size={8} className="inline mr-1" style={{ color: src.color }} />
                          {src.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Column 4: License */}
                  <div>
                    <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: 'rgba(6,182,212,0.5)' }}>
                      LICENSE
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Copyright size={10} style={{ color: 'rgba(6,182,212,0.4)' }} />
                      <span className="text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>CC BY 4.0</span>
                    </div>
                    <a
                      href="https://data.gov.my"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-mono hover:underline"
                      style={{ color: '#06b6d4' }}
                    >
                      <ExternalLink size={8} />
                      Open Data Portal
                    </a>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="border-t pt-3 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
                  <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
                    © {new Date().getFullYear()} Malaysia Data Command Center. All rights reserved.
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
                    Built with Next.js
                  </div>
                </div>

                {/* Animated bottom scan line */}
                <div className="mt-2 h-px w-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.05)' }}>
                  <motion.div
                    className="h-full w-1/4"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }}
                    animate={{ x: ['-100%', '500%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </footer>
        </motion.div>
      )}

      {/* Infographic Export Modal */}
      <AnimatePresence>
        {showInfographic && (
          <InfographicModal lang={lang} onClose={() => setShowInfographic(false)} />
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <CommandPalette
            lang={lang}
            onClose={() => setShowCommandPalette(false)}
            onAction={handleCommandAction}
          />
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcutsModal && (
          <KeyboardShortcutsModal
            lang={lang}
            onClose={() => setShowShortcutsModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && booted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer transition-shadow hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            style={{
              background: 'rgba(10,14,26,0.95)',
              borderColor: 'rgba(6,182,212,0.3)',
              zIndex: 30,
              boxShadow: '0 0 10px rgba(6,182,212,0.2)',
            }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} style={{ color: '#06b6d4' }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Live Data Alert Notifications */}
      <AnimatePresence>
        {currentAlert !== null && booted && (
          <motion.div
            key={`alert-${currentAlert}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-20 right-4 w-64 rounded-md border overflow-hidden"
            style={{
              background: 'rgba(10,14,26,0.97)',
              borderColor: 'rgba(6,182,212,0.15)',
              zIndex: 35,
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            {(() => {
              const alerts = [
                { title: 'Population data synced', icon: Users, color: '#06b6d4' },
                { title: 'GDP estimates refreshed', icon: TrendingUp, color: '#f59e0b' },
                { title: 'New dataset available', icon: Database, color: '#10b981' },
                { title: 'CPI index updated', icon: Activity, color: '#ef4444' },
                { title: 'Labour force data refreshed', icon: Briefcase, color: '#8b5cf6' },
              ];
              const alert = alerts[currentAlert % alerts.length];
              const Icon = alert.icon;
              const now = new Date();
              const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
              return (
                <>
                  {/* Colored left border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: alert.color }} />
                  <div className="flex items-start gap-2.5 p-3 pl-4">
                    <Icon size={14} style={{ color: alert.color, flexShrink: 0, marginTop: 1 }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-mono font-medium truncate" style={{ color: alert.color }}>
                        {alert.title}
                      </div>
                      <div className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(6,182,212,0.35)' }}>
                        {timeStr}
                      </div>
                    </div>
                    <Bell size={10} style={{ color: 'rgba(6,182,212,0.3)', flexShrink: 0, marginTop: 2 }} />
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
