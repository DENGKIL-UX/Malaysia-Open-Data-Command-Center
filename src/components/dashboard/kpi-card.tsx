'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
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

// ─── Sparkline SVG Component with Area Fill ──────────────────────────
function Sparkline({ data, color, width = 52, height = 22 }: {
  data: number[]; color: string; width?: number; height?: number;
}) {
  const { linePath, areaPath, lastPoint } = useMemo(() => {
    if (!data || data.length < 2) return { linePath: '', areaPath: '', lastPoint: null };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const padding = 2;
    const effectiveHeight = height - padding * 2;
    const points = data.map((v, i) => ({
      x: i * stepX,
      y: padding + effectiveHeight - ((v - min) / range) * effectiveHeight,
    }));
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const area = line + ` L${points[points.length - 1].x.toFixed(1)},${height} L${points[0].x.toFixed(1)},${height} Z`;
    return { linePath: line, areaPath: area, lastPoint: points[points.length - 1] };
  }, [data, width, height]);

  if (!data || data.length < 2) return null;

  // Generate a stable gradient ID from color
  const gradId = `sparkArea-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {/* Area fill under the line */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Animated end dot */}
      {lastPoint && (
        <>
          <circle cx={lastPoint.x} cy={lastPoint.y} r={2} fill={color} />
          <circle cx={lastPoint.x} cy={lastPoint.y} r={2} fill={color} opacity={0.5}>
            <animate attributeName="r" from="2" to="6" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

// ─── Data Tier Indicator ────────────────────────────────────────────
const TIER_CONFIG: Record<DataStatus, { color: string; label: string; animate: boolean }> = {
  loading: { color: BP_COLORS.textMuted, label: 'LOAD', animate: true },
  live:    { color: BP_DATA_VIZ.positive, label: 'LIVE', animate: true },
  csv:     { color: BP_COLORS.blue4, label: 'CSV',  animate: true },
  fallback:{ color: '#f59e0b', label: 'STATIC', animate: false },
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

// ─── Animated Number Component ──────────────────────────────────────
function AnimatedNumber({ value, color }: { value: string; color: string }) {
  const numericMatch = value.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const prefix = numericMatch ? value.substring(0, value.indexOf(numericMatch[0])) : '';
  const suffix = numericMatch ? value.substring(value.indexOf(numericMatch[0]) + numericMatch[0].length) : value;
  const decimals = numericMatch?.[0]?.split('.')[1]?.length ?? 0;

  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => {
    if (decimals === 0) return Math.round(v).toString();
    return v.toFixed(decimals);
  });
  const [displayText, setDisplayText] = useState('0');

  useEffect(() => {
    const controls = animate(motionVal, numericValue, {
      duration: 1.4,
      ease: [0.22, 0.61, 0.36, 1],
    });
    const unsub = display.on('change', (v) => setDisplayText(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [numericValue, motionVal, display]);

  if (!numericMatch) {
    return <span style={{ color }}>{value}</span>;
  }

  return (
    <span style={{ color }}>
      {prefix}{displayText}{suffix}
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
  const isUpward = trendValue ? trendValue.startsWith('+') || trendValue === '0.0%' : (change !== undefined ? change >= 0 : true);
  const sparklineColor = isUpward ? BP_DATA_VIZ.positive : BP_DATA_VIZ.negative;

  return (
    <motion.div
      onClick={onClick}
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        background: hovered
          ? `linear-gradient(145deg, ${color}0A 0%, ${BP_COLORS.appBg}CC 50%, ${BP_COLORS.appBg}E6 100%)`
          : `linear-gradient(145deg, ${color}06 0%, ${BP_COLORS.appBg}F2 40%, ${BP_COLORS.appBg}CC 100%)`,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: hovered ? `${color}50` : `${color}20`,
        borderRadius: 12,
        boxShadow: hovered
          ? `0 8px 30px ${color}20, 0 0 0 1px ${color}15, inset 0 1px 0 ${color}10`
          : `inset 0 1px 0 ${color}08`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '14px 14px 12px',
        fontFamily: BP_FONT.family,
        fontSize: BP_FONT.size,
        lineHeight: BP_FONT.lineHeight,
        transition: 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease',
      }}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Data Tier Indicator — top right corner */}
      <DataTierIndicator status={status} />

      {/* Top-right radial glow */}
      <div className="absolute top-0 right-0 w-28 h-28 opacity-[0.04]" style={{
        background: `radial-gradient(circle at top right, ${color}, transparent)`,
        transition: 'opacity 0.3s',
        ...(hovered ? { opacity: 0.08 } : {}),
      }} />

      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: 12 }}>
        {hovered && (
          <motion.div
            className="absolute inset-0"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              background: `linear-gradient(90deg, transparent, ${color}10, ${color}06, transparent)`,
            }}
          />
        )}
      </div>

      {/* Icon + change indicator */}
      <div className="flex items-start justify-between mb-3">
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `${color}10`,
          border: `1px solid ${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
          ...(hovered ? {
            background: `${color}18`,
            borderColor: `${color}30`,
            boxShadow: `0 0 12px ${color}15`,
          } : {}),
        }}>
          <Icon size={18} style={{ color }} />
        </div>
        {change !== undefined && (
          <div
            className="flex items-center gap-0.5 font-mono"
            style={{
              color: isUpward ? BP_DATA_VIZ.positive : BP_DATA_VIZ.negative,
              fontSize: 11,
              fontWeight: 700,
              background: isUpward ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              padding: '2px 6px',
              borderRadius: 6,
              border: `1px solid ${isUpward ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
            }}
          >
            {isUpward ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Animated value */}
      <div
        className="font-mono"
        style={{ color: BP_COLORS.textPrimary, fontSize: 26, fontWeight: 800, lineHeight: 1.1, marginBottom: 2 }}
      >
        <AnimatedNumber value={value} color={BP_COLORS.textPrimary} />
        <span
          className="ml-1"
          style={{ fontSize: 12, fontWeight: 500, color: BP_COLORS.textDisabled }}
        >
          {unit}
        </span>
      </div>

      {/* Label */}
      <div
        className="mt-0.5"
        style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
          color, opacity: 0.7,
        }}
      >
        {label}
      </div>

      {/* Sparkline + Trend row */}
      {sparkline && sparkline.length >= 2 && (
        <div className="flex items-center justify-between mt-2.5 pt-2" style={{ borderTop: `1px solid ${color}08` }}>
          <Sparkline data={sparkline} color={sparklineColor} width={56} height={22} />
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

      {/* Bottom accent line with animated glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, ${color}80, transparent)`,
          transformOrigin: 'left',
        }}
        animate={{
          scaleX: hovered ? 1 : 0.35,
          opacity: hovered ? 1 : 0.35,
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.div>
  );
}

// ─── Animated Counter Hook (legacy, preserved for backward compat) ──
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
