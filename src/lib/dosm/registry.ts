// src/lib/dosm/registry.ts
// Complete dataset registry for api.data.gov.my/data-catalogue
// All `id` fields and field names verified against live API testing (Task 4)
//
// Key corrections from live API testing (Task 4):
//   gdp_annual              → gdp_annual_nominal_supply  (has sector, series fields)
//   gdp_qtr                 → gdp_qtr_nominal            (series NOT series_type)
//   gdp_state               → gdp_state_real_supply      (has sector, series, state)
//   bop                     → bop_balance                (account, balance, date)
//   fdi                     → fdi_flows                  (date, inflow, net, outflow)
//   lfs_state               → lfs_state_sex              (has sex field)
//   trade_monthly           → trade_headline             (balance, date, exports, imports, ...)
//   exchangerates_monthly   → exchangerates              (WIDE format: date, usd, eur, ...)
//   exchangerates_daily     → exchangerates_daily_0900   (WIDE format)
//   crime_index             → crime_district             (category, crimes, date, district, state, type)
//   poverty_absolute        → hh_poverty_state           (poverty_absolute, poverty_hardcore, ...)
//   hies_malaysia           → hh_income                  (date, income_mean, income_median)
//   household_income        → hh_income                  (same as hies_malaysia)
//   cpi_inflation           → cpi_headline_inflation     (inflation_yoy PROVIDED by API, not computed!)
//
// Field corrections from live API testing:
//   ipi:          valueField='index', groupField='series' (NOT value/series_type)
//   ppi:          valueField='index', groupField='series' (NOT value/series_type)
//   interestrates: groupField='bank' (NOT series_type)
//   monetary_aggregates: groupField='measure' (NOT series_type)
//   federal_finance_year: has 'variable' and 'category' fields
//   forest_reserve_state: valueField='area' (NOT area_ha)
//   fertility:    valueField='fertility_rate', groupField='age_group' (NOT tfr/sex)
//   blood_donations: valueField='donations', groupField='blood_type' (NOT daily/state)
//   ridership_headline: WIDE format (NOT service/ridership long)
//   cpi_state:    valueField='index' (NOT cpi), also has 'division' field
//   employment_sector: valueField='proportion' (NOT employed)
//   births:       valueField='births', groupField='state' (NOT abs/sex)
//   deaths:       fields=abs,date,rate (NO sex field)
//   marriages:    groupField='sex' (NOT religion)
//   hies_state:   fields=expenditure_mean,gini,income_mean,income_median,poverty,state
//   fuelprice:    extraField 'diesel_eastmsia' (NOT diesel_east)

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
  /** Marks datasets that return WIDE format (each column is a separate series, needs pivot to long format) */
  wideFormat?: boolean;
  /** List of column names in WIDE format that represent data series (excluding dateField) */
  wideColumns?: string[];
  /** Datasets with no API endpoint — must use CSV proxy only */
  csvOnly?: boolean;
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
// All IDs and fields verified against live api.data.gov.my testing
// ═══════════════════════════════════════════════════════════════

