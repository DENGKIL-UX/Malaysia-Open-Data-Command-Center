'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, Baby, Heart, Briefcase, Database,
  MapPin, X, Scale, ArrowRight, ArrowUpRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { STATES, MAP_LAYERS } from '@/lib/data/malaysia-data';
import type { Lang, LayerId } from '@/lib/dashboard-types';

// Dynamic import for map (avoid SSR issues)
const MalaysiaMap = dynamic(() => import('@/components/map/malaysia-map'), { ssr: false });

// ─── State Detail Panel ──────────────────────────────────────────
function StateDetailPanel({ state, lang, onClose, onViewProfile }: { state: typeof STATES[0]; lang: Lang; onClose: () => void; onViewProfile: () => void }) {
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

      {/* View Profile Button */}
      <button
        onClick={onViewProfile}
        className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border text-[10px] font-mono tracking-wider transition-all hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
        style={{
          background: 'rgba(6,182,212,0.1)',
          borderColor: 'rgba(6,182,212,0.3)',
          color: '#06b6d4',
        }}
      >
        <ArrowUpRight size={11} />
        {lang === 'ms' ? 'Lihat Profil Penuh' : 'View Full Profile'}
      </button>
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

// ─── GeoMap Section ──────────────────────────────────────────────
export function GeoMapSection({ lang, onViewProfile }: { lang: Lang; onViewProfile?: (stateId: string) => void }) {
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
        {/* LIVE Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded border mr-1" style={{
          background: 'rgba(16, 185, 129, 0.08)',
          borderColor: 'rgba(16, 185, 129, 0.25)',
        }}>
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#10b981' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-[9px] font-mono font-bold tracking-widest" style={{ color: '#10b981' }}>LIVE</span>
        </div>

        <AnimatePresence mode="wait">
          {MAP_LAYERS.map(layer => (
            <motion.button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as LayerId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-all border"
              style={{
                background: activeLayer === layer.id ? 'rgba(6,182,212,0.15)' : 'rgba(10,14,26,0.8)',
                borderColor: activeLayer === layer.id ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.1)',
                color: activeLayer === layer.id ? '#06b6d4' : 'rgba(6,182,212,0.5)',
                boxShadow: activeLayer === layer.id
                  ? '0 0 15px rgba(6,182,212,0.15), 0 0 30px rgba(6,182,212,0.05)'
                  : 'none',
                animation: activeLayer === layer.id ? 'pulse-glow 2s ease-in-out infinite' : 'none',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              {layer.label_en}
              {activeLayer === layer.id && (
                <motion.div layoutId="layer-indicator" className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
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
            <StateDetailPanel 
              state={selectedData || hoveredData!} 
              lang={lang} 
              onClose={() => setSelectedState(null)}
              onViewProfile={() => {
                const id = (selectedData || hoveredData!)?.id;
                if (id && onViewProfile) onViewProfile(id);
              }}
            />
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
            <div className="space-y-0.5 max-h-64 overflow-y-auto custom-scrollbar">
              {STATES.slice()
                .sort((a, b) => (b[activeLayer as keyof typeof b] as number) - (a[activeLayer as keyof typeof a] as number))
                .map((s, i) => {
                  const val = s[activeLayer as keyof typeof s] as number;
                  const maxVal = Math.max(...STATES.map(st => st[activeLayer as keyof typeof st] as number));
                  const isSelected = selectedState === s.id;
                  return (
                    <motion.button
                      key={s.id}
                      onClick={() => setSelectedState(s.id)}
                      className="w-full flex items-center gap-2 py-1.5 px-2 rounded text-left transition-all duration-200 group"
                      style={{
                        background: isSelected ? 'rgba(6,182,212,0.12)' : 'transparent',
                        borderLeft: isSelected ? '2px solid #06b6d4' : '2px solid transparent',
                      }}
                      whileHover={{
                        backgroundColor: 'rgba(6,182,212,0.08)',
                        borderLeftColor: 'rgba(6,182,212,0.4)',
                      }}
                    >
                      <span className="text-[9px] font-mono w-4 text-right" style={{ color: i < 3 ? '#06b6d4' : 'rgba(6,182,212,0.3)' }}>
                        {i + 1}
                      </span>
                      <span className="text-[10px] font-mono flex-1 truncate group-hover:text-cyan-300 transition-colors" style={{ color: isSelected ? '#06b6d4' : '#94a3b8' }}>
                        {s.abbr}
                      </span>
                      <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(6,182,212,0.1)' }}>
                        <div className="h-full rounded-full transition-all duration-300" style={{
                          width: `${(val / maxVal) * 100}%`,
                          background: i < 3 ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                          boxShadow: i < 3 ? '0 0 4px rgba(6,182,212,0.3)' : 'none',
                        }} />
                      </div>
                      <span className="text-[9px] font-mono" style={{ color: '#e0f7fa' }}>
                        {typeof val === 'number' ? (activeLayer === 'unemployment' ? `${val}%` : activeLayer === 'gdp' ? `${(val/1000).toFixed(1)}B` : val.toLocaleString()) : val}
                      </span>
                    </motion.button>
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

export default GeoMapSection;
