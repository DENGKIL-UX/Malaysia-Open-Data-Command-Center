'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X, FileText, Braces, Image as ImageIcon, Download, CheckCircle2,
  Clock, HardDrive, ChevronRight, AlertTriangle,
} from 'lucide-react';
import { STATES, DATASET_CATEGORIES, TIMELINE_EVENTS } from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import { HUDBracket } from '@/components/dashboard/particle-background';
import type { Lang } from '@/lib/dashboard-types';

// ─── Types ──────────────────────────────────────────────────────────
interface DataExportHubProps {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'csv' | 'json' | 'png';

interface ExportSource {
  id: string;
  label_en: string;
  label_ms: string;
  color: string;
  icon: React.ElementType;
  count: number;
}

interface ExportHistoryEntry {
  id: string;
  sourceId: string;
  sourceLabel: string;
  format: ExportFormat;
  timestamp: Date;
  fileSize: string;
}

// ─── CSV Generator ──────────────────────────────────────────────────
function generateCSV(headers: string[], rows: string[][]): string {
  const headerLine = headers.join(',');
  const dataLines = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
}

// ─── JSON Generator ─────────────────────────────────────────────────
function generateJSON(data: Record<string, unknown>[]): string {
  return JSON.stringify(data, null, 2);
}

// ─── File Download ──────────────────────────────────────────────────
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Format File Size ───────────────────────────────────────────────
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Date String ────────────────────────────────────────────────────
function getDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

// ─── Export Sources Definition ──────────────────────────────────────
const EXPORT_SOURCES: ExportSource[] = [
  {
    id: 'state-metrics',
    label_en: 'State Metrics Data',
    label_ms: 'Data Metrik Negeri',
    color: '#06b6d4',
    icon: FileText,
    count: STATES.length,
  },
  {
    id: 'dataset-catalogue',
    label_en: 'Dataset Catalogue',
    label_ms: 'Katalog Set Data',
    color: '#f59e0b',
    icon: FileText,
    count: DATASETS.length,
  },
  {
    id: 'category-distribution',
    label_en: 'Category Distribution',
    label_ms: 'Taburan Kategori',
    color: '#10b981',
    icon: FileText,
    count: DATASET_CATEGORIES.length,
  },
  {
    id: 'timeline-events',
    label_en: 'Timeline Events',
    label_ms: 'Peristiwa Garis Masa',
    color: '#8b5cf6',
    icon: FileText,
    count: TIMELINE_EVENTS.length,
  },
  {
    id: 'data-quality',
    label_en: 'Data Quality Metrics',
    label_ms: 'Metrik Kualiti Data',
    color: '#ec4899',
    icon: FileText,
    count: 4,
  },
];

// ─── Data Generation Per Source ─────────────────────────────────────
function getSourceData(sourceId: string, lang: Lang): { headers: string[]; rows: string[][]; json: Record<string, unknown>[] } {
  switch (sourceId) {
    case 'state-metrics': {
      const headers = ['State', 'Abbreviation', 'Population (000)', 'GDP (RM M)', 'GDP Growth (%)', 'Births (000)', 'Deaths (000)', 'Unemployment (%)', 'Area (km²)', 'Density (/km²)', 'Datasets'];
      const rows = STATES.map(s => [
        lang === 'ms' ? s.name_ms : s.name,
        s.abbr,
        String(s.population),
        String(s.gdp),
        String(s.gdpGrowth),
        String(s.births),
        String(s.deaths),
        String(s.unemployment),
        String(s.area),
        String(s.density),
        String(s.datasets),
      ]);
      const json = STATES.map(s => ({
        state: lang === 'ms' ? s.name_ms : s.name,
        abbr: s.abbr,
        population: s.population,
        gdp: s.gdp,
        gdpGrowth: s.gdpGrowth,
        births: s.births,
        deaths: s.deaths,
        unemployment: s.unemployment,
        area: s.area,
        density: s.density,
        datasets: s.datasets,
      }));
      return { headers, rows, json };
    }
    case 'dataset-catalogue': {
      const headers = ['Title', 'Category', 'Frequency', 'Geography', 'Source'];
      const rows = DATASETS.map(d => [
        lang === 'ms' ? d.title_ms : d.title_en,
        lang === 'ms' ? d.category_ms : d.category_en,
        d.frequency,
        d.geography.join('; '),
        d.data_source.join('; '),
      ]);
      const json = DATASETS.map(d => ({
        id: d.id,
        title: lang === 'ms' ? d.title_ms : d.title_en,
        category: lang === 'ms' ? d.category_ms : d.category_en,
        frequency: d.frequency,
        geography: d.geography,
        source: d.data_source,
      }));
      return { headers, rows, json };
    }
    case 'category-distribution': {
      // Count datasets per category
      const catCounts: Record<string, number> = {};
      DATASETS.forEach(d => {
        const cat = d.category_en;
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });
      const headers = ['Category', 'Category (MS)', 'Dataset Count'];
      const rows = DATASET_CATEGORIES.map(c => [
        c.en,
        c.ms,
        String(catCounts[c.en] || 0),
      ]);
      const json = DATASET_CATEGORIES.map(c => ({
        category: c.en,
        category_ms: c.ms,
        count: catCounts[c.en] || 0,
        color: c.color,
      }));
      return { headers, rows, json };
    }
    case 'timeline-events': {
      const headers = ['Date', 'Event (EN)', 'Event (MS)'];
      const rows = TIMELINE_EVENTS.map(e => [
        e.date,
        e.event_en,
        e.event_ms,
      ]);
      const json = TIMELINE_EVENTS.map(e => ({
        date: e.date,
        event_en: e.event_en,
        event_ms: e.event_ms,
      }));
      return { headers, rows, json };
    }
    case 'data-quality': {
      const headers = ['Metric', 'Score (%)', 'Status'];
      const metrics = [
        { metric_en: 'Coverage', metric_ms: 'Liputan', score: 98, status: 'Excellent' },
        { metric_en: 'Freshness', metric_ms: 'Kesegaran', score: 87, status: 'Good' },
        { metric_en: 'Completeness', metric_ms: 'Kesempurnaan', score: 95, status: 'Excellent' },
        { metric_en: 'Consistency', metric_ms: 'Konsistensi', score: 91, status: 'Good' },
      ];
      const rows = metrics.map(m => [
        lang === 'ms' ? m.metric_ms : m.metric_en,
        String(m.score),
        m.status,
      ]);
      const json = metrics.map(m => ({
        metric: lang === 'ms' ? m.metric_ms : m.metric_en,
        score: m.score,
        status: m.status,
      }));
      return { headers, rows, json };
    }
    default:
      return { headers: [], rows: [], json: [] };
  }
}

// ─── Format Icons ───────────────────────────────────────────────────
const FORMAT_OPTIONS: { id: ExportFormat; label_en: string; label_ms: string; icon: React.ElementType; mimeType: string; ext: string }[] = [
  { id: 'csv', label_en: 'CSV', label_ms: 'CSV', icon: FileText, mimeType: 'text/csv', ext: 'csv' },
  { id: 'json', label_en: 'JSON', label_ms: 'JSON', icon: Braces, mimeType: 'application/json', ext: 'json' },
  { id: 'png', label_en: 'PNG', label_ms: 'PNG', icon: ImageIcon, mimeType: 'image/png', ext: 'png' },
];

// ─── Syntax Highlight for Preview ───────────────────────────────────
function HighlightedPreview({ content, format }: { content: string; format: ExportFormat }) {
  if (format === 'json') {
    // Simple syntax highlighting for JSON
    const highlighted = content
      .replace(/"([^"]+)":/g, '<span style="color:#06b6d4">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span style="color:#10b981">"$1"</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span style="color:#f59e0b">$1</span>')
      .replace(/: (true|false|null)/g, ': <span style="color:#8b5cf6">$1</span>');
    return (
      <pre
        className="text-[9px] leading-relaxed overflow-auto max-h-64 font-mono custom-scrollbar whitespace-pre-wrap break-all"
        style={{ color: '#94a3b8' }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    );
  }

  if (format === 'csv') {
    const lines = content.split('\n');
    return (
      <pre className="text-[9px] leading-relaxed overflow-auto max-h-64 font-mono custom-scrollbar whitespace-pre-wrap break-all" style={{ color: '#94a3b8' }}>
        {lines.map((line, i) => (
          <span key={i}>
            {i === 0 ? (
              <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>{line}</span>
            ) : (
              <span>{line}</span>
            )}
            {i < lines.length - 1 && '\n'}
          </span>
        ))}
      </pre>
    );
  }

  // PNG preview — show a placeholder message
  return (
    <div className="flex flex-col items-center justify-center h-32 gap-2" style={{ color: 'rgba(6,182,212,0.5)' }}>
      <ImageIcon size={24} />
      <span className="text-[10px] font-mono">{content}</span>
    </div>
  );
}

// ─── Data Export Hub Component ──────────────────────────────────────
export function DataExportHub({ lang, isOpen, onClose }: DataExportHubProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [exportHistory, setExportHistory] = useState<ExportHistoryEntry[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Toggle source selection
  const toggleSource = useCallback((id: string) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }, []);

  // Generate preview content
  const previewContent = useMemo(() => {
    if (selectedSources.length === 0) return null;

    const sourceId = selectedSources[0]; // Preview first selected source
    const data = getSourceData(sourceId, lang);

    if (selectedFormat === 'csv') {
      const previewRows = data.rows.slice(0, 5);
      return generateCSV(data.headers, previewRows);
    }
    if (selectedFormat === 'json') {
      const previewJson = data.json.slice(0, 5);
      return generateJSON(previewJson);
    }
    // PNG
    return lang === 'ms' ? 'Pratonton PNG — klik Eksport untuk menjana' : 'PNG Preview — click Export to generate';
  }, [selectedSources, selectedFormat, lang]);

  // Preview data row count
  const previewRowCount = useMemo(() => {
    if (selectedSources.length === 0) return 0;
    const sourceId = selectedSources[0];
    const data = getSourceData(sourceId, lang);
    return Math.min(data.rows.length, 5);
  }, [selectedSources, lang]);

  // Handle export
  const handleExport = useCallback(async () => {
    if (selectedSources.length === 0) return;
    setIsExporting(true);

    for (const sourceId of selectedSources) {
      const source = EXPORT_SOURCES.find(s => s.id === sourceId);
      if (!source) continue;

      const sourceLabel = lang === 'ms' ? source.label_ms : source.label_en;
      const data = getSourceData(sourceId, lang);
      const dateStr = getDateStr();

      if (selectedFormat === 'csv') {
        const content = generateCSV(data.headers, data.rows);
        const filename = `malaysia-data-${sourceId}-${dateStr}.csv`;
        downloadFile(content, filename, 'text/csv');
        // Estimate file size
        const size = new Blob([content]).size;
        setExportHistory(prev => [{
          id: `${sourceId}-${Date.now()}`,
          sourceId,
          sourceLabel,
          format: 'csv',
          timestamp: new Date(),
          fileSize: formatFileSize(size),
        }, ...prev].slice(0, 20));
      } else if (selectedFormat === 'json') {
        const content = generateJSON(data.json);
        const filename = `malaysia-data-${sourceId}-${dateStr}.json`;
        downloadFile(content, filename, 'application/json');
        const size = new Blob([content]).size;
        setExportHistory(prev => [{
          id: `${sourceId}-${Date.now()}`,
          sourceId,
          sourceLabel,
          format: 'json',
          timestamp: new Date(),
          fileSize: formatFileSize(size),
        }, ...prev].slice(0, 20));
      } else if (selectedFormat === 'png') {
        // Use html2canvas to capture the preview card
        try {
          const html2canvas = (await import('html2canvas')).default;
          if (previewRef.current) {
            const canvas = await html2canvas(previewRef.current, {
              scale: 2,
              backgroundColor: '#0a0e1a',
              useCORS: true,
            });
            const link = document.createElement('a');
            const filename = `malaysia-data-summary-${dateStr}.png`;
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
            // Estimate PNG size
            const pngDataUrl = canvas.toDataURL('image/png');
            const size = Math.round((pngDataUrl.length - 'data:image/png;base64,'.length) * 0.75);
            setExportHistory(prev => [{
              id: `${sourceId}-${Date.now()}`,
              sourceId,
              sourceLabel,
              format: 'png',
              timestamp: new Date(),
              fileSize: formatFileSize(size),
            }, ...prev].slice(0, 20));
          }
        } catch (err) {
          console.error('PNG export failed:', err);
        }
      }
    }

    setIsExporting(false);
  }, [selectedSources, selectedFormat, lang]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-lg border relative group"
        style={{
          background: '#0a0e1a',
          borderColor: 'rgba(6,182,212,0.2)',
          boxShadow: '0 0 60px rgba(6,182,212,0.1)',
        }}
      >
        <HUDBracket />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
          <div className="flex items-center gap-2">
            <Download size={16} style={{ color: '#06b6d4' }} />
            <span className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'PUSAT EKSPOR DATA' : 'DATA EXPORT HUB'}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded ml-2" style={{
              background: 'rgba(6,182,212,0.1)',
              color: '#06b6d4',
              border: '1px solid rgba(6,182,212,0.2)',
            }}>
              {selectedSources.length} {lang === 'ms' ? 'dipilih' : 'selected'}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-cyan-950/30 transition-colors" aria-label="Close">
            <X size={16} style={{ color: 'rgba(6,182,212,0.5)' }} />
          </button>
        </div>

        {/* Body - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar">
          {/* Left Column - Source Selection */}
          <div className="lg:col-span-2 p-4 border-r" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
            <div className="text-[10px] font-mono tracking-wider mb-3" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'SUMBER DATA BOLEH EKSPORT' : 'EXPORTABLE DATA SOURCES'}
            </div>
            <div className="space-y-2">
              {EXPORT_SOURCES.map(source => {
                const isSelected = selectedSources.includes(source.id);
                const SourceIcon = source.icon;
                return (
                  <button
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border text-left text-xs font-mono transition-all duration-200"
                    style={{
                      background: isSelected ? `${source.color}12` : 'rgba(10,14,26,0.6)',
                      borderColor: isSelected ? `${source.color}40` : 'rgba(6,182,212,0.08)',
                      color: isSelected ? source.color : '#94a3b8',
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all duration-200"
                      style={{
                        background: isSelected ? source.color : 'transparent',
                        borderColor: isSelected ? source.color : 'rgba(6,182,212,0.3)',
                      }}
                    >
                      {isSelected && <CheckCircle2 size={10} style={{ color: '#0a0e1a' }} />}
                    </div>

                    <SourceIcon size={12} style={{ color: isSelected ? source.color : 'rgba(6,182,212,0.4)', flexShrink: 0 }} />

                    <span className="flex-1 truncate">
                      {lang === 'ms' ? source.label_ms : source.label_en}
                    </span>

                    {/* Count Badge */}
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{
                        background: `${source.color}15`,
                        color: source.color,
                        border: `1px solid ${source.color}25`,
                      }}
                    >
                      {source.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Select All / Deselect All */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setSelectedSources(EXPORT_SOURCES.map(s => s.id))}
                className="flex-1 px-2 py-1.5 rounded border text-[10px] font-mono transition-colors hover:bg-cyan-950/30"
                style={{
                  borderColor: 'rgba(6,182,212,0.15)',
                  color: 'rgba(6,182,212,0.6)',
                }}
              >
                {lang === 'ms' ? 'Pilih Semua' : 'Select All'}
              </button>
              <button
                onClick={() => setSelectedSources([])}
                className="flex-1 px-2 py-1.5 rounded border text-[10px] font-mono transition-colors hover:bg-cyan-950/30"
                style={{
                  borderColor: 'rgba(6,182,212,0.15)',
                  color: 'rgba(6,182,212,0.6)',
                }}
              >
                {lang === 'ms' ? 'Nyahpilih' : 'Deselect'}
              </button>
            </div>

            {/* Export History */}
            {exportHistory.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                  {lang === 'ms' ? 'SEJARAH EKSPOR' : 'EXPORT HISTORY'}
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                  {exportHistory.map(entry => {
                    const FormatIcon = entry.format === 'csv' ? FileText : entry.format === 'json' ? Braces : Image;
                    const formatColor = entry.format === 'csv' ? '#06b6d4' : entry.format === 'json' ? '#f59e0b' : '#10b981';
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded border text-[9px] font-mono"
                        style={{
                          background: 'rgba(10,14,26,0.6)',
                          borderColor: 'rgba(6,182,212,0.06)',
                        }}
                      >
                        <FormatIcon size={9} style={{ color: formatColor, flexShrink: 0 }} />
                        <span className="flex-1 truncate" style={{ color: '#b0bec5' }}>{entry.sourceLabel}</span>
                        <span
                          className="px-1 py-0.5 rounded text-[8px] uppercase"
                          style={{
                            background: `${formatColor}15`,
                            color: formatColor,
                          }}
                        >
                          {entry.format}
                        </span>
                        <span style={{ color: 'rgba(6,182,212,0.35)' }}>{entry.fileSize}</span>
                        <span style={{ color: 'rgba(6,182,212,0.3)' }}>
                          {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Format + Preview + Download */}
          <div className="lg:col-span-3 p-4">
            {/* Format Selection */}
            <div className="text-[10px] font-mono tracking-wider mb-3" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'FORMAT EKSPOR' : 'EXPORT FORMAT'}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {FORMAT_OPTIONS.map(fmt => {
                const isSelected = selectedFormat === fmt.id;
                const FmtIcon = fmt.icon;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-md border text-xs font-mono transition-all duration-200"
                    style={{
                      background: isSelected ? 'rgba(6,182,212,0.1)' : 'rgba(10,14,26,0.6)',
                      borderColor: isSelected ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.08)',
                      color: isSelected ? '#06b6d4' : '#94a3b8',
                      boxShadow: isSelected ? '0 0 12px rgba(6,182,212,0.15)' : 'none',
                    }}
                  >
                    <FmtIcon size={18} style={{ color: isSelected ? '#06b6d4' : 'rgba(6,182,212,0.4)' }} />
                    <span className="font-bold">{fmt.label_en}</span>
                    <span className="text-[8px]" style={{ color: 'rgba(6,182,212,0.4)' }}>
                      .{fmt.ext}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Preview */}
            <div className="text-[10px] font-mono tracking-wider mb-2 flex items-center gap-2" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'PRATONTON' : 'PREVIEW'}
              {selectedSources.length > 0 && (
                <span className="text-[8px]" style={{ color: 'rgba(6,182,212,0.4)' }}>
                  ({previewRowCount} {lang === 'ms' ? 'baris pertama' : 'first rows'}{selectedSources.length > 1 ? ` +${selectedSources.length - 1} more` : ''})
                </span>
              )}
            </div>

            <div
              ref={previewRef}
              className="rounded-md border p-3 mb-4 min-h-[180px]"
              style={{
                background: 'rgba(10,14,26,0.85)',
                borderColor: 'rgba(6,182,212,0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {selectedSources.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2" style={{ color: 'rgba(6,182,212,0.3)' }}>
                  <AlertTriangle size={20} />
                  <span className="text-[10px] font-mono text-center">
                    {lang === 'ms'
                      ? 'Pilih sumber data untuk melihat pratonton'
                      : 'Select a data source to preview'
                    }
                  </span>
                </div>
              ) : (
                <>
                  {/* Preview card header for PNG capture */}
                  <div className="flex items-center gap-2 mb-2 pb-2" style={{ borderBottom: '1px solid rgba(6,182,212,0.08)' }}>
                    <ChevronRight size={10} style={{ color: '#06b6d4' }} />
                    <span className="text-[9px] font-mono font-bold" style={{ color: '#06b6d4' }}>
                      {(() => {
                        const source = EXPORT_SOURCES.find(s => s.id === selectedSources[0]);
                        return source ? (lang === 'ms' ? source.label_ms : source.label_en) : '';
                      })()}
                    </span>
                    <span className="text-[8px] font-mono ml-auto" style={{ color: 'rgba(6,182,212,0.3)' }}>
                      {selectedFormat.toUpperCase()}
                    </span>
                  </div>
                  {previewContent && (
                    <HighlightedPreview content={previewContent} format={selectedFormat} />
                  )}
                </>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={handleExport}
              disabled={isExporting || selectedSources.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-xs font-mono font-bold disabled:opacity-30 transition-all duration-200 cursor-pointer"
              style={{
                background: selectedSources.length > 0
                  ? 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(16,185,129,0.1))'
                  : 'rgba(10,14,26,0.6)',
                borderColor: selectedSources.length > 0
                  ? 'rgba(6,182,212,0.4)'
                  : 'rgba(6,182,212,0.1)',
                color: selectedSources.length > 0 ? '#06b6d4' : '#525252',
                boxShadow: selectedSources.length > 0 ? '0 0 20px rgba(6,182,212,0.15)' : 'none',
              }}
            >
              <Download size={14} />
              {isExporting
                ? (lang === 'ms' ? 'MENGEKSPORT...' : 'EXPORTING...')
                : selectedSources.length === 0
                  ? (lang === 'ms' ? 'PILIH SUMBER DATA' : 'SELECT DATA SOURCES')
                  : lang === 'ms'
                    ? `EKSPORT ${selectedSources.length} SUMBER (${selectedFormat.toUpperCase()})`
                    : `EXPORT ${selectedSources.length} SOURCE${selectedSources.length > 1 ? 'S' : ''} (${selectedFormat.toUpperCase()})`
              }
            </button>

            {/* File info */}
            {selectedSources.length > 0 && (
              <div className="flex items-center gap-4 mt-3 text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.35)' }}>
                <span className="flex items-center gap-1">
                  <HardDrive size={9} />
                  {lang === 'ms' ? 'Format' : 'Format'}: {selectedFormat.toUpperCase()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={9} />
                  {lang === 'ms' ? 'Tarikh' : 'Date'}: {getDateStr()}
                </span>
                <span>
                  {lang === 'ms' ? 'Sumber' : 'Sources'}: {selectedSources.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DataExportHub;
