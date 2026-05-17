'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown } from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import type { DataStatus } from '@/lib/dosm/client';
import {
  BP_COLORS,
  BP_FONT,
  BP_SPACE,
  BP_RADIUS,
  BP_SHADOW,
  BP_DATA_VIZ,
} from '@/design/blueprint-tokens';

// ─── Sparkline SVG Component ───────────────────────────────────────
function Sparkline({ data, color, width = 40, height = 16 }: {
  data: number[]; color: string; width?: number; height?: number;
}) {
  const path = useMemo(() => {
    if (!data || data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const padding = 2;
    const effectiveHeight = height - padding * 2;
    return data.map((v, i) => {
      const x = i * stepX;
      const y = padding + effectiveHeight - ((v - min) / range) * effectiveHeight;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [data, width, height]);

  if (!data || data.length < 2) return null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Data Tier Indicator ────────────────────────────────────────────
const TIER_CONFIG: Record<DataStatus, { color: string; label: string; animate: boolean }> = {
  loading: { color: BP_COLORS.textMuted, label: 'LOAD', animate: true },
  live:    { color: BP_DATA_VIZ.positive, label: 'LIVE', animate: true },
  csv:     { color: BP_COLORS.blue4, label: 'CSV',  animate: true },
  fallback:{ color: BP_COLORS.warningLight, label: 'STATIC', animate: false },
  error:   { color: BP_COLORS.dangerLight, label: 'ERR',  animate: false },
};

function DataTierIndicator({ status }: { status?: DataStatus }) {
  if (!status) return null;
  const cfg = TIER_CONFIG[status];
  return (
    <span
      className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm font-mono z-10"
      style={{
        background: `${cfg.color}10`,
        border: `1px solid ${cfg.color}25`,
      }}
      role="status"
      aria-label={`Data tier: ${cfg.label}`}
    >
      <span className="relative inline-flex items-center justify-center w-1.5 h-1.5 flex-shrink-0">
        {cfg.animate ? (
          <>
            <motion.span
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ border: `1px solid ${cfg.color}40` }}
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: cfg.color,
                boxShadow: `0 0 4px ${cfg.color}60`,
              }}
              animate={status === 'loading'
                ? { rotate: 360 }
                : { scale: [1, 1.15, 1], opacity: [1, 0.8, 1] }}
              transition={status === 'loading'
                ? { duration: 1, repeat: Infinity, ease: 'linear' }
                : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        ) : (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: cfg.color,
              boxShadow: `0 0 3px ${cfg.color}40`,
            }}
          />
        )}
      </span>
      <span
        className="text-[7px] font-bold tracking-wider"
        style={{
          color: cfg.color,
          textShadow: `0 0 4px ${cfg.color}30`,
        }}
      >
        {cfg.label}
      </span>
    </span>
  );
}

// ─── KPI Card Component ─────────────────────────────────────────────
export function KPICard({ icon: Icon, label, value, unit, change, color, lang, sparkline, trendValue, onClick, status }: {
  icon: React.ElementType; label: string; value: string; unit: string;
  change?: number; color: string; lang: Lang;
  sparkline?: number[];
  trendValue?: string;
  onClick?: () => void;
  status?: DataStatus;
}) {
  const [hovered, setHovered] = useState(false);

  // Determine trend direction from sparkline data or change value
  const isUpward = trendValue ? trendValue.startsWith('+') : (change !== undefined ? change >= 0 : true);
  const sparklineColor = isUpward ? BP_DATA_VIZ.positive : BP_DATA_VIZ.negative;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`relative overflow-hidden border ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${BP_COLORS.appBg}BF, ${BP_COLORS.appBg}99)`
          : `linear-gradient(135deg, ${BP_COLORS.appBg}F2, ${BP_COLORS.appBg}CC)`,
        borderColor: hovered ? `${color}60` : `${color}25`,
        borderRadius: BP_RADIUS.lg,
        boxShadow: hovered
          ? `0 0 25px ${color}30, 0 0 50px ${color}15, 0 0 80px ${color}08, inset 0 0 20px ${color}08`
          : 'none',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: BP_SPACE.lg,
        fontFamily: BP_FONT.family,
        fontSize: BP_FONT.size,
        lineHeight: BP_FONT.lineHeight,
        transition: 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Data Tier Indicator — top right corner */}
      <DataTierIndicator status={status} />

      {/* Top-right radial glow */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{
        background: `radial-gradient(circle at top right, ${color}, transparent)`,
      }} />

      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: BP_RADIUS.lg }}>
        {hovered && (
          <motion.div
            className="absolute inset-0"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              background: `linear-gradient(90deg, transparent, ${color}12, ${color}08, transparent)`,
            }}
          />
        )}
      </div>

      {/* Glow pulse ring on hover */}
      {hovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ border: `1px solid ${color}40`, borderRadius: BP_RADIUS.lg }}
          animate={{ borderColor: [`${color}40`, `${color}10`, `${color}40`] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="flex items-start justify-between mb-2">
        <Icon size={18} style={{ color }} />
        {change !== undefined && (
          <div
            className="flex items-center gap-0.5 text-xs font-mono"
            style={{
              color: isUpward ? BP_DATA_VIZ.positive : BP_DATA_VIZ.negative,
              fontSize: BP_FONT.sizeSmall,
            }}
          >
            {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div
        className="text-2xl font-bold font-mono"
        style={{ color: BP_COLORS.textPrimary }}
      >
        {value}
        <span
          className="text-xs font-normal ml-1"
          style={{ color: BP_COLORS.textDisabled }}
        >
          {unit}
        </span>
      </div>

      {/* Sparkline + Trend row */}
      {sparkline && sparkline.length >= 2 && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <Sparkline data={sparkline} color={sparklineColor} />
          {trendValue && (
            <div
              className="flex items-center gap-0.5 font-mono font-bold"
              style={{
                color: isUpward ? BP_DATA_VIZ.positive : BP_DATA_VIZ.negative,
                fontSize: 10,
              }}
            >
              {isUpward ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
              {trendValue}
            </div>
          )}
        </div>
      )}

      <div
        className="text-[10px] font-mono mt-1 tracking-wider uppercase"
        style={{ color, opacity: 0.6 }}
      >
        {label}
      </div>

      {/* Bottom accent line with glow pulse */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: hovered
            ? `linear-gradient(90deg, transparent, ${color}, transparent)`
            : `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          boxShadow: hovered ? `0 0 12px ${color}80, 0 0 24px ${color}40` : 'none',
          animation: !hovered ? 'glow-pulse 2s ease-in-out infinite' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </motion.div>
  );
}

// ─── Animated Counter Hook ──────────────────────────────────────────
export function useAnimatedValue(target: number, duration = 2000) {
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

export default KPICard;
