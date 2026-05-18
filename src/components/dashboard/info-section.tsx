'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, ChevronDown, AlertTriangle, BookOpen, Shield,
  ExternalLink,
} from 'lucide-react';
import {
  FAQ_DATA, DISCLAIMERS, CITATIONS,
} from '@/lib/data/malaysia-data';
import type { Lang } from '@/lib/dashboard-types';

// ─── FAQ & Info Section ──────────────────────────────────────────
export function InfoSection({ lang }: { lang: Lang }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* FAQ */}
      <div className="rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(6,182,212,0.12)',
      }}>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={14} style={{ color: '#06b6d4' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
            {lang === 'ms' ? 'SOALAN LAZIM' : 'FREQUENTLY ASKED QUESTIONS'}
          </span>
        </div>
        <div className="space-y-2">
          {FAQ_DATA.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-2 px-3 rounded text-left text-xs transition-colors hover:bg-cyan-950/20"
                style={{ color: '#e0f7fa' }}
              >
                <span>{lang === 'ms' ? faq.q_ms : faq.q_en}</span>
                <ChevronDown size={12} style={{
                  color: '#06b6d4',
                  transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-2 text-[11px] leading-relaxed" style={{ color: '#94a3b8' }}>
                      {lang === 'ms' ? faq.a_ms : faq.a_en}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimers */}
      <div className="rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(245,158,11,0.12)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#f59e0b' }}>
            {lang === 'ms' ? 'PENAFIAN' : 'DISCLAIMERS'}
          </span>
        </div>
        <ul className="space-y-1.5">
          {(lang === 'ms' ? DISCLAIMERS.ms : DISCLAIMERS.en).map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: '#94a3b8' }}>
              <span style={{ color: '#f59e0b' }}>•</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      {/* Citations */}
      <div className="rounded-lg border p-4" style={{
        background: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(16,185,129,0.12)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={14} style={{ color: '#10b981' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: '#10b981' }}>
            {lang === 'ms' ? 'SUMBER & PETIKAN' : 'SOURCES & CITATIONS'}
          </span>
        </div>
        <div className="space-y-2">
          {CITATIONS.map((c, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 px-2 rounded" style={{ background: 'rgba(16,185,129,0.03)' }}>
              <Shield size={10} className="mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
              <div>
                <div className="text-xs font-medium" style={{ color: '#e0f7fa' }}>{c.source}</div>
                <div className="text-[10px]" style={{ color: '#94a3b8' }}>{c.description}</div>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-mono inline-flex items-center gap-0.5" style={{ color: '#10b981' }}>
                  <ExternalLink size={8} /> {c.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
