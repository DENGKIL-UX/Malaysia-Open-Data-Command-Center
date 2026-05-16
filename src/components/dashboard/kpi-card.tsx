'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';

// ─── KPI Card Component ─────────────────────────────────────────────
export function KPICard({ icon: Icon, label, value, unit, change, color, lang }: {
  icon: React.ElementType; label: string; value: string; unit: string;
  change?: number; color: string; lang: Lang;
}) {
  const [hovered, setHovered] = useState(false);

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
        boxShadow: hovered ? `0 0 20px ${color}20, 0 0 40px ${color}10` : 'none',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{
        background: `radial-gradient(circle at top right, ${color}, transparent)`,
      }} />
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
      <div className="text-[10px] font-mono mt-1 tracking-wider uppercase opacity-60" style={{ color }}>
        {label}
      </div>
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{
        background: hovered
          ? `linear-gradient(90deg, transparent, ${color}, transparent)`
          : `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        boxShadow: hovered ? `0 0 8px ${color}60` : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }} />
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
