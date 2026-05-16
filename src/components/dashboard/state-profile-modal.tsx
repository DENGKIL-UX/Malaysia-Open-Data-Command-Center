'use client';

import { useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X, Users, TrendingUp, Baby, Heart, Briefcase, Database,
  MapPin, ArrowUpRight, Award, Lightbulb, Compass,
} from 'lucide-react';
import { STATES, MALAYSIA_TOTALS } from '@/lib/data/malaysia-data';
import type { Lang } from '@/lib/dashboard-types';

// ─── Types ──────────────────────────────────────────────────────────
interface StateProfileModalProps {
  stateId: string | null;
  lang: Lang;
  onClose: () => void;
}

// ─── Simulated 5-year sparkline data per state ──────────────────────
const sparklineData: Record<string, Record<string, number[]>> = {
  johor: { population: [3950, 4020, 4090, 4150, 4210], gdp: [135000, 138500, 141200, 145000, 148200], births: [76, 75, 74, 73.5, 73.5], deaths: [16, 16.5, 17, 17.4, 17.8] },
  kedah: { population: [2100, 2130, 2160, 2190, 2220], gdp: [48000, 49200, 50100, 51200, 52400], births: [44, 43.5, 43, 42.5, 42.1], deaths: [10, 10.3, 10.6, 10.9, 11.2] },
  kelantan: { population: [1900, 1930, 1960, 1985, 2010], gdp: [29000, 29800, 30500, 31300, 32100], births: [47, 46, 45.5, 44.8, 44.2], deaths: [8.5, 9, 9.2, 9.5, 9.8] },
  melaka: { population: [920, 940, 960, 975, 990], gdp: [35000, 36200, 37400, 38800, 40200], births: [18, 17.5, 17.2, 17, 16.8], deaths: [4.5, 4.7, 4.9, 5, 5.2] },
  'negeri-sembilan': { population: [1150, 1175, 1195, 1210, 1230], gdp: [41500, 42800, 44000, 45400, 46800], births: [22, 21.5, 21, 20.8, 20.5], deaths: [6.2, 6.5, 6.7, 6.9, 7.1] },
  pahang: { population: [1680, 1705, 1730, 1750, 1770], gdp: [56000, 57500, 59200, 60800, 62400], births: [35, 34.5, 34, 33.4, 32.8], deaths: [8, 8.5, 8.8, 9.1, 9.4] },
  perak: { population: [2480, 2490, 2500, 2510, 2520], gdp: [68000, 69800, 71200, 72900, 74600], births: [45, 44.5, 43.8, 43.2, 42.6], deaths: [13, 13.3, 13.6, 14, 14.3] },
  perlis: { population: [270, 275, 280, 285, 290], gdp: [6500, 6700, 6850, 7000, 7200], births: [6.2, 6.1, 6, 5.9, 5.8], deaths: [1.4, 1.5, 1.6, 1.7, 1.8] },
  'pulau-pinang': { population: [1720, 1745, 1765, 1785, 1800], gdp: [78000, 80000, 82000, 84600, 87200], births: [29, 28.5, 28, 27.5, 27.1], deaths: [9.5, 9.8, 10, 10.2, 10.5] },
  sabah: { population: [3650, 3710, 3770, 3830, 3900], gdp: [79000, 81000, 82500, 85000, 87600], births: [72, 71, 70, 69, 68.4], deaths: [12.5, 13, 13.4, 13.8, 14.2] },
  sarawak: { population: [2750, 2800, 2830, 2865, 2900], gdp: [110000, 113500, 116800, 119800, 122800], births: [51, 50, 49.5, 49, 48.2], deaths: [10, 10.5, 10.8, 11.2, 11.6] },
  selangor: { population: [6500, 6650, 6800, 6950, 7100], gdp: [320000, 330000, 340000, 351000, 362400], births: [125, 123, 121, 119.5, 118.2], deaths: [24, 24.8, 25.4, 26.1, 26.8] },
  terengganu: { population: [1210, 1230, 1250, 1265, 1280], gdp: [35500, 36500, 37500, 38500, 39600], births: [28, 27.2, 26.5, 26.2, 25.8], deaths: [6, 6.3, 6.5, 6.7, 6.9] },
  'wp-kuala-lumpur': { population: [1850, 1875, 1900, 1920, 1940], gdp: [205000, 210000, 215000, 222000, 228600], births: [35, 34, 33.5, 33, 32.4], deaths: [11, 11.3, 11.6, 11.8, 12.1] },
  'wp-labuan': { population: [100, 103, 105, 108, 110], gdp: [6000, 6200, 6400, 6600, 6800], births: [2.1, 2, 2, 1.95, 1.9], deaths: [0.5, 0.5, 0.55, 0.55, 0.6] },
  'wp-putrajaya': { population: [105, 108, 112, 116, 120], gdp: [4200, 4350, 4500, 4650, 4800], births: [2.3, 2.25, 2.2, 2.15, 2.1], deaths: [0.3, 0.32, 0.35, 0.38, 0.4] },
};

