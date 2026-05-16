'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Copy, Check, ChevronDown, ChevronUp,
  LayoutGrid, Building2, Filter, X, Layers,
  Shield, TrendingUp, Heart, HardHat, Landmark,
  Users, Globe, Briefcase, GraduationCap, Truck,
  Zap, Banknote, Scale, FileText, Activity,
  Cpu, Wifi, Database, MapPin, BarChart3,
  Anchor, Plane, Factory, Leaf, Droplets,
  Sun, Flame, Wind, Gem, Fingerprint,
  Type, Palette, Brush, PenTool, Image,
  CircleDot, Hexagon, Diamond, Star, Square,
  Triangle, Octagon, Pentagon, ArrowRight,
  AppWindow, Box, Component, Grid3x3,
  // Additional icons needed by malaysian-ministries data
  Crown, TreePine, Palmtree, Store, ShoppingCart,
  Baby, Dumbbell, Handshake, Moon, TrainFront,
  Mountain, Radio, Gavel, Swords, Wheat,
  PiggyBank, Receipt, CircleDollarSign, CreditCard,
  Wallet, ArrowLeftRight, DollarSign, Percent,
  Ship, Car, Bus, Plug, Smartphone, Fuel,
  Bed, Pill, Stethoscope, Flag, Home, Tag,
  Scroll, TrendingDown, BookOpen,
} from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';
import {
  MINISTRIES, ICON_SETS, MINISTRY_CATEGORY_LABELS,
  type Ministry, type IconSetItem, type IconSet,
} from '@/lib/data/malaysian-ministries';

// ─── Category Config (derived from MINISTRY_CATEGORY_LABELS) ─────
type MinistryCategory = Ministry['category'];

const CATEGORY_CONFIG: Record<MinistryCategory, { color: string; label_en: string; label_ms: string; icon: React.ElementType }> = {
  core:           { color: MINISTRY_CATEGORY_LABELS.core.color, label_en: MINISTRY_CATEGORY_LABELS.core.en, label_ms: MINISTRY_CATEGORY_LABELS.core.ms, icon: Landmark },
  economic:       { color: MINISTRY_CATEGORY_LABELS.economic.color, label_en: MINISTRY_CATEGORY_LABELS.economic.en, label_ms: MINISTRY_CATEGORY_LABELS.economic.ms, icon: TrendingUp },
  social:         { color: MINISTRY_CATEGORY_LABELS.social.color, label_en: MINISTRY_CATEGORY_LABELS.social.en, label_ms: MINISTRY_CATEGORY_LABELS.social.ms, icon: Heart },
  security:       { color: MINISTRY_CATEGORY_LABELS.security.color, label_en: MINISTRY_CATEGORY_LABELS.security.en, label_ms: MINISTRY_CATEGORY_LABELS.security.ms, icon: Shield },
  infrastructure: { color: MINISTRY_CATEGORY_LABELS.infrastructure.color, label_en: MINISTRY_CATEGORY_LABELS.infrastructure.en, label_ms: MINISTRY_CATEGORY_LABELS.infrastructure.ms, icon: HardHat },
};

// ─── Lucide Icon Resolver ─────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  // Original icons
  Users, Globe, Briefcase, GraduationCap, Truck, Zap, Banknote, Scale,
  FileText, Activity, Cpu, Wifi, Database, MapPin, BarChart3, Anchor,
  Plane, Factory, Leaf, Droplets, Sun, Flame, Wind, Gem, Fingerprint,
  Type, Palette, Brush, PenTool, Image, CircleDot, Hexagon, Diamond,
  Star, Square, Triangle, Octagon, Pentagon, ArrowRight, AppWindow,
  Box, Component, Grid3x3, Shield, TrendingUp, Heart, HardHat,
  Landmark, Search, Copy, Layers, Building2,
  // Ministry icons
  Crown, TreePine, Palmtree, Store, ShoppingCart,
  Baby, Dumbbell, Handshake, Moon, TrainFront,
  Mountain, Radio, Gavel, Swords, Wheat,
  // Economic indicator icons
  PiggyBank, Receipt, CircleDollarSign, CreditCard,
  Wallet, ArrowLeftRight, DollarSign, Percent,
  // Infrastructure icons
  Ship, Car, Bus, Plug, Smartphone, Fuel,
  // Social indicator icons
  Bed, Pill, Stethoscope,
  // State & misc icons
  Flag, Home, Tag, Scroll, TrendingDown, BookOpen,
};

