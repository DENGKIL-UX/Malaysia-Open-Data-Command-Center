'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Monitor, BarChart3, Globe, Info,
  RefreshCw, Zap, LayoutGrid, Activity,
  Rss, Sparkles, ScanLine, Play,
  Palette, MessageSquare, Languages, Hash,
  Thermometer, Calendar, RotateCcw, ChevronDown,
  Settings,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HUDBracket } from '@/components/dashboard/particle-background';
import type { Lang } from '@/lib/dashboard-types';
import type { DashboardSettings } from '@/hooks/use-settings';

// ─── Types ────────────────────────────────────────────────────────
interface SettingsPanelProps {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
  settings: DashboardSettings;
  updateSetting: <K extends keyof DashboardSettings>(key: K, value: DashboardSettings[K]) => void;
  resetToDefaults: () => void;
}

// ─── Section Header ───────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  titleEn,
  titleMs,
  lang,
  color = '#06b6d4',
}: {
  icon: React.ElementType;
  titleEn: string;
  titleMs: string;
  lang: Lang;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={13} style={{ color }} />
      <span className="text-[10px] font-mono tracking-wider font-bold uppercase" style={{ color }}>
        {lang === 'ms' ? titleMs : titleEn}
      </span>
      <div className="flex-1 h-px" style={{ background: `${color}15` }} />
    </div>
  );
}

// ─── Setting Row ──────────────────────────────────────────────────
function SettingRow({
  labelEn,
  labelMs,
  lang,
  children,
}: {
  labelEn: string;
  labelMs: string;
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-[10px] font-mono" style={{ color: 'rgba(148,163,184,0.7)' }}>
        {lang === 'ms' ? labelMs : labelEn}
      </span>
      {children}
    </div>
  );
}

// ─── Toggle Switch Row ────────────────────────────────────────────
function ToggleRow({
  labelEn,
  labelMs,
  lang,
  checked,
  onCheckedChange,
}: {
  labelEn: string;
  labelMs: string;
  lang: Lang;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <SettingRow labelEn={labelEn} labelMs={labelMs} lang={lang}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-slate-700"
      />
    </SettingRow>
  );
}

// ─── Toggle Button Group ──────────────────────────────────────────
function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  lang,
}: {
  options: { value: T; label_en: string; label_ms: string }[];
  value: T;
  onChange: (val: T) => void;
  lang: Lang;
}) {
  return (
    <div className="flex gap-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-2 py-1 rounded text-[8px] font-mono tracking-wider transition-all cursor-pointer"
          style={{
            background: value === opt.value ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.03)',
            border: `1px solid ${value === opt.value ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.08)'}`,
            color: value === opt.value ? '#06b6d4' : 'rgba(148,163,184,0.4)',
          }}
        >
          {lang === 'ms' ? opt.label_ms : opt.label_en}
        </button>
      ))}
    </div>
  );
}

