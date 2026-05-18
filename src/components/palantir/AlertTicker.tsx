'use client';

// ============================================================================
// Malaysia Open Data Command Center — Alert Ticker
// Scrolling alert bar — Palantir mission control style
// Consumes alerts from the Intelligence Bus
// ============================================================================

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntelBus, type AlertLevel } from '@/engine/intelligence/bus';

// ── Severity Palette ──
const PALETTE: Record<AlertLevel, { bg: string; border: string; text: string; dot: string }> = {
  CRITICAL: {
    bg: 'rgba(220,38,38,0.10)',
    border: '#DC2626',
    text: '#FCA5A5',
    dot: '#DC2626',
  },
  HIGH: {
    bg: 'rgba(245,158,11,0.10)',
    border: '#F59E0B',
    text: '#FCD34D',
    dot: '#F59E0B',
  },
  MEDIUM: {
    bg: 'rgba(139,92,246,0.10)',
    border: '#8B5CF6',
    text: '#C4B5FD',
    dot: '#8B5CF6',
  },
  LOW: {
    bg: 'rgba(16,185,129,0.10)',
    border: '#10B981',
    text: '#6EE7B7',
    dot: '#10B981',
  },
};

export function AlertTicker() {
  const alerts = useIntelBus((s) => s.alerts);
  const dismissAlert = useIntelBus((s) => s.dismissAlert);
  const active = alerts.filter((a) => !a.dismissed);
  const [idx, setIdx] = useState(0);

  // Derive visibility from active alerts instead of state
  const visible = active.length > 0;

  // Cycle through alerts
  useEffect(() => {
    if (!active.length) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % active.length);
    }, 5000);
    return () => clearInterval(t);
  }, [active.length]);

  // Clamp index to valid range — use useMemo to derive
  const safeIdx = Math.min(idx, Math.max(0, active.length - 1));

  const handleDismiss = useCallback(() => {
    if (active[safeIdx]) {
      dismissAlert(active[safeIdx].id);
    }
  }, [active, safeIdx, dismissAlert]);

  if (!visible || !active.length) return null;

  const current = active[safeIdx % active.length];
  if (!current) return null;

  const p = PALETTE[current.level];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full flex items-center gap-3 px-4 py-1.5"
        style={{
          background: p.bg,
          borderBottom: `1px solid ${p.border}20`,
          userSelect: 'none',
        }}
      >
        {/* Pulsing dot */}
        <div className="relative flex-shrink-0">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.dot, boxShadow: `0 0 8px ${p.dot}` }}
          />
          <motion.div
            className="absolute inset-0 w-2 h-2 rounded-full"
            style={{ border: `1px solid ${p.dot}60` }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Level badge */}
        <span
          className="text-[9px] font-mono font-extrabold tracking-[0.2em] flex-shrink-0"
          style={{ color: p.border }}
        >
          {current.level}
        </span>

        <span className="text-[9px] font-mono flex-shrink-0" style={{ color: '#1F2937' }}>
          |
        </span>

        {/* Dataset */}
        <span
          className="text-[9px] font-mono tracking-wider flex-shrink-0"
          style={{ color: '#4B5563' }}
        >
          {current.dataset.toUpperCase()}
        </span>

        {/* Message */}
        <span
          className="text-[11px] font-mono flex-1 overflow-hidden"
          style={{
            color: p.text,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {current.messageBM || current.message}
        </span>

        {/* Counter + dismiss */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[9px] font-mono" style={{ color: '#374151' }}>
            {safeIdx + 1}/{active.length}
          </span>
          <button
            onClick={handleDismiss}
            className="text-sm font-bold leading-none px-1 rounded transition-colors hover:bg-white/5"
            style={{ color: '#4B5563', cursor: 'pointer', border: 'none', background: 'none' }}
            title="Dismiss alert"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
