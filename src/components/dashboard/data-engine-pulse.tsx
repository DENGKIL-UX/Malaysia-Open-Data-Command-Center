'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket } from '@/components/dashboard/particle-background';
import { useAnimatedValue } from '@/components/dashboard/kpi-card';

// ─── Real-time Engine Pulse ───────────────────────────────────────
export function DataEnginePulse({ lang }: { lang: Lang }) {
  const [pulse, setPulse] = useState(0);
  const [throughput, setThroughput] = useState(0);
  const [latency, setLatency] = useState(0);
  const animPop = useAnimatedValue(34300);

  useEffect(() => {
    const iv = setInterval(() => {
      setPulse(p => (p + 1) % 60);
      setThroughput(Math.floor(120 + Math.random() * 80));
      setLatency(Math.floor(8 + Math.random() * 12));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative group rounded-lg border p-4" style={{
      background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(10,14,26,0.85))',
      borderColor: 'rgba(6,182,212,0.15)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <HUDBracket />
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <Activity size={14} style={{ color: '#06b6d4' }} />
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Activity size={14} style={{ color: '#06b6d4' }} />
          </motion.div>
        </div>
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'ENJIN DATA MASA NYATA' : 'REAL-TIME DATA ENGINE'}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] font-mono text-emerald-400">ACTIVE</span>
        </div>
      </div>

      {/* Throughput Waveform */}
      <div className="flex items-end gap-px h-8 mb-3">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-300"
            style={{
              height: `${Math.max(8, Math.sin((pulse + i) * 0.3) * 50 + 50)}%`,
              background: `linear-gradient(180deg, #06b6d4${Math.round(40 + Math.sin((pulse + i) * 0.3) * 30).toString(16).padStart(2, '0')}, rgba(6,182,212,0.05))`,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-sm font-bold font-mono" style={{ color: '#06b6d4' }}>{throughput}</div>
          <div className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
            {lang === 'ms' ? 'REQ/MIN' : 'REQ/MIN'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono" style={{ color: '#10b981' }}>{latency}ms</div>
          <div className="text-[8px] font-mono" style={{ color: 'rgba(16,185,129,0.5)' }}>
            {lang === 'ms' ? 'KELENGKAPAN' : 'LATENCY'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono" style={{ color: '#f59e0b' }}>99.9%</div>
          <div className="text-[8px] font-mono" style={{ color: 'rgba(245,158,11,0.5)' }}>
            {lang === 'ms' ? 'KEBOLEHUPAYAAN' : 'UPTIME'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataEnginePulse;