// ─── Custom Select for settings panel ─────────────────────────────
function SettingsSelect<T extends string>({
  options,
  value,
  onChange,
  lang,
}: {
  options: { value: T; label_en: string; label_ms: string }[];
  value: T;
  onChange: (val: T) => void;
  lang: Lang;
}) {
  const current = options.find(o => o.value === value);
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger
        className="h-7 text-[9px] font-mono w-auto min-w-[110px]"
        style={{
          background: 'rgba(10,14,26,0.8)',
          borderColor: 'rgba(6,182,212,0.15)',
          color: '#06b6d4',
        }}
      >
        <SelectValue>
          {current ? (lang === 'ms' ? current.label_ms : current.label_en) : value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        style={{
          background: 'rgba(10,14,26,0.98)',
          borderColor: 'rgba(6,182,212,0.15)',
        }}
      >
        {options.map(opt => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-[9px] font-mono focus:bg-cyan-950/30 focus:text-cyan-300"
            style={{ color: 'rgba(148,163,184,0.7)' }}
          >
            {lang === 'ms' ? opt.label_ms : opt.label_en}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Radio Group Row ──────────────────────────────────────────────
function RadioRow<T extends string>({
  labelEn,
  labelMs,
  lang,
  options,
  value,
  onChange,
}: {
  labelEn: string;
  labelMs: string;
  lang: Lang;
  options: { value: T; label_en: string; label_ms: string }[];
  value: T;
  onChange: (val: T) => void;
}) {
  return (
    <div className="py-2">
      <div className="text-[10px] font-mono mb-2" style={{ color: 'rgba(148,163,184,0.7)' }}>
        {lang === 'ms' ? labelMs : labelEn}
      </div>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as T)}
        className="flex flex-wrap gap-x-4 gap-y-2"
      >
        {options.map(opt => (
          <div key={opt.value} className="flex items-center gap-1.5">
            <RadioGroupItem
              value={opt.value}
              className="border-cyan-800 text-cyan-500 data-[state=checked]:border-cyan-500"
            />
            <span className="text-[9px] font-mono" style={{ color: 'rgba(148,163,184,0.6)' }}>
              {lang === 'ms' ? opt.label_ms : opt.label_en}
            </span>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

// ─── Main Settings Panel ──────────────────────────────────────────
export function SettingsPanel({
  lang,
  isOpen,
  onClose,
  settings,
  updateSetting,
  resetToDefaults,
}: SettingsPanelProps) {
  // Refresh interval slider steps
  const REFRESH_STEPS = [
    { value: 0, label_en: 'Off', label_ms: 'Mati' },
    { value: 5000, label_en: '5s', label_ms: '5s' },
    { value: 10000, label_en: '10s', label_ms: '10s' },
    { value: 15000, label_en: '15s', label_ms: '15s' },
    { value: 30000, label_en: '30s', label_ms: '30s' },
    { value: 60000, label_en: '60s', label_ms: '60s' },
  ];

  const refreshLabel = (() => {
    const step = REFRESH_STEPS.find(s => s.value === settings.refreshInterval);
    return step ? (lang === 'ms' ? step.label_ms : step.label_en) : `${settings.refreshInterval / 1000}s`;
  })();

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
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] flex flex-col"
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
                  <Settings size={14} style={{ color: '#06b6d4' }} />
                  <span className="text-xs font-mono tracking-wider font-bold" style={{ color: '#06b6d4' }}>
                    {lang === 'ms' ? 'TETAPAN PAPARAN' : 'DASHBOARD SETTINGS'}
                  </span>
                </div>
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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(6,182,212,0.15) transparent',
            }}>

              {/* ═══ 1. Display Settings ═══ */}
              <section>
                <SectionHeader
                  icon={Monitor}
                  titleEn="Display Settings"
                  titleMs="Tetapan Paparan"
                  lang={lang}
                  color="#06b6d4"
                />

                {/* Data Refresh Interval */}
                <div className="py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                      <RefreshCw size={10} style={{ color: '#06b6d4' }} />
                      {lang === 'ms' ? 'Selang Muat Semula Data' : 'Data Refresh Interval'}
                    </span>
                    <span className="text-[9px] font-mono font-bold" style={{
                      color: settings.refreshInterval === 0 ? '#ef4444' : '#06b6d4',
                    }}>
                      {refreshLabel}
                    </span>
                  </div>
                  <Slider
                    value={[settings.refreshInterval]}
                    min={0}
                    max={60000}
                    step={5000}
                    onValueChange={([v]) => updateSetting('refreshInterval', v)}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[7px] font-mono" style={{ color: 'rgba(148,163,184,0.25)' }}>
                      {lang === 'ms' ? 'Mati' : 'Off'}
                    </span>
                    <span className="text-[7px] font-mono" style={{ color: 'rgba(148,163,184,0.25)' }}>60s</span>
                  </div>
                </div>

                {/* Animation Speed */}
                <div className="py-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                      <Zap size={10} style={{ color: '#f59e0b' }} />
                      {lang === 'ms' ? 'Kelajuan Animasi' : 'Animation Speed'}
                    </span>
                  </div>
                  <ToggleGroup
                    options={[
                      { value: 'smooth' as const, label_en: 'Smooth', label_ms: 'Lancar' },
                      { value: 'fast' as const, label_en: 'Fast', label_ms: 'Pantas' },
                      { value: 'reduced' as const, label_en: 'Reduced', label_ms: 'Dikurangkan' },
                    ]}
                    value={settings.animationSpeed}
                    onChange={(v) => updateSetting('animationSpeed', v)}
                    lang={lang}
                  />
                </div>

                {/* Display Density */}
                <div className="py-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                      <LayoutGrid size={10} style={{ color: '#8b5cf6' }} />
                      {lang === 'ms' ? 'Ketumpatan Paparan' : 'Display Density'}
                    </span>
                  </div>
                  <ToggleGroup
                    options={[
                      { value: 'comfortable' as const, label_en: 'Comfortable', label_ms: 'Selesa' },
                      { value: 'compact' as const, label_en: 'Compact', label_ms: 'Padat' },
                      { value: 'spacious' as const, label_en: 'Spacious', label_ms: 'Lapang' },
                    ]}
                    value={settings.displayDensity}
                    onChange={(v) => updateSetting('displayDensity', v)}
                    lang={lang}
                  />
                </div>

                {/* Toggle switches */}
                <ToggleRow
                  labelEn="Show Data Engine Pulse"
                  labelMs="Tunjuk Denyut Enjin Data"
                  lang={lang}
                  checked={settings.showDataEngine}
                  onCheckedChange={(v) => updateSetting('showDataEngine', v)}
                />
                <ToggleRow
                  labelEn="Show Activity Feed"
                  labelMs="Tunjuk Suapan Aktiviti"
                  lang={lang}
                  checked={settings.showActivityFeed}
                  onCheckedChange={(v) => updateSetting('showActivityFeed', v)}
                />
                <ToggleRow
                  labelEn="Show Particles"
                  labelMs="Tunjuk Zarah"
                  lang={lang}
                  checked={settings.showParticles}
                  onCheckedChange={(v) => updateSetting('showParticles', v)}
                />
                <ToggleRow
                  labelEn="Show Scan Lines"
                  labelMs="Tunjuk Garis Imbasan"
                  lang={lang}
                  checked={settings.showScanLines}
                  onCheckedChange={(v) => updateSetting('showScanLines', v)}
                />
              </section>

              {/* Divider */}
              <div className="h-px" style={{ background: 'rgba(6,182,212,0.08)' }} />

              {/* ═══ 2. Chart Settings ═══ */}
              <section>
                <SectionHeader
                  icon={BarChart3}
                  titleEn="Chart Settings"
                  titleMs="Tetapan Carta"
                  lang={lang}
                  color="#f59e0b"
                />

                <ToggleRow
                  labelEn="Default Chart Animation"
                  labelMs="Animasi Carta Lalai"
                  lang={lang}
                  checked={settings.chartAnimation}
                  onCheckedChange={(v) => updateSetting('chartAnimation', v)}
                />

                {/* Chart Color Theme */}
                <div className="py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                      <Palette size={10} style={{ color: '#06b6d4' }} />
                      {lang === 'ms' ? 'Tema Warna Carta' : 'Chart Color Theme'}
                    </span>
                    <SettingsSelect
                      options={[
                        { value: 'cyan', label_en: 'Cyan Neon', label_ms: 'Sian Neon' },
                        { value: 'amber', label_en: 'Amber Gold', label_ms: 'Amber Emas' },
                        { value: 'emerald', label_en: 'Emerald', label_ms: 'Zamrud' },
                        { value: 'purple', label_en: 'Purple Haze', label_ms: 'Ungu Kabus' },
                      ]}
                      value={settings.chartColorTheme}
                      onChange={(v) => updateSetting('chartColorTheme', v)}
                      lang={lang}
                    />
                  </div>
                </div>

                {/* Tooltip Style */}
                <div className="py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                      <MessageSquare size={10} style={{ color: '#8b5cf6' }} />
                      {lang === 'ms' ? 'Gaya Tip Alat' : 'Tooltip Style'}
                    </span>
                    <SettingsSelect
                      options={[
                        { value: 'dark', label_en: 'Dark', label_ms: 'Gelap' },
                        { value: 'glass', label_en: 'Glass', label_ms: 'Kaca' },
                        { value: 'minimal', label_en: 'Minimal', label_ms: 'Minimum' },
                      ]}
                      value={settings.tooltipStyle}
                      onChange={(v) => updateSetting('tooltipStyle', v)}
                      lang={lang}
                    />
                  </div>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px" style={{ background: 'rgba(6,182,212,0.08)' }} />

              {/* ═══ 3. Data Preferences ═══ */}
              <section>
                <SectionHeader
                  icon={Globe}
                  titleEn="Data Preferences"
                  titleMs="Keutamaan Data"
                  lang={lang}
                  color="#10b981"
                />

                {/* Default Language */}
                <RadioRow
                  labelEn="Default Language / Bahasa Lalai"
                  labelMs="Bahasa Lalai / Default Language"
                  lang={lang}
                  options={[
                    { value: 'en', label_en: 'English', label_ms: 'English' },
                    { value: 'ms', label_en: 'Bahasa Malaysia', label_ms: 'Bahasa Malaysia' },
                  ]}
                  value={settings.defaultLanguage}
                  onChange={(v) => updateSetting('defaultLanguage', v)}
                />

                {/* Number Format */}
                <RadioRow
                  labelEn="Number Format / Format Nombor"
                  labelMs="Format Nombor / Number Format"
                  lang={lang}
                  options={[
                    { value: 'comma', label_en: '1,000', label_ms: '1,000' },
                    { value: 'dot', label_en: '1.000', label_ms: '1.000' },
                    { value: 'space', label_en: '1 000', label_ms: '1 000' },
                  ]}
                  value={settings.numberFormat}
                  onChange={(v) => updateSetting('numberFormat', v)}
                />

                {/* Temperature Unit (decorative) */}
                <RadioRow
                  labelEn="Temperature Unit / Unit Suhu"
                  labelMs="Unit Suhu / Temperature Unit"
                  lang={lang}
                  options={[
                    { value: 'celsius' as 'comma', label_en: 'Celsius (°C)', label_ms: 'Celsius (°C)' },
                    { value: 'fahrenheit' as 'dot', label_en: 'Fahrenheit (°F)', label_ms: 'Fahrenheit (°F)' },
                  ]}
                  value={'celsius' as 'comma'}
                  onChange={() => {/* decorative only */}}
                />

                {/* Date Format */}
                <div className="py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
                      <Calendar size={10} style={{ color: '#f59e0b' }} />
                      {lang === 'ms' ? 'Format Tarikh' : 'Date Format'}
                    </span>
                    <SettingsSelect
                      options={[
                        { value: 'yyyy-mm-dd', label_en: 'YYYY-MM-DD', label_ms: 'TTTT-BB-HH' },
                        { value: 'dd/mm/yyyy', label_en: 'DD/MM/YYYY', label_ms: 'HH/BB/TTTT' },
                        { value: 'mm/dd/yyyy', label_en: 'MM/DD/YYYY', label_ms: 'BB/HH/TTTT' },
                      ]}
                      value={settings.dateFormat}
                      onChange={(v) => updateSetting('dateFormat', v)}
                      lang={lang}
                    />
                  </div>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px" style={{ background: 'rgba(6,182,212,0.08)' }} />

              {/* ═══ 4. About Section ═══ */}
              <section>
                <SectionHeader
                  icon={Info}
                  titleEn="About"
                  titleMs="Perihal"
                  lang={lang}
                  color="#8b5cf6"
                />

                <div className="space-y-2 text-[9px] font-mono" style={{ color: 'rgba(148,163,184,0.5)' }}>
                  <div className="flex items-center justify-between py-1">
                    <span>{lang === 'ms' ? 'Versi' : 'Version'}</span>
                    <span className="font-bold" style={{ color: '#06b6d4' }}>v3.0.0</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>{lang === 'ms' ? 'Dibina Dengan' : 'Built With'}</span>
                    <span style={{ color: 'rgba(148,163,184,0.6)' }}>Next.js 16, React 19</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>{lang === 'ms' ? 'Pustaka Carta' : 'Chart Library'}</span>
                    <span style={{ color: 'rgba(148,163,184,0.6)' }}>Recharts, Framer Motion</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>{lang === 'ms' ? 'Sumber Data' : 'Data Source'}</span>
                    <a
                      href="https://data.gov.my"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: '#06b6d4' }}
                    >
                      data.gov.my
                    </a>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>{lang === 'ms' ? 'Lesen' : 'License'}</span>
                    <span style={{ color: 'rgba(148,163,184,0.6)' }}>CC BY 4.0</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer — Reset to Defaults */}
            <div className="flex-shrink-0 p-4 border-t" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
              <button
                onClick={resetToDefaults}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded border text-[10px] font-mono tracking-wider transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                style={{
                  background: 'rgba(6,182,212,0.05)',
                  borderColor: 'rgba(6,182,212,0.15)',
                  color: '#06b6d4',
                }}
              >
                <RotateCcw size={11} />
                {lang === 'ms' ? 'Tetapkan Semula ke Lalai' : 'Reset to Defaults'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Settings Gear Button (exported for nav bar use) ──────────────
export const SettingsGearButton = React.forwardRef<HTMLButtonElement, {
  lang: Lang;
  onClick: () => void;
  isActive: boolean;
  'aria-label'?: string;
}>(function SettingsGearButton({ lang, onClick, isActive, 'aria-label': ariaLabel }, ref) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative flex items-center gap-1 px-2 py-1.5 rounded border text-[10px] font-mono tracking-wider cursor-pointer transition-all"
      style={{
        background: isActive ? 'rgba(6,182,212,0.1)' : 'rgba(10,14,26,0.8)',
        borderColor: isActive ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.15)',
        color: '#06b6d4',
      }}
      title={lang === 'ms' ? 'Tetapan Dashboard' : 'Dashboard Settings'}
    >
      <Settings size={10} className={isActive ? 'animate-spin' : ''} style={{ animationDuration: isActive ? '3s' : undefined }} />
      <span className="hidden sm:inline">{lang === 'ms' ? 'Tetapan' : 'Settings'}</span>
    </button>
  );
});

export default SettingsPanel;
