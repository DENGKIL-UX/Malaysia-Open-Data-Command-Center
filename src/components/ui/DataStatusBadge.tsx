'use client';

import { motion } from 'framer-motion';

// ─── Types ──────────────────────────────────────────────────────────
type DataStatus = 'loading' | 'live' | 'fallback' | 'error';

interface DataStatusBadgeProps {
  status: DataStatus;
  datasetId: string;
  fetchedAt?: Date | null;
  fields?: string[];
  compact?: boolean;
}

// ─── Status Configuration ───────────────────────────────────────────
const STATUS_CONFIG: Record<DataStatus, {
  color: string;
  label: string;
  dotStyle: 'pulse' | 'static' | 'spin';
}> = {
  loading: {
    color: '#6b7280',
    label: 'MEMUATKAN',
    dotStyle: 'spin',
  },
  live: {
    color: '#10B981',
    label: 'DATA LANGSUNG',
    dotStyle: 'pulse',
  },
  fallback: {
    color: '#F59E0B',
    label: 'DATA STATIK',
    dotStyle: 'static',
  },
  error: {
    color: '#EF4444',
    label: 'RALAT',
    dotStyle: 'static',
  },
};

// ─── Pulsing / Animated Dot ─────────────────────────────────────────
function StatusDot({ color, mode }: { color: string; mode: 'pulse' | 'static' | 'spin' }) {
  if (mode === 'spin') {
    // Loading spinner dot — rotating ring
    return (
      <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 flex-shrink-0">
        <motion.span
          className="absolute inset-0 rounded-full border-[1.5px]"
          style={{ borderColor: `${color}60`, borderTopColor: color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <span
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: `${color}40` }}
        />
      </span>
    );
  }

  if (mode === 'pulse') {
    // Live — pulsing green dot with expanding ring
    return (
      <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 flex-shrink-0">
        <motion.span
          className="absolute w-2 h-2 rounded-full"
          style={{
            border: `1px solid ${color}40`,
          }}
          animate={{
            scale: [1, 2.2, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}80, 0 0 16px ${color}30`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [1, 0.75, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    );
  }

  // Static dot (fallback / error)
  return (
    <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 flex-shrink-0">
      <span
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}50`,
        }}
      />
    </span>
  );
}

// ─── Format Relative Time ───────────────────────────────────────────
function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 10) return 'BARU SAJA';
  if (seconds < 60) return `${seconds}d LALU`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m LALU`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j LALU`;
  const days = Math.floor(hours / 24);
  return `${days}h LALU`;
}

function formatAbsoluteTime(date: Date): string {
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kuala_Lumpur',
  };
  return date.toLocaleTimeString('en-GB', timeOpts);
}

// ─── DataStatusBadge Component ──────────────────────────────────────
export function DataStatusBadge({
  status,
  datasetId,
  fetchedAt,
  fields,
  compact = false,
}: DataStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const catalogUrl = `https://data.gov.my/data-catalogue?id=${datasetId}`;

  // ── Compact Mode ──
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono"
        style={{
          background: `${config.color}08`,
          border: `1px solid ${config.color}18`,
        }}
        role="status"
        aria-label={config.label}
      >
        <StatusDot color={config.color} mode={config.dotStyle} />
        <span
          className="text-[9px] font-bold tracking-wider"
          style={{
            color: config.color,
            textShadow: `0 0 6px ${config.color}40`,
          }}
        >
          {status === 'loading' ? 'MUAT' : status === 'live' ? 'LANGSUNG' : status === 'fallback' ? 'STATIK' : 'RALAT'}
        </span>
      </span>
    );
  }

  // ── Full Mode ──
  return (
    <div
      className="inline-flex items-center gap-3 px-3 py-2 rounded-lg font-mono"
      style={{
        background: `linear-gradient(135deg, ${config.color}06, rgba(10,14,26,0.6))`,
        border: `1px solid ${config.color}15`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      role="status"
      aria-label={config.label}
    >
      {/* Status dot + label */}
      <span className="flex items-center gap-2">
        <StatusDot color={config.color} mode={config.dotStyle} />
        <span
          className="text-[10px] font-bold tracking-wider"
          style={{
            color: config.color,
            textShadow: `0 0 8px ${config.color}40`,
          }}
        >
          {config.label}
        </span>
      </span>

      {/* Separator */}
      <span
        className="text-[10px] opacity-20"
        style={{ color: '#06b6d4' }}
      >
        │
      </span>

      {/* Dataset ID */}
      <span
        className="text-[9px] tracking-wider opacity-50"
        style={{ color: '#06b6d4' }}
      >
        {datasetId}
      </span>

      {/* Fields (if provided) */}
      {fields && fields.length > 0 && (
        <>
          <span className="text-[10px] opacity-20" style={{ color: '#06b6d4' }}>│</span>
          <span className="text-[8px] tracking-wider opacity-40" style={{ color: '#8899aa' }}>
            {fields.slice(0, 3).join(' · ')}
            {fields.length > 3 && ` +${fields.length - 3}`}
          </span>
        </>
      )}

      {/* Fetched timestamp */}
      {fetchedAt && (
        <>
          <span className="text-[10px] opacity-20" style={{ color: '#06b6d4' }}>│</span>
          <span className="flex items-center gap-1">
            <span
              className="text-[8px] tracking-wider opacity-40"
              style={{ color: '#06b6d4' }}
            >
              {formatAbsoluteTime(fetchedAt)}
            </span>
            <span
              className="text-[7px] tracking-wider opacity-30"
              style={{ color: '#10B981' }}
            >
              {formatRelativeTime(fetchedAt)}
            </span>
          </span>
        </>
      )}

      {/* External link to data.gov.my */}
      <a
        href={catalogUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 text-[9px] tracking-wider opacity-40 hover:opacity-80 transition-opacity duration-200 no-underline"
        style={{ color: '#06b6d4' }}
        aria-label={`Lihat ${datasetId} di data.gov.my`}
      >
        <span style={{ textShadow: '0 0 4px rgba(6,182,212,0.3)' }}>↗</span>
      </a>
    </div>
  );
}

// ─── LiveIndicator — Inline Header Component ────────────────────────
interface LiveIndicatorProps {
  /** 'live' shows green pulsing dot + "LIVE", 'static' shows amber dot + "STATIC" */
  mode: 'live' | 'static';
}

export function LiveIndicator({ mode }: LiveIndicatorProps) {
  const isLive = mode === 'live';
  const color = isLive ? '#10B981' : '#F59E0B';
  const label = isLive ? 'LIVE' : 'STATIC';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded font-mono"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}18`,
      }}
      role="status"
      aria-label={label}
    >
      <span className="relative inline-flex items-center justify-center w-2 h-2 flex-shrink-0">
        {isLive ? (
          <>
            {/* Expanding pulse ring */}
            <motion.span
              className="absolute w-2 h-2 rounded-full"
              style={{ border: `1px solid ${color}40` }}
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Solid dot */}
            <motion.span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 6px ${color}70`,
              }}
              animate={{ scale: [1, 1.12, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        ) : (
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 5px ${color}40`,
            }}
          />
        )}
      </span>
      <span
        className="text-[8px] font-bold tracking-wider"
        style={{
          color,
          textShadow: `0 0 6px ${color}40`,
        }}
      >
        {label}
      </span>
    </span>
  );
}

export default DataStatusBadge;
