'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown } from 'lucide-react';
import {
  BP_COLORS,
  BP_FONT,
  BP_SPACE,
  BP_RADIUS,
  BP_SHADOW,
  BP_DATA_VIZ,
} from '@/design/blueprint-tokens';

// ─── Alert level type ───────────────────────────────────────────────
type AlertLevel = 'normal' | 'warning' | 'danger';

const ALERT_ACCENT: Record<AlertLevel, string> = {
  normal: BP_DATA_VIZ.series[0],   // blue4 #48AFF0
  warning: BP_COLORS.warningLight,  // #D9973B
  danger: BP_COLORS.dangerLight,    // #DB4D4D
};

// ─── Sparkline SVG ──────────────────────────────────────────────────
function Sparkline({ data, color, width = 48, height = 20 }: {
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

// ─── BlueprintKPICard Props ─────────────────────────────────────────
export interface BlueprintKPICardProps {
  /** Card title / label */
  title: string;
  /** Primary metric value */
  value: string;
  /** Optional unit suffix */
  unit?: string;
  /** Percent change from previous period */
  change?: number;
  /** Sparkline data points */
  sparkline?: number[];
  /** Alert severity level — controls left-border accent color */
  alert?: AlertLevel;
  /** Override accent color (takes priority over alert) */
  accentColor?: string;
  /** Optional click handler */
  onClick?: () => void;
}

// ─── BlueprintKPICard Component ─────────────────────────────────────
/**
 * A KPI card styled to match Palantir's Blueprint dark-theme aesthetic
 * using only Tailwind + BP design tokens — no @blueprintjs/core imports.
 *
 * Visual characteristics:
 *  - Dense, compact layout (4px grid)
 *  - Thin left border accent from data-viz palette
 *  - 14px base font, Inter family
 *  - 2-3px border radius
 *  - Blueprint elevation shadows
 *  - Change indicator with directional arrow
 *  - Inline sparkline
 */
export function BlueprintKPICard({
  title,
  value,
  unit,
  change,
  sparkline,
  alert = 'normal',
  accentColor,
  onClick,
}: BlueprintKPICardProps) {
  const [hovered, setHovered] = useState(false);

  // Resolve the accent color: explicit override > alert level
  const accent = accentColor ?? ALERT_ACCENT[alert];

  // Determine trend direction
  const isUpward = change !== undefined ? change >= 0 : true;
  const sparkColor = isUpward ? BP_DATA_VIZ.positive : BP_DATA_VIZ.negative;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        // Blueprint card background + thin left accent border
        background: BP_COLORS.cardBg,
        borderLeft: `3px solid ${accent}`,
        borderRadius: BP_RADIUS.md,
        boxShadow: hovered ? BP_SHADOW.elevation3 : BP_SHADOW.elevation1,
        padding: `${BP_SPACE.md}px ${BP_SPACE.lg}px`,
        fontFamily: BP_FONT.family,
        fontSize: BP_FONT.size,
        lineHeight: BP_FONT.lineHeight,
        transition: 'box-shadow 0.15s ease, border-left-color 0.15s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Subtle top-right glow on hover */}
      {hovered && (
        <div
          className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${accent}15, transparent)`,
          }}
        />
      )}

      {/* Title row */}
      <div
        className="uppercase tracking-wider"
        style={{
          color: BP_COLORS.textMuted,
          fontSize: BP_FONT.sizeSmall,
          fontWeight: BP_FONT.weightMedium,
          letterSpacing: '0.06em',
          marginBottom: BP_SPACE.xs,
        }}
      >
        {title}
      </div>

      {/* Value row */}
      <div className="flex items-baseline gap-1.5">
        <span
          style={{
            color: BP_COLORS.textPrimary,
            fontSize: 22,
            fontWeight: BP_FONT.weightSemibold,
            fontFamily: BP_FONT.mono,
            lineHeight: 1.2,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              color: BP_COLORS.textDisabled,
              fontSize: BP_FONT.sizeSmall,
              fontWeight: BP_FONT.weightNormal,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Change indicator + Sparkline row */}
      {(change !== undefined || (sparkline && sparkline.length >= 2)) && (
        <div
          className="flex items-center gap-2"
          style={{ marginTop: BP_SPACE.sm }}
        >
          {/* Change indicator */}
          {change !== undefined && (
            <div
              className="flex items-center gap-0.5"
              style={{
                color: isUpward ? BP_DATA_VIZ.positive : BP_DATA_VIZ.negative,
                fontSize: BP_FONT.sizeSmall,
                fontWeight: BP_FONT.weightMedium,
                fontFamily: BP_FONT.mono,
              }}
            >
              {isUpward ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(change)}%
            </div>
          )}

          {/* Sparkline */}
          {sparkline && sparkline.length >= 2 && (
            <Sparkline data={sparkline} color={sparkColor} />
          )}
        </div>
      )}
    </motion.div>
  );
}

export default BlueprintKPICard;
