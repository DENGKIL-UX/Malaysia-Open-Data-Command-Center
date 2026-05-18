'use client';

import { motion } from 'framer-motion';
import type { Lang } from '@/lib/dashboard-types';

interface DataFreshnessIndicatorProps {
  lastUpdated: string | Date | number; // ISO string, Date, or timestamp
  lang?: Lang;
  size?: 'sm' | 'md';
}

export function DataFreshnessIndicator({ lastUpdated, lang = 'en', size = 'sm' }: DataFreshnessIndicatorProps) {
  const now = Date.now();
  const updatedTime = typeof lastUpdated === 'number'
    ? lastUpdated
    : typeof lastUpdated === 'string'
    ? new Date(lastUpdated).getTime()
    : lastUpdated.getTime();
  
  const ageMs = now - updatedTime;
  const ageMinutes = Math.floor(ageMs / 60000);
  const ageHours = Math.floor(ageMs / 3600000);
  const ageDays = Math.floor(ageMs / 86400000);
  
  let freshness: 'fresh' | 'recent' | 'stale' | 'unknown';
  let ageLabel: string;
  
  if (isNaN(ageMs)) {
    freshness = 'unknown';
    ageLabel = lang === 'ms' ? 'Tidak diketahui' : 'Unknown';
  } else if (ageMinutes < 30) {
    freshness = 'fresh';
    ageLabel = lang === 'ms' ? `${ageMinutes} min lalu` : `${ageMinutes}m ago`;
  } else if (ageHours < 24) {
    freshness = 'recent';
    ageLabel = lang === 'ms' ? `${ageHours} jam lalu` : `${ageHours}h ago`;
  } else {
    freshness = 'stale';
    ageLabel = lang === 'ms' ? `${ageDays} hari lalu` : `${ageDays}d ago`;
  }
  
  const colors = {
    fresh: '#10b981',
    recent: '#f59e0b',
    stale: '#ef4444',
    unknown: '#64748b',
  };
  
  const labels = {
    fresh: lang === 'ms' ? 'SEGAR' : 'FRESH',
    recent: lang === 'ms' ? 'TERKINI' : 'RECENT',
    stale: lang === 'ms' ? 'LAMA' : 'STALE',
    unknown: lang === 'ms' ? '?' : '?',
  };
  
  const color = colors[freshness];
  const fontSize = size === 'sm' ? '8px' : '10px';
  
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize,
        fontFamily: 'monospace',
      }}
    >
      <motion.span
        style={{
          display: 'inline-block',
          width: size === 'sm' ? 5 : 7,
          height: size === 'sm' ? 5 : 7,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 4px ${color}60`,
        }}
        animate={freshness === 'fresh' ? {
          scale: [1, 1.3, 1],
          opacity: [1, 0.6, 1],
        } : {}}
        transition={freshness === 'fresh' ? {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        } : {}}
      />
      <span style={{ color, fontWeight: 600, letterSpacing: '0.05em' }}>
        {labels[freshness]}
      </span>
      <span style={{ color: `${color}80`, fontSize: '7px' }}>
        {ageLabel}
      </span>
    </span>
  );
}
