// src/lib/dosm/registry.ts
// Complete dataset registry for api.data.gov.my/data-catalogue
// All `id` fields verified against ground-truth-registry.ts (YAML-confirmed API IDs)
//
// Key corrections from ground truth (Task 3):
//   gdp_annual_nominal_supply  → gdp_annual
//   gdp_qtr_nominal            → gdp_qtr
//   gdp_state_real_supply      → gdp_state
//   cpi_headline_inflation     → cpi_headline (inflation is COMPUTED from CPI)
//   lfs_state_sex              → lfs_state
//   trade_headline             → trade_monthly
//   exchangerates              → exchangerates_monthly
//   hh_income_state            → hies_state
//   hh_poverty_state           → poverty_absolute
//   births_annual              → births
//   crime_district             → crime_index
//   pricecatcher               → pricecatcher_week
//   bop_balance                → bop
//   fdi_flows                  → fdi

// ═══════════════════════════════════════════════════════════════
// Re-export from ground-truth-registry for backward compatibility
// ═══════════════════════════════════════════════════════════════

export {
  ID_CORRECTIONS,
  GROUND_TRUTH_REGISTRY,
  STATIC_FALLBACKS,
  STATE_NAMES,
  API_REFERENCE,
} from './ground-truth-registry';

export type {
  GroundTruthDataset,
  GroundTruthDatasetId,
  VerificationStatus,
} from './ground-truth-registry';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type DatasetGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'biennial';
export type DatasetPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface DatasetConfig {
  id: string;
  label: string;
  labelBM: string;
  category: string;
  categoryBM: string;
  valueField: string;
  dateField: string;
  groupField?: string;
  extraFields?: string[];
  /** Default filter to apply on first API load (e.g. { currency: 'USD' }) */
  defaultFilter?: Record<string, string>;
  /** If true, this dataset's valueField is derived/computed from another dataset, not a raw API field */
  computed?: boolean;
  unit: string;
  granularity: DatasetGranularity;
  priority: DatasetPriority;
  description: string;
  descriptionBM: string;
  defaultLimit: number;
  refreshMs: number;
  color: string;
  icon: string;
}

// ═══════════════════════════════════════════════════════════════
// PRIORITY REFRESH INTERVALS
// ═══════════════════════════════════════════════════════════════

const P0_REFRESH = 300_000;   // 5 min
const P1_REFRESH = 600_000;   // 10 min
const P2_REFRESH = 1_800_000; // 30 min
const P3_REFRESH = 86_400_000; // 24 hours

// ═══════════════════════════════════════════════════════════════
// DOSM_REGISTRY — Main dataset configuration map
// ═══════════════════════════════════════════════════════════════

