'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Database, BarChart3, Map, LayoutDashboard, FileText,
  Printer, Info, Languages, Search, Command, ArrowUp,
  ArrowDown, CornerDownLeft, X, HelpCircle,
} from 'lucide-react';
import { DATASETS } from '@/lib/data/datasets';
import type { Lang } from '@/lib/dashboard-types';

// ─── Command Palette ──────────────────────────────────────────────
export function CommandPalette({ lang, onClose, onAction }: {
  lang: Lang; onClose: () => void;
  onAction: (action: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const baseCommands = [
    { id: 'tab-overview', label_en: 'Go to Overview', label_ms: 'Pergi ke Gambaran', icon: LayoutDashboard, shortcut: '1' },
    { id: 'tab-geomap', label_en: 'Go to GeoMap', label_ms: 'Pergi ke PetaGeo', icon: Map, shortcut: '2' },
    { id: 'tab-datasets', label_en: 'Go to Datasets', label_ms: 'Pergi ke Set Data', icon: Database, shortcut: '3' },
    { id: 'tab-analytics', label_en: 'Go to Analytics', label_ms: 'Pergi ke Analitik', icon: BarChart3, shortcut: '4' },
    { id: 'toggle-lang', label_en: 'Toggle Language', label_ms: 'Tukar Bahasa', icon: Languages, shortcut: 'L' },
    { id: 'open-infographic', label_en: 'Open Infographic Export', label_ms: 'Buka Eksport Infografik', icon: Printer, shortcut: 'E' },
    { id: 'toggle-info', label_en: 'Toggle Info Panel', label_ms: 'Togol Panel Maklumat', icon: Info, shortcut: 'I' },
  ];

  const datasetCommands = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return DATASETS
      .filter(d => d.title_en.toLowerCase().includes(q) || d.title_ms.toLowerCase().includes(q))
      .slice(0, 20)
      .map(d => ({
        id: `dataset-${d.id}`,
        label_en: d.title_en,
        label_ms: d.title_ms,
        icon: FileText,
        shortcut: '',
        category: d.category_en,
      }));
  }, [query]);

  const allItems = useMemo(() => {
    const items: typeof baseCommands & { category?: string }[] = [...baseCommands];
    if (datasetCommands.length > 0) {
      items.push(...(datasetCommands as (typeof baseCommands & { category?: string })[]));
    }
    return items;
  }, [baseCommands, datasetCommands]);

  const filtered = useMemo(() => {
    if (!query) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(item =>
      item.label_en.toLowerCase().includes(q) ||
      item.label_ms.toLowerCase().includes(q) ||
      ('category' in item && item.category?.toLowerCase().includes(q))
    );
  }, [query, allItems]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onAction(filtered[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-lg rounded-lg border overflow-hidden"
        style={{
          background: 'rgba(8,12,24,0.98)',
          borderColor: 'rgba(6,182,212,0.3)',
          boxShadow: '0 0 40px rgba(6,182,212,0.15), 0 25px 50px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'rgba(6,182,212,0.15)' }}>
          <Command size={16} style={{ color: '#06b6d4' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'ms' ? 'Taip arahan atau cari set data...' : 'Type a command or search datasets...'}
            className="flex-1 bg-transparent outline-none text-sm font-mono"
            style={{ color: '#e0f7fa', caretColor: '#06b6d4' }}
          />
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.15)',
            color: 'rgba(6,182,212,0.5)',
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto custom-scrollbar py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search size={20} style={{ color: 'rgba(6,182,212,0.2)' }} className="mx-auto mb-2" />
              <p className="text-xs font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
                {lang === 'ms' ? 'Tiada hasil dijumpai' : 'No results found'}
              </p>
            </div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { onAction(item.id); onClose(); }}
                onMouseEnter={() => setSelectedIndex(i)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{
                  background: i === selectedIndex ? 'rgba(6,182,212,0.1)' : 'transparent',
                }}
              >
                <item.icon size={14} style={{ color: i === selectedIndex ? '#06b6d4' : 'rgba(6,182,212,0.4)' }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono block truncate" style={{
                    color: i === selectedIndex ? '#06b6d4' : '#e0f7fa',
                  }}>
                    {'category' in item && item.category ? (
                      <>
                        <span style={{ color: 'rgba(6,182,212,0.4)' }}>{item.category} › </span>
                        {lang === 'ms' ? item.label_ms : item.label_en}
                      </>
                    ) : (
                      lang === 'ms' ? item.label_ms : item.label_en
                    )}
                  </span>
                </div>
                {item.shortcut && (
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                    background: i === selectedIndex ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.05)',
                    border: '1px solid rgba(6,182,212,0.15)',
                    color: i === selectedIndex ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                  }}>{item.shortcut}</kbd>
                )}
                {i === selectedIndex && (
                  <CornerDownLeft size={12} style={{ color: 'rgba(6,182,212,0.3)' }} />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t" style={{ borderColor: 'rgba(6,182,212,0.1)' }}>
          <div className="flex items-center gap-1.5">
            <ArrowUp size={10} style={{ color: 'rgba(6,182,212,0.3)' }} />
            <ArrowDown size={10} style={{ color: 'rgba(6,182,212,0.3)' }} />
            <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
              {lang === 'ms' ? 'Navigasi' : 'Navigate'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CornerDownLeft size={10} style={{ color: 'rgba(6,182,212,0.3)' }} />
            <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
              {lang === 'ms' ? 'Pilih' : 'Select'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="text-[7px] font-mono px-1 py-0.5 rounded" style={{
              background: 'rgba(6,182,212,0.05)',
              border: '1px solid rgba(6,182,212,0.1)',
              color: 'rgba(6,182,212,0.3)',
            }}>ESC</kbd>
            <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
              {lang === 'ms' ? 'Tutup' : 'Close'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Keyboard Shortcuts Modal ─────────────────────────────────────
export function KeyboardShortcutsModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const shortcuts = [
    { key: '1', action_en: 'Go to Overview', action_ms: 'Pergi ke Gambaran' },
    { key: '2', action_en: 'Go to GeoMap', action_ms: 'Pergi ke PetaGeo' },
    { key: '3', action_en: 'Go to Datasets', action_ms: 'Pergi ke Set Data' },
    { key: '4', action_en: 'Go to Analytics', action_ms: 'Pergi ke Analitik' },
    { key: 'L', action_en: 'Toggle Language (EN/MS)', action_ms: 'Tukar Bahasa (EN/MS)' },
    { key: 'I', action_en: 'Toggle Info Panel', action_ms: 'Togol Panel Maklumat' },
    { key: 'E', action_en: 'Open Infographic Export', action_ms: 'Buka Eksport Infografik' },
    { key: '⌘K / Ctrl+K', action_en: 'Open Command Palette', action_ms: 'Buka Palet Arahan' },
    { key: 'ESC', action_en: 'Close Modal / Palette', action_ms: 'Tutup Modal / Palet' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-lg border overflow-hidden"
        style={{
          background: 'rgba(8,12,24,0.98)',
          borderColor: 'rgba(6,182,212,0.3)',
          boxShadow: '0 0 40px rgba(6,182,212,0.15), 0 25px 50px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(6,182,212,0.15)' }}>
          <div className="flex items-center gap-2">
            <HelpCircle size={16} style={{ color: '#06b6d4' }} />
            <span className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'PINTASAN PAPAN KEKUNCI' : 'KEYBOARD SHORTCUTS'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-cyan-950/30 transition-colors">
            <X size={14} style={{ color: 'rgba(6,182,212,0.5)' }} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="px-5 py-3 space-y-0">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5" style={{
              borderBottom: i < shortcuts.length - 1 ? '1px solid rgba(6,182,212,0.06)' : 'none',
            }}>
              <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>
                {lang === 'ms' ? s.action_ms : s.action_en}
              </span>
              <kbd className="text-[10px] font-mono px-2 py-1 rounded" style={{
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.2)',
                color: '#06b6d4',
                boxShadow: '0 0 8px rgba(6,182,212,0.05)',
              }}>{s.key}</kbd>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t" style={{ borderColor: 'rgba(6,182,212,0.1)' }}>
          <p className="text-[9px] font-mono text-center" style={{ color: 'rgba(6,182,212,0.3)' }}>
            {lang === 'ms'
              ? 'Pintasan tidak aktif semasa menaip dalam medan input'
              : 'Shortcuts are disabled while typing in input fields'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CommandPalette;
