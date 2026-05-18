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
      geomap: 'GeoMap',
    },
    status: {
      live: 'LIVE',
      csv: 'CSV',
      static: 'STATIC',
      loading: 'LOADING',
      error: 'ERROR',
      latest: 'LATEST',
      operational: 'OPERATIONAL',
      connected: 'CONNECTED',
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
      categories: 'Categories',
      datasets: 'Datasets',
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
      export: 'Export',
      exportPng: 'Export PNG',
      refresh: 'Refresh',
      drillDown: 'Drill Down',
      viewAll: 'View All',
      search: 'Search commands, datasets, reports...',
      filter: 'Filter',
      reset: 'Reset',
      close: 'Close',
      infographic: 'Infographic',
    },
    footer: {
      builtWith: 'Built with data.gov.my Open Data',
      quickStats: 'QUICK STATS',
      dataSources: 'DATA SOURCES',
      license: 'LICENSE',
      poweredBy: 'Powered by data.gov.my',
      openDataPortal: 'Open Data Portal',
      statesFT: 'States/FT',
      dataLayers: 'Data Layers',
      allRightsReserved: 'All rights reserved.',
    },
    breadcrumb: {
      title: 'MALAYSIA OPEN DATA COMMAND CENTER',
    },
    skip: {
      mainContent: 'Skip to main content',
    },
    shortcuts: {
      keyboardShortcuts: 'Keyboard Shortcuts (?)',
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
    mapLayers: {
      population: 'Population',
      gdp: 'GDP',
      births: 'Births',
      deaths: 'Deaths',
      unemployment: 'Unemployment',
      datasets: 'Datasets',
    },
    regions: {
      eastMalaysia: 'EAST MALAYSIA',
      peninsular: 'PENINSULAR',
    },
    hero: {
      states: 'STATES',
      federalTerritories: 'FT',
      layers: 'LAYERS',
      categories: 'CATEGORIES',
    },
  },

  ms: {
    nav: {
      overview: 'Gambaran',
      analytics: 'Analitik',
      geospatial: 'Geospatial',
      datasets: 'Set Data',
      intelligence: 'Perisikan',
      geomap: 'PetaGeo',
    },
    status: {
      live: 'LANGSUNG',
      csv: 'CSV',
      static: 'STATIK',
      loading: 'MEMUATKAN',
      error: 'RALAT',
      latest: 'TERKINI',
      operational: 'BEROPERASI',
      connected: 'BERHUBUNG',
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
      categories: 'Kategori',
      datasets: 'Set Data',
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
      export: 'Eksport',
      exportPng: 'Eksport PNG',
      refresh: 'Muat Semula',
      drillDown: 'Perincikan',
      viewAll: 'Lihat Semua',
      search: 'Cari arahan, dataset, laporan...',
      filter: 'Tapis',
      reset: 'Set Semula',
      close: 'Tutup',
      infographic: 'Infografik',
    },
    footer: {
      builtWith: 'Dibina dengan data.gov.my Open Data',
      quickStats: 'STATISTIK PANTAS',
      dataSources: 'SUMBER DATA',
      license: 'LESEN',
      poweredBy: 'Dikuasakan oleh data.gov.my',
      openDataPortal: 'Portal Data Terbuka',
      statesFT: 'Negeri/WP',
      dataLayers: 'Lapisan Data',
      allRightsReserved: 'Hak cipta terpelihara.',
    },
    breadcrumb: {
      title: 'PUSAT PERINTAH DATA TERBUKA MALAYSIA',
    },
    skip: {
      mainContent: 'Langkau ke kandungan utama',
    },
    shortcuts: {
      keyboardShortcuts: 'Pintasan Papan Kekunci (?)',
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
    mapLayers: {
      population: 'Penduduk',
      gdp: 'KDNK',
      births: 'Kelahiran',
      deaths: 'Kematian',
      unemployment: 'Pengangguran',
      datasets: 'Set Data',
    },
    regions: {
      eastMalaysia: 'MALAYSIA TIMUR',
      peninsular: 'SEMENANJUNG',
    },
    hero: {
      states: 'NEGERI',
      federalTerritories: 'WP',
      layers: 'LAPISAN',
      categories: 'KATEGORI',
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