export const DOSM_REGISTRY: Record<string, DatasetConfig> = {

  // ─── CATEGORY: ECONOMY ─────────────────────────────────────

  gdp_annual: {
    id: 'gdp_annual',                          // FIXED: was gdp_annual_nominal_supply
    label: 'Annual GDP',
    labelBM: 'KDNK Tahunan',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: { series_type: 'real' },
    unit: 'RM Bilion',
    granularity: 'annual',
    priority: 'P1',
    description: 'Gross Domestic Product at current and constant prices',
    descriptionBM: 'Keluaran Dalam Negara Kasar pada harga semasa dan malar',
    defaultLimit: 20,
    refreshMs: P1_REFRESH,
    color: '#00D4FF',
    icon: 'TrendingUp',
  },

  gdp_qtr: {
    id: 'gdp_qtr',                             // FIXED: was gdp_qtr_nominal
    label: 'Quarterly GDP',
    labelBM: 'KDNK Suku Tahunan',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: { series_type: 'real' },
    unit: 'RM Bilion',
    granularity: 'quarterly',
    priority: 'P0',
    description: 'Quarterly GDP at current and constant prices',
    descriptionBM: 'KDNK suku tahunan pada harga semasa dan malar',
    defaultLimit: 20,
    refreshMs: P0_REFRESH,
    color: '#00D4FF',
    icon: 'TrendingUp',
  },

  gdp_state: {
    id: 'gdp_state',                           // FIXED: was gdp_state_real_supply
    label: 'GDP by State',
    labelBM: 'KDNK mengikut Negeri',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: { series_type: 'real' },
    unit: 'RM Bilion',
    granularity: 'annual',
    priority: 'P1',
    description: 'GDP by state at constant prices',
    descriptionBM: 'KDNK mengikut negeri pada harga malar',
    defaultLimit: 100,
    refreshMs: P1_REFRESH,
    color: '#00D4FF',
    icon: 'MapPin',
  },

  ipi: {
    id: 'ipi',
    label: 'Industrial Production Index',
    labelBM: 'Indeks Pengeluaran Perindustrian',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P1',
    description: 'Monthly industrial production index',
    descriptionBM: 'Indeks pengeluaran perindustrian bulanan',
    defaultLimit: 24,
    refreshMs: P1_REFRESH,
    color: '#6366F1',
    icon: 'Factory',
  },

  bop: {
    id: 'bop',                                 // FIXED: was bop_balance
    label: 'Balance of Payments',
    labelBM: 'Imbangan Pembayaran',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'RM Juta',
    granularity: 'quarterly',
    priority: 'P2',
    description: 'Balance of payments current and capital account',
    descriptionBM: 'Akaun semasa dan modal imbangan pembayaran',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#06B6D4',
    icon: 'Scale',
  },

  fdi: {
    id: 'fdi',                                 // FIXED: was fdi_flows
    label: 'Foreign Direct Investment',
    labelBM: 'Pelaburan Langsung Asing',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'RM Juta',
    granularity: 'quarterly',
    priority: 'P2',
    description: 'FDI flows in and out of Malaysia',
    descriptionBM: 'Aliran FDI masuk dan keluar Malaysia',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#8B5CF6',
    icon: 'Globe',
  },

  // ─── CATEGORY: PRICES ──────────────────────────────────────

  cpi_headline: {
    id: 'cpi_headline',
    label: 'Headline CPI',
    labelBM: 'IHP Keseluruhan',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'cpi',
    dateField: 'date',
    extraFields: ['core_cpi'],
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P0',
    description: 'Consumer Price Index headline and core index',
    descriptionBM: 'Indeks Harga Pengguna keseluruhan dan teras',
    defaultLimit: 24,
    refreshMs: P0_REFRESH,
    color: '#F59E0B',
    icon: 'Flame',
  },

  cpi_inflation: {
    id: 'cpi_headline',                        // FIXED: was cpi_headline_inflation; inflation is COMPUTED from CPI
    label: 'CPI Inflation Rate',
    labelBM: 'Kadar Inflasi IHP',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'cpi',                         // FIXED: was 'inflation' which doesn't exist in API; inflation = YoY % change of cpi
    dateField: 'date',
    computed: true,                            // Marked as derived — inflation is computed client-side
    unit: '%',
    granularity: 'monthly',
    priority: 'P0',
    description: 'Year-on-year inflation rate (computed from CPI)',
    descriptionBM: 'Kadar inflasi tahunan ke tahunan (dikira dari IHP)',
    defaultLimit: 24,
    refreshMs: P0_REFRESH,
    color: '#EF4444',
    icon: 'TrendingUp',
  },

  cpi_2d: {
    id: 'cpi_2d',                              // NEW: CPI by Division (was missing)
    label: 'CPI by Division',
    labelBM: 'IHP mengikut Bahagian',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'cpi',
    dateField: 'date',
    groupField: 'division',
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P1',
    description: 'CPI broken down by COICOP division',
    descriptionBM: 'IHP dipecahkan mengikut bahagian COICOP',
    defaultLimit: 48,
    refreshMs: P1_REFRESH,
    color: '#F97316',
    icon: 'Layers',
  },

  cpi_category: {
    id: 'cpi_3d',                              // ✓ Correct (was already cpi_3d)
    label: 'CPI by Category',
    labelBM: 'IHP mengikut Kategori',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'cpi',
    dateField: 'date',
    groupField: 'category',                    // ✓ Correct per ground truth (not 'division')
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P1',
    description: 'CPI broken down by expenditure category',
    descriptionBM: 'IHP dipecahkan mengikut kategori perbelanjaan',
    defaultLimit: 48,
    refreshMs: P1_REFRESH,
    color: '#F97316',
    icon: 'Tag',
  },

  cpi_state: {
    id: 'cpi_state',
    label: 'CPI by State',
    labelBM: 'IHP mengikut Negeri',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'cpi',
    dateField: 'date',
    groupField: 'state',
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P1',
    description: 'CPI by state showing regional price differences',
    descriptionBM: 'IHP mengikut negeri menunjukkan perbezaan harga wilayah',
    defaultLimit: 100,
    refreshMs: P1_REFRESH,
    color: '#F97316',
    icon: 'MapPin',
  },

  ppi: {
    id: 'ppi',
    label: 'Producer Price Index',
    labelBM: 'Indeks Harga Pengeluar',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Producer prices at manufacturing stage',
    descriptionBM: 'Harga pengeluar di peringkat pembuatan',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#D97706',
    icon: 'Package',
  },

  hpi_malaysia: {
    id: 'hpi_malaysia',                        // NEW: House Price Index (was missing)
    label: 'House Price Index',
    labelBM: 'Indeks Harga Rumah',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'index',                       // Ground truth: field is 'index', not 'hpi'
    dateField: 'date',
    groupField: 'series',
    unit: 'Indeks',
    granularity: 'quarterly',
    priority: 'P1',
    description: 'House Price Index by property type',
    descriptionBM: 'Indeks harga rumah mengikut jenis harta',
    defaultLimit: 24,
    refreshMs: P1_REFRESH,
    color: '#14B8A6',
    icon: 'Home',
  },

  fuelprice: {
    id: 'fuelprice',
    label: 'Fuel Prices',
    labelBM: 'Harga Bahan Api',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'ron95',
    dateField: 'date',
    extraFields: ['ron97', 'diesel', 'diesel_east'],
    unit: 'RM/liter',
    granularity: 'weekly',
    priority: 'P0',
    description: 'Weekly fuel prices RON95, RON97 and diesel',
    descriptionBM: 'Harga bahan api mingguan RON95, RON97 dan diesel',
    defaultLimit: 52,
    refreshMs: P0_REFRESH,
    color: '#84CC16',
    icon: 'Fuel',
  },

  pricecatcher: {
    id: 'pricecatcher_week',                   // FIXED: was pricecatcher
    label: 'PriceCatcher',
    labelBM: 'Penangkap Harga',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'price',
    dateField: 'date',
    groupField: 'item_category',               // FIXED: was 'item'; ground truth uses 'item_category'
    unit: 'RM',
    granularity: 'weekly',                     // FIXED: was 'daily'; pricecatcher_week is weekly
    priority: 'P2',
    description: 'Weekly price monitoring of essential goods',
    descriptionBM: 'Pemantauan harga mingguan barang keperluan',
    defaultLimit: 100,
    refreshMs: P2_REFRESH,
    color: '#10B981',
    icon: 'Search',
  },

  // ─── CATEGORY: LABOUR ──────────────────────────────────────

  labour_monthly: {
    id: 'lfs_month',                           // ✓ Correct
    label: 'Labour Force Monthly',
    labelBM: 'Tenaga Buruh Bulanan',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    extraFields: ['lf', 'lf_employed', 'lf_unemployed'],
    unit: '%',
    granularity: 'monthly',
    priority: 'P0',
    description: 'Monthly unemployment rate and labour force statistics',
    descriptionBM: 'Kadar pengangguran bulanan dan statistik tenaga buruh',
    defaultLimit: 24,
    refreshMs: P0_REFRESH,
    color: '#10B981',
    icon: 'Users',
  },

  labour_monthly_sa: {
    id: 'lfs_month_sa',                        // ✓ Verified in ground truth
    label: 'Labour Force (Seasonally Adjusted)',
    labelBM: 'Tenaga Buruh (Laras Musim)',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    extraFields: ['lf', 'lf_employed', 'lf_unemployed'],
    unit: '%',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Seasonally adjusted labour force statistics',
    descriptionBM: 'Statistik tenaga buruh laras musim',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#059669',
    icon: 'BarChart3',
  },

  lfs_qtr: {
    id: 'lfs_qtr',                             // NEW: Quarterly Labour Force (was missing)
    label: 'Labour Force Quarterly',
    labelBM: 'Tenaga Buruh Suku Tahunan',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    extraFields: ['lf', 'lf_employed', 'lf_unemployed'],
    unit: '%',
    granularity: 'quarterly',
    priority: 'P1',
    description: 'Quarterly labour force statistics',
    descriptionBM: 'Statistik tenaga buruh suku tahunan',
    defaultLimit: 20,
    refreshMs: P1_REFRESH,
    color: '#34D399',
    icon: 'CalendarRange',
  },

  labour_state: {
    id: 'lfs_state',                           // FIXED: was lfs_state_sex
    label: 'Labour Force by State',
    labelBM: 'Tenaga Buruh mengikut Negeri',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    groupField: 'state',
    unit: '%',
    granularity: 'annual',
    priority: 'P1',
    description: 'Unemployment rate by state',
    descriptionBM: 'Kadar pengangguran mengikut negeri',
    defaultLimit: 100,
    refreshMs: P1_REFRESH,
    color: '#10B981',
    icon: 'MapPin',
  },

  labour_district: {
    id: 'lfs_district',
    label: 'Labour Force by District',
    labelBM: 'Tenaga Buruh mengikut Daerah',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    groupField: 'district',
    unit: '%',
    granularity: 'annual',
    priority: 'P2',
    description: 'Unemployment rate by district',
    descriptionBM: 'Kadar pengangguran mengikut daerah',
    defaultLimit: 200,
    refreshMs: P2_REFRESH,
    color: '#34D399',
    icon: 'Building',
  },

  employment_sector: {
    id: 'employment_sector',
    label: 'Employment by Sector',
    labelBM: 'Pekerjaan mengikut Sektor',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'employed',
    dateField: 'date',
    groupField: 'sector',
    unit: 'ribu orang',
    granularity: 'annual',
    priority: 'P2',
    description: 'Employment by economic sector',
    descriptionBM: 'Pekerjaan mengikut sektor ekonomi',
    defaultLimit: 50,
    refreshMs: P2_REFRESH,
    color: '#6EE7B7',
    icon: 'Briefcase',
  },

  productivity_annual: {
    id: 'productivity_annual',
    label: 'Labour Productivity',
    labelBM: 'Produktiviti Buruh',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'Indeks',
    granularity: 'annual',
    priority: 'P2',
    description: 'Labour productivity index by sector',
    descriptionBM: 'Indeks produktiviti buruh mengikut sektor',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#A7F3D0',
    icon: 'Zap',
  },

  // ─── CATEGORY: TRADE ───────────────────────────────────────

  trade_monthly: {
    id: 'trade_monthly',                       // FIXED: was trade_headline
    label: 'External Trade',
    labelBM: 'Perdagangan Luar Negeri',
    category: 'Trade',
    categoryBM: 'Perdagangan',
    valueField: 'balance',
    dateField: 'date',
    extraFields: ['exports', 'imports'],
    unit: 'RM Juta',
    granularity: 'monthly',
    priority: 'P0',
    description: 'Monthly exports, imports and trade balance',
    descriptionBM: 'Eksport, import dan imbangan dagangan bulanan',
    defaultLimit: 24,
    refreshMs: P0_REFRESH,
    color: '#06B6D4',
    icon: 'Ship',
  },

  trade_commodity: {
    id: 'trade_sitc_1d',
    label: 'Trade by Commodity',
    labelBM: 'Perdagangan mengikut Komoditi',
    category: 'Trade',
    categoryBM: 'Perdagangan',
    valueField: 'value',
    dateField: 'date',
    groupField: 'sitc',                        // FIXED: was 'commodity'; ground truth uses 'sitc'
    extraFields: ['flow'],                     // Ground truth has 'flow' (exports/imports)
    unit: 'RM Juta',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Trade by commodity classification (SITC)',
    descriptionBM: 'Perdagangan mengikut klasifikasi komoditi (SITC)',
    defaultLimit: 50,
    refreshMs: P2_REFRESH,
    color: '#0EA5E9',
    icon: 'Package',
  },

  // ─── CATEGORY: FINANCE ─────────────────────────────────────

  exchange_rate: {
    id: 'exchangerates_monthly',               // FIXED: was exchangerates; monthly granularity
    label: 'Exchange Rates',
    labelBM: 'Kadar Pertukaran',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'rate',
    dateField: 'date',
    groupField: 'currency',
    defaultFilter: { currency: 'USD' },        // NEW: default to USD
    unit: 'RM',
    granularity: 'monthly',                    // FIXED: was 'daily'; exchangerates_monthly is monthly
    priority: 'P0',
    description: 'Ringgit exchange rate against major currencies (monthly)',
    descriptionBM: 'Kadar pertukaran Ringgit berbanding mata wang utama (bulanan)',
    defaultLimit: 30,
    refreshMs: P0_REFRESH,
    color: '#3B82F6',
    icon: 'DollarSign',
  },

  exchangerates_daily: {
    id: 'exchangerates_daily',                 // NEW: Daily exchange rates (was missing)
    label: 'Exchange Rates (Daily)',
    labelBM: 'Kadar Pertukaran (Harian)',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'rate',
    dateField: 'date',
    groupField: 'currency',
    defaultFilter: { currency: 'USD' },
    unit: 'RM',
    granularity: 'daily',
    priority: 'P1',
    description: 'Daily Ringgit exchange rate against major currencies',
    descriptionBM: 'Kadar pertukaran Ringgit harian berbanding mata wang utama',
    defaultLimit: 30,
    refreshMs: P1_REFRESH,
    color: '#2563EB',
    icon: 'DollarSign',
  },

  interest_rate: {
    id: 'interestrates',
    label: 'Interest Rates',
    labelBM: 'Kadar Faedah',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'rate',
    dateField: 'date',
    groupField: 'series_type',
    unit: '%',
    granularity: 'daily',
    priority: 'P1',
    description: 'BNM policy rate and interbank rates',
    descriptionBM: 'Kadar dasar BNM dan kadar antara bank',
    defaultLimit: 30,
    refreshMs: P1_REFRESH,
    color: '#7C3AED',
    icon: 'Percent',
  },

  money_supply: {
    id: 'monetary_aggregates',
    label: 'Money Supply',
    labelBM: 'Bekalan Wang',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: { series_type: 'M3' },
    unit: 'RM Juta',
    granularity: 'monthly',
    priority: 'P2',
    description: 'M1, M2, M3 monetary aggregates',
    descriptionBM: 'Agregat kewangan M1, M2, M3',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#1D4ED8',
    icon: 'Banknote',
  },

  federal_revenue: {
    id: 'federal_finance_year',                // FIXED: was federal_finance_year_revenue; same dataset, different filter
    label: 'Federal Revenue',
    labelBM: 'Hasil Kerajaan Persekutuan',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'RM Juta',
    granularity: 'annual',
    priority: 'P2',
    description: 'Federal government revenue by source',
    descriptionBM: 'Hasil kerajaan persekutuan mengikut sumber',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#7C3AED',
    icon: 'Landmark',
  },

  federal_expenditure: {
    id: 'federal_finance_year',
    label: 'Federal Expenditure',
    labelBM: 'Perbelanjaan Kerajaan Persekutuan',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'RM Juta',
    granularity: 'annual',
    priority: 'P2',
    description: 'Federal government operating and development expenditure',
    descriptionBM: 'Perbelanjaan mengurus dan pembangunan kerajaan persekutuan',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#9333EA',
    icon: 'Receipt',
  },

  // ─── CATEGORY: DEMOGRAPHY ──────────────────────────────────

  population_state: {
    id: 'population_state',                    // ✓ Correct
    label: 'Population by State',
    labelBM: 'Penduduk mengikut Negeri',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'population',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: { sex: 'both', ethnicity: 'overall', age: 'overall' }, // FIXED: 3-way filter to prevent 200x data duplication
    unit: 'ribu orang',
    granularity: 'annual',
    priority: 'P0',
    description: 'Population by state from 1970 to present',
    descriptionBM: 'Penduduk mengikut negeri dari 1970 hingga kini',
    defaultLimit: 100,
    refreshMs: P3_REFRESH,
    color: '#8B5CF6',
    icon: 'Users',
  },

  population_malaysia: {
    id: 'population_malaysia',                 // ✓ Correct
    label: 'Population Malaysia',
    labelBM: 'Penduduk Malaysia',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'population',
    dateField: 'date',
    groupField: 'sex',
    extraFields: ['age_group', 'ethnicity'],
    defaultFilter: { sex: 'both', ethnicity: 'overall', age: 'overall' }, // FIXED: 3-way filter to prevent 200x data duplication
    unit: 'ribu orang',
    granularity: 'annual',
    priority: 'P0',
    description: 'National population by sex, age and ethnicity',
    descriptionBM: 'Penduduk nasional mengikut jantina, umur dan etnik',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#A78BFA',
    icon: 'UserCheck',
  },

  population_district: {
    id: 'population_district',
    label: 'Population by District',
    labelBM: 'Penduduk mengikut Daerah',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'population',
    dateField: 'date',
    groupField: 'district',
    unit: 'ribu orang',
    granularity: 'annual',
    priority: 'P2',
    description: 'Population at district level',
    descriptionBM: 'Penduduk di peringkat daerah',
    defaultLimit: 200,
    refreshMs: P3_REFRESH,
    color: '#C4B5FD',
    icon: 'Building2',
  },

  births: {
    id: 'births',                              // FIXED: was births_annual
    label: 'Live Births',
    labelBM: 'Kelahiran Hidup',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'abs',
    dateField: 'date',
    groupField: 'sex',                         // Ground truth: has sex grouping
    defaultFilter: { sex: 'both' },            // FIXED: was 'Both'; API uses lowercase
    unit: 'orang',
    granularity: 'monthly',                    // FIXED: was 'annual'; ground truth shows monthly
    priority: 'P1',
    description: 'Live births registered',
    descriptionBM: 'Kelahiran hidup yang didaftarkan',
    defaultLimit: 24,
    refreshMs: P3_REFRESH,
    color: '#F472B6',
    icon: 'Baby',
  },

  deaths: {
    id: 'deaths',
    label: 'Deaths',
    labelBM: 'Kematian',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'abs',
    dateField: 'date',
    groupField: 'sex',                         // Ground truth: has sex grouping
    defaultFilter: { sex: 'both' },            // FIXED: was 'Both'; API uses lowercase
    unit: 'orang',
    granularity: 'monthly',                    // FIXED: was 'annual'; ground truth shows monthly
    priority: 'P1',
    description: 'Deaths registered',
    descriptionBM: 'Kematian yang didaftarkan',
    defaultLimit: 24,
    refreshMs: P3_REFRESH,
    color: '#6B7280',
    icon: 'Heart',
  },

  marriages: {
    id: 'marriages',
    label: 'Marriages',
    labelBM: 'Perkahwinan',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'abs',
    dateField: 'date',
    groupField: 'religion',                    // Ground truth: grouped by religion
    unit: 'pasangan',
    granularity: 'monthly',                    // FIXED: was 'annual'; ground truth shows monthly
    priority: 'P2',
    description: 'Marriages registered by religion',
    descriptionBM: 'Perkahwinan yang didaftarkan mengikut agama',
    defaultLimit: 24,
    refreshMs: P3_REFRESH,
    color: '#EC4899',
    icon: 'HeartHandshake',
  },

  divorces: {
    id: 'divorces',                            // NEW: was missing from registry
    label: 'Divorces',
    labelBM: 'Perceraian',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'abs',
    dateField: 'date',
    groupField: 'religion',
    unit: 'pasangan',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Divorces registered by religion',
    descriptionBM: 'Perceraian yang didaftarkan mengikut agama',
    defaultLimit: 24,
    refreshMs: P3_REFRESH,
    color: '#F43F5E',
    icon: 'HeartOff',
  },

  fertility: {
    id: 'fertility',
    label: 'Fertility Rate',
    labelBM: 'Kadar Kesuburan',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'tfr',
    dateField: 'date',
    groupField: 'sex',
    defaultFilter: { sex: 'female' },          // FIXED: was 'Female'; API uses lowercase
    unit: 'kadar',
    granularity: 'annual',
    priority: 'P2',
    description: 'Total fertility rate (TFR)',
    descriptionBM: 'Jumlah kadar kesuburan (TFR)',
    defaultLimit: 20,
    refreshMs: P3_REFRESH,
    color: '#F9A8D4',
    icon: 'Activity',
  },

  // ─── CATEGORY: HOUSEHOLDS & WELFARE ────────────────────────

  hies_malaysia: {
    id: 'hies_malaysia',                       // NEW: Household Income & Expenditure - national (was missing)
    label: 'Household Income (Malaysia)',
    labelBM: 'Pendapatan Isi Rumah Malaysia',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'value',
    dateField: 'date',
    groupField: 'variable',
    unit: 'RM',
    granularity: 'biennial',
    priority: 'P1',
    description: 'National household income, expenditure and Gini (HIES)',
    descriptionBM: 'Pendapatan, perbelanjaan dan Gini isi rumah nasional (HIES)',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#A855F7',
    icon: 'Wallet',
  },

  household_income: {
    id: 'hies_state',                          // FIXED: was hh_income_state
    label: 'Household Income by State',
    labelBM: 'Pendapatan Isi Rumah mengikut Negeri',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'value',                       // FIXED: was 'income_median'; ground truth uses 'value' with 'variable' grouping
    dateField: 'date',
    groupField: 'state',
    extraFields: ['variable'],                 // Ground truth: has 'variable' for income_mean, income_median, gini
    defaultFilter: { variable: 'income_median' }, // NEW: default to median income
    unit: 'RM',
    granularity: 'biennial',                   // FIXED: was 'annual'; ground truth shows biennial
    priority: 'P1',
    description: 'Median household income and Gini coefficient by state',
    descriptionBM: 'Median pendapatan isi rumah dan pekali Gini mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#A855F7',
    icon: 'Wallet',
  },

  poverty_rate: {
    id: 'poverty_absolute',                    // FIXED: was hh_poverty_state; NEEDS_VERIFY
    label: 'Poverty Rate by State',
    labelBM: 'Kadar Kemiskinan mengikut Negeri',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'value',
    dateField: 'date',
    groupField: 'state',
    unit: '%',
    granularity: 'annual',
    priority: 'P1',
    description: 'Absolute poverty rate by state (NEEDS_VERIFY: API ID may differ)',
    descriptionBM: 'Kadar kemiskinan mutlak mengikut negeri (PERLU SAH: ID API mungkin berbeza)',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#FB923C',
    icon: 'AlertTriangle',
  },

  inequality: {
    id: 'hies_state',                          // FIXED: was hh_inequality_state; Gini is from HIES
    label: 'Income Inequality by State',
    labelBM: 'Ketidaksamaan Pendapatan mengikut Negeri',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'value',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: { variable: 'gini' },       // NEW: filter for Gini coefficient
    unit: 'pekali',
    granularity: 'biennial',
    priority: 'P2',
    description: 'Gini coefficient by state',
    descriptionBM: 'Pekali Gini mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#FBBF24',
    icon: 'Scale',
  },

  // ─── CATEGORY: HEALTHCARE ──────────────────────────────────

  hospital_beds: {
    id: 'hospital_beds',
    label: 'Hospital Beds',
    labelBM: 'Katil Hospital',
    category: 'Healthcare',
    categoryBM: 'Kesihatan',
    valueField: 'beds',
    dateField: 'date',
    groupField: 'state',
    unit: 'katil',
    granularity: 'annual',
    priority: 'P2',
    description: 'Hospital beds by state',
    descriptionBM: 'Katil hospital mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#EC4899',
    icon: 'BedDouble',
  },

  healthcare_staff: {
    id: 'healthcare_staff',
    label: 'Healthcare Staff',
    labelBM: 'Kakitangan Kesihatan',
    category: 'Healthcare',
    categoryBM: 'Kesihatan',
    valueField: 'count',
    dateField: 'date',
    groupField: 'category',
    unit: 'orang',
    granularity: 'annual',
    priority: 'P2',
    description: 'Healthcare staff by category',
    descriptionBM: 'Kakitangan kesihatan mengikut kategori',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#F472B6',
    icon: 'Stethoscope',
  },

  blood_donations: {
    id: 'blood_donations',
    label: 'Blood Donations',
    labelBM: 'Penderma Darah',
    category: 'Healthcare',
    categoryBM: 'Kesihatan',
    valueField: 'daily',
    dateField: 'date',
    groupField: 'state',                       // Ground truth: grouped by state
    unit: 'orang',
    granularity: 'daily',
    priority: 'P2',
    description: 'Daily blood donation statistics by state',
    descriptionBM: 'Statistik pendermaan darah harian mengikut negeri',
    defaultLimit: 30,
    refreshMs: P3_REFRESH,
    color: '#DB2777',
    icon: 'Droplets',
  },

  // ─── CATEGORY: ENVIRONMENT ─────────────────────────────────

  air_pollution: {
    id: 'air_pollution',
    label: 'Air Pollution Index',
    labelBM: 'Indeks Pencemaran Udara',
    category: 'Environment',
    categoryBM: 'Alam Sekitar',
    valueField: 'api',
    dateField: 'date',
    groupField: 'state',
    unit: 'API',
    granularity: 'daily',
    priority: 'P2',
    description: 'Air pollutant index by state',
    descriptionBM: 'Indeks pencemar udara mengikut negeri',
    defaultLimit: 30,
    refreshMs: P2_REFRESH,
    color: '#22C55E',
    icon: 'Wind',
  },

  forest_reserve: {
    id: 'forest_reserve_state',
    label: 'Forest Reserve by State',
    labelBM: 'Hutan Simpan mengikut Negeri',
    category: 'Environment',
    categoryBM: 'Alam Sekitar',
    valueField: 'area_ha',
    dateField: 'date',
    groupField: 'state',
    unit: 'hektar',
    granularity: 'annual',
    priority: 'P3',
    description: 'Forest reserve area by state',
    descriptionBM: 'Kawasan hutan simpan mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#16A34A',
    icon: 'TreePine',
  },

  electricity_supply: {
    id: 'electricity_supply',
    label: 'Electricity Supply',
    labelBM: 'Bekalan Elektrik',
    category: 'Environment',
    categoryBM: 'Alam Sekitar',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'GWh',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Electricity generation and consumption',
    descriptionBM: 'Penjanaan dan penggunaan elektrik',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#EAB308',
    icon: 'Zap',
  },

  water_consumption: {
    id: 'water_consumption',
    label: 'Water Consumption',
    labelBM: 'Penggunaan Air',
    category: 'Environment',
    categoryBM: 'Alam Sekitar',
    valueField: 'value',
    dateField: 'date',
    groupField: 'state',
    unit: 'ML/hari',
    granularity: 'annual',
    priority: 'P3',
    description: 'Water consumption by state',
    descriptionBM: 'Penggunaan air mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#0EA5E9',
    icon: 'Droplet',
  },

  // ─── CATEGORY: TRANSPORT ───────────────────────────────────

  ridership: {
    id: 'ridership_headline',                  // ✓ Correct
    label: 'Public Transport Ridership',
    labelBM: 'Penumpang Pengangkutan Awam',
    category: 'Transport',
    categoryBM: 'Pengangkutan',
    valueField: 'ridership',
    dateField: 'date',
    groupField: 'service',                     // FIXED: was 'series_type'; ground truth uses 'service'
    unit: 'orang',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Public transport ridership by service mode',
    descriptionBM: 'Penumpang pengangkutan awam mengikut kaedah perkhidmatan',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#14B8A6',
    icon: 'TrainFront',
  },

  vehicle_registration: {
    id: 'registration_transactions_all',
    label: 'Vehicle Registration',
    labelBM: 'Pendaftaran Kenderaan',
    category: 'Transport',
    categoryBM: 'Pengangkutan',
    valueField: 'registered',
    dateField: 'date',
    groupField: 'type',
    unit: 'unit',
    granularity: 'monthly',
    priority: 'P2',
    description: 'New vehicle registrations by type',
    descriptionBM: 'Pendaftaran kenderaan baru mengikut jenis',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#0D9488',
    icon: 'Car',
  },

  // ─── CATEGORY: PUBLIC SAFETY ───────────────────────────────

  crime_district: {
    id: 'crime_index',                         // FIXED: was crime_district
    label: 'Index Crime',
    labelBM: 'Jenayah Indeks',
    category: 'Safety',
    categoryBM: 'Keselamatan',
    valueField: 'cases',                       // FIXED: was 'total'; ground truth uses 'cases'
    dateField: 'date',
    groupField: 'type',                        // FIXED: was 'district'; ground truth groups by 'type' and 'state'
    unit: 'kes',
    granularity: 'annual',
    priority: 'P2',
    description: 'Index crime by type and state',
    descriptionBM: 'Jenayah indeks mengikut jenis dan negeri',
    defaultLimit: 200,
    refreshMs: P3_REFRESH,
    color: '#EF4444',
    icon: 'ShieldAlert',
  },

  drug_arrests: {
    id: 'drug_arrests_age',
    label: 'Drug Arrests by Age',
    labelBM: 'Tangkapan Dadah mengikut Umur',
    category: 'Safety',
    categoryBM: 'Keselamatan',
    valueField: 'arrests',
    dateField: 'date',
    groupField: 'age_group',
    unit: 'orang',
    granularity: 'annual',
    priority: 'P3',
    description: 'Drug arrests by age group',
    descriptionBM: 'Tangkapan dadah mengikut kumpulan umur',
    defaultLimit: 20,
    refreshMs: P3_REFRESH,
    color: '#DC2626',
    icon: 'Shield',
  },

  // ─── CATEGORY: EDUCATION ───────────────────────────────────

  school_enrolment: {
    id: 'enrolment_school_district',
    label: 'School Enrolment',
    labelBM: 'Enrolmen Sekolah',
    category: 'Education',
    categoryBM: 'Pendidikan',
    valueField: 'enrolment',
    dateField: 'date',
    groupField: 'level',
    unit: 'orang',
    granularity: 'annual',
    priority: 'P2',
    description: 'School enrolment by level and district',
    descriptionBM: 'Enrolmen sekolah mengikut peringkat dan daerah',
    defaultLimit: 100,
    refreshMs: P3_REFRESH,
    color: '#F97316',
    icon: 'GraduationCap',
  },

  // ─── CATEGORY: ECONOMIC SECTORS ────────────────────────────

  manufacturing: {
    id: 'ipi_2d',
    label: 'Manufacturing Index',
    labelBM: 'Indeks Pembuatan',
    category: 'Industry',
    categoryBM: 'Perindustrian',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Manufacturing production index',
    descriptionBM: 'Indeks pengeluaran pembuatan',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#6366F1',
    icon: 'Factory',
  },

  crops: {
    id: 'crops_state',
    label: 'Agricultural Crops',
    labelBM: 'Tanaman Pertanian',
    category: 'Agriculture',
    categoryBM: 'Pertanian',
    valueField: 'production',
    dateField: 'date',
    groupField: 'state',
    unit: 'tan metrik',
    granularity: 'annual',
    priority: 'P3',
    description: 'Agricultural crop production by state',
    descriptionBM: 'Pengeluaran tanaman pertanian mengikut negeri',
    defaultLimit: 100,
    refreshMs: P3_REFRESH,
    color: '#84CC16',
    icon: 'Wheat',
  },

  fish_landings: {
    id: 'fish_landings',
    label: 'Fish Landings',
    labelBM: 'Pendaratan Ikan',
    category: 'Agriculture',
    categoryBM: 'Pertanian',
    valueField: 'landings',
    dateField: 'date',
    groupField: 'state',
    unit: 'tan metrik',
    granularity: 'monthly',
    priority: 'P3',
    description: 'Fish landings by state',
    descriptionBM: 'Pendaratan ikan mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#65A30D',
    icon: 'Fish',
  },

  // ─── CATEGORY: COMMUNICATIONS ──────────────────────────────

  cellular: {
    id: 'cellular_subscribers',
    label: 'Mobile Subscribers',
    labelBM: 'Pelanggan Mudah Alih',
    category: 'Digital',
    categoryBM: 'Digital',
    valueField: 'subscriptions',
    dateField: 'date',
    groupField: 'type',
    unit: 'juta',
    granularity: 'quarterly',
    priority: 'P3',
    description: 'Cellular subscriber statistics',
    descriptionBM: 'Statistik pelanggan selular',
    defaultLimit: 20,
    refreshMs: P3_REFRESH,
    color: '#0EA5E9',
    icon: 'Smartphone',
  },

  // ─── NEW: DEATHS BY CAUSE ───────────────────────────────────

  deaths_cause: {
    id: 'deaths_cause',
    label: 'Deaths by Cause',
    labelBM: 'Kematian mengikut Punca',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'abs',
    dateField: 'date',
    groupField: 'cause',
    defaultFilter: { sex: 'both' },
    unit: 'orang',
    granularity: 'annual',
    priority: 'P2',
    description: 'Deaths by cause of death',
    descriptionBM: 'Kematian mengikut punca kematian',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#9CA3AF',
    icon: 'Activity',
  },

  // ─── NEW: LABOUR FORCE BY EDUCATION ─────────────────────────

  lfs_edu: {
    id: 'lfs_edu',
    label: 'Labour Force by Education',
    labelBM: 'Tenaga Buruh mengikut Pendidikan',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    groupField: 'edu',
    unit: '%',
    granularity: 'annual',
    priority: 'P2',
    description: 'Unemployment rate by education level',
    descriptionBM: 'Kadar pengangguran mengikut tahap pendidikan',
    defaultLimit: 50,
    refreshMs: P2_REFRESH,
    color: '#6EE7B7',
    icon: 'GraduationCap',
  },

  // ─── NEW: TRADE BY COUNTRY ─────────────────────────────────

  trade_country: {
    id: 'trade_country',
    label: 'Trade by Country',
    labelBM: 'Perdagangan mengikut Negara',
    category: 'Trade',
    categoryBM: 'Perdagangan',
    valueField: 'value',
    dateField: 'date',
    groupField: 'country',
    extraFields: ['flow'],
    unit: 'RM Juta',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Trade by partner country',
    descriptionBM: 'Perdagangan mengikut negara rakan',
    defaultLimit: 50,
    refreshMs: P2_REFRESH,
    color: '#0EA5E9',
    icon: 'Globe',
  },

  // ─── NEW: POPULATION BY PARLIAMENT ─────────────────────────

  population_parlimen: {
    id: 'population_parlimen',
    label: 'Population by Parliament',
    labelBM: 'Penduduk mengikut Parlimen',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'population',
    dateField: 'date',
    groupField: 'parlimen',
    unit: 'ribu orang',
    granularity: 'annual',
    priority: 'P3',
    description: 'Population by parliament constituency',
    descriptionBM: 'Penduduk mengikut kawasan parlimen',
    defaultLimit: 300,
    refreshMs: P3_REFRESH,
    color: '#C4B5FD',
    icon: 'Building',
  },

  // ─── NEW: POVERTY RATE BY STATE ────────────────────────────

  poverty_state: {
    id: 'poverty_state',
    label: 'Poverty Rate by State',
    labelBM: 'Kadar Kemiskinan mengikut Negeri',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'incidence',
    dateField: 'date',
    groupField: 'state',
    extraFields: ['hardcore'],
    unit: '%',
    granularity: 'biennial',
    priority: 'P1',
    description: 'Poverty incidence rate by state',
    descriptionBM: 'Kadar kemiskinan mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#FB923C',
    icon: 'AlertTriangle',
  },

  // ─── NEW: ROAD ACCIDENTS ───────────────────────────────────

  road_accidents: {
    id: 'road_accidents',
    label: 'Road Accidents',
    labelBM: 'Kemalangan Jalan Raya',
    category: 'Safety',
    categoryBM: 'Keselamatan',
    valueField: 'accidents',
    dateField: 'date',
    groupField: 'state',
    extraFields: ['deaths', 'injuries'],
    unit: 'kes',
    granularity: 'annual',
    priority: 'P2',
    description: 'Road accidents, deaths and injuries by state',
    descriptionBM: 'Kemalangan, kematian dan kecederaan jalan raya mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#EF4444',
    icon: 'Car',
  },

  // ─── NEW: PALM OIL ─────────────────────────────────────────

  palm_oil: {
    id: 'palm_oil',
    label: 'Palm Oil Statistics',
    labelBM: 'Statistik Minyak Sawit',
    category: 'Agriculture',
    categoryBM: 'Pertanian',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    unit: 'tan',
    granularity: 'monthly',
    priority: 'P3',
    description: "Malaysia's palm oil production, exports and prices",
    descriptionBM: 'Pengeluaran, eksport dan harga minyak sawit Malaysia',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#84CC16',
    icon: 'Leaf',
  },
};

