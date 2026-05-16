'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { STATES } from '@/lib/data/malaysia-data';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket } from '@/components/dashboard/particle-background';

// ─── State Mini-Cards Grid ────────────────────────────────────────
export function StateMiniCards({ lang }: { lang: Lang }) {
  const topStates = STATES.slice().sort((a, b) => b.population - a.population).slice(0, 6);
  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'rgba(10,14,26,0.85)',
      borderColor: 'rgba(6,182,212,0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <HUDBracket />
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} style={{ color: '#06b6d4' }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
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
            className="relative rounded-md border p-3 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(6,182,212,${0.03 + i * 0.01}), rgba(10,14,26,0.85))`,
              borderColor: i === 0 ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.08)',
            }}
          >
            {/* Rank badge */}
            <div className="absolute top-1.5 right-1.5 text-[8px] font-mono px-1 py-0.5 rounded" style={{
              background: i < 3 ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.05)',
              color: i < 3 ? '#06b6d4' : 'rgba(6,182,212,0.4)',
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
              <span className="text-[8px]" style={{ color: 'rgba(6,182,212,0.3)' }}>•</span>
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
