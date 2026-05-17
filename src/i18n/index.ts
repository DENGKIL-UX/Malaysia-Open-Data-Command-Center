// ============================================================================
// Malaysia Open Data Command Center — i18n System
// Complete BM/EN translation system with Zustand persistence
// ============================================================================

export type Lang = 'en' | 'ms';

export const T = {
  en: {
    nav: {
      overview: 'Overview',
      analytics: 'Analytics',
      geospatial: 'Geospatial',
      datasets: 'Datasets',
      intelligence: 'Intelligence',
    },
    status: {
      live: 'LIVE',
      csv: 'CSV',
      static: 'STATIC',
      loading: 'LOADING',
      error: 'ERROR',
    },
    confidence: {
      confirmed: 'CONFIRMED',
      high: 'HIGH',
      moderate: 'MODERATE',
      unverified: 'UNVERIFIED',
    },
    risk: {
      critical: 'CRITICAL',
      high: 'HIGH',
      medium: 'MEDIUM',
      low: 'LOW',
    },
    datasets: {
      gdp_qtr: 'GDP Quarterly',
      cpi_headline: 'Consumer Price Index',
      lfs_month: 'Unemployment Rate',
      fuelprice: 'Fuel Prices',
      trade_monthly: 'External Trade',
      exchangerates_monthly: 'Exchange Rates',
      population_malaysia: 'Total Population',
      hies_state: 'Household Income',
    },
    intel: {
      title: 'Intelligence Center',
      confidence: 'Confidence Scores',
      anomalies: 'Detected Anomalies',
      findings: 'Intelligence Findings',
      graph: 'Ontology Network',
      audit: 'Audit Trail',
    },
    actions: {
      generate: 'Generate',
      export: 'Export PNG',
      refresh: 'Refresh',
      drillDown: 'Drill Down',
      viewAll: 'View All',
      search: 'Search commands, datasets, reports...',
    },
    footer: {
      builtWith: 'Built with data.gov.my Open Data',
      quickStats: 'QUICK STATS',
      dataSources: 'DATA SOURCES',
      license: 'LICENSE',
    },
    commandPalette: {
      title: 'Command Palette',
      noResults: 'No commands found for',
      navigate: 'NAVIGATE',
      dataset: 'DATASET',
      generate: 'GENERATE',
      intelligence: 'INTELLIGENCE',
    },
    alertTicker: {
      dismiss: 'Dismiss alert',
    },
  },

  ms: {
    nav: {
      overview: 'Gambaran Keseluruhan',
      analytics: 'Analitik',
      geospatial: 'Geospatial',
      datasets: 'Set Data',
      intelligence: 'Perisikan',
    },
    status: {
      live: 'LANGSUNG',
      csv: 'CSV',
      static: 'STATIK',
      loading: 'MEMUATKAN',
      error: 'RALAT',
    },
    confidence: {
      confirmed: 'DISAHKAN',
      high: 'TINGGI',
      moderate: 'SEDERHANA',
      unverified: 'TIDAK DISAHKAN',
    },
    risk: {
      critical: 'KRITIKAL',
      high: 'TINGGI',
      medium: 'SEDERHANA',
      low: 'RENDAH',
    },
    datasets: {
      gdp_qtr: 'KDNK Suku Tahunan',
      cpi_headline: 'Indeks Harga Pengguna',
      lfs_month: 'Kadar Pengangguran',
      fuelprice: 'Harga Bahan Api',
      trade_monthly: 'Perdagangan Luar',
      exchangerates_monthly: 'Kadar Pertukaran',
      population_malaysia: 'Jumlah Penduduk',
      hies_state: 'Pendapatan Isi Rumah',
    },
    intel: {
      title: 'Pusat Perisikan',
      confidence: 'Skor Keyakinan',
      anomalies: 'Anomali Dikesan',
      findings: 'Penemuan Perisikan',
      graph: 'Rangkaian Ontologi',
      audit: 'Jejak Audit',
    },
    actions: {
      generate: 'Jana',
      export: 'Eksport PNG',
      refresh: 'Muat Semula',
      drillDown: 'Perincikan',
      viewAll: 'Lihat Semua',
      search: 'Cari arahan, dataset, laporan...',
    },
    footer: {
      builtWith: 'Dibina dengan data.gov.my Open Data',
      quickStats: 'STATISTIK PANTAS',
      dataSources: 'SUMBER DATA',
      license: 'LESEN',
    },
    commandPalette: {
      title: 'Palet Arahan',
      noResults: 'Tiada arahan ditemui untuk',
      navigate: 'NAVIGASI',
      dataset: 'DATASET',
      generate: 'JANA',
      intelligence: 'PERISIKAN',
    },
    alertTicker: {
      dismiss: 'Tutup amaran',
    },
  },
} as const;

// ── Zustand store for language ──
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LangStore {
  lang: Lang;
  t: (typeof T)['en'];
  toggle: () => void;
  setLang: (lang: Lang) => void;
}

export const useLang = create<LangStore>()(
  persist(
    (set) => ({
      lang: 'en' as Lang,
      t: T.en,
      toggle: () =>
        set((s) => {
          const next = s.lang === 'en' ? 'ms' : 'en';
          return { lang: next, t: T[next] };
        }),
      setLang: (lang: Lang) => set({ lang, t: T[lang] }),
    }),
    { name: 'intel-lang', version: 1 }
  )
);
