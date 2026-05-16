'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Printer, X, Download, Calendar, Database, Building2, Monitor, Smartphone, Maximize2 } from 'lucide-react';
import { STATES, DATASET_CATEGORIES, MALAYSIA_TOTALS } from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import { MINISTRIES, MINISTRY_CATEGORY_LABELS, getDataGovMinistries } from '@/lib/data/malaysian-ministries';
import type { Lang } from '@/lib/dashboard-types';

// ─── Infographic Source & Date Data ────────────────────────────────
const INFOGRAPHIC_SOURCES = [
  { abbr: 'DOSM', full_en: 'Dept. of Statistics Malaysia', full_ms: 'Jabatan Perangkaan Malaysia', url: 'https://open.dosm.gov.my', emoji: '📊' },
  { abbr: 'BNM', full_en: 'Bank Negara Malaysia', full_ms: 'Bank Negara Malaysia', url: 'https://www.bnm.gov.my', emoji: '🏦' },
  { abbr: 'KKM', full_en: 'Ministry of Health Malaysia', full_ms: 'Kementerian Kesihatan Malaysia', url: 'https://www.moh.gov.my', emoji: '❤️' },
  { abbr: 'JPN', full_en: 'National Registration Dept.', full_ms: 'Jabatan Pendaftaran Negara', url: 'https://www.jpn.gov.my', emoji: '📋' },
  { abbr: 'MOT', full_en: 'Ministry of Transport', full_ms: 'Kementerian Pengangkutan', url: 'https://www.mot.gov.my', emoji: '🚄' },
  { abbr: 'KD', full_en: 'Ministry of Digital', full_ms: 'Kementerian Digital', url: 'https://data.gov.my', emoji: '💻' },
  { abbr: 'JDN', full_en: 'National Data Dept.', full_ms: 'Jabatan Data Negara', url: 'https://data.gov.my', emoji: '🗄️' },
  { abbr: 'KPM', full_en: 'Ministry of Education', full_ms: 'Kementerian Pendidikan', url: 'https://www.moe.gov.my', emoji: '🎓' },
  { abbr: 'NRES', full_en: 'Ministry of Natural Resources & Environment', full_ms: 'Kementerian Sumber Asli & Alam Sekitar', url: 'https://www.nres.gov.my', emoji: '🍃' },
  { abbr: 'data.gov.my', full_en: 'Malaysia Open Data Portal', full_ms: 'Portal Data Terbuka Malaysia', url: 'https://data.gov.my', emoji: '🌐' },
];

// Map layer IDs to the dataset categories they correspond to
const LAYER_CATEGORY_MAP: Record<string, string[]> = {
  population: ['Demography'],
  gdp: ['National Accounts'],
  demography: ['Demography'],
  healthcare: ['Healthcare'],
  environment: ['Environment'],
  education: ['Education'],
};

// Layer icon mapping for visual enhancement
const LAYER_ICONS: Record<string, string> = {
  population: '🧑',
  gdp: '💰',
  demography: '📊',
  healthcare: '❤️',
  environment: '🌿',
  education: '🎓',
};

