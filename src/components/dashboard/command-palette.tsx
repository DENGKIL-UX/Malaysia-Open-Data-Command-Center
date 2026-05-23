'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Database, BarChart3, Map, LayoutDashboard, FileText,
  Printer, Languages, Search, Command, ArrowUp,
  ArrowDown, CornerDownLeft, X, HelpCircle,
  Brain, AlertTriangle, ShieldCheck, Network, Image, RectangleHorizontal,
  RectangleVertical,
} from 'lucide-react';
import { useIntelBus } from '@/engine/intelligence/bus';
import { GROUND_TRUTH_REGISTRY } from '@/lib/dosm/ground-truth-registry';
import type { Lang } from '@/lib/dashboard-types';
import type { DatasetPriority } from '@/lib/dosm/ground-truth-registry';

// ─── Types ──────────────────────────────────────────────────────────
type CommandCategory = 'navigate' | 'dataset' | 'intelligence' | 'generate';

interface PaletteCommand {
  id: string;
  label_en: string;
  label_ms: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  shortcut?: string;
  category: CommandCategory;
  /** Priority badge to display (e.g. P0, P1, INTEL) */
  badge?: string;
  /** Badge color variant */
  badgeVariant?: 'priority' | 'intel';
  /** Dataset registry key for dataset commands, used to set intel bus context */
  registryKey?: string;
}

// ─── Category header labels ─────────────────────────────────────────
const CATEGORY_HEADERS: Record<CommandCategory, { en: string; ms: string }> = {
  navigate: { en: 'NAVIGATE', ms: 'NAVIGASI' },
  dataset: { en: 'DATASET', ms: 'SET DATA' },
  intelligence: { en: 'INTELLIGENCE', ms: 'INTELEJEN' },
  generate: { en: 'GENERATE', ms: 'JANA' },
};

// ─── Category sort order ────────────────────────────────────────────
const CATEGORY_ORDER: Record<CommandCategory, number> = {
  navigate: 0,
  dataset: 1,
  intelligence: 2,
  generate: 3,
};

// ─── Priority badge color config ────────────────────────────────────
const PRIORITY_BADGE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  P0: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', text: '#f87171' },
  P1: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)', text: '#fbbf24' },
  INTEL: { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.35)', text: '#06b6d4' },
};

