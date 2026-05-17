'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, Brain, Zap,
  TrendingUp, Activity, Eye, ChevronRight,
  Radio, Wifi, WifiOff, Loader2,
} from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';
import { OntologyGraph } from '@/components/dashboard/ontology-graph';
import { useLiveData, type LiveAnomaly } from '@/components/dashboard/live-data-provider';

// ─── Premium Card Style Helper ───────────────────────────────────
function premiumCardStyle(overrides?: Record<string, string>) {
  return {
    background: 'linear-gradient(180deg, rgba(6,182,212,0.03) 0%, rgba(10,14,26,0.85) 30%)',
    borderColor: 'rgba(6,182,212,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.06)',
    ...overrides,
  };
}

// ─── Animated Section Divider ────────────────────────────────────
function AnimatedDivider({ color = '#06b6d4' }: { color?: string }) {
  return (
    <div className="w-full h-px my-4" style={{ background: `linear-gradient(90deg, transparent, ${color}33, ${color}66, ${color}33, transparent)` }}>
      <motion.div
        className="h-full w-16"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        animate={{ x: ['-100px', 'calc(100% + 100px)'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// ─── Scan Beam Overlay ──────────────────────────────────────────
function ScanBeamOverlay({ color = '#06b6d4' }: { color?: string }) {
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <motion.div
        className="absolute top-0 bottom-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent, ${color}30, ${color}60, ${color}30, transparent)`,
          boxShadow: `0 0 8px ${color}40`,
        }}
        animate={{ left: ['0%', '100%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// ─── Severity Badge ──────────────────────────────────────────────
function SeverityBadge({ severity, lang }: { severity: LiveAnomaly['severity']; lang: Lang }) {
  const colors: Record<string, string> = {
    critical: '#ef4444',
    high: '#F59E0B',
    medium: '#8B5CF6',
    low: '#10B981',
  };
  const labels: Record<string, { en: string; ms: string }> = {
    critical: { en: 'CRITICAL', ms: 'KRITIKAL' },
    high: { en: 'HIGH', ms: 'TINGGI' },
    medium: { en: 'MODERATE', ms: 'SEDERHANA' },
    low: { en: 'LOW', ms: 'RENDAH' },
  };
  const color = colors[severity];
  const label = labels[severity];

  return (
    <span
      className="text-[7px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded"
      style={{
        color,
        background: `${color}15`,
        border: `1px solid ${color}30`,
      }}
    >
      {lang === 'ms' ? label.ms : label.en}
    </span>
  );
}

// ─── Confidence Badge ────────────────────────────────────────────
function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  let color = '#10B981';
  if (pct < 70) color = '#F59E0B';
  if (pct < 50) color = '#ef4444';

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[8px] font-mono font-bold" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

// ─── Fallback static data (used when live data hasn't loaded yet) ──
const FALLBACK_ANOMALIES = [
  { id: 'fb-1', datasetId: 'labour_monthly', datasetLabel: 'Kadar Pengangguran', severity: 'critical' as const, value: 5.2, expected: 3.4, zScore: 2.8, description: 'Sabah unemployment at 5.2% — significantly above national average', timestamp: new Date() },
  { id: 'fb-2', datasetId: 'cpi_headline', datasetLabel: 'Indeks Harga Pengguna', severity: 'high' as const, value: 132.1, expected: 128.0, zScore: 2.1, description: 'CPI above expected range — demand-pull pressure detected', timestamp: new Date() },
  { id: 'fb-3', datasetId: 'population_state', datasetLabel: 'Penduduk mengikut Negeri', severity: 'medium' as const, value: 7983, expected: 5000, zScore: 1.8, description: 'KL urban density anomaly — 8x national average', timestamp: new Date() },
  { id: 'fb-4', datasetId: 'trade_monthly', datasetLabel: 'Perdagangan Luar', severity: 'medium' as const, value: -200, expected: 14000, zScore: -1.9, description: 'GDP-Inflation divergence — potential demand-pull pressure', timestamp: new Date() },
];

const FALLBACK_FINDINGS = [
  { id: 'ff-1', title_en: 'GDP drives unemployment inverse', title_ms: 'KDNK memacu songsangan pengangguran', detail_en: 'Strong inverse correlation (r=-0.76) between GDP growth and unemployment rate', detail_ms: 'Korelasi songsangan kuat (r=-0.76) antara pertumbuhan KDNK dan kadar pengangguran', confidence: 0.87, color: '#00D4FF' },
  { id: 'ff-2', title_en: 'Selangor GDP concentration risk', title_ms: 'Risiko penumpuan KDNK Selangor', detail_en: 'Selangor contributes 21.6% of GDP — single-state dependency risk identified', detail_ms: 'Selangor menyumbang 21.6% KDNK — risiko kebergantungan satu negeri dikenal pasti', confidence: 0.82, color: '#F59E0B' },
  { id: 'ff-3', title_en: 'Birth rate decline trajectory', title_ms: 'Trajektori penurunan kadar kelahiran', detail_en: 'Birth rate declining at 1.2% annually — below replacement level in 3 states', detail_ms: 'Kadar kelahiran menurun pada 1.2% setahun — di bawah tahap penggantian di 3 negeri', confidence: 0.91, color: '#8B5CF6' },
  { id: 'ff-4', title_en: 'East Malaysia trade gap', title_ms: 'Jurang perdagangan Malaysia Timur', detail_en: 'Sarawak trade contribution disproportionate to population — resource extraction pattern', detail_ms: 'Sumbangan perdagangan Sarawak tidak seimbang dengan penduduk — corak pengekstrakan sumber', confidence: 0.72, color: '#10B981' },
  { id: 'ff-5', title_en: 'Healthcare spending vs outcomes', title_ms: 'Perbelanjaan kesihatan vs hasil', detail_en: 'Death rate inversely correlates (r=-0.68) with healthcare metric', detail_ms: 'Kadar kematian berkorelasi songsang (r=-0.68) dengan metrik kesihatan', confidence: 0.68, color: '#EC4899' },
];

// ─── Intelligence Section Component ──────────────────────────────
export function IntelligenceSection({ lang }: { lang: Lang }) {
  const liveData = useLiveData();

  // Use live anomalies or fallback
  const anomalies = liveData.anomalies.length > 0
    ? liveData.anomalies.slice(0, 8)
    : FALLBACK_ANOMALIES;

  // Findings from live confidence data
  const findings = useMemo(() => {
    if (liveData.confidences.length > 0) {
      // Generate findings from live confidence data
      return liveData.confidences.map((c, i) => {
        const colors = ['#00D4FF', '#F59E0B', '#8B5CF6', '#10B981', '#EC4899', '#06B6D4'];
        return {
          id: `live-finding-${i}`,
          title_en: `${c.datasetLabel} — ${c.label} confidence`,
          title_ms: `${c.datasetLabel} — keyakinan ${c.label}`,
          detail_en: c.recommendation,
          detail_ms: c.recommendation,
          confidence: c.score,
          color: colors[i % colors.length],
        };
      });
    }
    return FALLBACK_FINDINGS;
  }, [liveData.confidences]);

  // Confidence counts from live data
  const confidenceCounts = useMemo(() => {
    if (liveData.isLive) {
      return liveData.confidenceCounts;
    }
    // Fallback
    const allConfidences = [0.98, 0.97, 0.95, 0.96, 0.94, 0.92, 0.91, 0.93, 0.88, 0.99, 0.97, 0.96, 0.97, 0.96, 0.87, 0.72, 0.65, 0.78, 0.91, 0.68, 0.76, 0.95, 0.85, 0.72, 0.65, 0.80];
    return {
      confirmed: allConfidences.filter(c => c > 0.9).length,
      high: allConfidences.filter(c => c > 0.7 && c <= 0.9).length,
      moderate: allConfidences.filter(c => c <= 0.7).length,
      unverfied: 0,
    };
  }, [liveData.isLive, liveData.confidenceCounts]);

  return (
    <div className="space-y-6" role="region" aria-label={lang === 'ms' ? 'Pusat intelligens' : 'Intelligence center'}>
      {/* ─── Section Header ────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Brain size={16} style={{ color: '#00D4FF', textShadow: '0 0 8px rgba(0,212,255,0.4)' }} />
            <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#00D4FF', textShadow: '0 0 8px rgba(0,212,255,0.4)' }}>
              {lang === 'ms' ? 'PUSAT INTELLIGEN' : 'INTELLIGENCE CENTER'}
            </span>
            <SectionHeaderLine color="#00D4FF" delay={0.2} />
            {/* Live data indicator */}
            {liveData.isLive ? (
              <motion.span
                className="text-[8px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#10B981' }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Radio size={8} />
                LIVE
              </motion.span>
            ) : liveData.anyLoading ? (
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', color: '#06b6d4' }}>
                <Loader2 size={8} className="animate-spin" />
                {lang === 'ms' ? 'MEMUAT...' : 'LOADING...'}
              </span>
            ) : (
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                <WifiOff size={8} />
                OFFLINE
              </span>
            )}
          </div>
          <p className="text-[10px] font-mono mt-1" style={{ color: '#6b7280' }}>
            {liveData.isLive
              ? (lang === 'ms'
                ? 'Data langsung dari api.data.gov.my — pengesanan anomali & penilaian keyakinan masa nyata'
                : 'Live data from api.data.gov.my — real-time anomaly detection & confidence assessment')
              : (lang === 'ms'
                ? 'Graf ontologi kelas perusahaan dengan pengesanan anomali dan penemuan auto'
                : 'Enterprise-grade ontology graph with anomaly detection and auto-discovery findings')}
          </p>
        </div>
      </div>

      {/* ─── Data Source Banner (shown when live) ──────────────── */}
      {liveData.isLive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
          style={{
            background: 'rgba(0,212,255,0.04)',
            border: '1px solid rgba(0,212,255,0.10)',
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: '#00D4FF', boxShadow: '0 0 6px #00D4FF' }}>
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ border: '1px solid rgba(0,212,255,0.4)' }}
              animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="text-[10px] font-mono font-semibold tracking-wider" style={{ color: '#00D4FF' }}>
            SUMBER AKTIF: api.data.gov.my/data-catalogue
          </span>
          <span className="text-[10px] font-mono" style={{ color: '#4b5563' }}>|</span>
          <span className="text-[10px] font-mono" style={{ color: '#6b7280' }}>DoSM Malaysia</span>
          <span className="text-[10px] font-mono" style={{ color: '#4b5563' }}>|</span>
          <Wifi size={10} style={{ color: '#10B981' }} />
          <span className="text-[10px] font-mono" style={{ color: '#10B981' }}>
            {liveData.kpis.filter(k => !k.loading && !k.error).length}/{liveData.kpis.length} KPIs
          </span>
        </motion.div>
      )}

      {/* ─── Top Row: Confidence Badges ────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative group rounded-xl border p-4"
          style={premiumCardStyle({
            background: 'linear-gradient(180deg, rgba(16,185,129,0.06) 0%, rgba(10,14,26,0.85) 30%)',
            borderColor: 'rgba(16,185,129,0.15)',
          })}
        >
          <HUDBracket />
          <ScanBeamOverlay color="#10B981" />
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-wider font-bold" style={{ color: '#10B981' }}>
                CONFIRMED
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: '#e0f7fa', textShadow: '0 0 12px rgba(16,185,129,0.3)' }}>
                {confidenceCounts.confirmed}
              </div>
              <div className="text-[8px] font-mono" style={{ color: '#6b7280' }}>
                {lang === 'ms' ? 'keyakinan > 90%' : 'confidence > 90%'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative group rounded-xl border p-4"
          style={premiumCardStyle({
            background: 'linear-gradient(180deg, rgba(245,158,11,0.06) 0%, rgba(10,14,26,0.85) 30%)',
            borderColor: 'rgba(245,158,11,0.15)',
          })}
        >
          <HUDBracket />
          <ScanBeamOverlay color="#F59E0B" />
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.2)',
            }}>
              <Zap size={16} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-wider font-bold" style={{ color: '#F59E0B' }}>
                HIGH
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: '#e0f7fa', textShadow: '0 0 12px rgba(245,158,11,0.3)' }}>
                {confidenceCounts.high}
              </div>
              <div className="text-[8px] font-mono" style={{ color: '#6b7280' }}>
                {lang === 'ms' ? 'keyakinan 70–90%' : 'confidence 70–90%'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative group rounded-xl border p-4"
          style={premiumCardStyle({
            background: 'linear-gradient(180deg, rgba(139,92,246,0.06) 0%, rgba(10,14,26,0.85) 30%)',
            borderColor: 'rgba(139,92,246,0.15)',
          })}
        >
          <HUDBracket />
          <ScanBeamOverlay color="#8B5CF6" />
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}>
              <TrendingUp size={16} style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-wider font-bold" style={{ color: '#8B5CF6' }}>
                MODERATE
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: '#e0f7fa', textShadow: '0 0 12px rgba(139,92,246,0.3)' }}>
                {confidenceCounts.moderate + confidenceCounts.unverfied}
              </div>
              <div className="text-[8px] font-mono" style={{ color: '#6b7280' }}>
                {lang === 'ms' ? 'keyakinan < 70%' : 'confidence < 70%'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatedDivider color="#00D4FF" />

      {/* ─── Middle: Ontology Graph ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative group rounded-xl border overflow-hidden"
        style={premiumCardStyle({
          borderColor: 'rgba(0,212,255,0.15)',
          boxShadow: 'inset 0 1px 0 0 rgba(0,212,255,0.08), 0 0 40px rgba(0,212,255,0.05)',
        })}
      >
        <HUDBracket />
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.15) 2px, rgba(0,212,255,0.15) 4px)',
        }} />

        <div className="relative z-0">
          {/* Graph header bar */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
            <div className="flex items-center gap-2">
              <Activity size={12} style={{ color: '#00D4FF' }} />
              <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: '#00D4FF' }}>
                {lang === 'ms' ? 'GRAF ONTOLOGI DATA' : 'DATA ONTOLOGY GRAPH'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.15)',
                color: '#00D4FF',
              }}>
                v2.0
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1" style={{
                background: liveData.isLive ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${liveData.isLive ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}`,
                color: liveData.isLive ? '#10B981' : '#F59E0B',
              }}>
                {liveData.isLive ? <Radio size={8} /> : <WifiOff size={8} />}
                {liveData.isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <OntologyGraph lang={lang} height={500} />
        </div>
      </motion.div>

      <AnimatedDivider color="#00D4FF" />

      {/* ─── Bottom Row: Anomalies + Findings ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Detection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative group rounded-xl border p-5"
          style={premiumCardStyle({
            borderColor: 'rgba(239,68,68,0.12)',
          })}
        >
          <HUDBracket />
          <ScanBeamOverlay color="#ef4444" />

          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} style={{ color: '#ef4444' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#ef4444' }}>
              {lang === 'ms' ? 'PENGESANAN ANOMALI' : 'ANOMALY DETECTION'}
            </span>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded ml-auto" style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444',
            }}>
              {anomalies.length} {lang === 'ms' ? 'dikesan' : 'detected'}
            </span>
            {liveData.isLive && (
              <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.12)',
                color: '#10B981',
              }}>
                LIVE
              </span>
            )}
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
            {anomalies.map((anomaly, i) => {
              const sevColor = anomaly.severity === 'critical' ? '#ef4444'
                : anomaly.severity === 'high' ? '#F59E0B'
                : anomaly.severity === 'medium' ? '#8B5CF6' : '#10B981';

              return (
                <motion.div
                  key={anomaly.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    background: `${sevColor}06`,
                    borderColor: `${sevColor}15`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${sevColor}30`;
                    e.currentTarget.style.background = `${sevColor}0a`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = `${sevColor}15`;
                    e.currentTarget.style.background = `${sevColor}06`;
                  }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full" style={{
                      background: sevColor,
                      boxShadow: `0 0 6px ${sevColor}60`,
                    }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold" style={{ color: '#e0f7fa' }}>
                        {anomaly.datasetLabel}
                      </span>
                      <SeverityBadge severity={anomaly.severity} lang={lang} />
                      {liveData.isLive && (
                        <span className="text-[7px] font-mono" style={{ color: '#6b7280' }}>
                          z={anomaly.zScore.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] font-mono leading-relaxed" style={{ color: '#8899aa' }}>
                      {anomaly.description}
                    </p>
                  </div>
                  <ChevronRight size={12} className="flex-shrink-0 mt-1 opacity-30" style={{ color: sevColor }} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Intelligence Findings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative group rounded-xl border p-5"
          style={premiumCardStyle({
            borderColor: 'rgba(0,212,255,0.12)',
          })}
        >
          <HUDBracket />
          <ScanBeamOverlay color="#00D4FF" />

          <div className="flex items-center gap-2 mb-4">
            <Eye size={14} style={{ color: '#00D4FF' }} />
            <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#00D4FF' }}>
              {lang === 'ms' ? 'PENEMUAN INTELLIGEN' : 'INTELLIGENCE FINDINGS'}
            </span>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded ml-auto" style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#00D4FF',
            }}>
              {findings.length} {lang === 'ms' ? 'penemuan' : 'findings'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
            {findings.map((finding, i) => (
              <motion.div
                key={finding.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: `${finding.color}06`,
                  borderColor: `${finding.color}15`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${finding.color}30`;
                  e.currentTarget.style.background = `${finding.color}0a`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${finding.color}15`;
                  e.currentTarget.style.background = `${finding.color}06`;
                }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{
                    background: `${finding.color}12`,
                    border: `1px solid ${finding.color}20`,
                  }}>
                    <Brain size={10} style={{ color: finding.color }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold" style={{ color: '#e0f7fa' }}>
                      {lang === 'ms' ? finding.title_ms : finding.title_en}
                    </span>
                    <ConfidenceBadge confidence={finding.confidence} />
                  </div>
                  <p className="text-[9px] font-mono leading-relaxed" style={{ color: '#8899aa' }}>
                    {lang === 'ms' ? finding.detail_ms : finding.detail_en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default IntelligenceSection;
