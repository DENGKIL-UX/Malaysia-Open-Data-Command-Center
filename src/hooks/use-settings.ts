'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Settings Type ───────────────────────────────────────────────
export interface DashboardSettings {
  refreshInterval: number;       // 0 = off, else milliseconds
  animationSpeed: 'smooth' | 'fast' | 'reduced';
  displayDensity: 'comfortable' | 'compact' | 'spacious';
  showDataEngine: boolean;
  showActivityFeed: boolean;
  showParticles: boolean;
  showScanLines: boolean;
  chartAnimation: boolean;
  chartColorTheme: 'cyan' | 'amber' | 'emerald' | 'purple';
  tooltipStyle: 'dark' | 'glass' | 'minimal';
  defaultLanguage: 'en' | 'ms';
  numberFormat: 'comma' | 'dot' | 'space';
  dateFormat: 'yyyy-mm-dd' | 'dd/mm/yyyy' | 'mm/dd/yyyy';
  fontSize: 'small' | 'medium' | 'large';
}

// ─── Default Values ──────────────────────────────────────────────
export const DEFAULT_SETTINGS: DashboardSettings = {
  refreshInterval: 15000,
  animationSpeed: 'smooth',
  displayDensity: 'comfortable',
  showDataEngine: true,
  showActivityFeed: true,
  showParticles: true,
  showScanLines: true,
  chartAnimation: true,
  chartColorTheme: 'cyan',
  tooltipStyle: 'dark',
  defaultLanguage: 'en',
  numberFormat: 'comma',
  dateFormat: 'yyyy-mm-dd',
  fontSize: 'medium',
};

const STORAGE_KEY = 'malaysia-data-command-center-settings';

// ─── Safe localStorage access ────────────────────────────────────
function readFromStorage(): Partial<DashboardSettings> | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeToStorage(settings: DashboardSettings): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Silently fail — localStorage may be unavailable
  }
}

// ─── Hook ────────────────────────────────────────────────────────
export function useSettings() {
  const [settings, setSettings] = useState<DashboardSettings>(() => {
    const stored = readFromStorage();
    return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
  });
  const [loaded, setLoaded] = useState(true);

  // Persist to localStorage on change
  useEffect(() => {
    if (loaded) {
      writeToStorage(settings);
    }
  }, [settings, loaded]);

  const updateSetting = useCallback(<K extends keyof DashboardSettings>(
    key: K,
    value: DashboardSettings[K],
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, updateSetting, resetToDefaults, loaded };
}

export default useSettings;
