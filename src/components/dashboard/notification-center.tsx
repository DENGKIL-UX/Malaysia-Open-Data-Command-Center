'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, Database, AlertTriangle, Trophy,
  CheckCheck, Filter,
} from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';
import { HUDBracket } from '@/components/dashboard/particle-background';

// ─── Types ────────────────────────────────────────────────────────
type NotificationCategory = 'update' | 'alert' | 'milestone';

interface Notification {
  id: number;
  category: NotificationCategory;
  title_en: string;
  title_ms: string;
  desc_en: string;
  desc_ms: string;
  time: string;
  read: boolean;
}

interface NotificationCenterProps {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

// ─── Constants ────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<NotificationCategory, { icon: React.ElementType; color: string; label_en: string; label_ms: string }> = {
  update:    { icon: Database,       color: '#06b6d4', label_en: 'Data Updates',    label_ms: 'Kemas Kini Data' },
  alert:     { icon: AlertTriangle,  color: '#ef4444', label_en: 'System Alerts',   label_ms: 'Amaran Sistem' },
  milestone: { icon: Trophy,         color: '#f59e0b', label_en: 'Milestones',      label_ms: 'Pencapaian' },
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    category: 'update',
    title_en: 'Population data updated',
    title_ms: 'Data penduduk dikemas kini',
    desc_en: 'Population estimates for 2025 have been released',
    desc_ms: 'Anggaran penduduk untuk 2025 telah dikeluarkan',
    time: '2h ago',
    read: false,
  },
  {
    id: 2,
    category: 'milestone',
    title_en: '287 datasets now available',
    title_ms: '287 set data kini tersedia',
    desc_en: 'The data catalogue has reached 287 datasets',
    desc_ms: 'Katalog data telah mencapai 287 set data',
    time: '1d ago',
    read: false,
  },
  {
    id: 3,
    category: 'alert',
    title_en: 'CPI data delayed',
    title_ms: 'Data CPI tertangguh',
    desc_en: 'Monthly CPI update is delayed by 2 days',
    desc_ms: 'Kemas kini CPI bulanan tertangguh 2 hari',
    time: '3d ago',
    read: true,
  },
  {
    id: 4,
    category: 'update',
    title_en: 'GDP Q1 2025 released',
    title_ms: 'KDNK Q1 2025 dikeluarkan',
    desc_en: 'Quarterly GDP data for Q1 2025 is now available',
    desc_ms: 'Data KDNK suku tahunan Q1 2025 kini tersedia',
    time: '5h ago',
    read: false,
  },
  {
    id: 5,
    category: 'milestone',
    title_en: 'All 19 states covered',
    title_ms: 'Semua 19 negeri diliputi',
    desc_en: 'State-level data is now available for all 19 states and FT',
    desc_ms: 'Data peringkat negeri kini tersedia untuk semua 19 negeri dan WT',
    time: '2d ago',
    read: false,
  },
  {
    id: 6,
    category: 'alert',
    title_en: 'API rate limit warning',
    title_ms: 'Amaran had kadar API',
    desc_en: 'API requests approaching daily rate limit (80%)',
    desc_ms: 'Permintaan API menghampiri had kadar harian (80%)',
    time: '6h ago',
    read: true,
  },
  {
    id: 7,
    category: 'update',
    title_en: 'Labour force data refreshed',
    title_ms: 'Data tenaga buruh disegarkan',
    desc_en: 'Labour force statistics updated with Q1 2025 figures',
    desc_ms: 'Statistik tenaga buruh dikemas kini dengan angka Q1 2025',
    time: '12h ago',
    read: false,
  },
  {
    id: 8,
    category: 'milestone',
    title_en: '18 data categories available',
    title_ms: '18 kategori data tersedia',
    desc_en: 'Data catalogue now spans 18 distinct categories',
    desc_ms: 'Katalog data kini merentasi 18 kategori berbeza',
    time: '4d ago',
    read: true,
  },
];

// ─── Notification Bell Button (exported for header use) ───────────
export const NotificationBell = React.forwardRef<HTMLButtonElement, {
  lang: Lang;
  unreadCount: number;
  onClick: () => void;
  'aria-label'?: string;
}>(function NotificationBell({ lang, unreadCount, onClick, 'aria-label': ariaLabel }, ref) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider cursor-pointer"
      style={{
        background: 'rgba(10,14,26,0.8)',
        borderColor: 'rgba(6,182,212,0.15)',
        color: '#06b6d4',
      }}
      title={lang === 'ms' ? 'Pusat Pemberitahuan' : 'Notification Center'}
    >
      <Bell size={10} />
      <span className="hidden sm:inline">{lang === 'ms' ? 'Notifikasi' : 'Notifications'}</span>
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute w-4 h-4 flex items-center justify-center rounded-full text-[8px] font-mono font-bold"
          style={{
            background: '#ef4444',
            color: '#fff',
            top: -4,
            right: -4,
            boxShadow: '0 0 6px rgba(239,68,68,0.4)',
          }}
        >
          {unreadCount}
        </motion.span>
      )}
    </button>
  );
});

