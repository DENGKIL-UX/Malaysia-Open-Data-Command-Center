'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, Brain, Zap,
  TrendingUp, Activity, Eye, ChevronRight,
} from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';
import { OntologyGraph } from '@/components/dashboard/ontology-graph';

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

// ─── Anomaly Data ────────────────────────────────────────────────
interface Anomaly {
  id: string;
  severity: 'critical' | 'high' | 'moderate';
  title_en: string;
  title_ms: string;
  detail_en: string;
  detail_ms: string;
  color: string;
}

const ANOMALIES: Anomaly[] = [
  {
    id: 'anm-1',
    severity: 'critical',
    title_en: 'Sabah Unemployment Spike',
    title_ms: 'Lonjakan Pengangguran Sabah',
    detail_en: 'Sabah unemployment at 5.2% — significantly above national average of 3.4%',
    detail_ms: 'Pengangguran Sabah pada 5.2% — jauh melebihi purata kebangsaan 3.4%',
    color: '#ef4444',
  },
  {
    id: 'anm-2',
    severity: 'high',
    title_en: 'KL Urban Density Anomaly',
    title_ms: 'Anomali Ketumpatan Bandar KL',
    detail_en: 'W.P. Kuala Lumpur density at 7,983/km\u00B2 — 8x national average',
    detail_ms: 'Ketumpatan W.P. Kuala Lumpur pada 7,983/km\u00B2 — 8x purata kebangsaan',
    color: '#F59E0B',
  },
  {
    id: 'anm-3',
    severity: 'moderate',
    title_en: 'Death Rate Divergence',
    title_ms: 'Penyimpangan Kadar Kematian',
    detail_en: 'Inversely correlated with healthcare spending — Sarawak outlier detected',
    detail_ms: 'Berkorelasi songsang dengan perbelanjaan kesihatan — pencilan Sarawak dikesan',
    color: '#8B5CF6',
  },
  {
    id: 'anm-4',
    severity: 'moderate',
    title_en: 'GDP-Inflation Divergence',
    title_ms: 'Penyimpangan KDNK-Inflasi',
    detail_en: 'GDP growth 4.5% vs CPI 2.2% — potential demand-pull pressure',
    detail_ms: 'Pertumbuhan KDNK 4.5% vs CPI 2.2% — potensi tekanan tarikan permintaan',
    color: '#06b6d4',
  },
];

// ─── Finding Data ────────────────────────────────────────────────
interface Finding {
  id: string;
  title_en: string;
  title_ms: string;
  detail_en: string;
  detail_ms: string;
  confidence: number;
  color: string;
}

const FINDINGS: Finding[] = [
  {
    id: 'fnd-1',
    title_en: 'GDP drives unemployment inverse',
    title_ms: 'KDNK memacu songsangan pengangguran',
    detail_en: 'Strong inverse correlation (r=-0.76) between GDP growth and unemployment rate',
    detail_ms: 'Korelasi songsangan kuat (r=-0.76) antara pertumbuhan KDNK dan kadar pengangguran',
    confidence: 0.87,
    color: '#00D4FF',
  },
  {
    id: 'fnd-2',
    title_en: 'Selangor GDP concentration risk',
    title_ms: 'Risiko penumpuan KDNK Selangor',
    detail_en: 'Selangor contributes 21.6% of GDP — single-state dependency risk identified',
    detail_ms: 'Selangor menyumbang 21.6% KDNK — risiko kebergantungan satu negeri dikenal pasti',
    confidence: 0.82,
    color: '#F59E0B',
  },
  {
    id: 'fnd-3',
    title_en: 'Birth rate decline trajectory',
    title_ms: 'Trajektori penurunan kadar kelahiran',
    detail_en: 'Birth rate declining at 1.2% annually — below replacement level in 3 states',
    detail_ms: 'Kadar kelahiran menurun pada 1.2% setahun — di bawah tahap penggantian di 3 negeri',
    confidence: 0.91,
    color: '#8B5CF6',
  },
  {
    id: 'fnd-4',
    title_en: 'East Malaysia trade gap',
    title_ms: 'Jurang perdagangan Malaysia Timur',
    detail_en: 'Sarawak trade contribution disproportionate to population — resource extraction pattern',
    detail_ms: 'Sumbangan perdagangan Sarawak tidak seimbang dengan penduduk — corak pengekstrakan sumber',
    confidence: 0.72,
    color: '#10B981',
  },
  {
    id: 'fnd-5',
    title_en: 'Healthcare spending vs outcomes',
    title_ms: 'Perbelanjaan kesihatan vs hasil',
    detail_en: 'Death rate inversely correlates (r=-0.68) with healthcare metric — causal link suspected',
    detail_ms: 'Kadar kematian berkorelasi songsang (r=-0.68) dengan metrik kesihatan — pautan kausal disyaki',
    confidence: 0.68,
    color: '#EC4899',
  },
];