// ─── Command Palette ────────────────────────────────────────────────
export function CommandPalette({ lang, onClose, onAction }: {
  lang: Lang; onClose: () => void;
  onAction: (action: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const intelBus = useIntelBus();

  // ── Navigate commands (bilingual) ──
  const navigateCommands: PaletteCommand[] = useMemo(() => [
    { id: 'tab-overview', label_en: 'Go to Overview', label_ms: 'Pergi ke Gambaran', icon: LayoutDashboard, shortcut: '1', category: 'navigate' },
    { id: 'tab-geomap', label_en: 'Go to GeoMap', label_ms: 'Pergi ke PetaGeo', icon: Map, shortcut: '2', category: 'navigate' },
    { id: 'tab-datasets', label_en: 'Go to Datasets', label_ms: 'Pergi ke Set Data', icon: Database, shortcut: '3', category: 'navigate' },
    { id: 'tab-analytics', label_en: 'Go to Analytics', label_ms: 'Pergi ke Analitik', icon: BarChart3, shortcut: '4', category: 'navigate' },
    { id: 'tab-intelligence', label_en: 'Go to Intelligence', label_ms: 'Pergi ke Intel', icon: Brain, shortcut: '5', category: 'navigate' },
    { id: 'toggle-lang', label_en: 'Toggle Language', label_ms: 'Tukar Bahasa', icon: Languages, shortcut: 'L', category: 'navigate' },
    { id: 'open-infographic', label_en: 'Open Infographic Export', label_ms: 'Buka Eksport Infografik', icon: Printer, shortcut: 'E', category: 'navigate' },
  ], []);

  // ── Dataset commands (auto-generated from P0/P1 ground truth registry) ──
  const datasetCommands: PaletteCommand[] = useMemo(() => {
    const commands: PaletteCommand[] = [];
    const entries = Object.entries(GROUND_TRUTH_REGISTRY);

    // Sort: P0 first, then P1, then by priority_order within each tier
    const p0p1 = entries
      .filter(([, ds]) => ds.priority === 'P0' || ds.priority === 'P1')
      .sort(([, a], [, b]) => {
        const pa = a.priority === 'P0' ? 0 : 1;
        const pb = b.priority === 'P0' ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return a.priority_order - b.priority_order;
      });

    for (const [key, ds] of p0p1) {
      commands.push({
        id: `dataset-${key}`,
        label_en: ds.title_en,
        label_ms: ds.title_ms,
        icon: FileText,
        category: 'dataset',
        badge: ds.priority,
        badgeVariant: 'priority',
        registryKey: key,
      });
    }

    return commands;
  }, []);

  // ── Intelligence commands ──
  const intelligenceCommands: PaletteCommand[] = useMemo(() => [
    {
      id: 'intel-anomalies',
      label_en: 'View Anomalies',
      label_ms: 'Lihat Anomali',
      icon: AlertTriangle,
      category: 'intelligence',
      badge: 'INTEL',
      badgeVariant: 'intel',
    },
    {
      id: 'intel-confidence',
      label_en: 'Confidence Report',
      label_ms: 'Laporan Keyakinan',
      icon: ShieldCheck,
      category: 'intelligence',
      badge: 'INTEL',
      badgeVariant: 'intel',
    },
    {
      id: 'intel-ontology',
      label_en: 'Ontology Graph',
      label_ms: 'Graf Ontologi',
      icon: Network,
      category: 'intelligence',
      badge: 'INTEL',
      badgeVariant: 'intel',
    },
  ], []);

  // ── Generate commands ──
  const generateCommands: PaletteCommand[] = useMemo(() => [
    {
      id: 'generate-infographic-16x9',
      label_en: 'Generate Infographic (16:9 Landscape)',
      label_ms: 'Jana Infografik (16:9 Landskap)',
      icon: RectangleHorizontal,
      category: 'generate',
    },
    {
      id: 'generate-infographic-9x16',
      label_en: 'Generate Infographic (9:16 Portrait)',
      label_ms: 'Jana Infografik (9:16 Potret)',
      icon: RectangleVertical,
      category: 'generate',
    },
  ], []);

  // ── All commands combined ──
  const allCommands = useMemo(() => [
    ...navigateCommands,
    ...datasetCommands,
    ...intelligenceCommands,
    ...generateCommands,
  ], [navigateCommands, datasetCommands, intelligenceCommands, generateCommands]);

  // ── Filtered results with category grouping ──
  const filtered = useMemo(() => {
    if (!query) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(item =>
      item.label_en.toLowerCase().includes(q) ||
      item.label_ms.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  }, [query, allCommands]);

  // ── Group filtered results by category ──
  const groupedResults = useMemo(() => {
    const groups: Map<CommandCategory, PaletteCommand[]> = new Map();
    for (const cmd of filtered) {
      const existing = groups.get(cmd.category) || [];
      existing.push(cmd);
      groups.set(cmd.category, existing);
    }
    // Sort groups by category order
    const sorted = Array.from(groups.entries()).sort(
      ([a], [b]) => CATEGORY_ORDER[a] - CATEGORY_ORDER[b]
    );
    return sorted;
  }, [filtered]);

  // ── Flat list for keyboard navigation (preserves grouped order) ──
  const flatList = useMemo(() => {
    const items: PaletteCommand[] = [];
    for (const [, cmds] of groupedResults) {
      items.push(...cmds);
    }
    return items;
  }, [groupedResults]);

  // ── Action handler with Intel Bus integration ──
  const handleAction = useCallback((cmd: PaletteCommand) => {
    // Set intelligence bus context for dataset commands
    if (cmd.registryKey) {
      intelBus.setContext(cmd.registryKey, 'datasets');
    }

    // Handle intelligence commands
    if (cmd.id === 'intel-anomalies') {
      intelBus.setContext('anomalies', 'intelligence');
      onAction('tab-intelligence');
    } else if (cmd.id === 'intel-confidence') {
      intelBus.setContext('confidence', 'intelligence');
      onAction('tab-intelligence');
    } else if (cmd.id === 'intel-ontology') {
      intelBus.setContext('ontology', 'intelligence');
      onAction('tab-intelligence');
    } else if (cmd.id === 'generate-infographic-16x9') {
      onAction('open-infographic-16x9');
    } else if (cmd.id === 'generate-infographic-9x16') {
      onAction('open-infographic-9x16');
    } else {
      onAction(cmd.id);
    }

    onClose();
  }, [intelBus, onAction, onClose]);

  // ── Focus input on mount ──
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── Reset selected index when query changes (handled in onChange) ──

  // ── Scroll selected item into view ──
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // ── Keyboard navigation ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatList[selectedIndex]) {
        handleAction(flatList[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // ── Render badge ──
  const renderBadge = (badge: string, variant: 'priority' | 'intel') => {
    const colors = PRIORITY_BADGE_COLORS[badge] || PRIORITY_BADGE_COLORS[variant === 'intel' ? 'INTEL' : 'P1'];
    return (
      <span
        className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm ml-1.5 shrink-0"
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.text,
        }}
      >
        {badge}
      </span>
    );
  };

  // ── Build a flat index counter for mapping grouped results to flatList ──
  let flatIndex = 0;

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
        <div ref={listRef} className="max-h-96 overflow-y-auto custom-scrollbar py-2">
          {flatList.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search size={20} style={{ color: 'rgba(6,182,212,0.2)' }} className="mx-auto mb-2" />
              <p className="text-xs font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
                {lang === 'ms' ? 'Tiada hasil dijumpai' : 'No results found'}
              </p>
            </div>
          ) : (
            groupedResults.map(([category, commands]) => {
              // Compute the starting flat index for this category
              const categoryStartIndex = flatIndex;
              flatIndex += commands.length;

              return (
                <div key={category}>
                  {/* Category Header */}
                  <div
                    className="px-4 py-1.5 flex items-center gap-2"
                    style={{ borderBottom: '1px solid rgba(6,182,212,0.06)' }}
                  >
                    <span
                      className="text-[9px] font-mono font-bold tracking-widest"
                      style={{ color: 'rgba(6,182,212,0.35)' }}
                    >
                      {lang === 'ms' ? CATEGORY_HEADERS[category].ms : CATEGORY_HEADERS[category].en}
                    </span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(6,182,212,0.06)' }} />
                    <span
                      className="text-[8px] font-mono"
                      style={{ color: 'rgba(6,182,212,0.2)' }}
                    >
                      {commands.length}
                    </span>
                  </div>

                  {/* Commands in this category */}
                  {commands.map((item, i) => {
                    const globalIndex = categoryStartIndex + i;
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <button
                        key={item.id}
                        data-selected={isSelected}
                        onClick={() => handleAction(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                        style={{
                          background: isSelected ? 'rgba(6,182,212,0.1)' : 'transparent',
                        }}
                      >
                        <item.icon
                          size={14}
                          style={{ color: isSelected ? '#06b6d4' : 'rgba(6,182,212,0.4)' }}
                        />
                        <div className="flex-1 min-w-0">
                          <span
                            className="text-xs font-mono block truncate"
                            style={{ color: isSelected ? '#06b6d4' : '#e0f7fa' }}
                          >
                            {lang === 'ms' ? item.label_ms : item.label_en}
                          </span>
                        </div>
                        {/* Badge (P0 / P1 / INTEL) */}
                        {item.badge && renderBadge(item.badge, item.badgeVariant!)}
                        {/* Shortcut key */}
                        {item.shortcut && (
                          <kbd
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                            style={{
                              background: isSelected ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.05)',
                              border: '1px solid rgba(6,182,212,0.15)',
                              color: isSelected ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                            }}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                        {/* Selected indicator */}
                        {isSelected && (
                          <CornerDownLeft size={12} style={{ color: 'rgba(6,182,212,0.3)' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
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
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.2)' }}>
              {flatList.length} {lang === 'ms' ? 'arahan' : 'commands'}
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
    { key: '5', action_en: 'Go to Intelligence', action_ms: 'Pergi ke Intel' },
    { key: 'L', action_en: 'Toggle Language (EN/MS)', action_ms: 'Tukar Bahasa (EN/MS)' },
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