// ─── Notification Center Panel ────────────────────────────────────
export function NotificationCenter({ lang, isOpen, onClose, onUnreadChange }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'ALL'>('ALL');

  const unreadCount = notifications.filter(n => !n.read).length;

  // Sync unread count with parent
  useEffect(() => {
    onUnreadChange?.(unreadCount);
  }, [unreadCount, onUnreadChange]);

  const filtered = categoryFilter === 'ALL'
    ? notifications
    : notifications.filter(n => n.category === categoryFilter);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filterTabs: { id: NotificationCategory | 'ALL'; label_en: string; label_ms: string }[] = [
    { id: 'ALL', label_en: 'All', label_ms: 'Semua' },
    { id: 'update', label_en: 'Updates', label_ms: 'Kemas Kini' },
    { id: 'alert', label_en: 'Alerts', label_ms: 'Amaran' },
    { id: 'milestone', label_en: 'Milestones', label_ms: 'Pencapaian' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0"
            style={{ background: 'rgba(0,0,0,0.5)', zIndex: 45 }}
            onClick={onClose}
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 flex flex-col"
            style={{
              background: 'rgba(10,14,26,0.98)',
              borderLeft: '1px solid rgba(6,182,212,0.12)',
              zIndex: 50,
              boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div className="relative group flex-shrink-0 p-4 border-b" style={{ borderColor: 'rgba(6,182,212,0.1)' }}>
              <HUDBracket />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={14} style={{ color: '#06b6d4' }} />
                  <span className="text-xs font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                    {lang === 'ms' ? 'PUSAT PEMBERITAHUAN' : 'NOTIFICATION CENTER'}
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                      background: 'rgba(239,68,68,0.12)',
                      color: '#ef4444',
                      border: '1px solid rgba(239,68,68,0.2)',
                    }}>
                      {unreadCount} {lang === 'ms' ? 'baru' : 'new'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[8px] font-mono px-1.5 py-1 rounded cursor-pointer"
                      style={{
                        background: 'rgba(16,185,129,0.08)',
                        color: '#10b981',
                        border: '1px solid rgba(16,185,129,0.15)',
                      }}
                      title={lang === 'ms' ? 'Tanda semua dibaca' : 'Mark all read'}
                    >
                      <CheckCheck size={9} />
                      <span className="hidden sm:inline">{lang === 'ms' ? 'Semua dibaca' : 'All read'}</span>
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-colors"
                    style={{ color: 'rgba(148,163,184,0.5)' }}
                    title="Close"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex-shrink-0 flex items-center gap-1 px-4 py-2 border-b" style={{ borderColor: 'rgba(6,182,212,0.06)' }}>
              <Filter size={9} style={{ color: 'rgba(6,182,212,0.3)', marginRight: 4 }} />
              {filterTabs.map(tab => {
                const isActive = categoryFilter === tab.id;
                const tabColor = tab.id === 'ALL' ? '#06b6d4' : CATEGORY_CONFIG[tab.id].color;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                    className="px-2 py-1 rounded text-[8px] font-mono tracking-wider transition-all cursor-pointer"
                    style={{
                      background: isActive ? `${tabColor}15` : 'transparent',
                      border: `1px solid ${isActive ? `${tabColor}30` : 'rgba(6,182,212,0.06)'}`,
                      color: isActive ? tabColor : 'rgba(148,163,184,0.4)',
                    }}
                  >
                    {lang === 'ms' ? tab.label_ms : tab.label_en}
                  </button>
                );
              })}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence initial={false}>
                {filtered.map((notification) => {
                  const catCfg = CATEGORY_CONFIG[notification.category];
                  const CatIcon = catCfg.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative px-4 py-3 border-b cursor-pointer transition-colors hover:bg-cyan-950/20"
                      style={{
                        borderColor: 'rgba(6,182,212,0.06)',
                        borderLeft: `3px solid ${catCfg.color}40`,
                      }}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Category Icon */}
                        <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                          background: `${catCfg.color}12`,
                          border: `1px solid ${catCfg.color}20`,
                        }}>
                          <CatIcon size={12} style={{ color: catCfg.color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-mono font-medium" style={{
                              color: notification.read ? '#94a3b8' : '#e0f7fa',
                            }}>
                              {lang === 'ms' ? notification.title_ms : notification.title_en}
                            </span>
                            {/* Unread indicator */}
                            {!notification.read && (
                              <motion.div
                                className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                                style={{ background: '#3b82f6' }}
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </div>
                          <p className="text-[9px] font-mono mt-0.5 leading-relaxed" style={{
                            color: notification.read ? 'rgba(148,163,184,0.5)' : 'rgba(148,163,184,0.7)',
                          }}>
                            {lang === 'ms' ? notification.desc_ms : notification.desc_en}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[8px] font-mono" style={{ color: 'rgba(148,163,184,0.5)' }}>
                              {notification.time}
                            </span>
                            <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{
                              background: `${catCfg.color}10`,
                              color: `${catCfg.color}80`,
                              border: `1px solid ${catCfg.color}15`,
                            }}>
                              {lang === 'ms' ? catCfg.label_ms : catCfg.label_en}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <Bell size={20} style={{ color: 'rgba(6,182,212,0.15)', margin: '0 auto 8px' }} />
                  <p className="text-[10px] font-mono" style={{ color: 'rgba(148,163,184,0.3)' }}>
                    {lang === 'ms' ? 'Tiada pemberitahuan' : 'No notifications'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {notifications.length > 0 && (
              <div className="flex-shrink-0 p-3 border-t flex items-center justify-between" style={{
                borderColor: 'rgba(6,182,212,0.08)',
              }}>
                <span className="text-[8px] font-mono" style={{ color: 'rgba(148,163,184,0.5)' }}>
                  {notifications.length} {lang === 'ms' ? 'pemberitahuan' : 'notifications'}
                </span>
                <button
                  onClick={clearAll}
                  className="text-[8px] font-mono px-2 py-1 rounded cursor-pointer transition-colors"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.15)',
                  }}
                >
                  {lang === 'ms' ? 'Kosongkan Semua' : 'Clear All'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificationCenter;