function LayerSourcesAndDates({ layerId, lang, fontSize }: { layerId: string; lang: Lang; fontSize: string }) {
  const categories = LAYER_CATEGORY_MAP[layerId] || [];
  const layerData = useMemo(() => {
    const matching = DATASETS.filter(d => categories.includes(d.category_en));
    if (matching.length === 0) return null;

    let minBegin = 9999, maxEnd = 0, latestUpdate = '';
    const sources = new Set<string>();
    const frequencies = new Set<string>();
    let totalDatasets = matching.length;

    for (const d of matching) {
      if (d.dataset_begin < minBegin) minBegin = d.dataset_begin;
      if (d.dataset_end > maxEnd) maxEnd = d.dataset_end;
      if (d.last_updated > latestUpdate) latestUpdate = d.last_updated;
      d.data_source.forEach(s => sources.add(s));
      frequencies.add(d.frequency);
    }

    return { minBegin, maxEnd, latestUpdate, sources: [...sources], frequencies: [...frequencies], totalDatasets };
  }, [categories]);

  if (!layerData) return null;

  const layerLabels: Record<string, { en: string; ms: string; color: string }> = {
    population: { en: 'Population', ms: 'Penduduk', color: '#06b6d4' },
    gdp: { en: 'GDP & Economy', ms: 'KDNK & Ekonomi', color: '#f59e0b' },
    demography: { en: 'Demography', ms: 'Demografi', color: '#10b981' },
    healthcare: { en: 'Healthcare', ms: 'Kesihatan', color: '#ec4899' },
    environment: { en: 'Environment', ms: 'Alam Sekitar', color: '#22c55e' },
    education: { en: 'Education', ms: 'Pendidikan', color: '#3b82f6' },
  };

  const label = layerLabels[layerId] || { en: layerId, ms: layerId, color: '#06b6d4' };
  const fs = fontSize;

  return (
    <div className="mb-3 p-2.5 rounded border" style={{ background: `${label.color}05`, borderColor: `${label.color}15` }}>
      {/* Layer header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: label.color }} />
          <span className="font-mono font-bold" style={{ color: label.color, fontSize: fs === '10px' ? '9px' : fs === '12px' ? '10px' : '11px' }}>
            {lang === 'ms' ? label.ms : label.en}
          </span>
        </div>
        <span className="font-mono" style={{ color: `${label.color}80`, fontSize: fs === '10px' ? '7px' : fs === '12px' ? '8px' : '9px' }}>
          {layerData.totalDatasets} {lang === 'ms' ? 'set data' : 'datasets'}
        </span>
      </div>

      {/* Date range */}
      <div className="flex items-center gap-3 mb-1.5">
        <div className="flex items-center gap-1">
          <Calendar size={fs === '10px' ? 8 : fs === '12px' ? 9 : 10} style={{ color: label.color }} />
          <span className="font-mono" style={{ color: '#e0f7fa', fontSize: fs === '10px' ? '8px' : fs === '12px' ? '9px' : '10px' }}>
            {layerData.minBegin} – {layerData.maxEnd}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Database size={fs === '10px' ? 8 : fs === '12px' ? 9 : 10} style={{ color: `${label.color}80` }} />
          <span className="font-mono" style={{ color: '#94a3b8', fontSize: fs === '10px' ? '7px' : fs === '12px' ? '8px' : '9px' }}>
            {lang === 'ms' ? 'Dikemas kini' : 'Updated'}: {layerData.latestUpdate.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Source badges */}
      <div className="flex flex-wrap gap-1">
        {layerData.sources.map(src => {
          const knownSource = INFOGRAPHIC_SOURCES.find(s => s.abbr === src);
          return (
            <span
              key={src}
              className="font-mono px-1.5 py-0.5 rounded border"
              title={knownSource ? (lang === 'ms' ? knownSource.full_ms : knownSource.full_en) : src}
              style={{
                fontSize: fs === '10px' ? '7px' : fs === '12px' ? '8px' : '9px',
                background: `${label.color}08`,
                borderColor: `${label.color}20`,
                color: `${label.color}cc`,
              }}
            >
              {src}
            </span>
          );
        })}
      </div>

      {/* Frequency indicators */}
      <div className="flex items-center gap-1.5 mt-1.5">
        {layerData.frequencies.map(freq => (
          <span key={freq} className="font-mono" style={{ fontSize: fs === '10px' ? '6px' : fs === '12px' ? '7px' : '8px', color: '#64748b' }}>
            ● {freq}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Coat of Arms Decorative SVG ────────────────────────────────────
function CoatOfArmsDecoration({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer star / crescent ring */}
      <circle cx="20" cy="20" r="18" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
      <circle cx="20" cy="20" r="15" stroke="#06b6d4" strokeWidth="0.5" opacity="0.2" />
      {/* 14-point star simplified */}
      {[0, 25.7, 51.4, 77.1, 102.8, 128.5, 154.2, 180, 205.7, 231.4, 257.1, 282.8, 308.5, 334.2].map((angle, i) => (
        <line key={i} x1="20" y1="20" x2={20 + 14 * Math.cos((angle * Math.PI) / 180)} y2={20 + 14 * Math.sin((angle * Math.PI) / 180)} stroke="#06b6d4" strokeWidth="0.8" opacity="0.25" />
      ))}
      {/* Inner crescent */}
      <path d="M16 10 A12 12 0 1 0 16 30 A9 9 0 1 1 16 10Z" fill="#06b6d4" opacity="0.08" />
      {/* Center star */}
      <polygon points="20,12 21.5,17 27,17 22.5,20.5 24,25.5 20,22 16,25.5 17.5,20.5 13,17 18.5,17" fill="#06b6d4" opacity="0.2" />
    </svg>
  );
}

// ─── HUDBracket Component ────────────────────────────────────────────
function HUDBracket() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/20 transition-colors duration-300 group-hover:border-cyan-500/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/20 transition-colors duration-300 group-hover:border-cyan-500/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/20 transition-colors duration-300 group-hover:border-cyan-500/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/20 transition-colors duration-300 group-hover:border-cyan-500/40" />
    </div>
  );
}

// ─── Infographic Export Modal ────────────────────────────────────
export function InfographicModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['population', 'gdp', 'demography']);
  const [fontSize, setFontSize] = useState<'S' | 'M' | 'L'>('M');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | 'auto'>('16:9');
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const layers = [
    { id: 'population', label_en: 'Population', label_ms: 'Penduduk', color: '#06b6d4' },
    { id: 'gdp', label_en: 'GDP & Economy', label_ms: 'KDNK & Ekonomi', color: '#f59e0b' },
    { id: 'demography', label_en: 'Demography', label_ms: 'Demografi', color: '#10b981' },
    { id: 'healthcare', label_en: 'Healthcare', label_ms: 'Kesihatan', color: '#ec4899' },
    { id: 'environment', label_en: 'Environment', label_ms: 'Alam Sekitar', color: '#22c55e' },
    { id: 'education', label_en: 'Education', label_ms: 'Pendidikan', color: '#3b82f6' },
  ];

  const isPortrait = aspectRatio === '9:16';
  const isAuto = aspectRatio === 'auto';

  const toggleLayer = useCallback((id: string) => {
    setSelectedLayers(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  }, []);

  // Get data.gov.my ministries for the visual section
  const dataGovMinistries = useMemo(() => getDataGovMinistries(), []);

  // Compute global date range across all selected layers
  const globalDateInfo = useMemo(() => {
    const allCategories = selectedLayers.flatMap(l => LAYER_CATEGORY_MAP[l] || []);
    const matching = DATASETS.filter(d => allCategories.includes(d.category_en));
    if (matching.length === 0) return { minBegin: 2020, maxEnd: 2024, latestUpdate: '', sources: [] as string[], totalDatasets: 0 };
    let minBegin = 9999, maxEnd = 0, latestUpdate = '';
    const sources = new Set<string>();
    for (const d of matching) {
      if (d.dataset_begin < minBegin) minBegin = d.dataset_begin;
      if (d.dataset_end > maxEnd) maxEnd = d.dataset_end;
      if (d.last_updated > latestUpdate) latestUpdate = d.last_updated;
      d.data_source.forEach(s => sources.add(s));
    }
    return { minBegin, maxEnd, latestUpdate, sources: [...sources], totalDatasets: matching.length };
  }, [selectedLayers]);

  /**
   * Fix html2canvas v1.x incompatibility with modern CSS color functions.
   * html2canvas cannot parse oklab(), oklch(), lab(), lch(), or color-mix(in oklab, ...).
   * Tailwind CSS 4 generates these in base styles for opacity variants.
   *
   * Strategy: Temporarily disable stylesheet rules containing any of these
   * modern CSS color functions by removing them before export, then restoring
   * after. Also inject CSS overrides for outline-color and caret-color defaults.
   */
  const patchStylesheetsForExport = (): Array<{ sheet: CSSStyleSheet; rule: string; index: number }> => {
    const removed: Array<{ sheet: CSSStyleSheet; rule: string; index: number }> = [];
    const BAD_PATTERNS = ['oklab', 'oklch', 'lab(', 'lch(', 'color-mix('];

    for (let si = 0; si < document.styleSheets.length; si++) {
      try {
        const sheet = document.styleSheets[si];
        const rules = sheet.cssRules;
        // Iterate backwards to preserve indices when removing
        for (let ri = rules.length - 1; ri >= 0; ri--) {
          const ruleText = rules[ri].cssText;
          if (ruleText && BAD_PATTERNS.some(p => ruleText.includes(p))) {
            removed.push({ sheet, rule: ruleText, index: ri });
            try {
              sheet.deleteRule(ri);
            } catch {
              // Can't delete this rule
            }
          }
        }
      } catch {
        // CORS on external stylesheets
      }
    }

    // Inject global overrides for properties that used oklab/oklch defaults
    // Only fix outline-color and caret-color — NOT border-color, which would
    // override all visual borders and make the infographic look wrong.
    const fixStyle = document.createElement('style');
    fixStyle.id = 'html2canvas-oklab-fix';
    fixStyle.textContent = `
      *, *::before, *::after, ::backdrop {
        outline-color: transparent !important;
        caret-color: currentColor !important;
      }
    `;
    document.head.appendChild(fixStyle);

    return removed;
  };

  const restoreStylesheets = (removed: Array<{ sheet: CSSStyleSheet; rule: string; index: number }>) => {
    // Remove the injected fix style
    const fixStyle = document.getElementById('html2canvas-oklab-fix');
    if (fixStyle) fixStyle.remove();

    // Restore removed rules (in reverse order to maintain indices)
    for (const { sheet, rule, index } of removed.reverse()) {
      try {
        sheet.insertRule(rule, index);
      } catch {
        // Can't re-insert this rule
      }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    const patches = patchStylesheetsForExport();
    try {
      // Dynamic import with error handling
      let html2canvasFn: typeof import('html2canvas').default;
      try {
        const h2cModule = await import('html2canvas');
        html2canvasFn = h2cModule.default || h2cModule;
      } catch (importErr) {
        console.error('Failed to load html2canvas:', importErr);
        alert('Failed to load export library. Please refresh and try again.');
        restoreStylesheets(patches);
        setExporting(false);
        return;
      }

      const target = previewRef.current;
      if (!target) {
        restoreStylesheets(patches);
        setExporting(false);
        return;
      }

      // Target export dimensions based on aspect ratio selection
      let targetW: number;
      let targetH: number;
      if (aspectRatio === '16:9') {
        targetW = 960;
        targetH = 540;
      } else if (aspectRatio === '9:16') {
        targetW = 540;
        targetH = 960;
      } else {
        // Auto: use the actual rendered dimensions
        targetW = target.offsetWidth;
        targetH = target.offsetHeight;
      }

      const isAutoMode = aspectRatio === 'auto';
      const pad = Math.round(targetW * 0.04); // 4% padding = clean margins at export size

      // ─── Off-screen rendering approach ───
      // Create an off-screen container at EXACT target dimensions.
      // Clone the preview content into it. The browser lays out the content
      // naturally at the target size, so everything (text, grids, padding)
      // is properly proportioned. Then html2canvas captures it at scale:2
      // for retina-quality output (e.g., 960→1920px for 16:9).
      const offscreen = document.createElement('div');
      offscreen.style.cssText = `
        position: fixed;
        left: -99999px;
        top: 0;
        width: ${targetW}px;
        min-height: ${targetH}px;
        background: #0a0e1a;
        padding: ${pad}px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: ${fs};
        color: #e0f7fa;
        overflow: hidden;
        box-sizing: border-box;
      `;

      // Clone the infographic content from the preview (children only, not the preview wrapper)
      const contentClone = target.cloneNode(true) as HTMLElement;
      // Strip preview-only styling from the clone
      contentClone.style.cssText = `
        background: transparent;
        border: none;
        border-radius: 0;
        box-shadow: none;
        padding: 0;
        margin: 0;
        width: 100%;
        overflow: hidden;
      `;
      // Remove aspect-ratio / max-height constraints
      contentClone.style.aspectRatio = '';
      contentClone.style.maxHeight = 'none';
      contentClone.style.overflowY = 'visible';

      offscreen.appendChild(contentClone);
      document.body.appendChild(offscreen);

      // Wait for layout to settle
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const canvas = await html2canvasFn(offscreen, {
        scale: 2,
        backgroundColor: '#0a0e1a',
        useCORS: true,
        logging: false,
        width: targetW,
        height: targetH,
        onclone: (clonedDoc, clonedEl) => {
          // Patch cloned document's stylesheets for modern CSS color functions
          try {
            const BAD_PATTERNS = ['oklab', 'oklch', 'lab(', 'lch(', 'color-mix('];
            for (let si = 0; si < clonedDoc.styleSheets.length; si++) {
              try {
                const sheet = clonedDoc.styleSheets[si];
                const rules = sheet.cssRules;
                for (let ri = rules.length - 1; ri >= 0; ri--) {
                  const ruleText = rules[ri].cssText;
                  if (ruleText && BAD_PATTERNS.some(p => ruleText.includes(p))) {
                    try { sheet.deleteRule(ri); } catch { /* ignore */ }
                  }
                }
              } catch { /* CORS */ }
            }
          } catch { /* ignore */ }

          // Fix only outline and caret colors
          const cloneStyle = clonedDoc.createElement('style');
          cloneStyle.textContent = `
            *, *::before, *::after {
              outline-color: transparent !important;
              caret-color: currentColor !important;
            }
          `;
          clonedDoc.head.appendChild(cloneStyle);
        },
      });

      // Clean up off-screen element
      offscreen.remove();

      // Crop to exact target dimensions × 2 (scale:2)
      const finalW = targetW * 2;
      const finalH = targetH * 2;

      let outputCanvas = canvas;
      if (canvas.width !== finalW || canvas.height !== finalH) {
        outputCanvas = document.createElement('canvas');
        outputCanvas.width = finalW;
        outputCanvas.height = finalH;
        const ctx = outputCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0a0e1a';
          ctx.fillRect(0, 0, finalW, finalH);
          ctx.drawImage(canvas, 0, 0, finalW, finalH);
        } else {
          outputCanvas = canvas;
        }
      }

      const link = document.createElement('a');
      const ratioStr = aspectRatio === '16:9' ? '16x9' : aspectRatio === '9:16' ? '9x16' : 'auto';
      link.download = `malaysia-open-data-infographic-${ratioStr}-${Date.now()}.png`;
      link.href = outputCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed. Please try again or use a different browser.');
    }
    restoreStylesheets(patches);
    setExporting(false);
  };

  const fs = fontSize === 'S' ? '10px' : fontSize === 'M' ? '12px' : '14px';

  // Export dimension label (actual output pixel dimensions at 2× scale)
  const exportDimLabel = useMemo(() => {
    if (aspectRatio === '16:9') return '1920×1080';
    if (aspectRatio === '9:16') return '1080×1920';
    return 'auto';
  }, [aspectRatio]);

  // Filter INFOGRAPHIC_SOURCES that match actual sources in data
  const activeSources = useMemo(() => {
    return INFOGRAPHIC_SOURCES.filter(s => globalDateInfo.sources.includes(s.abbr) || s.abbr === 'data.gov.my');
  }, [globalDateInfo.sources]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border custom-scrollbar"
        style={{
          background: '#0a0e1a',
          borderColor: 'rgba(6,182,212,0.2)',
          boxShadow: '0 0 60px rgba(6,182,212,0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
          <div className="flex items-center gap-2">
            <Printer size={16} style={{ color: '#06b6d4' }} />
            <span className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'EKSPOR INFOGRAFIK' : 'INFOGRAPHIC EXPORT'}
            </span>
            {/* Aspect ratio badge in header */}
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{
              borderColor: 'rgba(6,182,212,0.3)',
              color: '#06b6d4',
              background: 'rgba(6,182,212,0.08)',
            }}>
              {aspectRatio}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-cyan-950/30">
            <X size={16} style={{ color: 'rgba(6,182,212,0.5)' }} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Controls */}
          <div className="space-y-4">
            {/* Aspect Ratio Selector */}
            <div>
              <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'NISBAH ASPEK' : 'ASPECT RATIO'}
              </div>
              <div className="flex gap-2">
                {([
                  { value: '16:9' as const, icon: Monitor, label: '16:9' },
                  { value: '9:16' as const, icon: Smartphone, label: '9:16' },
                  { value: 'auto' as const, icon: Maximize2, label: 'Auto' },
                ]).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAspectRatio(opt.value)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[10px] font-mono transition-all"
                    style={{
                      background: aspectRatio === opt.value ? 'rgba(6,182,212,0.15)' : 'rgba(10,14,26,0.8)',
                      borderColor: aspectRatio === opt.value ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.1)',
                      color: aspectRatio === opt.value ? '#06b6d4' : '#94a3b8',
                    }}
                  >
                    <opt.icon size={12} />
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Dimension indicator */}
              <div className="text-[8px] font-mono mt-1.5" style={{ color: '#64748b' }}>
                {lang === 'ms' ? 'Eksport' : 'Export'}: {exportDimLabel} px
              </div>
            </div>

            {/* Layer Selection */}
            <div>
              <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'PILIH LAPISAN' : 'SELECT LAYERS'}
              </div>
              <div className="space-y-1.5">
                {layers.map(l => (
                  <button
                    key={l.id}
                    onClick={() => toggleLayer(l.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md border text-left text-xs font-mono transition-all"
                    style={{
                      background: selectedLayers.includes(l.id) ? `${l.color}15` : 'rgba(10,14,26,0.8)',
                      borderColor: selectedLayers.includes(l.id) ? `${l.color}40` : 'rgba(6,182,212,0.1)',
                      color: selectedLayers.includes(l.id) ? l.color : '#94a3b8',
                    }}
                  >
                    <span className="text-sm">{LAYER_ICONS[l.id]}</span>
                    <div className="w-2.5 h-2.5 rounded-sm border" style={{
                      background: selectedLayers.includes(l.id) ? l.color : 'transparent',
                      borderColor: l.color,
                    }} />
                    {lang === 'ms' ? l.label_ms : l.label_en}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'SAIZ FONT' : 'FONT SIZE'}
              </div>
              <div className="flex gap-2">
                {(['S', 'M', 'L'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className="px-3 py-1.5 rounded border text-xs font-mono"
                    style={{
                      background: fontSize === s ? 'rgba(6,182,212,0.15)' : 'rgba(10,14,26,0.8)',
                      borderColor: fontSize === s ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.1)',
                      color: fontSize === s ? '#06b6d4' : '#94a3b8',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exporting || selectedLayers.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border text-xs font-mono font-bold disabled:opacity-30 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(16,185,129,0.1))',
                borderColor: 'rgba(6,182,212,0.3)',
                color: '#06b6d4',
              }}
            >
              <Download size={14} />
              {exporting
                ? (lang === 'ms' ? 'MENGEKSPORT...' : 'EXPORTING...')
                : `EXPORT PNG ${aspectRatio} (${exportDimLabel})`
              }
            </button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'PRATONTON' : 'PREVIEW'}
              </div>
              <div className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                color: isPortrait ? '#ec4899' : '#06b6d4',
                background: isPortrait ? 'rgba(236,72,153,0.1)' : 'rgba(6,182,212,0.1)',
              }}>
                {isPortrait ? '📱 PORTRAIT' : isAuto ? '📐 AUTO' : '🖥️ LANDSCAPE'}
              </div>
            </div>
            <div
              ref={previewRef}
              className="rounded-lg border p-6 overflow-hidden"
              style={{
                background: '#0a0e1a',
                borderColor: 'rgba(6,182,212,0.12)',
                fontSize: fs,
                aspectRatio: isAuto ? undefined : aspectRatio.replace(':', '/'),
                maxHeight: isPortrait ? '80vh' : undefined,
                overflowY: isPortrait ? 'auto' : undefined,
              }}
            >
              {/* ─── INFOGRAPHIC HEADER ─────────────────────────── */}
              <div className="text-center mb-6 pb-4 relative" style={{ borderBottom: '1px solid rgba(6,182,212,0.15)' }}>
                {/* Decorative corner brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: 'rgba(6,182,212,0.25)' }} />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: 'rgba(6,182,212,0.25)' }} />

                {/* Coat of Arms + MALAYSIA Badge */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CoatOfArmsDecoration size={24} />
                  <div
                    className="px-3 py-1 rounded border font-mono font-bold tracking-[0.2em]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.03))',
                      borderColor: 'rgba(6,182,212,0.25)',
                      color: '#06b6d4',
                      textShadow: '0 0 10px rgba(6,182,212,0.3)',
                      fontSize: fs === '10px' ? '10px' : fs === '12px' ? '12px' : '14px',
                    }}
                  >
                    🇲🇾 MALAYSIA
                  </div>
                  <CoatOfArmsDecoration size={24} />
                </div>

                <div className="text-[9px] font-mono tracking-[0.3em] mb-1" style={{ color: 'rgba(6,182,212,0.5)' }}>DATA.GOV.MY</div>
                <div className="text-xl font-bold" style={{ color: '#06b6d4', textShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
                  {lang === 'ms' ? 'PUSAT PERINTAH DATA TERBUKA MALAYSIA' : 'MALAYSIA OPEN DATA COMMAND CENTER'}
                </div>
                <div className="text-[10px] font-mono mt-1" style={{ color: '#94a3b8' }}>
                  {lang === 'ms' ? 'Infografik Data Nasional' : 'National Data Infographic'} — {new Date().getFullYear()}
                </div>

                {/* Decorative bottom brackets */}
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: 'rgba(6,182,212,0.25)' }} />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: 'rgba(6,182,212,0.25)' }} />
              </div>

              {/* ─── OVERVIEW STATS ─────────────────────────────── */}
              <div
                className={`gap-3 mb-6 ${isPortrait ? 'grid grid-cols-1' : 'grid grid-cols-3'}`}
              >
                <div className="text-center p-3 rounded border relative group" style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)' }}>
                  <HUDBracket />
                  <div className="text-lg font-bold font-mono" style={{ color: '#06b6d4' }}>34.3M</div>
                  <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Penduduk' : 'Population'}</div>
                </div>
                <div className="text-center p-3 rounded border relative group" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.1)' }}>
                  <HUDBracket />
                  <div className="text-lg font-bold font-mono" style={{ color: '#f59e0b' }}>RM1.68T</div>
                  <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'KDNK' : 'GDP'}</div>
                </div>
                <div className="text-center p-3 rounded border relative group" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.1)' }}>
                  <HUDBracket />
                  <div className="text-lg font-bold font-mono" style={{ color: '#10b981' }}>287</div>
                  <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Set Data' : 'Datasets'}</div>
                </div>
              </div>

              {/* ─── DATA SOURCE AGENCIES GRID ──────────────────── */}
              <div className="mb-6 relative group">
                <HUDBracket />
                <div className="flex items-center gap-1.5 mb-2">
                  <Building2 size={fs === '10px' ? 9 : fs === '12px' ? 10 : 11} style={{ color: '#06b6d4' }} />
                  <span className="font-mono font-bold tracking-wider" style={{ color: '#06b6d4', fontSize: fs === '10px' ? '9px' : fs === '12px' ? '10px' : '11px' }}>
                    {lang === 'ms' ? 'AGENSI SUMBER DATA' : 'DATA SOURCE AGENCIES'}
                  </span>
                </div>
                <div className={`gap-1.5 ${isPortrait ? 'grid grid-cols-2' : 'grid grid-cols-4'}`}>
                  {dataGovMinistries.slice(0, isPortrait ? 12 : 8).map(ministry => {
                    const catLabel = MINISTRY_CATEGORY_LABELS[ministry.category];
                    return (
                      <div
                        key={ministry.id}
                        className="flex items-center gap-1.5 p-1.5 rounded border"
                        style={{
                          background: `${ministry.color}08`,
                          borderColor: `${ministry.color}18`,
                        }}
                      >
                        <span style={{ fontSize: fs === '10px' ? '10px' : fs === '12px' ? '12px' : '14px' }}>{ministry.emoji}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono font-bold truncate" style={{ color: ministry.color, fontSize: fs === '10px' ? '7px' : fs === '12px' ? '8px' : '9px' }}>
                            {lang === 'ms' ? ministry.abbr_ms : ministry.abbr_en}
                          </span>
                          <span className="font-mono truncate" style={{ color: '#94a3b8', fontSize: fs === '10px' ? '5px' : fs === '12px' ? '6px' : '7px' }}>
                            {lang === 'ms' ? ministry.name_ms : ministry.name_en}
                          </span>
                        </div>
                        <div
                          className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: catLabel.color }}
                          title={lang === 'ms' ? catLabel.ms : catLabel.en}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── SELECTED LAYERS CONTENT ────────────────────── */}

              {/* Population Layer */}
              {selectedLayers.includes('population') && (
                <div className="mb-4 relative group">
                  <HUDBracket />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                    <span>{LAYER_ICONS.population}</span>
                    ▸ {lang === 'ms' ? 'PENDUDUK MENGIKUT NEGERI' : 'POPULATION BY STATE'}
                  </div>
                  <div className={`gap-1.5 ${isPortrait ? 'grid grid-cols-2' : 'grid grid-cols-4'}`}>
                    {STATES.slice().sort((a,b) => b.population - a.population).slice(0, 8).map(s => (
                      <div key={s.id} className="p-1.5 rounded border" style={{ background: 'rgba(6,182,212,0.03)', borderColor: 'rgba(6,182,212,0.08)' }}>
                        <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{s.abbr}</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: '#e0f7fa' }}>{s.population.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GDP Layer */}
              {selectedLayers.includes('gdp') && (
                <div className="mb-4 relative group">
                  <HUDBracket />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider mb-2" style={{ color: '#f59e0b' }}>
                    <span>{LAYER_ICONS.gdp}</span>
                    ▸ {lang === 'ms' ? 'KDNK MENGIKUT NEGERI' : 'GDP BY STATE'}
                  </div>
                  <div className={`gap-1.5 ${isPortrait ? 'grid grid-cols-2' : 'grid grid-cols-4'}`}>
                    {STATES.slice().sort((a,b) => b.gdp - a.gdp).slice(0, 8).map(s => (
                      <div key={s.id} className="p-1.5 rounded border" style={{ background: 'rgba(245,158,11,0.03)', borderColor: 'rgba(245,158,11,0.08)' }}>
                        <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{s.abbr}</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: '#e0f7fa' }}>RM{(s.gdp/1000).toFixed(1)}B</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Demography Layer */}
              {selectedLayers.includes('demography') && (
                <div className="mb-4 relative group">
                  <HUDBracket />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider mb-2" style={{ color: '#10b981' }}>
                    <span>{LAYER_ICONS.demography}</span>
                    ▸ {lang === 'ms' ? 'STATISTIK VITAL' : 'VITAL STATISTICS'}
                  </div>
                  <div className={`gap-4 ${isPortrait ? 'grid grid-cols-1' : 'flex'}`}>
                    <div className="flex-1 p-2 rounded border text-center" style={{ background: 'rgba(16,185,129,0.03)', borderColor: 'rgba(16,185,129,0.08)' }}>
                      <div className="text-sm font-bold font-mono" style={{ color: '#10b981' }}>602.9k</div>
                      <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Kelahiran' : 'Births'}</div>
                    </div>
                    <div className="flex-1 p-2 rounded border text-center" style={{ background: 'rgba(239,68,68,0.03)', borderColor: 'rgba(239,68,68,0.08)' }}>
                      <div className="text-sm font-bold font-mono" style={{ color: '#ef4444' }}>159.7k</div>
                      <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Kematian' : 'Deaths'}</div>
                    </div>
                    <div className="flex-1 p-2 rounded border text-center" style={{ background: 'rgba(139,92,246,0.03)', borderColor: 'rgba(139,92,246,0.08)' }}>
                      <div className="text-sm font-bold font-mono" style={{ color: '#8b5cf6' }}>3.4%</div>
                      <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Pengangguran' : 'Unemployment'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Healthcare Layer */}
              {selectedLayers.includes('healthcare') && (
                <div className="mb-4 relative group">
                  <HUDBracket />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider mb-2" style={{ color: '#ec4899' }}>
                    <span>{LAYER_ICONS.healthcare}</span>
                    ▸ {lang === 'ms' ? 'KESIHATAN' : 'HEALTHCARE'}
                  </div>
                  <div className="p-2 rounded border" style={{ background: 'rgba(236,72,153,0.03)', borderColor: 'rgba(236,72,153,0.08)' }}>
                    <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>
                      {lang === 'ms'
                        ? 'Data penjagaan kesihatan merangkumi imunisasi bayi, penendermaan darah, katil hospital, dan kakitangan kesihatan dari KKM.'
                        : 'Healthcare data covers infant immunisation, blood donations, hospital beds, and healthcare staffing from KKM.'
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Environment Layer */}
              {selectedLayers.includes('environment') && (
                <div className="mb-4 relative group">
                  <HUDBracket />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider mb-2" style={{ color: '#22c55e' }}>
                    <span>{LAYER_ICONS.environment}</span>
                    ▸ {lang === 'ms' ? 'ALAM SEKITAR' : 'ENVIRONMENT'}
                  </div>
                  <div className="p-2 rounded border" style={{ background: 'rgba(34,197,94,0.03)', borderColor: 'rgba(34,197,94,0.08)' }}>
                    <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>
                      {lang === 'ms'
                        ? 'Data alam sekitar merangkumi pencemaran udara, akses air, penggunaan elektrik, dan rizab hutan dari DOSM dan NRES.'
                        : 'Environmental data covers air pollution, water access, electricity consumption, and forest reserves from DOSM and NRES.'
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Education Layer */}
              {selectedLayers.includes('education') && (
                <div className="mb-4 relative group">
                  <HUDBracket />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider mb-2" style={{ color: '#3b82f6' }}>
                    <span>{LAYER_ICONS.education}</span>
                    ▸ {lang === 'ms' ? 'PENDIDIKAN' : 'EDUCATION'}
                  </div>
                  <div className="p-2 rounded border" style={{ background: 'rgba(59,130,246,0.03)', borderColor: 'rgba(59,130,246,0.08)' }}>
                    <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>
                      {lang === 'ms'
                        ? 'Data pendidikan merangkumi pendaftaran sekolah, guru, pensyarah universiti, dan kadar tamat sekolah dari KPM.'
                        : 'Education data covers school enrolment, teachers, university lecturers, and school completion rates from KPM.'
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* ─── DATA SOURCES & DATE RANGES SECTION ───────────────────────── */}
              {selectedLayers.length > 0 && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(6,182,212,0.12)' }}>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Building2 size={fs === '10px' ? 9 : fs === '12px' ? 10 : 11} style={{ color: '#06b6d4' }} />
                    <span className="font-mono font-bold tracking-wider" style={{ color: '#06b6d4', fontSize: fs === '10px' ? '9px' : fs === '12px' ? '10px' : '11px' }}>
                      {lang === 'ms' ? 'SUMBER DATA & JULAT TARIIKH' : 'DATA SOURCES & DATE RANGES'}
                    </span>
                  </div>

                  {/* Per-layer source & date cards */}
                  {selectedLayers.map(layerId => (
                    <LayerSourcesAndDates key={layerId} layerId={layerId} lang={lang} fontSize={fs} />
                  ))}

                  {/* Global date coverage summary */}
                  <div className="mt-3 p-2.5 rounded border" style={{ background: 'rgba(6,182,212,0.03)', borderColor: 'rgba(6,182,212,0.1)' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold" style={{ color: '#06b6d4', fontSize: fs === '10px' ? '8px' : fs === '12px' ? '9px' : '10px' }}>
                        {lang === 'ms' ? 'JULAT KESELURUHAN' : 'OVERALL COVERAGE'}
                      </span>
                      <span className="font-mono" style={{ color: '#e0f7fa', fontSize: fs === '10px' ? '9px' : fs === '12px' ? '10px' : '11px' }}>
                        {globalDateInfo.minBegin} – {globalDateInfo.maxEnd}
                      </span>
                    </div>

                    {/* Visual timeline bar */}
                    <div className="relative h-3 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(6,182,212,0.08)' }}>
                      <div className="absolute top-0 bottom-0 rounded-full" style={{
                        left: `${((globalDateInfo.minBegin - 1990) / (2030 - 1990)) * 100}%`,
                        right: `${100 - ((globalDateInfo.maxEnd - 1990) / (2030 - 1990)) * 100}%`,
                        background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                        opacity: 0.6,
                      }} />
                      {/* Tick marks */}
                      {[2000, 2005, 2010, 2015, 2020, 2025].map(year => (
                        <div key={year} className="absolute top-0 bottom-0" style={{
                          left: `${((year - 1990) / (2030 - 1990)) * 100}%`,
                          width: 1,
                          background: 'rgba(6,182,212,0.15)',
                        }} />
                      ))}
                    </div>

                    {/* Timeline year labels */}
                    <div className="flex justify-between font-mono" style={{ fontSize: fs === '10px' ? '6px' : fs === '12px' ? '7px' : '8px', color: '#64748b' }}>
                      <span>2000</span><span>2005</span><span>2010</span><span>2015</span><span>2020</span><span>2025</span>
                    </div>

                    {/* Total sources across all selected layers */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="font-mono" style={{ color: '#94a3b8', fontSize: fs === '10px' ? '7px' : fs === '12px' ? '8px' : '9px' }}>
                        {globalDateInfo.totalDatasets} {lang === 'ms' ? 'set data daripada' : 'datasets from'} {globalDateInfo.sources.length} {lang === 'ms' ? 'sumber' : 'sources'}
                      </span>
                      <span className="font-mono" style={{ color: '#64748b', fontSize: fs === '10px' ? '7px' : fs === '12px' ? '8px' : '9px' }}>
                        • {lang === 'ms' ? 'Terakhir dikemas kini' : 'Last updated'}: {globalDateInfo.latestUpdate ? globalDateInfo.latestUpdate.split(' ')[0] : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── ENHANCED SOURCE REFERENCE TABLE ────────────────────── */}
              {selectedLayers.length > 0 && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(6,182,212,0.08)' }}>
                  <div className="text-[8px] font-mono tracking-wider mb-2" style={{ color: 'rgba(6,182,212,0.6)' }}>
                    {lang === 'ms' ? 'RUJUKAN SUMBER' : 'SOURCE REFERENCES'}
                  </div>
                  <div className={`gap-1 ${isPortrait ? 'grid grid-cols-1' : 'grid grid-cols-2'}`}>
                    {activeSources.map(src => {
                      // Find matching ministry for category color
                      const matchingMinistry = MINISTRIES.find(m => m.abbr_en === src.abbr || m.abbr_ms === src.abbr);
                      const catColor = matchingMinistry ? MINISTRY_CATEGORY_LABELS[matchingMinistry.category].color : '#06b6d4';
                      return (
                        <div key={src.abbr} className="flex items-center gap-1.5 p-1.5 rounded border" style={{
                          fontSize: fs === '10px' ? '7px' : fs === '12px' ? '8px' : '9px',
                          background: `${catColor}05`,
                          borderColor: `${catColor}12`,
                        }}>
                          <span style={{ fontSize: fs === '10px' ? '9px' : fs === '12px' ? '10px' : '11px' }}>{src.emoji}</span>
                          <span className="font-mono font-bold flex-shrink-0" style={{ color: catColor, minWidth: '30px' }}>{src.abbr}</span>
                          <span className="font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? src.full_ms : src.full_en}</span>
                          {matchingMinistry && (
                            <div
                              className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: catColor }}
                              title={lang === 'ms' ? MINISTRY_CATEGORY_LABELS[matchingMinistry.category].ms : MINISTRY_CATEGORY_LABELS[matchingMinistry.category].en}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─── FOOTER ATTRIBUTION ─────────────────────────── */}
              <div className="mt-4 pt-3 text-center relative" style={{ borderTop: '1px solid rgba(6,182,212,0.1)' }}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CoatOfArmsDecoration size={14} />
                  <div className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.5)' }}>
                    {lang === 'ms'
                      ? `Dijana pada ${new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' })} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuala_Lumpur' })} MYT`
                      : `Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' })} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuala_Lumpur' })} MYT`
                    }
                  </div>
                  <CoatOfArmsDecoration size={14} />
                </div>
                <div className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
                  {lang === 'ms'
                    ? 'Data diperoleh daripada data.gov.my • Lesen CC BY 4.0 • Pusat Perintah Data Terbuka Malaysia v3.0'
                    : 'Data sourced from data.gov.my • CC BY 4.0 License • Malaysia Open Data Command Center v3.0'
                  }
                </div>
                {/* Aspect ratio label in footer */}
                <div className="text-[7px] font-mono mt-1" style={{ color: 'rgba(6,182,212,0.25)' }}>
                  {aspectRatio} • {exportDimLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default InfographicModal;
