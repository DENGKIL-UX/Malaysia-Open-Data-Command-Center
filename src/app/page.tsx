'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, Database, Briefcase, Activity,
  BarChart3, Map, LayoutDashboard, Printer, Info,
  HelpCircle, Languages, ArrowUp, Bell, Copyright,
  ExternalLink, Heart, Download, ChevronRight,
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
import { DataExportHub } from '@/components/dashboard/data-export-hub';
import { QuickStatsBar } from '@/components/dashboard/quick-stats-bar';
import { SettingsPanel, SettingsGearButton } from '@/components/dashboard/settings-panel';
import { useSettings } from '@/hooks/use-settings';
import { SkeletonCard, SkeletonChart, SkeletonMap } from '@/components/dashboard/skeleton-loader';
import { ScrollProgress } from '@/components/dashboard/scroll-progress';
import type { TabId, Lang } from '@/lib/dashboard-types';

// ─── Focus Trap Hook ──────────────────────────────────────────────
function useFocusTrap(isOpen: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    // Focus the first focusable element when modal opens
    const focusFirst = () => {
      const focusable = container.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length > 0) {
        requestAnimationFrame(() => focusable[0].focus());
      }
    };

    // Small delay to let animation render the content
    const timer = setTimeout(focusFirst, 100);

    // Trap tab key within the container
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = container.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, containerRef]);
}

