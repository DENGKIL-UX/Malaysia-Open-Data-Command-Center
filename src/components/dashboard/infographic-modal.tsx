'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Printer, X, Download, Monitor, Smartphone, Maximize2, Loader2, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { STATES, MALAYSIA_TOTALS } from '@/lib/data/malaysia-data';
import type { Lang } from '@/lib/dashboard-types';

// ─── Layer icon mapping ──────────────────────────────────────────────
const LAYER_ICONS: Record<string, string> = {
  population: '🧑',
  gdp: '💰',
  demography: '📊',
  healthcare: '❤️',
  environment: '🌿',
  education: '🎓',
};

// ─── Infographic Export Modal (Satori + Sharp Engine) ────────────────
export function InfographicModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['population', 'gdp', 'demography']);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | 'auto'>('16:9');
  const [exporting, setExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

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

  // Export dimension label
  const exportDimLabel = useMemo(() => {
    if (aspectRatio === '16:9') return '1920×1080';
    if (aspectRatio === '9:16') return '1080×1920';
    return 'auto';
  }, [aspectRatio]);

  // Generate preview
  const generatePreview = useCallback(async () => {
    if (isAuto) {
      setPreviewUrl(null);
      return;
    }
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const format = aspectRatio === '9:16' ? '9:16' : '16:9';
      const response = await fetch('/api/infographic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          selectedLayers,
          format,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(url);
    } catch (err) {
      console.error('Preview generation failed:', err);
      setPreviewError(err instanceof Error ? err.message : 'Preview failed');
    } finally {
      setPreviewLoading(false);
    }
  }, [aspectRatio, isAuto, lang, selectedLayers, previewUrl]);

  // Auto-generate preview when settings change
  useEffect(() => {
    if (isAuto) return;

    const timer = setTimeout(() => {
      generatePreview();
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [aspectRatio, isAuto, lang, selectedLayers, generatePreview]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle export (download the full-res PNG)
  const handleExport = async () => {
    if (isAuto) return;
    setExporting(true);
    try {
      const format = aspectRatio === '9:16' ? '9:16' : '16:9';
      const response = await fetch('/api/infographic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          selectedLayers,
          format,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const ratioStr = format === '16:9' ? '16x9' : '9x16';
      link.download = `malaysia-open-data-infographic-${ratioStr}-${Date.now()}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert(`Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setExporting(false);
    }
  };

  // Zoom controls
  const handleZoomIn = () => setPreviewZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setPreviewZoom(prev => Math.max(prev - 0.25, 0.25));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-lg border flex flex-col"
        style={{
          background: '#0a0e1a',
          borderColor: 'rgba(6,182,212,0.2)',
          boxShadow: '0 0 80px rgba(6,182,212,0.08), 0 0 2px rgba(6,182,212,0.2)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b shrink-0" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
          <div className="flex items-center gap-3">
            <Printer size={16} style={{ color: '#06b6d4' }} />
            <span className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'EKSPOR INFOGRAFIK' : 'INFOGRAPHIC EXPORT'}
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border" style={{
              borderColor: 'rgba(6,182,212,0.3)',
              color: '#06b6d4',
              background: 'rgba(6,182,212,0.06)',
            }}>
              SATORI + SHARP
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{
              borderColor: 'rgba(6,182,212,0.3)',
              color: '#06b6d4',
              background: 'rgba(6,182,212,0.08)',
            }}>
              {aspectRatio}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-cyan-950/30 transition-colors">
            <X size={16} style={{ color: 'rgba(6,182,212,0.5)' }} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Panel: Controls */}
          <div className="w-72 shrink-0 p-4 space-y-5 border-r overflow-y-auto custom-scrollbar" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
            {/* Aspect Ratio */}
            <div>
              <div className="text-[10px] font-mono tracking-wider mb-2.5" style={{ color: '#06b6d4' }}>
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
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-md border text-[10px] font-mono transition-all"
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
              <div className="text-[8px] font-mono mt-1.5" style={{ color: '#64748b' }}>
                {lang === 'ms' ? 'Eksport' : 'Export'}: {exportDimLabel} px
              </div>
            </div>

            {/* Layer Selection */}
            <div>
              <div className="text-[10px] font-mono tracking-wider mb-2.5" style={{ color: '#06b6d4' }}>
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

            {/* Rendering Engine Info */}
            <div className="p-3 rounded-md border" style={{ background: 'rgba(6,182,212,0.03)', borderColor: 'rgba(6,182,212,0.1)' }}>
              <div className="text-[9px] font-mono font-bold mb-1.5" style={{ color: '#06b6d4' }}>
                {lang === 'ms' ? 'ENJIN RENDER' : 'RENDER ENGINE'}
              </div>
              <div className="text-[8px] font-mono leading-relaxed" style={{ color: '#94a3b8' }}>
                {lang === 'ms'
                  ? 'Satori (JSX→SVG) + Sharp (SVG→PNG). Render sisi pelayan, tiada isu CSS, eksport pixel-sempurna setiap kali.'
                  : 'Satori (JSX→SVG) + Sharp (SVG→PNG). Server-side rendering, no CSS issues, pixel-perfect export every time.'
                }
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exporting || selectedLayers.length === 0 || isAuto}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-xs font-mono font-bold disabled:opacity-30 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(16,185,129,0.1))',
                borderColor: 'rgba(6,182,212,0.3)',
                color: '#06b6d4',
              }}
            >
              {exporting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {lang === 'ms' ? 'MENGEKSPORT...' : 'EXPORTING...'}
                </>
              ) : (
                <>
                  <Download size={14} />
                  {isAuto
                    ? (lang === 'ms' ? 'PILIH NISBAH ASPEK DAHULU' : 'SELECT ASPECT RATIO FIRST')
                    : `EXPORT PNG ${aspectRatio} (${exportDimLabel})`
                  }
                </>
              )}
            </button>
          </div>

          {/* Right Panel: Preview */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b shrink-0" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'PRATONTON' : 'PREVIEW'}
                </span>
                <div className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                  color: isPortrait ? '#ec4899' : '#06b6d4',
                  background: isPortrait ? 'rgba(236,72,153,0.1)' : 'rgba(6,182,212,0.1)',
                }}>
                  {isPortrait ? '📱 PORTRAIT' : isAuto ? '📐 AUTO' : '🖥️ LANDSCAPE'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isAuto && previewUrl && (
                  <>
                    <button onClick={handleZoomOut} className="p-1 rounded hover:bg-cyan-950/30 transition-colors" title="Zoom out">
                      <ZoomOut size={12} style={{ color: '#94a3b8' }} />
                    </button>
                    <span className="text-[8px] font-mono" style={{ color: '#64748b' }}>
                      {Math.round(previewZoom * 100)}%
                    </span>
                    <button onClick={handleZoomIn} className="p-1 rounded hover:bg-cyan-950/30 transition-colors" title="Zoom in">
                      <ZoomIn size={12} style={{ color: '#94a3b8' }} />
                    </button>
                    <div className="w-px h-3 mx-1" style={{ background: 'rgba(6,182,212,0.15)' }} />
                  </>
                )}
                <button
                  onClick={generatePreview}
                  disabled={previewLoading || isAuto}
                  className="flex items-center gap-1 px-2 py-1 rounded border text-[9px] font-mono disabled:opacity-30 transition-all"
                  style={{
                    borderColor: 'rgba(6,182,212,0.2)',
                    color: '#06b6d4',
                    background: 'rgba(6,182,212,0.05)',
                  }}
                >
                  <RefreshCw size={10} className={previewLoading ? 'animate-spin' : ''} />
                  {lang === 'ms' ? 'Muat Semula' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div
              ref={previewContainerRef}
              className="flex-1 overflow-auto custom-scrollbar p-4 flex items-start justify-center"
              style={{ background: '#060810' }}
            >
              {isAuto ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Maximize2 size={32} style={{ color: '#64748b' }} />
                  <div className="text-xs font-mono mt-3" style={{ color: '#94a3b8' }}>
                    {lang === 'ms'
                      ? 'Pilih nisbah aspek (16:9 atau 9:16) untuk pratonton'
                      : 'Select an aspect ratio (16:9 or 9:16) for preview'
                    }
                  </div>
                </div>
              ) : previewLoading && !previewUrl ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 size={24} className="animate-spin" style={{ color: '#06b6d4' }} />
                  <div className="text-[10px] font-mono mt-3" style={{ color: '#94a3b8' }}>
                    {lang === 'ms' ? 'Menjana pratonton...' : 'Generating preview...'}
                  </div>
                  <div className="text-[8px] font-mono mt-1" style={{ color: '#64748b' }}>
                    Satori + Sharp engine
                  </div>
                </div>
              ) : previewError ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-xs font-mono" style={{ color: '#ef4444' }}>
                    {lang === 'ms' ? 'Ralat:' : 'Error:'} {previewError}
                  </div>
                  <button
                    onClick={generatePreview}
                    className="mt-3 px-3 py-1.5 rounded border text-[10px] font-mono"
                    style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
                  >
                    {lang === 'ms' ? 'Cuba Lagi' : 'Retry'}
                  </button>
                </div>
              ) : previewUrl ? (
                <div
                  style={{
                    transform: `scale(${previewZoom})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Infographic Preview"
                    style={{
                      maxWidth: '100%',
                      borderRadius: 4,
                      border: '1px solid rgba(6,182,212,0.12)',
                      boxShadow: '0 0 30px rgba(6,182,212,0.08)',
                    }}
                  />
                </div>
              ) : null}
            </div>

            {/* Preview Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t shrink-0" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
              <div className="text-[8px] font-mono" style={{ color: '#64748b' }}>
                {lang === 'ms' ? 'Enjin render sisi pelayan' : 'Server-side render engine'} • Satori v0.26 + Sharp v0.34
              </div>
              <div className="text-[8px] font-mono" style={{ color: '#64748b' }}>
                {previewUrl ? `✅ ${exportDimLabel} PNG` : '—'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