// ─── Severity Badge ──────────────────────────────────────────────
function SeverityBadge({ severity, lang }: { severity: Anomaly['severity']; lang: Lang }) {
  const colors: Record<string, string> = {
    critical: '#ef4444',
    high: '#F59E0B',
    moderate: '#8B5CF6',
  };
  const labels: Record<string, { en: string; ms: string }> = {
    critical: { en: 'CRITICAL', ms: 'KRITIKAL' },
    high: { en: 'HIGH', ms: 'TINGGI' },
    moderate: { en: 'MODERATE', ms: 'Sederhana' },
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

// ─── Intelligence Section Component ──────────────────────────────
export function IntelligenceSection({ lang }: { lang: Lang }) {
  // Confidence badge counts
  const confidenceCounts = useMemo(() => {
    const allConfidences = [
      0.98, 0.97, 0.95, 0.96, 0.94, 0.92, 0.91, 0.93,
      0.88, 0.99, 0.97, 0.96, 0.97, 0.96,
      0.87, 0.72, 0.65, 0.78, 0.91, 0.68, 0.76, 0.95, 0.85, 0.72, 0.65, 0.80,
    ];
    return {
      confirmed: allConfidences.filter(c => c > 0.9).length, // CONFIRMED
      high: allConfidences.filter(c => c > 0.7 && c <= 0.9).length, // HIGH
      moderate: allConfidences.filter(c => c <= 0.7).length, // MODERATE
    };
  }, []);

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
          </div>
          <p className="text-[10px] font-mono mt-1" style={{ color: '#6b7280' }}>
            {lang === 'ms'
              ? 'Graf ontologi kelas perusahaan dengan pengesanan anomali masa nyata dan penemuan auto'
              : 'Enterprise-grade ontology graph with real-time anomaly detection and auto-discovery findings'}
          </p>
        </div>
      </div>

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
                {confidenceCounts.moderate}
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
                v1.0
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.15)',
                color: '#10B981',
              }}>
                LIVE
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
              {ANOMALIES.length} {lang === 'ms' ? 'dikesan' : 'detected'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
            {ANOMALIES.map((anomaly, i) => (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: `${anomaly.color}06`,
                  borderColor: `${anomaly.color}15`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${anomaly.color}30`;
                  e.currentTarget.style.background = `${anomaly.color}0a`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${anomaly.color}15`;
                  e.currentTarget.style.background = `${anomaly.color}06`;
                }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full" style={{
                    background: anomaly.color,
                    boxShadow: `0 0 6px ${anomaly.color}60`,
                  }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold" style={{ color: '#e0f7fa' }}>
                      {lang === 'ms' ? anomaly.title_ms : anomaly.title_en}
                    </span>
                    <SeverityBadge severity={anomaly.severity} lang={lang} />
                  </div>
                  <p className="text-[9px] font-mono leading-relaxed" style={{ color: '#8899aa' }}>
                    {lang === 'ms' ? anomaly.detail_ms : anomaly.detail_en}
                  </p>
                </div>
                <ChevronRight size={12} className="flex-shrink-0 mt-1 opacity-30" style={{ color: anomaly.color }} />
              </motion.div>
            ))}
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
              {FINDINGS.length} {lang === 'ms' ? 'penemuan' : 'findings'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
            {FINDINGS.map((finding, i) => (
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