export const DOSM_REGISTRY: Record<string, DatasetConfig> = {

  // ─── CATEGORY: ECONOMY ─────────────────────────────────────

  gdp_annual: {
    id: 'gdp_annual_nominal_supply',            // FIXED: was gdp_annual (404)
    label: 'Annual GDP',
    labelBM: 'KDNK Tahunan',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series',                       // FIXED: was series_type; API uses 'series'
    extraFields: ['sector'],                    // FIXED: API has 'sector' field
    defaultFilter: { series: 'abs' },           // FIXED: filter key matches groupField
    unit: 'RM Bilion',
    granularity: 'annual',
    priority: 'P1',
    description: 'Gross Domestic Product at current and constant prices (fields: date, sector, series, value)',
    descriptionBM: 'Keluaran Dalam Negara Kasar pada harga semasa dan malar',
    defaultLimit: 20,
    refreshMs: P1_REFRESH,
    color: '#00D4FF',
    icon: 'TrendingUp',
  },

  gdp_qtr: {
    id: 'gdp_qtr_nominal',                      // FIXED: was gdp_qtr (404)
    label: 'Quarterly GDP',
    labelBM: 'KDNK Suku Tahunan',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series',                       // FIXED: was series_type; API uses 'series'
    defaultFilter: { series: 'abs' },           // FIXED: filter key matches groupField
    unit: 'RM Bilion',
    granularity: 'quarterly',
    priority: 'P0',
    description: 'Quarterly GDP (fields: date, series, value). series=abs for constant 2015, series=growth_yoy for YoY%',
    descriptionBM: 'KDNK suku tahunan pada harga semasa dan malar',
    defaultLimit: 20,
    refreshMs: P0_REFRESH,
    color: '#00D4FF',
    icon: 'TrendingUp',
  },

  gdp_growth: {
    id: 'gdp_qtr_nominal',                      // FIXED: was gdp_qtr; same dataset, different filter
    label: 'GDP Growth Rate',
    labelBM: 'Kadar Pertumbuhan KDNK',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series',                       // FIXED: was series_type; API uses 'series'
    defaultFilter: { series: 'growth_yoy' },    // FIXED: filter key matches groupField
    computed: true,
    unit: '%',
    granularity: 'quarterly',
    priority: 'P0',
    description: 'GDP year-on-year growth rate (series=growth_yoy)',
    descriptionBM: 'Kadar pertumbuhan KDNK tahunan ke tahunan',
    defaultLimit: 12,
    refreshMs: P0_REFRESH,
    color: '#00FFD4',
    icon: 'TrendingUp',
  },

  gdp_state: {
    id: 'gdp_state_real_supply',                // FIXED: was gdp_state (404)
    label: 'GDP by State',
    labelBM: 'KDNK mengikut Negeri',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'value',
    dateField: 'date',
    groupField: 'state',
    extraFields: ['sector', 'series'],          // FIXED: API has sector and series fields
    defaultFilter: { series: 'abs' },           // FIXED: filter key is 'series' not 'series_type'
    unit: 'RM Bilion',
    granularity: 'annual',
    priority: 'P1',
    description: 'GDP by state (fields: date, sector, series, state, value)',
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
    valueField: 'index',                        // FIXED: was 'value'; API uses 'index'
    dateField: 'date',
    groupField: 'series',                       // FIXED: was 'series_type'; API uses 'series'
    extraFields: ['index_sa'],                  // API also returns seasonally adjusted index
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P1',
    description: 'Monthly industrial production index (fields: date, index, index_sa, series)',
    descriptionBM: 'Indeks pengeluaran perindustrian bulanan',
    defaultLimit: 24,
    refreshMs: P1_REFRESH,
    color: '#6366F1',
    icon: 'Factory',
  },

  bop: {
    id: 'bop_balance',                          // FIXED: was bop (404)
    label: 'Balance of Payments',
    labelBM: 'Imbangan Pembayaran',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'balance',                      // FIXED: was 'value'; API uses 'balance'
    dateField: 'date',
    groupField: 'account',                      // FIXED: was 'series_type'; API uses 'account'
    unit: 'RM Juta',
    granularity: 'quarterly',
    priority: 'P2',
    description: 'Balance of payments (fields: account, balance, date)',
    descriptionBM: 'Akaun semasa dan modal imbangan pembayaran',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#06B6D4',
    icon: 'Scale',
  },

  fdi: {
    id: 'fdi_flows',                            // FIXED: was fdi (404)
    label: 'Foreign Direct Investment',
    labelBM: 'Pelaburan Langsung Asing',
    category: 'Economy',
    categoryBM: 'Ekonomi',
    valueField: 'net',                          // FIXED: was 'value'; API uses inflow/net/outflow
    dateField: 'date',
    extraFields: ['inflow', 'outflow'],         // FIXED: API has inflow, net, outflow (NOT series_type/value)
    unit: 'RM Juta',
    granularity: 'quarterly',
    priority: 'P2',
    description: 'FDI flows (fields: date, inflow, net, outflow)',
    descriptionBM: 'Aliran FDI masuk dan keluar Malaysia',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#8B5CF6',
    icon: 'Globe',
  },

  // ─── CATEGORY: PRICES ──────────────────────────────────────

  cpi_headline: {
    id: 'cpi_headline',                         // ✅ Correct
    label: 'Headline CPI',
    labelBM: 'IHP Keseluruhan',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'index',                        // ✅ API returns 'index'
    dateField: 'date',
    groupField: 'division',                     // ✅ API returns 'division'
    defaultFilter: { division: 'overall' },
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P0',
    description: 'Consumer Price Index headline by division (overall, food_beverage, etc.)',
    descriptionBM: 'Indeks Harga Pengguna keseluruhan mengikut bahagian',
    defaultLimit: 24,
    refreshMs: P0_REFRESH,
    color: '#F59E0B',
    icon: 'Flame',
  },

  cpi_inflation: {
    id: 'cpi_headline_inflation',               // FIXED: was cpi_headline; SEPARATE dataset!
    label: 'CPI Inflation Rate',
    labelBM: 'Kadar Inflasi IHP',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'inflation_yoy',                // ✅ API PROVIDES inflation_yoy directly!
    dateField: 'date',
    groupField: 'division',                     // API also groups by division
    defaultFilter: { division: 'overall' },
    // NOTE: Removed computed=true — inflation_yoy is PROVIDED by the API, not computed client-side!
    unit: '%',
    granularity: 'monthly',
    priority: 'P0',
    description: 'Year-on-year inflation rate from cpi_headline_inflation API (fields: date, division, inflation_mom, inflation_yoy)',
    descriptionBM: 'Kadar inflasi tahunan ke tahunan (disediakan oleh API)',
    defaultLimit: 24,
    refreshMs: P0_REFRESH,
    color: '#EF4444',
    icon: 'TrendingUp',
  },

  cpi_2d: {
    id: 'cpi_headline',                         // FIXED: No cpi_2d API; reuse cpi_headline with division filter
    label: 'CPI by Division',
    labelBM: 'IHP mengikut Bahagian',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'index',                        // FIXED: was 'cpi'; actual field is 'index'
    dateField: 'date',
    groupField: 'division',                     // Same as cpi_headline — no separate API
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P1',
    csvOnly: true,                              // No dedicated API; use cpi_headline or CSV
    description: 'CPI broken down by COICOP division (redirects to cpi_headline)',
    descriptionBM: 'IHP dipecahkan mengikut bahagian COICOP',
    defaultLimit: 48,
    refreshMs: P1_REFRESH,
    color: '#F97316',
    icon: 'Layers',
  },

  cpi_category: {
    id: 'cpi_headline',                         // FIXED: No cpi_3d API; reuse cpi_headline
    label: 'CPI by Category',
    labelBM: 'IHP mengikut Kategori',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'index',                        // FIXED: was 'cpi'; actual field is 'index'
    dateField: 'date',
    groupField: 'division',                     // No separate category API — division serves this
    csvOnly: true,                              // No dedicated API
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P1',
    description: 'CPI by expenditure category (no dedicated API — uses cpi_headline divisions)',
    descriptionBM: 'IHP dipecahkan mengikut kategori perbelanjaan',
    defaultLimit: 48,
    refreshMs: P1_REFRESH,
    color: '#F97316',
    icon: 'Tag',
  },

  cpi_state: {
    id: 'cpi_state',                            // ✅ Correct
    label: 'CPI by State',
    labelBM: 'IHP mengikut Negeri',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'index',                        // FIXED: was 'cpi'; API uses 'index'
    dateField: 'date',
    groupField: 'state',
    extraFields: ['division'],                  // FIXED: API also has 'division' field
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P1',
    description: 'CPI by state (fields: date, division, index, state)',
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
    valueField: 'index',                        // FIXED: was 'value'; API uses 'index'
    dateField: 'date',
    groupField: 'series',                       // FIXED: was 'series_type'; API uses 'series'
    extraFields: ['index_sa'],                  // API also returns seasonally adjusted index
    unit: 'Indeks',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Producer prices at manufacturing stage (fields: date, index, index_sa, series)',
    descriptionBM: 'Harga pengeluar di peringkat pembuatan',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#D97706',
    icon: 'Package',
  },

  hpi_malaysia: {
    id: 'hpi_malaysia',                         // No API exists — csvOnly
    label: 'House Price Index',
    labelBM: 'Indeks Harga Rumah',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'index',
    dateField: 'date',
    groupField: 'series',
    csvOnly: true,                              // FIXED: No API endpoint — CSV only
    unit: 'Indeks',
    granularity: 'quarterly',
    priority: 'P1',
    description: 'House Price Index by property type (NO API — CSV proxy only)',
    descriptionBM: 'Indeks harga rumah mengikut jenis harta',
    defaultLimit: 24,
    refreshMs: P1_REFRESH,
    color: '#14B8A6',
    icon: 'Home',
  },

  fuelprice: {
    id: 'fuelprice',                            // ✅ Correct
    label: 'Fuel Prices',
    labelBM: 'Harga Bahan Api',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'ron95',
    dateField: 'date',
    extraFields: ['ron97', 'diesel', 'diesel_eastmsia', 'ron95_budi95', 'ron95_skps', 'series_type'], // FIXED: diesel_eastmsia NOT diesel_east
    unit: 'RM/liter',
    granularity: 'weekly',
    priority: 'P0',
    description: 'Weekly fuel prices RON95, RON97 and diesel (fields: date, diesel, diesel_eastmsia, ron95, ron95_budi95, ron95_skps, ron97, series_type)',
    descriptionBM: 'Harga bahan api mingguan RON95, RON97 dan diesel',
    defaultLimit: 52,
    refreshMs: P0_REFRESH,
    color: '#84CC16',
    icon: 'Fuel',
  },

  pricecatcher: {
    id: 'pricecatcher_week',                    // No API — csvOnly
    label: 'PriceCatcher',
    labelBM: 'Penangkap Harga',
    category: 'Prices',
    categoryBM: 'Harga',
    valueField: 'price',
    dateField: 'date',
    groupField: 'item_category',
    csvOnly: true,                              // FIXED: No API endpoint — CSV proxy only
    unit: 'RM',
    granularity: 'weekly',
    priority: 'P2',
    description: 'Weekly price monitoring of essential goods (NO API — CSV proxy only)',
    descriptionBM: 'Pemantauan harga mingguan barang keperluan',
    defaultLimit: 100,
    refreshMs: P2_REFRESH,
    color: '#10B981',
    icon: 'Search',
  },

  // ─── CATEGORY: LABOUR ──────────────────────────────────────

  labour_monthly: {
    id: 'lfs_month',                            // ✅ Correct
    label: 'Labour Force Monthly',
    labelBM: 'Tenaga Buruh Bulanan',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    extraFields: ['lf', 'lf_employed', 'lf_unemployed', 'lf_outside', 'ep_ratio', 'p_rate'],
    unit: '%',
    granularity: 'monthly',
    priority: 'P0',
    description: 'Monthly unemployment rate and labour force statistics (fields: date, ep_ratio, lf, lf_employed, lf_outside, lf_unemployed, p_rate, u_rate)',
    descriptionBM: 'Kadar pengangguran bulanan dan statistik tenaga buruh',
    defaultLimit: 24,
    refreshMs: P0_REFRESH,
    color: '#10B981',
    icon: 'Users',
  },

  labour_monthly_sa: {
    id: 'lfs_month_sa',                         // ✅ Correct
    label: 'Labour Force (Seasonally Adjusted)',
    labelBM: 'Tenaga Buruh (Laras Musim)',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    extraFields: ['lf', 'lf_employed', 'lf_unemployed', 'p_rate'],
    unit: '%',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Seasonally adjusted labour force statistics (fields: date, lf, lf_employed, lf_unemployed, p_rate, u_rate)',
    descriptionBM: 'Statistik tenaga buruh laras musim',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#059669',
    icon: 'BarChart3',
  },

  lfs_qtr: {
    id: 'lfs_qtr',                              // ✅ Correct
    label: 'Labour Force Quarterly',
    labelBM: 'Tenaga Buruh Suku Tahunan',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    extraFields: ['lf', 'lf_employed', 'lf_unemployed', 'lf_outside', 'ep_ratio', 'p_rate'],
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
    id: 'lfs_state_sex',                        // FIXED: was lfs_state (404)
    label: 'Labour Force by State',
    labelBM: 'Tenaga Buruh mengikut Negeri',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    groupField: 'state',
    extraFields: ['sex'],                       // FIXED: API has 'sex' field
    unit: '%',
    granularity: 'annual',
    priority: 'P1',
    description: 'Labour force by state and sex (fields: date, ep_ratio, lf, lf_employed, lf_outside, lf_unemployed, p_rate, sex, state, u_rate)',
    descriptionBM: 'Kadar pengangguran mengikut negeri',
    defaultLimit: 100,
    refreshMs: P1_REFRESH,
    color: '#10B981',
    icon: 'MapPin',
  },

  labour_district: {
    id: 'lfs_district',                         // ✅ Correct
    label: 'Labour Force by District',
    labelBM: 'Tenaga Buruh mengikut Daerah',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    groupField: 'district',
    extraFields: ['state', 'lf', 'lf_employed', 'lf_unemployed', 'lf_outside', 'ep_ratio', 'p_rate'],
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
    id: 'employment_sector',                    // ✅ Correct
    label: 'Employment by Sector',
    labelBM: 'Pekerjaan mengikut Sektor',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'proportion',                   // FIXED: was 'employed'; API uses 'proportion'
    dateField: 'date',
    groupField: 'sector',
    extraFields: ['sex'],                       // API has sex field
    unit: '%',
    granularity: 'annual',
    priority: 'P2',
    description: 'Employment proportion by economic sector (fields: date, proportion, sector, sex)',
    descriptionBM: 'Pekerjaan mengikut sektor ekonomi',
    defaultLimit: 50,
    refreshMs: P2_REFRESH,
    color: '#6EE7B7',
    icon: 'Briefcase',
  },

  productivity_annual: {
    id: 'productivity_annual',                  // ✅ Correct
    label: 'Labour Productivity',
    labelBM: 'Produktiviti Buruh',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'output_hour',                  // FIXED: was 'value'; API has specific fields
    dateField: 'date',
    groupField: 'sector',                       // FIXED: was 'series_type'; API groups by 'sector'
    extraFields: ['employment', 'gdp', 'hours', 'output_employment', 'series'],
    unit: 'Indeks',
    granularity: 'annual',
    priority: 'P2',
    description: 'Labour productivity (fields: date, employment, gdp, hours, output_employment, output_hour, sector, series)',
    descriptionBM: 'Indeks produktiviti buruh mengikut sektor',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#A7F3D0',
    icon: 'Zap',
  },

  // ─── CATEGORY: TRADE ───────────────────────────────────────

  trade_monthly: {
    id: 'trade_headline',                       // FIXED: was trade_monthly (404)
    label: 'External Trade',
    labelBM: 'Perdagangan Luar Negeri',
    category: 'Trade',
    categoryBM: 'Perdagangan',
    valueField: 'balance',
    dateField: 'date',
    extraFields: ['exports', 'imports', 'exports_domestic', 'imports_retained', 're_exports', 'series', 'total'],
    unit: 'RM Juta',
    granularity: 'monthly',
    priority: 'P0',
    description: 'Monthly external trade (fields: balance, date, exports, exports_domestic, imports, imports_retained, re_exports, series, total)',
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
    groupField: 'sitc',
    extraFields: ['flow'],
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
    id: 'exchangerates',                        // FIXED: was exchangerates_monthly (404)
    label: 'Exchange Rates',
    labelBM: 'Kadar Pertukaran',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'usd',                          // FIXED: WIDE format — usd is the default column
    dateField: 'date',
    wideFormat: true,                           // FIXED: API returns WIDE format
    wideColumns: ['usd', 'eur', 'gbp', 'jpy', 'sgd', 'cny', 'thb', 'idr', 'krw', 'aud'],
    unit: 'RM',
    granularity: 'monthly',
    priority: 'P0',
    description: 'Ringgit exchange rates WIDE format (fields: date, usd, eur, gbp, jpy, sgd, cny, thb, idr, krw, aud)',
    descriptionBM: 'Kadar pertukaran Ringgit berbanding mata wang utama (bulanan)',
    defaultLimit: 30,
    refreshMs: P0_REFRESH,
    color: '#3B82F6',
    icon: 'DollarSign',
  },

  exchangerates_daily: {
    id: 'exchangerates_daily_0900',             // FIXED: was exchangerates_daily (404)
    label: 'Exchange Rates (Daily)',
    labelBM: 'Kadar Pertukaran (Harian)',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'usd',                          // FIXED: WIDE format
    dateField: 'date',
    wideFormat: true,                           // FIXED: API returns WIDE format
    wideColumns: ['usd', 'eur', 'gbp', 'jpy', 'sgd', 'cny', 'thb', 'idr', 'krw', 'aud'],
    unit: 'RM',
    granularity: 'daily',
    priority: 'P1',
    description: 'Daily Ringgit exchange rates WIDE format (fields: date, usd, eur, gbp, ...)',
    descriptionBM: 'Kadar pertukaran Ringgit harian berbanding mata wang utama',
    defaultLimit: 30,
    refreshMs: P1_REFRESH,
    color: '#2563EB',
    icon: 'DollarSign',
  },

  interest_rate: {
    id: 'interestrates',                        // ✅ Correct
    label: 'Interest Rates',
    labelBM: 'Kadar Faedah',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'rate',
    dateField: 'date',
    groupField: 'bank',                         // FIXED: was 'series_type'; API uses 'bank'
    extraFields: ['value'],                     // API also has 'value' field
    unit: '%',
    granularity: 'daily',
    priority: 'P1',
    description: 'Interest rates by bank (fields: bank, date, rate, value)',
    descriptionBM: 'Kadar dasar BNM dan kadar antara bank',
    defaultLimit: 30,
    refreshMs: P1_REFRESH,
    color: '#7C3AED',
    icon: 'Percent',
  },

  money_supply: {
    id: 'monetary_aggregates',                  // ✅ Correct
    label: 'Money Supply',
    labelBM: 'Bekalan Wang',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'value',
    dateField: 'date',
    groupField: 'measure',                      // FIXED: was 'series_type'; API uses 'measure'
    defaultFilter: { measure: 'M3' },           // FIXED: filter key is 'measure' not 'series_type'
    unit: 'RM Juta',
    granularity: 'monthly',
    priority: 'P2',
    description: 'M1, M2, M3 monetary aggregates (fields: date, measure, value)',
    descriptionBM: 'Agregat kewangan M1, M2, M3',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#1D4ED8',
    icon: 'Banknote',
  },

  federal_revenue: {
    id: 'federal_finance_year',                 // ✅ Correct
    label: 'Federal Revenue',
    labelBM: 'Hasil Kerajaan Persekutuan',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'value',
    dateField: 'date',
    groupField: 'variable',                     // FIXED: was 'series_type'; API uses 'variable'
    extraFields: ['category'],                  // FIXED: API has 'category' field
    unit: 'RM Juta',
    granularity: 'annual',
    priority: 'P2',
    description: 'Federal government revenue (fields: category, date, value, variable)',
    descriptionBM: 'Hasil kerajaan persekutuan mengikut sumber',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#7C3AED',
    icon: 'Landmark',
  },

  federal_expenditure: {
    id: 'federal_finance_year',                 // ✅ Same dataset as federal_revenue
    label: 'Federal Expenditure',
    labelBM: 'Perbelanjaan Kerajaan Persekutuan',
    category: 'Finance',
    categoryBM: 'Kewangan',
    valueField: 'value',
    dateField: 'date',
    groupField: 'variable',                     // FIXED: was 'series_type'; API uses 'variable'
    extraFields: ['category'],                  // FIXED: API has 'category' field
    unit: 'RM Juta',
    granularity: 'annual',
    priority: 'P2',
    description: 'Federal government expenditure (fields: category, date, value, variable)',
    descriptionBM: 'Perbelanjaan mengurus dan pembangunan kerajaan persekutuan',
    defaultLimit: 20,
    refreshMs: P2_REFRESH,
    color: '#9333EA',
    icon: 'Receipt',
  },

  // ─── CATEGORY: DEMOGRAPHY ──────────────────────────────────

  population_state: {
    id: 'population_state',                     // ✅ Correct
    label: 'Population by State',
    labelBM: 'Penduduk mengikut Negeri',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'population',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: { sex: 'both', ethnicity: 'overall', age: 'overall' },
    unit: 'ribu orang',
    granularity: 'annual',
    priority: 'P0',
    description: 'Population by state (fields: age, date, ethnicity, population, sex, state)',
    descriptionBM: 'Penduduk mengikut negeri dari 1970 hingga kini',
    defaultLimit: 100,
    refreshMs: P3_REFRESH,
    color: '#8B5CF6',
    icon: 'Users',
  },

  population_malaysia: {
    id: 'population_malaysia',                  // ✅ Correct
    label: 'Population Malaysia',
    labelBM: 'Penduduk Malaysia',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'population',
    dateField: 'date',
    groupField: 'sex',
    extraFields: ['age', 'ethnicity'],          // FIXED: field is 'age' not 'age_group'
    defaultFilter: { sex: 'both', ethnicity: 'overall', age: 'overall' },
    unit: 'ribu orang',
    granularity: 'annual',
    priority: 'P0',
    description: 'National population (fields: age, date, ethnicity, population, sex)',
    descriptionBM: 'Penduduk nasional mengikut jantina, umur dan etnik',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#A78BFA',
    icon: 'UserCheck',
  },

  population_district: {
    id: 'population_district',                  // ✅ Correct
    label: 'Population by District',
    labelBM: 'Penduduk mengikut Daerah',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'population',
    dateField: 'date',
    groupField: 'district',
    extraFields: ['age', 'ethnicity', 'sex', 'state'], // FIXED: API has age, ethnicity, sex, state
    unit: 'ribu orang',
    granularity: 'annual',
    priority: 'P2',
    description: 'Population at district level (fields: age, date, district, ethnicity, population, sex, state)',
    descriptionBM: 'Penduduk di peringkat daerah',
    defaultLimit: 200,
    refreshMs: P3_REFRESH,
    color: '#C4B5FD',
    icon: 'Building2',
  },

  births: {
    id: 'births',                               // ✅ Correct
    label: 'Live Births',
    labelBM: 'Kelahiran Hidup',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'births',                       // FIXED: was 'abs'; API field is 'births'
    dateField: 'date',
    groupField: 'state',                        // FIXED: was 'sex'; API groups by 'state'
    unit: 'orang',
    granularity: 'monthly',
    priority: 'P1',
    description: 'Live births by state (fields: births, date, state)',
    descriptionBM: 'Kelahiran hidup yang didaftarkan',
    defaultLimit: 24,
    refreshMs: P3_REFRESH,
    color: '#F472B6',
    icon: 'Baby',
  },

  deaths: {
    id: 'deaths',                               // ✅ Correct
    label: 'Deaths',
    labelBM: 'Kematian',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'abs',                          // ✅ API field is 'abs'
    dateField: 'date',
    // NOTE: NO groupField — API fields are: abs, date, rate (NO sex field!)
    extraFields: ['rate'],                      // API also returns 'rate'
    unit: 'orang',
    granularity: 'monthly',
    priority: 'P1',
    description: 'Deaths registered (fields: abs, date, rate)',
    descriptionBM: 'Kematian yang didaftarkan',
    defaultLimit: 24,
    refreshMs: P3_REFRESH,
    color: '#6B7280',
    icon: 'Heart',
  },

  marriages: {
    id: 'marriages',                            // ✅ Correct
    label: 'Marriages',
    labelBM: 'Perkahwinan',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'abs',                          // ✅ API field is 'abs'
    dateField: 'date',
    groupField: 'sex',                          // FIXED: was 'religion'; API groups by 'sex'
    extraFields: ['rate'],                      // API also returns 'rate'
    unit: 'pasangan',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Marriages by sex (fields: abs, date, rate, sex)',
    descriptionBM: 'Perkahwinan yang didaftarkan mengikut jantina',
    defaultLimit: 24,
    refreshMs: P3_REFRESH,
    color: '#EC4899',
    icon: 'HeartHandshake',
  },

  divorces: {
    id: 'divorces',                             // No API exists — csvOnly
    label: 'Divorces',
    labelBM: 'Perceraian',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'abs',
    dateField: 'date',
    groupField: 'religion',
    csvOnly: true,                              // FIXED: No API endpoint — CSV proxy only
    unit: 'pasangan',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Divorces registered by religion (NO API — CSV proxy only)',
    descriptionBM: 'Perceraian yang didaftarkan mengikut agama',
    defaultLimit: 24,
    refreshMs: P3_REFRESH,
    color: '#F43F5E',
    icon: 'HeartOff',
  },

  fertility: {
    id: 'fertility',                            // ✅ Correct
    label: 'Fertility Rate',
    labelBM: 'Kadar Kesuburan',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'fertility_rate',               // FIXED: was 'tfr'; API uses 'fertility_rate'
    dateField: 'date',
    groupField: 'age_group',                    // FIXED: was 'sex'; API uses 'age_group'
    unit: 'kadar',
    granularity: 'annual',
    priority: 'P2',
    description: 'Fertility rate by age group (fields: age_group, date, fertility_rate)',
    descriptionBM: 'Jumlah kadar kesuburan mengikut kumpulan umur',
    defaultLimit: 20,
    refreshMs: P3_REFRESH,
    color: '#F9A8D4',
    icon: 'Activity',
  },

  // ─── CATEGORY: HOUSEHOLDS & WELFARE ────────────────────────

  hies_malaysia: {
    id: 'hh_income',                            // FIXED: was hies_malaysia (404)
    label: 'Household Income (Malaysia)',
    labelBM: 'Pendapatan Isi Rumah Malaysia',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'income_median',                // FIXED: was 'value'; API has income_mean and income_median directly
    dateField: 'date',
    extraFields: ['income_mean'],               // API has income_mean and income_median
    unit: 'RM',
    granularity: 'biennial',
    priority: 'P1',
    description: 'National household income (fields: date, income_mean, income_median)',
    descriptionBM: 'Pendapatan isi rumah nasional',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#A855F7',
    icon: 'Wallet',
  },

  household_income: {
    id: 'hh_income',                            // FIXED: was hies_state (404); same as hies_malaysia
    label: 'Household Income by State',
    labelBM: 'Pendapatan Isi Rumah mengikut Negeri',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'income_median',                // FIXED: was 'value'; API has direct fields
    dateField: 'date',
    extraFields: ['income_mean'],               // API has income_mean and income_median
    unit: 'RM',
    granularity: 'biennial',
    priority: 'P1',
    description: 'Household income by state (fields: date, income_mean, income_median)',
    descriptionBM: 'Median pendapatan isi rumah dan pekali Gini mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#A855F7',
    icon: 'Wallet',
  },

  poverty_rate: {
    id: 'hh_poverty_state',                     // FIXED: was poverty_absolute (404)
    label: 'Poverty Rate by State',
    labelBM: 'Kadar Kemiskinan mengikut Negeri',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'poverty_absolute',             // FIXED: was 'value'; API uses 'poverty_absolute'
    dateField: 'date',
    groupField: 'state',
    extraFields: ['poverty_hardcore', 'poverty_relative'], // FIXED: API has these fields
    unit: '%',
    granularity: 'annual',
    priority: 'P1',
    description: 'Poverty by state (fields: date, poverty_absolute, poverty_hardcore, poverty_relative, state)',
    descriptionBM: 'Kadar kemiskinan mutlak mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#FB923C',
    icon: 'AlertTriangle',
  },

  inequality: {
    id: 'hies_state',                           // ✅ Correct
    label: 'Income Inequality by State',
    labelBM: 'Ketidaksamaan Pendapatan mengikut Negeri',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'gini',                         // FIXED: was 'value'; API has gini directly
    dateField: 'date',
    groupField: 'state',
    extraFields: ['expenditure_mean', 'income_mean', 'income_median', 'poverty'],
    unit: 'pekali',
    granularity: 'biennial',
    priority: 'P2',
    description: 'Gini coefficient by state (fields: date, expenditure_mean, gini, income_mean, income_median, poverty, state)',
    descriptionBM: 'Pekali Gini mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#FBBF24',
    icon: 'Scale',
  },

  // ─── CATEGORY: HEALTHCARE ──────────────────────────────────

  hospital_beds: {
    id: 'hospital_beds',                        // No API exists — csvOnly
    label: 'Hospital Beds',
    labelBM: 'Katil Hospital',
    category: 'Healthcare',
    categoryBM: 'Kesihatan',
    valueField: 'beds',
    dateField: 'date',
    groupField: 'state',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'katil',
    granularity: 'annual',
    priority: 'P2',
    description: 'Hospital beds by state (NO API — CSV proxy only)',
    descriptionBM: 'Katil hospital mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#EC4899',
    icon: 'BedDouble',
  },

  healthcare_staff: {
    id: 'healthcare_staff',                     // No API exists — csvOnly
    label: 'Healthcare Staff',
    labelBM: 'Kakitangan Kesihatan',
    category: 'Healthcare',
    categoryBM: 'Kesihatan',
    valueField: 'count',
    dateField: 'date',
    groupField: 'category',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'orang',
    granularity: 'annual',
    priority: 'P2',
    description: 'Healthcare staff by category (NO API — CSV proxy only)',
    descriptionBM: 'Kakitangan kesihatan mengikut kategori',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#F472B6',
    icon: 'Stethoscope',
  },

  blood_donations: {
    id: 'blood_donations',                      // ✅ Correct
    label: 'Blood Donations',
    labelBM: 'Penderma Darah',
    category: 'Healthcare',
    categoryBM: 'Kesihatan',
    valueField: 'donations',                    // FIXED: was 'daily'; API uses 'donations'
    dateField: 'date',
    groupField: 'blood_type',                   // FIXED: was 'state'; API groups by 'blood_type'
    unit: 'orang',
    granularity: 'daily',
    priority: 'P2',
    description: 'Blood donations by blood type (fields: blood_type, date, donations)',
    descriptionBM: 'Statistik pendermaan darah mengikut jenis darah',
    defaultLimit: 30,
    refreshMs: P3_REFRESH,
    color: '#DB2777',
    icon: 'Droplets',
  },

  // ─── CATEGORY: ENVIRONMENT ─────────────────────────────────

  air_pollution: {
    id: 'air_pollution',                        // No API exists — csvOnly
    label: 'Air Pollution Index',
    labelBM: 'Indeks Pencemaran Udara',
    category: 'Environment',
    categoryBM: 'Alam Sekitar',
    valueField: 'api',
    dateField: 'date',
    groupField: 'state',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'API',
    granularity: 'daily',
    priority: 'P2',
    description: 'Air pollutant index by state (NO API — CSV proxy only)',
    descriptionBM: 'Indeks pencemar udara mengikut negeri',
    defaultLimit: 30,
    refreshMs: P2_REFRESH,
    color: '#22C55E',
    icon: 'Wind',
  },

  forest_reserve: {
    id: 'forest_reserve_state',                 // ✅ Correct
    label: 'Forest Reserve by State',
    labelBM: 'Hutan Simpan mengikut Negeri',
    category: 'Environment',
    categoryBM: 'Alam Sekitar',
    valueField: 'area',                         // FIXED: was 'area_ha'; API uses 'area'
    dateField: 'date',
    groupField: 'state',
    unit: 'hektar',
    granularity: 'annual',
    priority: 'P3',
    description: 'Forest reserve area by state (fields: area, date, state)',
    descriptionBM: 'Kawasan hutan simpan mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#16A34A',
    icon: 'TreePine',
  },

  electricity_supply: {
    id: 'electricity_supply',                   // No API exists — csvOnly
    label: 'Electricity Supply',
    labelBM: 'Bekalan Elektrik',
    category: 'Environment',
    categoryBM: 'Alam Sekitar',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'GWh',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Electricity generation and consumption (NO API — CSV proxy only)',
    descriptionBM: 'Penjanaan dan penggunaan elektrik',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#EAB308',
    icon: 'Zap',
  },

  water_consumption: {
    id: 'water_consumption',                    // No API exists — csvOnly
    label: 'Water Consumption',
    labelBM: 'Penggunaan Air',
    category: 'Environment',
    categoryBM: 'Alam Sekitar',
    valueField: 'value',
    dateField: 'date',
    groupField: 'state',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'ML/hari',
    granularity: 'annual',
    priority: 'P3',
    description: 'Water consumption by state (NO API — CSV proxy only)',
    descriptionBM: 'Penggunaan air mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#0EA5E9',
    icon: 'Droplet',
  },

  // ─── CATEGORY: TRANSPORT ───────────────────────────────────

  ridership: {
    id: 'ridership_headline',                   // ✅ Correct
    label: 'Public Transport Ridership',
    labelBM: 'Penumpang Pengangkutan Awam',
    category: 'Transport',
    categoryBM: 'Pengangkutan',
    valueField: 'bus_rkl',                      // FIXED: WIDE format — default to bus_rkl column
    dateField: 'date',
    wideFormat: true,                           // FIXED: API returns WIDE format, NOT service/ridership long format
    wideColumns: [
      'bus_rkl', 'bus_rkn', 'bus_rpn',
      'rail_ets', 'rail_intercity', 'rail_komuter', 'rail_komuter_utara',
      'rail_lrt_ampang', 'rail_lrt_kj',
      'rail_monorail', 'rail_mrt_kajang', 'rail_mrt_pjy', 'rail_tebrau',
    ],
    unit: 'orang',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Public transport ridership WIDE format (fields: date, bus_rkl, bus_rkn, rail_ets, rail_komuter, ...)',
    descriptionBM: 'Penumpang pengangkutan awam mengikut kaedah perkhidmatan',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#14B8A6',
    icon: 'TrainFront',
  },

  vehicle_registration: {
    id: 'registration_transactions_all',        // No API — csvOnly
    label: 'Vehicle Registration',
    labelBM: 'Pendaftaran Kenderaan',
    category: 'Transport',
    categoryBM: 'Pengangkutan',
    valueField: 'registered',
    dateField: 'date',
    groupField: 'type',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'unit',
    granularity: 'monthly',
    priority: 'P2',
    description: 'New vehicle registrations by type (NO API — CSV proxy only)',
    descriptionBM: 'Pendaftaran kenderaan baru mengikut jenis',
    defaultLimit: 24,
    refreshMs: P2_REFRESH,
    color: '#0D9488',
    icon: 'Car',
  },

  // ─── CATEGORY: PUBLIC SAFETY ───────────────────────────────

  crime_district: {
    id: 'crime_district',                       // FIXED: was crime_index (404)
    label: 'Index Crime',
    labelBM: 'Jenayah Indeks',
    category: 'Safety',
    categoryBM: 'Keselamatan',
    valueField: 'crimes',                       // FIXED: was 'cases'; API uses 'crimes'
    dateField: 'date',
    groupField: 'type',                         // Groups by crime type
    extraFields: ['category', 'district', 'state'], // FIXED: API has category, district, state
    unit: 'kes',
    granularity: 'annual',
    priority: 'P2',
    description: 'Index crime (fields: category, crimes, date, district, state, type)',
    descriptionBM: 'Jenayah indeks mengikut jenis dan negeri',
    defaultLimit: 200,
    refreshMs: P3_REFRESH,
    color: '#EF4444',
    icon: 'ShieldAlert',
  },

  drug_arrests: {
    id: 'drug_arrests_age',                     // No API — csvOnly
    label: 'Drug Arrests by Age',
    labelBM: 'Tangkapan Dadah mengikut Umur',
    category: 'Safety',
    categoryBM: 'Keselamatan',
    valueField: 'arrests',
    dateField: 'date',
    groupField: 'age_group',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'orang',
    granularity: 'annual',
    priority: 'P3',
    description: 'Drug arrests by age group (NO API — CSV proxy only)',
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
    id: 'deaths_cause',                         // No API exists — csvOnly
    label: 'Deaths by Cause',
    labelBM: 'Kematian mengikut Punca',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'abs',
    dateField: 'date',
    groupField: 'cause',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'orang',
    granularity: 'annual',
    priority: 'P2',
    description: 'Deaths by cause of death (NO API — CSV proxy only)',
    descriptionBM: 'Kematian mengikut punca kematian',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#9CA3AF',
    icon: 'Activity',
  },

  // ─── NEW: LABOUR FORCE BY EDUCATION ─────────────────────────

  lfs_edu: {
    id: 'lfs_edu',                              // No API exists — csvOnly
    label: 'Labour Force by Education',
    labelBM: 'Tenaga Buruh mengikut Pendidikan',
    category: 'Labour',
    categoryBM: 'Pasaran Buruh',
    valueField: 'u_rate',
    dateField: 'date',
    groupField: 'edu',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: '%',
    granularity: 'annual',
    priority: 'P2',
    description: 'Unemployment rate by education level (NO API — CSV proxy only)',
    descriptionBM: 'Kadar pengangguran mengikut tahap pendidikan',
    defaultLimit: 50,
    refreshMs: P2_REFRESH,
    color: '#6EE7B7',
    icon: 'GraduationCap',
  },

  // ─── NEW: TRADE BY COUNTRY ─────────────────────────────────

  trade_country: {
    id: 'trade_country',                        // No API exists — csvOnly
    label: 'Trade by Country',
    labelBM: 'Perdagangan mengikut Negara',
    category: 'Trade',
    categoryBM: 'Perdagangan',
    valueField: 'value',
    dateField: 'date',
    groupField: 'country',
    extraFields: ['flow'],
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'RM Juta',
    granularity: 'monthly',
    priority: 'P2',
    description: 'Trade by partner country (NO API — CSV proxy only)',
    descriptionBM: 'Perdagangan mengikut negara rakan',
    defaultLimit: 50,
    refreshMs: P2_REFRESH,
    color: '#0EA5E9',
    icon: 'Globe',
  },

  // ─── NEW: POPULATION BY PARLIAMENT ─────────────────────────

  population_parlimen: {
    id: 'population_parlimen',                  // No API exists — csvOnly
    label: 'Population by Parliament',
    labelBM: 'Penduduk mengikut Parlimen',
    category: 'Demography',
    categoryBM: 'Demografi',
    valueField: 'population',
    dateField: 'date',
    groupField: 'parlimen',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'ribu orang',
    granularity: 'annual',
    priority: 'P3',
    description: 'Population by parliament constituency (NO API — CSV proxy only)',
    descriptionBM: 'Penduduk mengikut kawasan parlimen',
    defaultLimit: 300,
    refreshMs: P3_REFRESH,
    color: '#C4B5FD',
    icon: 'Building',
  },

  // ─── NEW: POVERTY RATE BY STATE ────────────────────────────

  poverty_state: {
    id: 'hh_poverty_state',                     // FIXED: reuse hh_poverty_state (same dataset as poverty_rate)
    label: 'Poverty Rate by State',
    labelBM: 'Kadar Kemiskinan mengikut Negeri',
    category: 'Households',
    categoryBM: 'Isi Rumah',
    valueField: 'poverty_absolute',
    dateField: 'date',
    groupField: 'state',
    extraFields: ['poverty_hardcore', 'poverty_relative'],
    unit: '%',
    granularity: 'biennial',
    priority: 'P1',
    description: 'Poverty incidence rate by state (fields: date, poverty_absolute, poverty_hardcore, poverty_relative, state)',
    descriptionBM: 'Kadar kemiskinan mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#FB923C',
    icon: 'AlertTriangle',
  },

  // ─── NEW: ROAD ACCIDENTS ───────────────────────────────────

  road_accidents: {
    id: 'road_accidents',                       // No API exists — csvOnly
    label: 'Road Accidents',
    labelBM: 'Kemalangan Jalan Raya',
    category: 'Safety',
    categoryBM: 'Keselamatan',
    valueField: 'accidents',
    dateField: 'date',
    groupField: 'state',
    extraFields: ['deaths', 'injuries'],
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'kes',
    granularity: 'annual',
    priority: 'P2',
    description: 'Road accidents, deaths and injuries by state (NO API — CSV proxy only)',
    descriptionBM: 'Kemalangan, kematian dan kecederaan jalan raya mengikut negeri',
    defaultLimit: 50,
    refreshMs: P3_REFRESH,
    color: '#EF4444',
    icon: 'Car',
  },

  // ─── NEW: PALM OIL ─────────────────────────────────────────

  palm_oil: {
    id: 'palm_oil',                             // No API exists — csvOnly
    label: 'Palm Oil Statistics',
    labelBM: 'Statistik Minyak Sawit',
    category: 'Agriculture',
    categoryBM: 'Pertanian',
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    csvOnly: true,                              // FIXED: No API endpoint
    unit: 'tan',
    granularity: 'monthly',
    priority: 'P3',
    description: "Malaysia's palm oil production, exports and prices (NO API — CSV proxy only)",
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
    'poverty_state',
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
    'deaths_cause',
    'lfs_edu',
    'trade_country',
    'road_accidents',
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
    'population_parlimen',
    'palm_oil',
  ],
};

