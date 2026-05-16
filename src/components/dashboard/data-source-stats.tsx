'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { DATASETS } from '@/lib/data/datasets';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket } from '@/components/dashboard/particle-background';

// ─── Data Source Statistics ───────────────────────────────────────
export function DataSourceStats({ lang }: { lang: Lang }) {
  const sourceStats = useMemo(() => {
    const counts: Record<string, { count: number; categories: Set<string> }> = {};
    DATASETS.forEach(d => {
      d.data_source.forEach(src => {
        if (!counts[src]) counts[src] = { count: 0, categories: new Set() };
        counts[src].count++;
        counts[src].categories.add(d.category_en);
      });
    });
    return Object.entries(counts)
      .map(([source, data]) => ({ source, count: data.count, categories: data.categories.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, []);

  const sourceColors: Record<string, string> = {
    DOSM: '#06b6d4', BNM: '#f59e0b', KKM: '#ec4899', JPJ: '#8b5cf6',
    KPM: '#3b82f6', KASA: '#22c55e', JDN: '#f97316', KD: '#64748b',
  };

  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'rgba(10,14,26,0.95)',
      borderColor: 'rgba(6,182,212,0.12)',
    }}>
      <HUDBracket />
      <div className="flex items-center gap-2 mb-3">
        <Database size={14} style={{ color: '#06b6d4' }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'AGENSI SUMBER DATA' : 'DATA SOURCE AGENCIES'}
        </span>
      </div>
      <div className="space-y-2">
        {sourceStats.map(s => {
          const color = sourceColors[s.source] || '#64748b';
          const maxCount = sourceStats[0]?.count || 1;
          return (
            <div key={s.source} className="flex items-center gap-2">
              <span className="text-[9px] font-mono w-10 text-right font-bold" style={{ color }}>{s.source}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(s.count / maxCount) * 100}%` }}
                  transition={{ duration: 1, delay: 0.1 }}
                  style={{
                    background: `linear-gradient(90deg, ${color}80, ${color})`,
                    boxShadow: `0 0 6px ${color}30`,
                  }}
                />
              </div>
              <span className="text-[8px] font-mono w-5 text-right" style={{ color: '#94a3b8' }}>{s.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DataSourceStats;