// ─── Footer Live Clock (MYT) ────────────────────────────────────
function FooterLiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const mytTime = new Date(now.getTime() + 8 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60 * 1000);
      const hours = mytTime.getHours().toString().padStart(2, '0');
      const minutes = mytTime.getMinutes().toString().padStart(2, '0');
      const seconds = mytTime.getSeconds().toString().padStart(2, '0');
      setTime(`MYT ${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 4px rgba(16,185,129,0.6)' }} />
        <motion.div
          className="absolute inset-0 w-1.5 h-1.5 rounded-full"
          style={{ border: '1px solid rgba(16,185,129,0.4)' }}
          animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: '#06b6d4', textShadow: '0 0 6px rgba(6,182,212,0.3)' }}>
        {time}
      </span>
    </div>
  );
}

// ─── Footer Animated Counter ────────────────────────────────────
function FooterCounter({ target, color }: { target: number; color: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Delay to let footer mount visually
    const timer = setTimeout(() => {
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
  }, [target]);

  return (
    <span style={{ color, textShadow: `0 0 8px ${color}50, 0 0 16px ${color}20`, fontSize: '12px' }} className="font-bold">{count}</span>
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
  const [showExportHub, setShowExportHub] = useState(false);
  const [showQuickStats, setShowQuickStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSetting, resetToDefaults } = useSettings();

  // Focus trap refs for modals
  const infographicRef = useRef<HTMLDivElement>(null);
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  const shortcutsModalRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const exportHubRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Trigger button refs for focus restoration
  const infographicTriggerRef = useRef<HTMLButtonElement>(null);
  const commandPaletteTriggerRef = useRef<HTMLButtonElement>(null);
  const shortcutsTriggerRef = useRef<HTMLButtonElement>(null);
  const notificationTriggerRef = useRef<HTMLButtonElement>(null);
  const settingsTriggerRef = useRef<HTMLButtonElement>(null);
  const exportHubTriggerRef = useRef<HTMLButtonElement>(null);

  // Apply focus traps
  useFocusTrap(showInfographic, infographicRef);
  useFocusTrap(showCommandPalette, commandPaletteRef);
  useFocusTrap(showShortcutsModal, shortcutsModalRef);
  useFocusTrap(showNotifications, notificationRef);
  useFocusTrap(showSettings, settingsRef);
  useFocusTrap(showExportHub, exportHubRef);
  useFocusTrap(!!profileStateId, profileRef);

  // Restore focus when modals close
  useEffect(() => {
    if (!showInfographic && infographicTriggerRef.current) {
      // Only restore if no other modal is open
      const anyModalOpen = showCommandPalette || showShortcutsModal || showNotifications || showSettings || showExportHub || !!profileStateId;
      if (!anyModalOpen) infographicTriggerRef.current.focus();
    }
  }, [showInfographic, showCommandPalette, showShortcutsModal, showNotifications, showSettings, showExportHub, profileStateId]);

  useEffect(() => {
    if (!showCommandPalette && commandPaletteTriggerRef.current) {
      const anyModalOpen = showInfographic || showShortcutsModal || showNotifications || showSettings || showExportHub || !!profileStateId;
      if (!anyModalOpen) commandPaletteTriggerRef.current.focus();
    }
  }, [showInfographic, showCommandPalette, showShortcutsModal, showNotifications, showSettings, showExportHub, profileStateId]);

  useEffect(() => {
    if (!showShortcutsModal && shortcutsTriggerRef.current) {
      const anyModalOpen = showInfographic || showCommandPalette || showNotifications || showSettings || showExportHub || !!profileStateId;
      if (!anyModalOpen) shortcutsTriggerRef.current.focus();
    }
  }, [showInfographic, showCommandPalette, showShortcutsModal, showNotifications, showSettings, showExportHub, profileStateId]);

  useEffect(() => {
    if (!showNotifications && notificationTriggerRef.current) {
      const anyModalOpen = showInfographic || showCommandPalette || showShortcutsModal || showSettings || showExportHub || !!profileStateId;
      if (!anyModalOpen) notificationTriggerRef.current.focus();
    }
  }, [showInfographic, showCommandPalette, showShortcutsModal, showNotifications, showSettings, showExportHub, profileStateId]);

  useEffect(() => {
    if (!showSettings && settingsTriggerRef.current) {
      const anyModalOpen = showInfographic || showCommandPalette || showShortcutsModal || showNotifications || showExportHub || !!profileStateId;
      if (!anyModalOpen) settingsTriggerRef.current.focus();
    }
  }, [showInfographic, showCommandPalette, showShortcutsModal, showNotifications, showSettings, showExportHub, profileStateId]);

  useEffect(() => {
    if (!showExportHub && exportHubTriggerRef.current) {
      const anyModalOpen = showInfographic || showCommandPalette || showShortcutsModal || showNotifications || showSettings || !!profileStateId;
      if (!anyModalOpen) exportHubTriggerRef.current.focus();
    }
  }, [showInfographic, showCommandPalette, showShortcutsModal, showNotifications, showSettings, showExportHub, profileStateId]);

  // Scroll listener for scroll-to-top button and quick stats bar
  useEffect(() => {
    if (!booted) return;
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setShowQuickStats(window.scrollY > 600);
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
        if (showSettings) { setShowSettings(false); return; }
        if (showExportHub) { setShowExportHub(false); return; }
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
  }, [showCommandPalette, showShortcutsModal, showInfographic, showNotifications, showSettings, showExportHub, profileStateId]);

  const tabs: { id: TabId; icon: React.ElementType; label_en: string; label_ms: string }[] = [
    { id: 'overview', icon: LayoutDashboard, label_en: 'Overview', label_ms: 'Gambaran' },
    { id: 'geomap', icon: Map, label_en: 'GeoMap', label_ms: 'PetaGeo' },
    { id: 'datasets', icon: Database, label_en: 'Datasets', label_ms: 'Set Data' },
    { id: 'analytics', icon: BarChart3, label_en: 'Analytics', label_ms: 'Analitik' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative" data-scan-lines={settings.showScanLines ? 'true' : 'false'} style={{ background: '#0a0e1a' }}>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {settings.showParticles && <ParticleBackground />}
      {/* Boot Sequence */}
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {/* Skeleton Loading — shown beneath boot overlay */}
      {!booted && (
        <div className="relative z-0 flex-1 px-4 py-6 max-w-[1400px] mx-auto w-full space-y-6 opacity-40" style={{ pointerEvents: 'none' }}>
          {/* Hero banner skeleton */}
          <SkeletonCard height="140px" />
          {/* KPI cards row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} height="100px" />
            ))}
          </div>
          {/* Data Engine + State Cards + Health Index row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SkeletonCard height="180px" />
            <SkeletonCard height="180px" />
            <SkeletonCard height="180px" />
          </div>
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <SkeletonChart />
            </div>
            <SkeletonCard height="240px" />
          </div>
          {/* Category + Sources + Timeline row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SkeletonCard height="200px" />
            <SkeletonCard height="200px" />
            <SkeletonCard height="200px" />
          </div>
        </div>
      )}

      {booted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          {/* Scroll Progress Indicator */}
          <ScrollProgress enabled={booted} />

          {/* Header */}
          <Header />

          {/* Navigation Bar */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="flex-shrink-0 px-4 transition-opacity duration-300"
            style={{
              background: 'rgba(10,14,26,0.95)',
              opacity: (showInfographic || showCommandPalette || showShortcutsModal || showExportHub || showNotifications || showSettings) ? 0.6 : 1,
            }}
          >
            {/* Subtle cyan glow line at the bottom of nav */}
            <div className="h-px w-full" style={{
              background: 'linear-gradient(90deg, transparent 5%, rgba(6,182,212,0.3) 30%, rgba(6,182,212,0.5) 50%, rgba(6,182,212,0.3) 70%, transparent 95%)',
              boxShadow: '0 0 8px rgba(6,182,212,0.2), 0 1px 4px rgba(6,182,212,0.15)',
            }} />
            <div className="flex items-center justify-between max-w-[1400px] mx-auto">
              <div className="flex items-center gap-1" role="tablist" aria-label="Dashboard sections">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      className="relative flex items-center gap-1.5 px-3 py-3 text-xs font-mono tracking-wider transition-all duration-300"
                      style={{
                        color: isActive ? '#06b6d4' : 'rgba(6,182,212,0.4)',
                        textShadow: isActive ? '0 0 8px rgba(6,182,212,0.5)' : 'none',
                        boxShadow: isActive ? '0 2px 12px rgba(6,182,212,0.15)' : 'none',
                        background: isActive ? 'rgba(6,182,212,0.08)' : 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'rgba(6,182,212,0.7)';
                          e.currentTarget.style.textShadow = '0 0 6px rgba(6,182,212,0.25)';
                          e.currentTarget.style.boxShadow = '0 2px 12px rgba(6,182,212,0.1)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'rgba(6,182,212,0.4)';
                          e.currentTarget.style.textShadow = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <tab.icon size={14} />
                      <span className="hidden sm:inline">{lang === 'ms' ? tab.label_ms : tab.label_en}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-[3px]"
                          style={{
                            background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
                            boxShadow: '0 0 12px rgba(6,182,212,0.6), 0 0 24px rgba(6,182,212,0.3)',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Separator line between tabs and toolbar */}
              <div className="hidden sm:block h-6 w-px mx-2" style={{ background: 'rgba(6,182,212,0.12)' }} />

              <div className="flex items-center gap-2">
                {/* Language Toggle */}
                <button
                  onClick={() => setLang(l => l === 'en' ? 'ms' : 'en')}
                  aria-label="Toggle language between English and Bahasa Malaysia"
                  className="flex items-center justify-center gap-1 min-w-[32px] px-2 py-1.5 rounded border text-[11px] font-mono tracking-wider transition-all duration-300"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(6,182,212,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(10,14,26,0.8)';
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Languages size={10} />
                  {lang === 'en' ? 'BM' : 'EN'}
                </button>

                {/* Data Export Hub — with animated dot indicator */}
                <button
                  ref={exportHubTriggerRef}
                  onClick={() => setShowExportHub(true)}
                  aria-label="Open data export hub"
                  className="relative flex items-center justify-center gap-1 min-w-[32px] px-2 py-1.5 rounded border text-[11px] font-mono tracking-wider transition-all duration-300"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(6,182,212,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(10,14,26,0.8)';
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Download size={10} />
                  <span className="hidden sm:inline">{lang === 'ms' ? 'Eksport' : 'Export'}</span>
                  {/* Animated dot indicator */}
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: '#06b6d4', boxShadow: '0 0 4px rgba(6,182,212,0.6)' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </button>

                {/* Infographic Export */}
                <button
                  ref={infographicTriggerRef}
                  onClick={() => setShowInfographic(true)}
                  aria-label="Open infographic export"
                  className="flex items-center justify-center gap-1 min-w-[32px] px-2 py-1.5 rounded border text-[11px] font-mono tracking-wider transition-all duration-300"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(6,182,212,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(10,14,26,0.8)';
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Printer size={10} />
                  <span className="hidden sm:inline">{lang === 'ms' ? 'Infografik' : 'Infographic'}</span>
                </button>

                {/* Info */}
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  aria-label="Toggle information panel"
                  aria-pressed={showInfo}
                  className="flex items-center justify-center gap-1 min-w-[32px] px-2 py-1.5 rounded border text-[11px] font-mono tracking-wider transition-all duration-300"
                  style={{
                    background: showInfo ? 'rgba(6,182,212,0.1)' : 'rgba(10,14,26,0.8)',
                    borderColor: showInfo ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                  onMouseEnter={e => {
                    if (!showInfo) {
                      e.currentTarget.style.background = 'rgba(6,182,212,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.15)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!showInfo) {
                      e.currentTarget.style.background = 'rgba(10,14,26,0.8)';
                      e.currentTarget.style.borderColor = 'rgba(6,182,212,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
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
                  aria-label={`Notifications, ${unreadCount} unread`}
                  ref={notificationTriggerRef}
                />

                {/* Settings Gear */}
                <SettingsGearButton
                  lang={lang}
                  onClick={() => setShowSettings(v => !v)}
                  isActive={showSettings}
                  aria-label="Open settings panel"
                  ref={settingsTriggerRef}
                />

                {/* Keyboard Shortcuts Help */}
                <button
                  ref={shortcutsTriggerRef}
                  onClick={() => setShowShortcutsModal(true)}
                  aria-label="Keyboard shortcuts help"
                  className="flex items-center justify-center gap-1 min-w-[32px] px-2 py-1.5 rounded border text-[11px] font-mono tracking-wider transition-all duration-300"
                  style={{
                    background: 'rgba(10,14,26,0.8)',
                    borderColor: 'rgba(6,182,212,0.15)',
                    color: '#06b6d4',
                  }}
                  title={lang === 'ms' ? 'Pintasan Papan Kekunci (?)' : 'Keyboard Shortcuts (?)'}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(6,182,212,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(10,14,26,0.8)';
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <HelpCircle size={10} />
                  <span className="hidden sm:inline">?</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Context-Aware Breadcrumb */}
          <div className="px-4 py-1.5" style={{ background: 'rgba(10,14,26,0.9)' }}>
            <div className="max-w-[1400px] mx-auto flex items-center gap-1" style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
              <span style={{ color: 'rgba(6,182,212,0.35)' }}>
                {lang === 'ms' ? 'PUSAT PERINTAH DATA TERBUKA MALAYSIA' : 'MALAYSIA OPEN DATA COMMAND CENTER'}
              </span>
              <ChevronRight size={8} style={{ color: 'rgba(6,182,212,0.2)' }} />
              <span style={{ color: '#06b6d4', textShadow: '0 0 4px rgba(6,182,212,0.3)' }}>
                {lang === 'ms'
                  ? tabs.find(t => t.id === activeTab)?.label_ms.toUpperCase()
                  : tabs.find(t => t.id === activeTab)?.label_en.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <main id="main-content" className="flex-1 overflow-y-auto px-4 py-4 max-w-[1400px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                role="tabpanel"
                aria-label={`${tabs.find(t => t.id === activeTab)?.label_en ?? activeTab} panel`}
              >
                {activeTab === 'overview' && <OverviewSection lang={lang} onNavigateDatasets={(category) => { setActiveTab('datasets'); }} />}
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
          <footer role="contentinfo" className="mt-auto flex-shrink-0" style={{ background: 'rgba(10,14,26,0.98)' }}>
            {/* Top border gradient (cyan → transparent → cyan) */}
            <div className="h-px w-full" style={{
              background: 'linear-gradient(90deg, #06b6d4, transparent 30%, transparent 70%, #06b6d4)',
              opacity: 0.4,
            }} />
            {/* Animated accent line */}
            <div className="h-px w-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.05)' }}>
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
                      MALAYSIA OPEN DATA COMMAND CENTER
                      <Heart
                        size={10}
                        style={{ color: '#10b981', animation: 'heartbeat 1.5s ease-in-out infinite', filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' }}
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
                  <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
                    © {new Date().getFullYear()} Malaysia Open Data Command Center. All rights reserved.
                  </div>
                  <div className="flex items-center gap-4">
                    <FooterLiveClock />
                    <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
                      Built with Next.js
                    </div>
                  </div>
                </div>
                {/* Made with love text */}
                <div className="text-center mt-1 mb-1">
                  <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.2)', letterSpacing: '0.15em' }}>
                    MADE WITH ❤️ IN MALAYSIA
                  </span>
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
          <div ref={infographicRef}>
          <InfographicModal lang={lang} onClose={() => setShowInfographic(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <div ref={commandPaletteRef}>
          <CommandPalette
            lang={lang}
            onClose={() => setShowCommandPalette(false)}
            onAction={handleCommandAction}
          />
          </div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcutsModal && (
          <div ref={shortcutsModalRef}>
          <KeyboardShortcutsModal
            lang={lang}
            onClose={() => setShowShortcutsModal(false)}
          />
          </div>
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
      <div ref={notificationRef}>
      <NotificationCenter
        lang={lang}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onUnreadChange={setUnreadCount}
      />
      </div>

      {/* Settings Panel */}
      <div ref={settingsRef}>
      <SettingsPanel
        lang={lang}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        updateSetting={updateSetting}
        resetToDefaults={resetToDefaults}
      />
      </div>

      {/* State Profile Modal */}
      <AnimatePresence>
        {profileStateId && (
          <div ref={profileRef}>
          <StateProfileModal
            stateId={profileStateId}
            lang={lang}
            onClose={() => setProfileStateId(null)}
          />
          </div>
        )}
      </AnimatePresence>

      {/* Data Export Hub */}
      <AnimatePresence>
        {showExportHub && (
          <div ref={exportHubRef}>
          <DataExportHub
            lang={lang}
            isOpen={showExportHub}
            onClose={() => setShowExportHub(false)}
          />
          </div>
        )}
      </AnimatePresence>

      {/* Quick Stats Floating Bar */}
      <AnimatePresence>
        {showQuickStats && booted && activeTab === 'overview' && (
          <QuickStatsBar lang={lang} />
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
                      <div className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(6,182,212,0.55)' }}>
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