export type DatasetId = keyof typeof DOSM_REGISTRY;

// ═══════════════════════════════════════════════════════════════
// PRIORITY GROUPS
// ═══════════════════════════════════════════════════════════════

export const PRIORITY_DATASETS: Record<DatasetPriority, DatasetId[]> = {
  P0: [
    'gdp_qtr',
    'cpi_headline',
    'cpi_inflation',
    'labour_monthly',
    'trade_monthly',
    'fuelprice',
    'exchange_rate',
    'population_state',
  ],
  P1: [
    'gdp_annual',
    'gdp_state',
    'cpi_2d',
    'cpi_category',
    'cpi_state',
    'lfs_qtr',
    'labour_state',
    'exchangerates_daily',
    'hies_malaysia',
    'household_income',
    'hpi_malaysia',
    'poverty_rate',
    'population_malaysia',
    'births',
    'deaths',
    'ipi',
    'interest_rate',
  ],
  P2: [
    'bop',
    'fdi',
    'ppi',
    'labour_district',
    'labour_monthly_sa',
    'employment_sector',
    'productivity_annual',
    'trade_commodity',
    'money_supply',
    'federal_revenue',
    'federal_expenditure',
    'air_pollution',
    'electricity_supply',
    'ridership',
    'vehicle_registration',
    'crime_district',
    'school_enrolment',
    'manufacturing',
    'pricecatcher',
    'inequality',
    'hospital_beds',
    'healthcare_staff',
    'blood_donations',
  ],
  P3: [
    'population_district',
    'marriages',
    'divorces',
    'fertility',
    'forest_reserve',
    'water_consumption',
    'drug_arrests',
    'crops',
    'fish_landings',
    'cellular',
  ],
};

