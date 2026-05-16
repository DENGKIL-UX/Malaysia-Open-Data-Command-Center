'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket } from '@/components/dashboard/particle-background';

// ─── Health Index Widget ──────────────────────────────────────────
export function HealthIndexWidget({ lang }: { lang: Lang }) {
  const indices = [
    { label_en: 'Healthcare', label_ms: 'Kesihatan', value: 78, color: '#ec4899', icon: '🏥' },
    { label_en: 'Environment', label_ms: 'Alam Sekitar', value: 65, color: '#22c55e', icon: '🌿' },
    { label_en: 'Education', label_ms: 'Pendidikan', value: 82, color: '#3b82f6', icon: '📚' },
    { label_en: 'Economy', label_ms: 'Ekonomi', value: 71, color: '#f59e0b', icon: '💰' },
    { label_en: 'Safety', label_ms: 'Keselamatan', value: 74, color: '#8b5cf6', icon: '🛡️' },
    { label_en: 'Digital', label_ms: 'Digital', value: 68, color: '#06b6d4', icon: '💻' },
  ];

  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'rgba(10,14,26,0.95)',
      borderColor: 'rgba(6,182,212,0.12)',
    }}>
      <HUDBracket />
      <div className="flex items-center gap-2 mb-3">
        <Heart size={14} style={{ color: '#ec4899' }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#ec4899' }}>
          {lang === 'ms' ? 'INDEKS KEBERKESANAN NEGARA' : 'NATIONAL PERFORMANCE INDEX'}
        </span>
      </div>
      <div className="space-y-2.5">
        {indices.map((idx) => (
          <div key={idx.label_en}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: '#94a3b8' }}>
                <span className="text-xs">{idx.icon}</span>
                {lang === 'ms' ? idx.label_ms : idx.label_en}
              </span>
              <span className="text-[10px] font-mono font-bold" style={{ color: idx.color }}>{idx.value}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${idx.value}%` }}
                transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                style={{
                  background: `linear-gradient(90deg, ${idx.color}60, ${idx.color})`,
                  boxShadow: `0 0 8px ${idx.color}40`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthIndexWidget;
