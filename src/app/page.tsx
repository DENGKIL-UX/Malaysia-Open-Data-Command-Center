'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, Database, Briefcase, Activity,
  BarChart3, Map, LayoutDashboard, Printer, Info,
  HelpCircle, Languages, ArrowUp, Bell, Copyright,
  ExternalLink, Heart,
} from 'lucide-react';

import BootSequence from '@/components/dashboard/boot-sequence';
import Header from '@/components/dashboard/header';
import { ParticleBackground } from '@/components/dashboard/particle-background';
import { OverviewSection } from '@/components/dashboard/overview-section';
import { GeoMapSection } from '@/components/dashboard/geomap-section';
import { DatasetsSection } from '@/components/dashboard/datasets-section';
import { AnalyticsSection } from '@/components/dashboard/analytics-section';
import { InfographicModal } from '@/components/dashboard/infographic-modal';
import { InfoSection } from '@/components/dashboard/info-section';
import { CommandPalette, KeyboardShortcutsModal } from '@/components/dashboard/command-palette';
import { StateProfileModal } from '@/components/dashboard/state-profile-modal';
import { NotificationCenter, NotificationBell } from '@/components/dashboard/notification-center';
import type { TabId, Lang } from '@/lib/dashboard-types';

// ─── Footer Animated Counter ────────────────────────────────────
function FooterCounter({ target, color }: { target: number; color: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    // Delay to let footer mount visually
    const timer = setTimeout(() => {
      setHasAnimated(true);
      const duration = 1200;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, 300);
    return () => clearTimeout(timer);
  }, [target, hasAnimated]);

  return (
    <span style={{ color }} className="font-bold">{count}</span>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────
export default function Home() {
  const [booted, setBooted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [lang, setLang] = useState<Lang>('en');
  const [showInfographic, setShowInfographic] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<number | null>(null);
  const [profileStateId, setProfileStateId] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(5);

  // Scroll listener for scroll-to-top button
  useEffect(() => {
    if (!booted) return;
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [booted]);

  // Live data alert notifications
  useEffect(() => {
    if (!booted) return;
    let alertIndex = 0;
    const interval = setInterval(() => {
      setCurrentAlert(alertIndex);
      alertIndex = (alertIndex + 1) % 5;
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setCurrentAlert(null);
      }, 3000);
    }, 15000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [booted]);

  // Command palette action handler
  const handleCommandAction = useCallback((action: string) => {
    switch (action) {
      case 'tab-overview': setActiveTab('overview'); break;
      case 'tab-geomap': setActiveTab('geomap'); break;
      case 'tab-datasets': setActiveTab('datasets'); break;
      case 'tab-analytics': setActiveTab('analytics'); break;
      case 'toggle-lang': setLang(l => l === 'en' ? 'ms' : 'en'); break;
      case 'open-infographic': setShowInfographic(true); break;
      case 'toggle-info': setShowInfo(v => !v); break;
      default:
        // Dataset commands — switch to datasets tab
        if (action.startsWith('dataset-')) {
          setActiveTab('datasets');
        }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;

      // Ctrl+K / Cmd+K — always works
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(v => !v);
        return;
      }

      // Escape — close modals
      if (e.key === 'Escape') {
        if (showCommandPalette) { setShowCommandPalette(false); return; }
        if (showShortcutsModal) { setShowShortcutsModal(false); return; }
        if (showInfographic) { setShowInfographic(false); return; }
        if (showNotifications) { setShowNotifications(false); return; }
        if (profileStateId) { setProfileStateId(null); return; }
        return;
      }

      // Don't handle other shortcuts when typing in input fields
      if (isInput) return;

      switch (e.key) {
        case '1': setActiveTab('overview'); break;
        case '2': setActiveTab('geomap'); break;
        case '3': setActiveTab('datasets'); break;
        case '4': setActiveTab('analytics'); break;
        case 'l': case 'L': setLang(l => l === 'en' ? 'ms' : 'en'); break;
        case 'i': case 'I': setShowInfo(v => !v); break;
        case 'e': case 'E': setShowInfographic(true); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette, showShortcutsModal, showInfographic, showNotifications, profileStateId]);

  const tabs: { id: TabId; icon: React.ElementType; label_en: string; label_ms: string }[] = [
    { id: 'overview', icon: LayoutDashboard, label_en: 'Overview', label_ms: 'Gambaran' },
    { id: 'geomap', icon: Map, label_en: 'GeoMap', label_ms: 'PetaGeo' },
    { id: 'datasets', icon: Database, label_en: 'Datasets', label_ms: 'Set Data' },
    { id: 'analytics', icon: BarChart3, label_en: 'Analytics', label_ms: 'Analitik' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#0a0e1a' }}>
      <ParticleBackground />
      {/* Boot Sequence */}
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {booted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          {/* Header */}
          <Header />

          {/* Navigation Bar */}
          <nav className="flex-shrink-0 border-b px-4" style={{
            background: 'rgba(10,14,26,0.95)',
            borderColor: 'rgba(6,182,212,0.1)',
          }}>
            <div className="flex items-center justify-between max-w-[1400px] mx-auto">
              <div className="flex items-center gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono tracking-wider transition-all"
                    style={{
                      color: activeTab === tab.id ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                    }}
                  >
                    <tab.icon size={14} />
                    <span className="hidden sm:inline">{lang === 'ms' ? tab.label_ms : tab.label_en}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
                          boxShadow: '0 0 10px rgba(6,182,212,0.5)',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {/* Language Toggle */}
                <button
                  onClick={() => setLang(l => l === 'en' ? 'ms' : 'en')}
                  className="flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                >
                  <Languages size={10} />
                  {lang === 'en' ? 'BM' : 'EN'}
                </button>

                {/* Infographic Export */}
                <button
                  onClick={() => setShowInfographic(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                >
                  <Printer size={10} />
                  <span className="hidden sm:inline">{lang === 'ms' ? 'Infografik' : 'Infographic'}</span>
                </button>

                {/* Info */}
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider"
                  style={{
                    background: showInfo ? 'rgba(6,182,212,0.1)' : 'rgba(10,14,26,0.8)',
                    borderColor: showInfo ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                >
                  <Info size={10} />
                  <span className="hidden sm:inline">{lang === 'ms' ? 'Maklumat' : 'Info'}</span>
                </button>

                {/* Notification Bell */}
                <NotificationBell
                  lang={lang}
                  unreadCount={unreadCount}
                  onClick={() => setShowNotifications(true)}
                />

                {/* Keyboard Shortcuts Help */}
                <button
                  onClick={() => setShowShortcutsModal(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                  title={lang === 'ms' ? 'Pintasan Papan Kekunci (?)' : 'Keyboard Shortcuts (?)'}
                >
                  <HelpCircle size={10} />
                  <span className="hidden sm:inline">?</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-4 py-4 max-w-[1400px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && <OverviewSection lang={lang} />}
                {activeTab === 'geomap' && <GeoMapSection lang={lang} onViewProfile={(id) => setProfileStateId(id)} />}
                {activeTab === 'datasets' && <DatasetsSection lang={lang} />}
                {activeTab === 'analytics' && <AnalyticsSection lang={lang} />}
              </motion.div>
            </AnimatePresence>

            {/* Info Section (shown below main content when toggled) */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <InfoSection lang={lang} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Enhanced Footer */}
          <footer className="mt-auto flex-shrink-0" style={{ background: 'rgba(10,14,26,0.98)' }}>
            {/* Top decorative gradient line */}
            <div className="h-px w-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.1)' }}>
              <motion.div
                className="h-full w-1/3"
                style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }}
                animate={{ x: ['-100%', '400%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            <div className="px-4 py-5">
              <div className="max-w-[1400px] mx-auto">
                {/* Grid layout — 4 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Column 1: Branding */}
                  <div>
                    <div className="text-xs font-mono font-bold tracking-wider mb-1 flex items-center gap-1.5" style={{
                      color: '#06b6d4',
                      textShadow: '0 0 10px rgba(6,182,212,0.4)',
                    }}>
                      MALAYSIA DATA COMMAND CENTER
                      <Heart
                        size={10}
                        style={{ color: '#10b981', animation: 'heartbeat 1.5s ease-in-out infinite' }}
                      />
                    </div>
                    <div className="text-[10px] font-mono mb-2" style={{ color: 'rgba(6,182,212,0.4)' }}>
                      Powered by data.gov.my
                    </div>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                      background: 'rgba(6,182,212,0.1)',
                      color: '#06b6d4',
                      border: '1px solid rgba(6,182,212,0.2)',
                    }}>
                      v3.0
                    </span>
                  </div>

                  {/* Column 2: Quick Stats */}
                  <div>
                    <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: 'rgba(6,182,212,0.5)' }}>
                      QUICK STATS
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-mono">
                      <span style={{ color: '#06b6d4' }}><FooterCounter target={287} color="#06b6d4" /> <span style={{ color: 'rgba(6,182,212,0.4)' }}>Datasets</span></span>
                      <span style={{ color: '#f59e0b' }}><FooterCounter target={18} color="#f59e0b" /> <span style={{ color: 'rgba(245,158,11,0.4)' }}>Categories</span></span>
                      <span style={{ color: '#10b981' }}><FooterCounter target={19} color="#10b981" /> <span style={{ color: 'rgba(16,185,129,0.4)' }}>States/FT</span></span>
                      <span style={{ color: '#8b5cf6' }}><FooterCounter target={6} color="#8b5cf6" /> <span style={{ color: 'rgba(139,92,246,0.4)' }}>Data Layers</span></span>
                    </div>
                  </div>

                  {/* Column 3: Data Sources */}
                  <div>
                    <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: 'rgba(6,182,212,0.5)' }}>
                      DATA SOURCES
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'DOSM', color: '#06b6d4' },
                        { name: 'BNM', color: '#f59e0b' },
                        { name: 'KKM', color: '#ec4899' },
                        { name: 'JDN', color: '#8b5cf6' },
                      ].map(src => (
                        <span
                          key={src.name}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-all duration-200 cursor-default hover:scale-110 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                          style={{
                            background: `${src.color}10`,
                            border: `1px solid ${src.color}20`,
                            color: src.color,
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget;
                            el.style.background = `${src.color}20`;
                            el.style.borderColor = `${src.color}40`;
                            el.style.boxShadow = `0 0 12px ${src.color}20`;
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget;
                            el.style.background = `${src.color}10`;
                            el.style.borderColor = `${src.color}20`;
                            el.style.boxShadow = 'none';
                          }}
                        >
                          <Database size={8} className="inline mr-1" style={{ color: src.color }} />
                          {src.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Column 4: License */}
                  <div>
                    <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: 'rgba(6,182,212,0.5)' }}>
                      LICENSE
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Copyright size={10} style={{ color: 'rgba(6,182,212,0.4)' }} />
                      <span className="text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>CC BY 4.0</span>
                    </div>
                    <a
                      href="https://data.gov.my"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-mono hover:underline"
                      style={{ color: '#06b6d4' }}
                    >
                      <ExternalLink size={8} />
                      Open Data Portal
                    </a>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="border-t pt-3 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
                  <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
                    © {new Date().getFullYear()} Malaysia Data Command Center. All rights reserved.
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
                    Built with Next.js
                  </div>
                </div>

                {/* Animated bottom scan line */}
                <div className="mt-2 h-px w-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.05)' }}>
                  <motion.div
                    className="h-full w-1/4"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }}
                    animate={{ x: ['-100%', '500%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </footer>
        </motion.div>
      )}

      {/* Infographic Export Modal */}
      <AnimatePresence>
        {showInfographic && (
          <InfographicModal lang={lang} onClose={() => setShowInfographic(false)} />
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <CommandPalette
            lang={lang}
            onClose={() => setShowCommandPalette(false)}
            onAction={handleCommandAction}
          />
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcutsModal && (
          <KeyboardShortcutsModal
            lang={lang}
            onClose={() => setShowShortcutsModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && booted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer transition-shadow hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            style={{
              background: 'rgba(10,14,26,0.95)',
              borderColor: 'rgba(6,182,212,0.3)',
              zIndex: 30,
              boxShadow: '0 0 10px rgba(6,182,212,0.2)',
            }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} style={{ color: '#06b6d4' }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Notification Center */}
      <NotificationCenter
        lang={lang}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onUnreadChange={setUnreadCount}
      />

      {/* State Profile Modal */}
      <AnimatePresence>
        {profileStateId && (
          <StateProfileModal
            stateId={profileStateId}
            lang={lang}
            onClose={() => setProfileStateId(null)}
          />
        )}
      </AnimatePresence>

      {/* Live Data Alert Notifications */}
      <AnimatePresence>
        {currentAlert !== null && booted && (
          <motion.div
            key={`alert-${currentAlert}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-20 right-4 w-64 rounded-md border overflow-hidden"
            style={{
              background: 'rgba(10,14,26,0.97)',
              borderColor: 'rgba(6,182,212,0.15)',
              zIndex: 35,
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            {(() => {
              const alerts = [
                { title: 'Population data synced', icon: Users, color: '#06b6d4' },
                { title: 'GDP estimates refreshed', icon: TrendingUp, color: '#f59e0b' },
                { title: 'New dataset available', icon: Database, color: '#10b981' },
                { title: 'CPI index updated', icon: Activity, color: '#ef4444' },
                { title: 'Labour force data refreshed', icon: Briefcase, color: '#8b5cf6' },
              ];
              const alert = alerts[currentAlert % alerts.length];
              const Icon = alert.icon;
              const now = new Date();
              const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
              return (
                <>
                  {/* Colored left border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: alert.color }} />
                  <div className="flex items-start gap-2.5 p-3 pl-4">
                    <Icon size={14} style={{ color: alert.color, flexShrink: 0, marginTop: 1 }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-mono font-medium truncate" style={{ color: alert.color }}>
                        {alert.title}
                      </div>
                      <div className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(6,182,212,0.35)' }}>
                        {timeStr}
                      </div>
                    </div>
                    <Bell size={10} style={{ color: 'rgba(6,182,212,0.3)', flexShrink: 0, marginTop: 2 }} />
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
