'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Printer, X, Download } from 'lucide-react';
import { STATES } from '@/lib/data/malaysia-data';
import type { Lang } from '@/lib/dashboard-types';

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

              {/* Footer attribution */}
              <div className="mt-6 pt-4 text-center" style={{ borderTop: '1px solid rgba(6,182,212,0.1)' }}>
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
