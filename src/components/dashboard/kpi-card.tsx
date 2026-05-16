'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown } from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';

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

// ─── KPI Card Component ─────────────────────────────────────────────
export function KPICard({ icon: Icon, label, value, unit, change, color, lang, sparkline, trendValue }: {
  icon: React.ElementType; label: string; value: string; unit: string;
  change?: number; color: string; lang: Lang;
  sparkline?: number[];
  trendValue?: string;
}) {
  const [hovered, setHovered] = useState(false);

  // Determine trend direction from sparkline data or change value
  const isUpward = trendValue ? trendValue.startsWith('+') : (change !== undefined ? change >= 0 : true);
  const sparklineColor = isUpward ? '#10b981' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg p-4 border"
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(10,14,26,0.75), rgba(10,14,26,0.6))`
          : `linear-gradient(135deg, rgba(10,14,26,0.95), rgba(10,14,26,0.8))`,
        borderColor: hovered ? `${color}50` : `${color}25`,
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hovered
          ? `0 0 20px ${color}20, 0 0 40px ${color}10, 0 0 60px ${color}08`
          : 'none',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top-right radial glow */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{
        background: `radial-gradient(circle at top right, ${color}, transparent)`,
      }} />

      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        {hovered && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}08, transparent)`,
              animation: 'shimmer 1.5s ease-in-out',
            }}
          />
        )}
      </div>

      <div className="flex items-start justify-between mb-2">
        <Icon size={18} style={{ color }} />
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-mono ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold font-mono" style={{ color: '#e0f7fa' }}>
        {value}
        <span className="text-xs font-normal ml-1 opacity-50">{unit}</span>
      </div>

      {/* Sparkline + Trend row */}
      {sparkline && sparkline.length >= 2 && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <Sparkline data={sparkline} color={sparklineColor} />
          {trendValue && (
            <div className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${isUpward ? 'text-emerald-400' : 'text-red-400'}`}>
              {isUpward ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
              {trendValue}
            </div>
          )}
        </div>
      )}

      <div className="text-[10px] font-mono mt-1 tracking-wider uppercase opacity-60" style={{ color }}>
        {label}
      </div>

      {/* Bottom accent line with glow pulse */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: hovered
            ? `linear-gradient(90deg, transparent, ${color}, transparent)`
            : `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          boxShadow: hovered ? `0 0 8px ${color}60` : 'none',
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