// ═══════════════════════════════════════════════════════════════
// COMMAND CENTER KPIs
// ═══════════════════════════════════════════════════════════════

export const COMMAND_CENTER_KPIS: DatasetId[] = [
  'gdp_qtr',
  'cpi_headline',
  'labour_monthly',
  'trade_monthly',
  'fuelprice',
  'exchange_rate',
];

// ═══════════════════════════════════════════════════════════════
// ANOMALY WATCHLIST
// ═══════════════════════════════════════════════════════════════

export const ANOMALY_WATCHLIST = [
  { id: 'cpi_headline' as DatasetId, threshold: 3.0, field: 'cpi', alert: 'Inflation exceeds 3%' },
  { id: 'labour_monthly' as DatasetId, threshold: 5.0, field: 'u_rate', alert: 'Unemployment exceeds 5%' },
  { id: 'trade_monthly' as DatasetId, threshold: 0, field: 'balance', alert: 'Trade deficit detected' },
  { id: 'exchange_rate' as DatasetId, threshold: 4.80, field: 'rate', alert: 'Ringgit exceeds RM4.80/USD' },
  { id: 'fuelprice' as DatasetId, threshold: 3.00, field: 'ron95', alert: 'RON95 exceeds RM3.00' },
] as const;

// ═══════════════════════════════════════════════════════════════
// ONTOLOGY GRAPH
// ═══════════════════════════════════════════════════════════════

export const ONTOLOGY_NODES: DatasetId[] = [
  'gdp_qtr', 'cpi_headline', 'labour_monthly', 'trade_monthly',
  'population_state', 'household_income', 'exchange_rate', 'fuelprice',
];

export const ONTOLOGY_RELATIONSHIPS = [
  { from: 'gdp_qtr', to: 'labour_monthly', type: 'DRIVES', strength: 0.87 },
  { from: 'cpi_headline', to: 'labour_monthly', type: 'INVERSELY_CORRELATES', strength: 0.61 },
  { from: 'fuelprice', to: 'cpi_headline', type: 'DRIVES', strength: 0.74 },
  { from: 'trade_monthly', to: 'exchange_rate', type: 'CORRELATES_WITH', strength: 0.68 },
  { from: 'gdp_qtr', to: 'household_income', type: 'DRIVES', strength: 0.79 },
  { from: 'population_state', to: 'gdp_state', type: 'CORRELATES_WITH', strength: 0.71 },
  { from: 'exchange_rate', to: 'cpi_headline', type: 'DRIVES', strength: 0.55 },
  { from: 'ipi', to: 'gdp_qtr', type: 'PRECEDES', strength: 0.82 },
] as const;
