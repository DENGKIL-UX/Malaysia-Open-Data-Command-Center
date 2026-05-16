'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { STATES } from '@/lib/data/malaysia-data';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket } from '@/components/dashboard/particle-background';

// ─── State Mini-Cards Grid ────────────────────────────────────────
export function StateMiniCards({ lang, onStateClick }: { lang: Lang; onStateClick?: (stateId: string) => void }) {
  const topStates = STATES.slice().sort((a, b) => b.population - a.population).slice(0, 6);
  return (
    <div className="relative group rounded-xl border p-5" style={{
      background: 'linear-gradient(180deg, rgba(6,182,212,0.03) 0%, rgba(10,14,26,0.85) 30%)',
      borderColor: 'rgba(6,182,212,0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.06)',
    }}>
      <HUDBracket />
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} style={{ color: '#06b6d4' }} />
        <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'NEGERI TERATAS MENGIKUT PENDUDUK' : 'TOP STATES BY POPULATION'}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {topStates.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={`relative rounded-md border p-3 overflow-hidden ${onStateClick ? 'cursor-pointer' : ''}`}
            style={{
              background: `linear-gradient(135deg, rgba(6,182,212,${0.03 + i * 0.01}), rgba(10,14,26,0.85))`,
              borderColor: i === 0 ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.08)',
            }}
            onClick={() => onStateClick?.(s.id)}
          >
            {/* Rank badge */}
            <div className="absolute top-1.5 right-1.5 text-[8px] font-mono px-1 py-0.5 rounded" style={{
              background: i < 3 ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.05)',
              color: i < 3 ? '#06b6d4' : '#8899aa',
            }}>
              #{i + 1}
            </div>
            <div className="text-xs font-bold mb-0.5" style={{ color: '#e0f7fa' }}>{s.name}</div>
            <div className="text-[9px] font-mono" style={{ color: '#06b6d4' }}>
              {s.population.toLocaleString()}k
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[8px] font-mono" style={{ color: '#10b981' }}>
                GDP {(s.gdp / 1000).toFixed(1)}B
              </span>
              <span className="text-[8px]" style={{ color: '#64748b' }}>•</span>
              <span className="text-[8px] font-mono" style={{ color: s.gdpGrowth >= 4 ? '#10b981' : '#f59e0b' }}>
                {s.gdpGrowth}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default StateMiniCards;
