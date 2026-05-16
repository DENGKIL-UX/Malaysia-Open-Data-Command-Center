'use client';

import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Printer, X, Download, Calendar, Database, Building2 } from 'lucide-react';
import { STATES, DATASET_CATEGORIES, MALAYSIA_TOTALS } from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import type { Lang } from '@/lib/dashboard-types';

// ─── Infographic Source & Date Data ────────────────────────────────
const INFOGRAPHIC_SOURCES = [
  { abbr: 'DOSM', full_en: 'Dept. of Statistics Malaysia', full_ms: 'Jabatan Perangkaan Malaysia', url: 'https://open.dosm.gov.my' },
  { abbr: 'BNM', full_en: 'Bank Negara Malaysia', full_ms: 'Bank Negara Malaysia', url: 'https://www.bnm.gov.my' },
  { abbr: 'KKM', full_en: 'Ministry of Health Malaysia', full_ms: 'Kementerian Kesihatan Malaysia', url: 'https://www.moh.gov.my' },
  { abbr: 'JPN', full_en: 'National Registration Dept.', full_ms: 'Jabatan Pendaftaran Negara', url: 'https://www.jpn.gov.my' },
  { abbr: 'MOT', full_en: 'Ministry of Transport', full_ms: 'Kementerian Pengangkutan', url: 'https://www.mot.gov.my' },
  { abbr: 'KD', full_en: 'Ministry of Digital', full_ms: 'Kementerian Digital', url: 'https://data.gov.my' },
  { abbr: 'JDN', full_en: 'National Data Dept.', full_ms: 'Jabatan Data Negara', url: 'https://data.gov.my' },
  { abbr: 'KPM', full_en: 'Ministry of Education', full_ms: 'Kementerian Pendidikan', url: 'https://www.moe.gov.my' },
  { abbr: 'KASA', full_en: 'Ministry of Environment', full_ms: 'Kementerian Alam Sekitar', url: 'https://www.kasa.gov.my' },
  { abbr: 'data.gov.my', full_en: 'Malaysia Open Data Portal', full_ms: 'Portal Data Terbuka Malaysia', url: 'https://data.gov.my' },
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

// ─── Infographic Export Modal ────────────────────────────────────
export function InfographicModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['population', 'gdp', 'births']);
  const [fontSize, setFontSize] = useState<'S' | 'M' | 'L'>('M');
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

  const toggleLayer = (id: string) => {
    setSelectedLayers(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (previewRef.current) {
        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          backgroundColor: '#0a0e1a',
          useCORS: true,
        });
        const link = document.createElement('a');
        link.download = `malaysia-data-infographic-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (e) {
      console.error('Export failed:', e);
    }
    setExporting(false);
  };

  const fs = fontSize === 'S' ? '10px' : fontSize === 'M' ? '12px' : '14px';

  // Compute global date range across all selected layers
  const globalDateInfo = useMemo(() => {
    const allCategories = selectedLayers.flatMap(l => LAYER_CATEGORY_MAP[l] || []);
    const matching = DATASETS.filter(d => allCategories.includes(d.category_en));
    if (matching.length === 0) return { minBegin: 2020, maxEnd: 2024, latestUpdate: '', sources: new Set<string>(), totalDatasets: 0 };
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
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border custom-scrollbar"
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
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-cyan-950/30">
            <X size={16} style={{ color: 'rgba(6,182,212,0.5)' }} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Controls */}
          <div className="space-y-4">
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
                    <div className="w-2.5 h-2.5 rounded-sm border" style={{
                      background: selectedLayers.includes(l.id) ? l.color : 'transparent',
                      borderColor: l.color,
                    }} />
                    {lang === 'ms' ? l.label_ms : l.label_en}
                  </button>
                ))}
              </div>
            </div>

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

            <button
              onClick={handleExport}
              disabled={exporting || selectedLayers.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border text-xs font-mono font-bold disabled:opacity-30"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(16,185,129,0.1))',
                borderColor: 'rgba(6,182,212,0.3)',
                color: '#06b6d4',
              }}
            >
              <Download size={14} />
              {exporting
                ? (lang === 'ms' ? 'MENGEKSPORT...' : 'EXPORTING...')
                : (lang === 'ms' ? 'EKSPOR PNG (2x)' : 'EXPORT PNG (2x)')
              }
            </button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'PRATONTON' : 'PREVIEW'}
            </div>
            <div ref={previewRef} className="rounded-lg border p-6" style={{
              background: '#0a0e1a',
              borderColor: 'rgba(6,182,212,0.12)',
              fontSize: fs,
            }}>
              {/* Infographic Header */}
              <div className="text-center mb-6 pb-4" style={{ borderBottom: '1px solid rgba(6,182,212,0.15)' }}>
                <div className="text-[9px] font-mono tracking-[0.3em] mb-1" style={{ color: 'rgba(6,182,212,0.5)' }}>DATA.GOV.MY</div>
                <div className="text-xl font-bold" style={{ color: '#06b6d4', textShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
                  {lang === 'ms' ? 'PUSAT PERINTAH DATA TERBUKA MALAYSIA' : 'MALAYSIA OPEN DATA COMMAND CENTER'}
                </div>
                <div className="text-[10px] font-mono mt-1" style={{ color: '#94a3b8' }}>
                  {lang === 'ms' ? 'Infografik Data Nasional' : 'National Data Infographic'} — {new Date().getFullYear()}
                </div>
              </div>

              {/* Overview Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 rounded border" style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)' }}>
                  <div className="text-lg font-bold font-mono" style={{ color: '#06b6d4' }}>34.3M</div>
                  <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Penduduk' : 'Population'}</div>
                </div>
                <div className="text-center p-3 rounded border" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.1)' }}>
                  <div className="text-lg font-bold font-mono" style={{ color: '#f59e0b' }}>RM1.68T</div>
                  <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'KDNK' : 'GDP'}</div>
                </div>
                <div className="text-center p-3 rounded border" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.1)' }}>
                  <div className="text-lg font-bold font-mono" style={{ color: '#10b981' }}>287</div>
                  <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? 'Set Data' : 'Datasets'}</div>
                </div>
              </div>

              {/* Selected Layers Content */}
              {selectedLayers.includes('population') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#06b6d4' }}>
                    ▸ {lang === 'ms' ? 'PENDUDUK MENGIKUT NEGERI' : 'POPULATION BY STATE'}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {STATES.slice().sort((a,b) => b.population - a.population).slice(0, 8).map(s => (
                      <div key={s.id} className="p-1.5 rounded border" style={{ background: 'rgba(6,182,212,0.03)', borderColor: 'rgba(6,182,212,0.08)' }}>
                        <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{s.abbr}</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: '#e0f7fa' }}>{s.population.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLayers.includes('gdp') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#f59e0b' }}>
                    ▸ {lang === 'ms' ? 'KDNK MENGIKUT NEGERI' : 'GDP BY STATE'}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {STATES.slice().sort((a,b) => b.gdp - a.gdp).slice(0, 8).map(s => (
                      <div key={s.id} className="p-1.5 rounded border" style={{ background: 'rgba(245,158,11,0.03)', borderColor: 'rgba(245,158,11,0.08)' }}>
                        <div className="text-[8px] font-mono" style={{ color: '#94a3b8' }}>{s.abbr}</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: '#e0f7fa' }}>RM{(s.gdp/1000).toFixed(1)}B</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLayers.includes('demography') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#10b981' }}>
                    ▸ {lang === 'ms' ? 'STATISTIK VITAL' : 'VITAL STATISTICS'}
                  </div>
                  <div className="flex gap-4">
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

              {selectedLayers.includes('healthcare') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#ec4899' }}>
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

              {selectedLayers.includes('environment') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#22c55e' }}>
                    ▸ {lang === 'ms' ? 'ALAM SEKITAR' : 'ENVIRONMENT'}
                  </div>
                  <div className="p-2 rounded border" style={{ background: 'rgba(34,197,94,0.03)', borderColor: 'rgba(34,197,94,0.08)' }}>
                    <div className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>
                      {lang === 'ms'
                        ? 'Data alam sekitar merangkumi pencemaran udara, akses air, penggunaan elektrik, dan rizab hutan dari DOSM dan KASA.'
                        : 'Environmental data covers air pollution, water access, electricity consumption, and forest reserves from DOSM and KASA.'
                      }
                    </div>
                  </div>
                </div>
              )}

              {selectedLayers.includes('education') && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono tracking-wider mb-2" style={{ color: '#3b82f6' }}>
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

              {/* ─── FULL SOURCE REFERENCE TABLE ───────────────────────── */}
              {selectedLayers.length > 0 && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(6,182,212,0.08)' }}>
                  <div className="text-[8px] font-mono tracking-wider mb-2" style={{ color: 'rgba(6,182,212,0.6)' }}>
                    {lang === 'ms' ? 'RUJUKAN SUMBER' : 'SOURCE REFERENCES'}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {INFOGRAPHIC_SOURCES.filter(s => globalDateInfo.sources.includes(s.abbr)).map(src => (
                      <div key={src.abbr} className="flex items-start gap-1.5 p-1" style={{ fontSize: fs === '10px' ? '7px' : fs === '12px' ? '8px' : '9px' }}>
                        <span className="font-mono font-bold flex-shrink-0" style={{ color: '#06b6d4', minWidth: '36px' }}>{src.abbr}</span>
                        <span className="font-mono" style={{ color: '#94a3b8' }}>{lang === 'ms' ? src.full_ms : src.full_en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer attribution */}
              <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid rgba(6,182,212,0.1)' }}>
                <div className="text-[8px] font-mono mb-1" style={{ color: 'rgba(6,182,212,0.5)' }}>
                  {lang === 'ms'
                    ? `Dijana pada ${new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' })} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuala_Lumpur' })} MYT`
                    : `Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' })} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuala_Lumpur' })} MYT`
                  }
                </div>
                <div className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
                  {lang === 'ms'
                    ? 'Data diperoleh daripada data.gov.my • Lesen CC BY 4.0 • Pusat Perintah Data Terbuka Malaysia v3.0'
                    : 'Data sourced from data.gov.my • CC BY 4.0 License • Malaysia Open Data Command Center v3.0'
                  }
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