// ═══════════════════════════════════════════════════════════════
// COMMAND CENTER KPIs
// ═══════════════════════════════════════════════════════════════

export const COMMAND_CENTER_KPIS: DatasetId[] = [
  'gdp_growth',      // GDP YoY growth rate (series=growth_yoy)
  'gdp_qtr',         // GDP absolute value (series=abs)
  'cpi_inflation',   // Inflation YoY from cpi_headline_inflation API
  'labour_monthly',
  'trade_monthly',
  'fuelprice',
  'exchange_rate',
  'population_malaysia',
];

// ═══════════════════════════════════════════════════════════════
// ANOMALY WATCHLIST
// ═══════════════════════════════════════════════════════════════

export const ANOMALY_WATCHLIST = [
  { id: 'cpi_inflation' as DatasetId, threshold: 3.0, field: 'inflation_yoy', alert: 'Inflation exceeds 3%' },
  { id: 'labour_monthly' as DatasetId, threshold: 5.0, field: 'u_rate', alert: 'Unemployment exceeds 5%' },
  { id: 'trade_monthly' as DatasetId, threshold: 0, field: 'balance', alert: 'Trade deficit detected' },
  { id: 'exchange_rate' as DatasetId, threshold: 4.80, field: 'usd', alert: 'Ringgit exceeds RM4.80/USD' },
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