function resolveIcon(name: string): React.ElementType {
  return ICON_MAP[name] || CircleDot;
}

// ─── Toast Notification ───────────────────────────────────────────
function CopyToast({ visible, message }: { visible: boolean; message: string }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-lg border font-mono"
          style={{
            background: 'rgba(10,14,26,0.95)',
            borderColor: 'rgba(16,185,129,0.3)',
            boxShadow: '0 0 20px rgba(16,185,129,0.15), 0 4px 20px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Check size={12} style={{ color: '#10b981' }} />
          <span className="text-[10px] tracking-wider" style={{ color: '#10b981' }}>
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export function IconographyPanel({ lang }: { lang: Lang }) {
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<MinistryCategory | 'all'>('all');
  const [activeSection, setActiveSection] = useState<'icons' | 'ministries'>('icons');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const ministries = MINISTRIES;
  const iconSets = ICON_SETS;

  // Flatten all icon set items for search
  const allIcons = useMemo(() => {
    const items: (IconSetItem & { setId: string; setName_en: string; setName_ms: string })[] = [];
    for (const set of iconSets) {
      for (const icon of set.icons) {
        items.push({ ...icon, setId: set.id, setName_en: set.name_en, setName_ms: set.name_ms });
      }
    }
    return items;
  }, [iconSets]);

  // Filtered icons
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return allIcons;
    const q = searchQuery.toLowerCase();
    return allIcons.filter(i =>
      i.label_en.toLowerCase().includes(q) ||
      i.label_ms.toLowerCase().includes(q) ||
      i.icon.toLowerCase().includes(q) ||
      i.setName_en.toLowerCase().includes(q)
    );
  }, [allIcons, searchQuery]);

  // Filtered ministries
  const filteredMinistries = useMemo(() => {
    let result = ministries;
    if (activeCategory !== 'all') {
      result = result.filter(m => m.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name_en.toLowerCase().includes(q) ||
        m.name_ms.toLowerCase().includes(q) ||
        m.abbr_en.toLowerCase().includes(q) ||
        m.abbr_ms.toLowerCase().includes(q)
      );
    }
    return result;
  }, [ministries, activeCategory, searchQuery]);

  // Copy to clipboard
  const copyToClipboard = useCallback((ref: string, displayLabel: string) => {
    navigator.clipboard.writeText(ref).then(() => {
      setCopiedId(ref);
      setToastMessage(
        lang === 'ms'
          ? `Disalin: ${displayLabel}`
          : `Copied: ${displayLabel}`
      );
      setToastVisible(true);
      setTimeout(() => {
        setCopiedId(null);
        setToastVisible(false);
      }, 2000);
    }).catch(() => {
      // Fallback: do nothing silently
    });
  }, [lang]);

  // Category tabs for ministries
  const categoryTabs: { id: MinistryCategory | 'all'; label_en: string; label_ms: string; color: string }[] = [
    { id: 'all', label_en: 'All', label_ms: 'Semua', color: '#06b6d4' },
    { id: 'core', label_en: CATEGORY_CONFIG.core.label_en, label_ms: CATEGORY_CONFIG.core.label_ms, color: CATEGORY_CONFIG.core.color },
    { id: 'economic', label_en: CATEGORY_CONFIG.economic.label_en, label_ms: CATEGORY_CONFIG.economic.label_ms, color: CATEGORY_CONFIG.economic.color },
    { id: 'social', label_en: CATEGORY_CONFIG.social.label_en, label_ms: CATEGORY_CONFIG.social.label_ms, color: CATEGORY_CONFIG.social.color },
    { id: 'security', label_en: CATEGORY_CONFIG.security.label_en, label_ms: CATEGORY_CONFIG.security.label_ms, color: CATEGORY_CONFIG.security.color },
    { id: 'infrastructure', label_en: CATEGORY_CONFIG.infrastructure.label_en, label_ms: CATEGORY_CONFIG.infrastructure.label_ms, color: CATEGORY_CONFIG.infrastructure.color },
  ];

  return (
    <div className="relative group rounded-xl border" style={{
      background: 'rgba(10,14,26,0.95)',
      borderColor: 'rgba(6,182,212,0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.06)',
    }}>
      <HUDBracket />

      {/* ── Panel Header ──────────────────────────────────────── */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer transition-colors hover:bg-cyan-950/10 rounded-t-xl"
        aria-expanded={expanded}
        aria-label={lang === 'ms' ? 'Panel Ikonografi' : 'Iconography Panel'}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.15)',
          }}>
            <Layers size={13} style={{ color: '#06b6d4' }} />
          </div>
          <div>
            <span className="text-[12px] font-bold font-mono tracking-[0.2em]" style={{
              color: '#06b6d4',
              textShadow: '0 0 8px rgba(6,182,212,0.4)',
            }}>
              {lang === 'ms' ? 'PANEL IKONOGRAFI' : 'ICONOGRAPHY PANEL'}
            </span>
            <SectionHeaderLine color="#06b6d4" delay={0.2} />
          </div>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded ml-2" style={{
            background: 'rgba(6,182,212,0.06)',
            color: 'rgba(6,182,212,0.6)',
            border: '1px solid rgba(6,182,212,0.08)',
          }}>
            {allIcons.length + ministries.length} {lang === 'ms' ? 'item' : 'items'}
          </span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={14} style={{ color: 'rgba(6,182,212,0.5)' }} />
        </motion.div>
      </button>

      {/* ── Collapsible Content ───────────────────────────────── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* ── Section Tabs (Icons | Ministries) ────────────── */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSection('icons')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer"
                  style={{
                    background: activeSection === 'icons' ? 'rgba(6,182,212,0.12)' : 'transparent',
                    border: `1px solid ${activeSection === 'icons' ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.06)'}`,
                    color: activeSection === 'icons' ? '#06b6d4' : 'rgba(148,163,184,0.5)',
                  }}
                >
                  <LayoutGrid size={10} />
                  {lang === 'ms' ? 'Set Ikon' : 'Icon Sets'}
                </button>
                <button
                  onClick={() => setActiveSection('ministries')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer"
                  style={{
                    background: activeSection === 'ministries' ? 'rgba(6,182,212,0.12)' : 'transparent',
                    border: `1px solid ${activeSection === 'ministries' ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.06)'}`,
                    color: activeSection === 'ministries' ? '#06b6d4' : 'rgba(148,163,184,0.5)',
                  }}
                >
                  <Building2 size={10} />
                  {lang === 'ms' ? 'Kementerian' : 'Ministries'}
                </button>
              </div>

              {/* ── Search Bar ────────────────────────────────────── */}
              <div className="relative">
                <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(6,182,212,0.4)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ms' ? 'Cari ikon atau kementerian...' : 'Search icons or ministries...'}
                  className="w-full pl-9 pr-8 py-2 rounded font-mono text-[11px] tracking-wider outline-none transition-colors"
                  style={{
                    background: 'rgba(6,182,212,0.04)',
                    border: '1px solid rgba(6,182,212,0.1)',
                    color: '#e0f7fa',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(6,182,212,0.3)';
                    e.target.style.boxShadow = '0 0 10px rgba(6,182,212,0.08)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(6,182,212,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ color: 'rgba(148,163,184,0.4)' }}
                  >
                    <X size={11} />
                  </button>
                )}
              </div>

              {/* ── Category Tabs (for Ministries section) ────────── */}
              {activeSection === 'ministries' && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Filter size={9} style={{ color: 'rgba(6,182,212,0.3)', marginRight: 2 }} />
                  {categoryTabs.map(tab => {
                    const isActive = activeCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveCategory(tab.id)}
                        className="px-2 py-1 rounded text-[8px] font-mono tracking-wider transition-all cursor-pointer"
                        style={{
                          background: isActive ? `${tab.color}15` : 'transparent',
                          border: `1px solid ${isActive ? `${tab.color}30` : 'rgba(6,182,212,0.06)'}`,
                          color: isActive ? tab.color : 'rgba(148,163,184,0.4)',
                        }}
                      >
                        {lang === 'ms' ? tab.label_ms : tab.label_en}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── Icon Sets Section ─────────────────────────────── */}
              {activeSection === 'icons' && (
                <div className="space-y-5">
                  {iconSets.map(iconSet => {
                    const setIcons = searchQuery.trim()
                      ? filteredIcons.filter(i => i.setId === iconSet.id)
                      : iconSet.icons;

                    if (searchQuery.trim() && setIcons.length === 0) return null;

                    return (
                      <div key={iconSet.id}>
                        {/* Set Header */}
                        <div className="flex items-center gap-2 mb-2.5">
                          <div className="w-1 h-4 rounded-full" style={{
                            background: 'linear-gradient(180deg, #06b6d4, transparent)',
                          }} />
                          <span className="text-[10px] font-bold font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                            {lang === 'ms' ? iconSet.name_ms : iconSet.name_en}
                          </span>
                          <span className="text-[8px] font-mono" style={{ color: 'rgba(148,163,184,0.4)' }}>
                            ({setIcons.length})
                          </span>
                          <span className="text-[8px] font-mono" style={{ color: 'rgba(148,163,184,0.3)' }}>
                            — {lang === 'ms' ? iconSet.description_ms : iconSet.description_en}
                          </span>
                        </div>

                        {/* Icon Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                          {setIcons.map((item, idx) => {
                            const IconComponent = resolveIcon(item.icon);
                            const copyRef = `<${item.icon} />`;
                            const isCopied = copiedId === copyRef;

                            return (
                              <motion.button
                                key={`${iconSet.id}-${item.icon}-${idx}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2, delay: idx * 0.03 }}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyToClipboard(copyRef, item.icon)}
                                className="relative flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all cursor-pointer group/icon"
                                style={{
                                  background: 'rgba(6,182,212,0.03)',
                                  borderColor: 'rgba(6,182,212,0.08)',
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = `${item.color}10`;
                                  e.currentTarget.style.borderColor = `${item.color}30`;
                                  e.currentTarget.style.boxShadow = `0 0 15px ${item.color}15, inset 0 0 15px ${item.color}05`;
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = 'rgba(6,182,212,0.03)';
                                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.08)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                                title={`${item.icon} — ${lang === 'ms' ? item.label_ms : item.label_en}\n${lang === 'ms' ? 'Klik untuk menyalin' : 'Click to copy'}`}
                              >
                                {/* Icon Visual */}
                                <div className="relative">
                                  <IconComponent size={18} style={{ color: item.color }} />
                                  {/* Glow on hover */}
                                  <div className="absolute inset-0 opacity-0 group-hover/icon:opacity-100 transition-opacity" style={{
                                    filter: `blur(6px)`,
                                  }}>
                                    <IconComponent size={18} style={{ color: item.color }} />
                                  </div>
                                </div>

                                {/* Label */}
                                <span className="text-[7px] font-mono tracking-wider text-center leading-tight" style={{ color: '#b0bec5' }}>
                                  {lang === 'ms' ? item.label_ms : item.label_en}
                                </span>

                                {/* Color dot */}
                                <div className="w-1 h-1 rounded-full" style={{ background: item.color, opacity: 0.6 }} />

                                {/* Copied overlay */}
                                <AnimatePresence>
                                  {isCopied && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="absolute inset-0 flex items-center justify-center rounded-lg"
                                      style={{
                                        background: 'rgba(10,14,26,0.9)',
                                        border: '1px solid rgba(16,185,129,0.3)',
                                      }}
                                    >
                                      <Check size={14} style={{ color: '#10b981' }} />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {filteredIcons.length === 0 && searchQuery.trim() && (
                    <div className="text-center py-8">
                      <Search size={20} style={{ color: 'rgba(6,182,212,0.15)', margin: '0 auto 8px' }} />
                      <p className="text-[10px] font-mono" style={{ color: 'rgba(148,163,184,0.3)' }}>
                        {lang === 'ms' ? 'Tiada ikon dijumpai' : 'No icons found'}
                      </p>
                      <p className="text-[8px] font-mono mt-1" style={{ color: 'rgba(148,163,184,0.2)' }}>
                        &quot;{searchQuery}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Ministries Section ─────────────────────────────── */}
              {activeSection === 'ministries' && (
                <div className="space-y-2">
                  {filteredMinistries.map((ministry, idx) => {
                    const catCfg = CATEGORY_CONFIG[ministry.category];
                    const CatIcon = catCfg.icon;
                    const MinistryIcon = resolveIcon(ministry.icon);
                    const copyRef = `@ministry/${ministry.id}`;
                    const isCopied = copiedId === copyRef;

                    return (
                      <motion.div
                        key={ministry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.04 }}
                        className="relative flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group/min"
                        style={{
                          background: 'rgba(6,182,212,0.02)',
                          borderColor: 'rgba(6,182,212,0.08)',
                          borderLeft: `3px solid ${ministry.color}40`,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = `${ministry.color}08`;
                          e.currentTarget.style.borderColor = `${ministry.color}25`;
                          e.currentTarget.style.borderLeftColor = ministry.color;
                          e.currentTarget.style.boxShadow = `0 0 20px ${ministry.color}10, inset 0 0 20px ${ministry.color}03`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(6,182,212,0.02)';
                          e.currentTarget.style.borderColor = 'rgba(6,182,212,0.08)';
                          e.currentTarget.style.borderLeftColor = `${ministry.color}40`;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={() => copyToClipboard(copyRef, ministry.abbr_en)}
                        title={`${lang === 'ms' ? ministry.name_ms : ministry.name_en}\n${lang === 'ms' ? 'Klik untuk menyalin rujukan' : 'Click to copy reference'}`}
                      >
                        {/* Ministry Icon */}
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative" style={{
                          background: `${ministry.color}10`,
                          border: `1px solid ${ministry.color}20`,
                        }}>
                          <MinistryIcon size={18} style={{ color: ministry.color }} />
                          {/* Glow */}
                          <div className="absolute inset-0 rounded-lg opacity-0 group-hover/min:opacity-100 transition-opacity" style={{
                            boxShadow: `0 0 12px ${ministry.color}25`,
                          }} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            {/* Abbreviation */}
                            <span className="text-[11px] font-mono font-bold tracking-wider" style={{
                              color: ministry.color,
                              textShadow: `0 0 6px ${ministry.color}30`,
                            }}>
                              {lang === 'ms' ? ministry.abbr_ms : ministry.abbr_en}
                            </span>
                            {/* Emoji */}
                            <span className="text-xs">{ministry.emoji}</span>
                          </div>
                          <span className="text-[9px] font-mono block truncate" style={{ color: '#b0bec5' }}>
                            {lang === 'ms' ? ministry.name_ms : ministry.name_en}
                          </span>
                          <span className="text-[8px] font-mono block truncate mt-0.5" style={{ color: 'rgba(148,163,184,0.5)' }}>
                            {lang === 'ms' ? ministry.description_ms : ministry.description_en}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="text-[7px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1" style={{
                            background: `${catCfg.color}10`,
                            color: `${catCfg.color}90`,
                            border: `1px solid ${catCfg.color}18`,
                          }}>
                            <CatIcon size={7} />
                            {lang === 'ms' ? catCfg.label_ms : catCfg.label_en}
                          </span>
                          {ministry.dataGovSource && (
                            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{
                              background: 'rgba(16,185,129,0.08)',
                              color: 'rgba(16,185,129,0.7)',
                              border: '1px solid rgba(16,185,129,0.15)',
                            }}>
                              data.gov.my
                            </span>
                          )}
                          {/* Copy indicator */}
                          <div className="flex items-center gap-0.5">
                            {isCopied ? (
                              <Check size={8} style={{ color: '#10b981' }} />
                            ) : (
                              <Copy size={8} style={{ color: 'rgba(148,163,184,0.3)' }} />
                            )}
                            <span className="text-[7px] font-mono" style={{
                              color: isCopied ? '#10b981' : 'rgba(148,163,184,0.3)',
                            }}>
                              {isCopied
                                ? (lang === 'ms' ? 'Disalin' : 'Copied')
                                : (lang === 'ms' ? 'Salin' : 'Copy')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {filteredMinistries.length === 0 && (
                    <div className="text-center py-8">
                      <Building2 size={20} style={{ color: 'rgba(6,182,212,0.15)', margin: '0 auto 8px' }} />
                      <p className="text-[10px] font-mono" style={{ color: 'rgba(148,163,184,0.3)' }}>
                        {lang === 'ms' ? 'Tiada kementerian dijumpai' : 'No ministries found'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Footer Stats ──────────────────────────────────── */}
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(6,182,212,0.06)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono" style={{ color: 'rgba(148,163,184,0.4)' }}>
                    <span style={{ color: '#06b6d4' }}>{iconSets.length}</span> {lang === 'ms' ? 'set' : 'sets'}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: 'rgba(148,163,184,0.4)' }}>
                    <span style={{ color: '#06b6d4' }}>{allIcons.length}</span> {lang === 'ms' ? 'ikon' : 'icons'}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: 'rgba(148,163,184,0.4)' }}>
                    <span style={{ color: '#06b6d4' }}>{ministries.length}</span> {lang === 'ms' ? 'kementerian' : 'ministries'}
                  </span>
                </div>
                <span className="text-[7px] font-mono tracking-wider" style={{ color: 'rgba(6,182,212,0.25)' }}>
                  {lang === 'ms' ? 'KLIK UNTUK MENYALIN' : 'CLICK TO COPY'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <CopyToast visible={toastVisible} message={toastMessage} />
    </div>
  );
}

export default IconographyPanel;