// ─── Quick Facts per state ──────────────────────────────────────────
const quickFacts: Record<string, { en: string[]; ms: string[] }> = {
  johor: { en: ['Southern Gateway to Malaysia', 'Home to Iskandar Malaysia economic zone', 'Legoland Malaysia Resort'], ms: ['Pintu Gerbang Selatan Malaysia', 'Zon ekonomi Iskandar Malaysia', 'Legoland Malaysia Resort'] },
  kedah: { en: ['Rice Bowl of Malaysia', 'Home to Langkawi Island', 'Oldest civilization in Malaysia (Bujang Valley)'], ms: ['Jelapang Padi Malaysia', 'Pulau Langkawi', 'Tamadun tertua di Malaysia (Lembah Bujang)'] },
  kelantan: { en: ['Cradle of Malay Culture', 'Renowned for batik and silverware', 'Home to Central Market (Siti Khadijah)'], ms: ['Budaya Melayu', 'Terkenal dengan batik dan perak', 'Pasar Besar Siti Khadijah'] },
  melaka: { en: ['UNESCO World Heritage Site (2008)', 'Historic port city founded 1400s', 'Home to Baba Nyonya culture'], ms: ['Tapak Warisan Dunia UNESCO (2008)', 'Bandar pelabuhan bersejarah abad ke-15', 'Budaya Baba Nyonya'] },
  'negeri-sembilan': { en: ['Unique Minangkabau matrilineal culture', 'Home to Port Dickson beaches', 'Adat Perpatih heritage'], ms: ['Budaya matrilineal Minangkabau', 'Pantai Port Dickson', 'Warisan Adat Perpatih'] },
  pahang: { en: ['Largest state in Peninsular Malaysia', 'Home to Cameron Highlands', 'Taman Negara National Park'], ms: ['Negeri terbesar di Semenanjung', 'Tanah Tinggi Cameron', 'Taman Negara'] },
  perak: { en: ['Silver State (rich in tin mining history)', 'Home to Pangkor Island', 'Ipoh — famous for white coffee'], ms: ['Negeri Perak (sejarah perlombongan timah)', 'Pulau Pangkor', 'Ipoh — terkenal kopi putih'] },
  perlis: { en: ['Smallest state in Malaysia', 'Famous for sugarcane and mangoes', 'Gua Kelam limestone cave'], ms: ['Negeri terkecil di Malaysia', 'Terkenal tebu dan mangga', 'Gua Kelam'] },
  'pulau-pinang': { en: ['UNESCO World Heritage Site (George Town)', 'Silicon Valley of the East', 'Top food destination in Asia'], ms: ['Tapak Warisan Dunia UNESCO (George Town)', 'Lembah Silikon Timur', 'Destinasi makanan terbaik di Asia'] },
  sabah: { en: ['2nd largest state by area', 'Mount Kinabalu — highest peak in SEA', 'Rich in biodiversity and rainforests'], ms: ['Negeri ke-2 terbesar mengikut keluasan', 'Gunung Kinabalu — puncak tertinggi di Asia Tenggara', 'Kaya biodiversiti dan hutan hujan'] },
  sarawak: { en: ['Largest state by area', 'Rich in natural resources (LNG, timber)', 'Rainforest heritage and hornbills'], ms: ['Negeri terbesar mengikut keluasan', 'Kaya sumber asli (LNG, kayu)', 'Warisan hutan hujan dan burung enggang'] },
  selangor: { en: ['Most populous state', 'Largest economy by GDP', 'Home to KLIA and Cyberjaya'], ms: ['Negeri paling ramai penduduk', 'Ekonomi terbesar mengikut KDNK', 'Rumah KLIA dan Cyberjaya'] },
  terengganu: { en: ['Beautiful coastline and islands', 'Rich in petroleum resources', 'Crystal Mosque landmark'], ms: ['Pantai dan pulau yang indah', 'Kaya sumber petroleum', 'Masjid Kristal'] },
  'wp-kuala-lumpur': { en: ['National capital', 'Highest population density', 'Financial hub of Malaysia'], ms: ['Ibu negara', 'Kepadatan penduduk tertinggi', 'Pusat kewangan Malaysia'] },
  'wp-labuan': { en: ['Federal territory off Borneo coast', 'Offshore financial centre', 'Duty-free island'], ms: ['Wilayah Persekutuan luar pantai Borneo', 'Pusat kewangan luar pesisir', 'Pulau bebas cukai'] },
  'wp-putrajaya': { en: ['Administrative capital of Malaysia', 'Planned garden city', 'Home to Perdana Putra (PM Office)'], ms: ['Ibu kota pentadbiran Malaysia', 'Bandar taman terancang', 'Perdana Putra (Pejabat PM)'] },
};

// ─── Neighboring states ─────────────────────────────────────────────
const neighbors: Record<string, string[]> = {
  johor: ['melaka', 'negeri-sembilan', 'pahang'],
  kedah: ['perlis', 'pulau-pinang', 'perak'],
  kelantan: ['terengganu', 'pahang', 'perak'],
  melaka: ['negeri-sembilan', 'johor'],
  'negeri-sembilan': ['melaka', 'johor', 'pahang', 'selangor'],
  pahang: ['selangor', 'negeri-sembilan', 'johor', 'terengganu', 'kelantan', 'perak'],
  perak: ['kedah', 'pulau-pinang', 'perlis', 'pahang', 'selangor'],
  perlis: ['kedah'],
  'pulau-pinang': ['kedah', 'perak'],
  sabah: ['sarawak', 'wp-labuan'],
  sarawak: ['sabah'],
  selangor: ['perak', 'pahang', 'negeri-sembilan', 'wp-kuala-lumpur'],
  terengganu: ['kelantan', 'pahang'],
  'wp-kuala-lumpur': ['selangor'],
  'wp-labuan': ['sabah'],
  'wp-putrajaya': ['selangor'],
};

// ─── Sparkline SVG Component ────────────────────────────────────────
function MiniSparkline({ data, color, width = 80, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((val, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: height - padding - ((val - min) / range) * (height - padding * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padding} L${points[0].x},${height - padding} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-grad-${color.replace('#', '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={2} fill={color} />
    </svg>
  );
}

// ─── HUD Bracket Component ─────────────────────────────────────────
function HUDBracket() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: 'rgba(6,182,212,0.35)' }} />
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: 'rgba(6,182,212,0.35)' }} />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: 'rgba(6,182,212,0.35)' }} />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: 'rgba(6,182,212,0.35)' }} />
    </div>
  );
}

// ─── Metric Comparison Bar ──────────────────────────────────────────
function MetricBar({ value, nationalAvg, color }: { value: number; nationalAvg: number; color: string }) {
  const pct = nationalAvg > 0 ? Math.min((value / nationalAvg) * 100, 200) : 0;
  const isGreen = pct >= 110;
  const isAmber = pct >= 90 && pct < 110;
  const isRed = pct < 90;
  const barColor = isGreen ? '#10b981' : isAmber ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(6,182,212,0.1)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(pct / 2, 100)}%`,
            background: barColor,
            boxShadow: `0 0 6px ${barColor}40`,
          }}
        />
      </div>
      <span className="text-[9px] font-mono w-10 text-right" style={{ color: barColor }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

// ─── Main State Profile Modal ──────────────────────────────────────
export function StateProfileModal({ stateId, lang, onClose }: StateProfileModalProps) {
  const stateData = useMemo(() => STATES.find(s => s.id === stateId), [stateId]);

  // Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!stateData) return null;

  const metrics = [
    { key: 'population', label_en: 'Population', label_ms: 'Penduduk', unit: "'000", icon: Users, color: '#06b6d4', format: (v: number) => v.toLocaleString() },
    { key: 'gdp', label_en: 'GDP', label_ms: 'KDNK', unit: 'RM M', icon: TrendingUp, color: '#f59e0b', format: (v: number) => `${(v / 1000).toFixed(1)}B` },
    { key: 'gdpGrowth', label_en: 'GDP Growth', label_ms: 'Pertumbuhan KDNK', unit: '%', icon: ArrowUpRight, color: '#10b981', format: (v: number) => `${v}%` },
    { key: 'births', label_en: 'Births', label_ms: 'Kelahiran', unit: "'000", icon: Baby, color: '#ec4899', format: (v: number) => v.toLocaleString() },
    { key: 'deaths', label_en: 'Deaths', label_ms: 'Kematian', unit: "'000", icon: Heart, color: '#ef4444', format: (v: number) => v.toLocaleString() },
    { key: 'unemployment', label_en: 'Unemployment', label_ms: 'Pengangguran', unit: '%', icon: Briefcase, color: '#8b5cf6', format: (v: number) => `${v}%` },
    { key: 'area', label_en: 'Area', label_ms: 'Keluasan', unit: 'km²', icon: MapPin, color: '#64748b', format: (v: number) => v.toLocaleString() },
    { key: 'density', label_en: 'Density', label_ms: 'Kepadatan', unit: '/km²', icon: Users, color: '#f97316', format: (v: number) => v.toLocaleString() },
    { key: 'datasets', label_en: 'Datasets', label_ms: 'Set Data', unit: '', icon: Database, color: '#06b6d4', format: (v: number) => v.toLocaleString() },
  ];

  // Regional ranking
  const regionPeers = STATES.filter(s => s.region === stateData.region);
  const regionRank = {
    population: regionPeers.sort((a, b) => b.population - a.population).findIndex(s => s.id === stateData.id) + 1,
    gdp: regionPeers.sort((a, b) => b.gdp - a.gdp).findIndex(s => s.id === stateData.id) + 1,
  };
  const totalInRegion = regionPeers.length;
  const regionLabel = stateData.region === 'east_malaysia'
    ? (lang === 'ms' ? 'Malaysia Timur' : 'East Malaysia')
    : (lang === 'ms' ? 'Semenanjung' : 'Peninsular');

  // Sparkline data for this state
  const stateSparkline = sparklineData[stateData.id];

  // Quick facts
  const facts = quickFacts[stateData.id];

  // Neighboring states
  const neighborIds = neighbors[stateData.id] || [];
  const neighborStates = neighborIds.map(id => STATES.find(s => s.id === id)!).filter(Boolean);

  // National averages
  const nationalAvgs: Record<string, number> = {
    population: MALAYSIA_TOTALS.population / STATES.length,
    gdp: MALAYSIA_TOTALS.gdp / STATES.length,
    gdpGrowth: MALAYSIA_TOTALS.gdpGrowth,
    births: MALAYSIA_TOTALS.births / STATES.length,
    deaths: MALAYSIA_TOTALS.deaths / STATES.length,
    unemployment: MALAYSIA_TOTALS.unemployment,
    area: MALAYSIA_TOTALS.area / STATES.length,
    density: MALAYSIA_TOTALS.density,
    datasets: MALAYSIA_TOTALS.datasets / STATES.length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border relative custom-scrollbar"
        style={{
          background: 'rgba(10,14,26,0.98)',
          borderColor: 'rgba(6,182,212,0.25)',
          boxShadow: '0 0 80px rgba(6,182,212,0.12), inset 0 1px 0 rgba(6,182,212,0.05)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <HUDBracket />

        {/* ─── Header ────────────────────────────────────────── */}
        <div className="relative p-5 border-b" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded" style={{
                  background: stateData.region === 'east_malaysia' ? 'rgba(16,185,129,0.1)' : 'rgba(6,182,212,0.1)',
                  border: `1px solid ${stateData.region === 'east_malaysia' ? 'rgba(16,185,129,0.25)' : 'rgba(6,182,212,0.25)'}`,
                  color: stateData.region === 'east_malaysia' ? '#10b981' : '#06b6d4',
                }}>
                  {regionLabel.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  color: '#f59e0b',
                }}>
                  {stateData.abbr}
                </span>
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#e0f7fa', textShadow: '0 0 20px rgba(6,182,212,0.15)' }}>
                {stateData.name}
              </h2>
              <p className="text-[11px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
                {stateData.name_ms}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md border transition-colors hover:bg-cyan-950/30"
              style={{ borderColor: 'rgba(6,182,212,0.15)' }}
              aria-label="Close"
            >
              <X size={16} style={{ color: 'rgba(6,182,212,0.5)' }} />
            </button>
          </div>
        </div>

        {/* ─── Body ──────────────────────────────────────────── */}
        <div className="p-5 space-y-5">

          {/* Regional Ranking Badge + Sparklines Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Regional Ranking */}
            <div className="rounded-lg border p-4" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.12)' }}>
              <div className="text-[10px] font-mono tracking-wider mb-3" style={{ color: '#06b6d4' }}>
                <Award size={10} className="inline mr-1" />
                {lang === 'ms' ? 'KEDUDUKAN WILAYAH' : 'REGIONAL RANKING'}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Penduduk' : 'Population'}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono font-bold" style={{
                      color: regionRank.population <= 3 ? '#10b981' : '#f59e0b',
                      textShadow: regionRank.population <= 3 ? '0 0 8px rgba(16,185,129,0.3)' : 'none',
                    }}>
                      #{regionRank.population}
                    </span>
                    <span className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.35)' }}>/ {totalInRegion}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'KDNK' : 'GDP'}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono font-bold" style={{
                      color: regionRank.gdp <= 3 ? '#10b981' : '#f59e0b',
                      textShadow: regionRank.gdp <= 3 ? '0 0 8px rgba(16,185,129,0.3)' : 'none',
                    }}>
                      #{regionRank.gdp}
                    </span>
                    <span className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.35)' }}>/ {totalInRegion}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sparklines */}
            {stateSparkline && (
              <>
                <div className="rounded-lg border p-4" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.12)' }}>
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                    {lang === 'ms' ? 'TREND PENDUDUK (5 TAHUN)' : 'POPULATION TREND (5Y)'}
                  </div>
                  <MiniSparkline data={stateSparkline.population} color="#06b6d4" />
                </div>
                <div className="rounded-lg border p-4" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.12)' }}>
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#f59e0b' }}>
                    {lang === 'ms' ? 'TREND KDNK (5 TAHUN)' : 'GDP TREND (5Y)'}
                  </div>
                  <MiniSparkline data={stateSparkline.gdp} color="#f59e0b" />
                </div>
              </>
            )}
          </div>

          {/* Additional sparklines row */}
          {stateSparkline && (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.12)' }}>
                <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#ec4899' }}>
                  {lang === 'ms' ? 'TREND KELAHIRAN (5 TAHUN)' : 'BIRTHS TREND (5Y)'}
                </div>
                <MiniSparkline data={stateSparkline.births} color="#ec4899" />
              </div>
              <div className="rounded-lg border p-4" style={{ background: 'rgba(10,14,26,0.8)', borderColor: 'rgba(6,182,212,0.12)' }}>
                <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#ef4444' }}>
                  {lang === 'ms' ? 'TREND KEMATIAN (5 TAHUN)' : 'DEATHS TREND (5Y)'}
                </div>
                <MiniSparkline data={stateSparkline.deaths} color="#ef4444" />
              </div>
            </div>
          )}

          {/* ─── All 9 Metrics with comparison bars ────────── */}
          <div>
            <div className="text-[10px] font-mono tracking-wider mb-3" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'METRIK PENUH — PERBANDINGAN KEBANGSAAN' : 'FULL METRICS — NATIONAL COMPARISON'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {metrics.map(m => {
                const val = stateData[m.key as keyof typeof stateData] as number;
                const natAvg = nationalAvgs[m.key];
                return (
                  <div key={m.key} className="rounded-md border p-3" style={{
                    background: 'rgba(10,14,26,0.6)',
                    borderColor: `${m.color}15`,
                  }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <m.icon size={11} style={{ color: m.color }} />
                      <span className="text-[10px] font-mono tracking-wider" style={{ color: '#94a3b8' }}>
                        {lang === 'ms' ? m.label_ms : m.label_en}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-1.5">
                      <span className="text-base font-mono font-bold" style={{ color: '#e0f7fa' }}>
                        {m.format(val)}
                      </span>
                      <span className="text-[8px] font-mono opacity-40">{m.unit}</span>
                    </div>
                    <MetricBar value={val} nationalAvg={natAvg} color={m.color} />
                    <div className="text-[8px] font-mono mt-1" style={{ color: 'rgba(6,182,212,0.3)' }}>
                      {lang === 'ms' ? 'Purata kebangsaan' : 'National avg'}: {m.format(natAvg)} {m.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Quick Facts ────────────────────────────────── */}
          {facts && (
            <div>
              <div className="text-[10px] font-mono tracking-wider mb-3" style={{ color: '#06b6d4' }}>
                <Lightbulb size={10} className="inline mr-1" />
                {lang === 'ms' ? 'FAKTA MENARIK' : 'QUICK FACTS'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(lang === 'ms' ? facts.ms : facts.en).map((fact, i) => (
                  <div key={i} className="rounded-md border p-3 flex items-start gap-2" style={{
                    background: 'rgba(10,14,26,0.6)',
                    borderColor: 'rgba(6,182,212,0.1)',
                  }}>
                    <span className="text-[10px] font-mono font-bold flex-shrink-0 w-5 h-5 rounded flex items-center justify-center" style={{
                      background: 'rgba(6,182,212,0.1)',
                      color: '#06b6d4',
                    }}>
                      {i + 1}
                    </span>
                    <span className="text-[11px] font-mono leading-relaxed" style={{ color: '#94a3b8' }}>
                      {fact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Neighboring States ──────────────────────────── */}
          {neighborStates.length > 0 && (
            <div>
              <div className="text-[10px] font-mono tracking-wider mb-3" style={{ color: '#06b6d4' }}>
                <Compass size={10} className="inline mr-1" />
                {lang === 'ms' ? 'NEGERI BERSEMPADAN' : 'NEIGHBORING STATES'}
              </div>
              <div className="flex flex-wrap gap-2">
                {neighborStates.map(n => (
                  <button
                    key={n.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border transition-all hover:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    style={{
                      background: 'rgba(10,14,26,0.8)',
                      borderColor: 'rgba(6,182,212,0.15)',
                    }}
                  >
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{
                      background: 'rgba(6,182,212,0.1)',
                      color: '#06b6d4',
                    }}>
                      {n.abbr}
                    </span>
                    <span className="text-[11px] font-mono" style={{ color: '#94a3b8' }}>
                      {lang === 'ms' ? n.name_ms : n.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer ──────────────────────────────────────── */}
        <div className="border-t px-5 py-3 flex items-center justify-between" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
          <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
            {lang === 'ms' ? 'Data daripada data.gov.my • CC BY 4.0' : 'Data from data.gov.my • CC BY 4.0'}
          </div>
          <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
            ESC {lang === 'ms' ? 'untuk tutup' : 'to close'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StateProfileModal;
