// src/lib/dosm/ground-truth-registry.ts
// ────────────────────────────────────────────────────────────────
// Single source of truth for all DoSM dataset IDs and field names.
// Verified against YAML files from github.com/data-gov-my/datagovmy-meta
// and the live api.data.gov.my/data-catalogue API.
//
// Sections:
//   1. ID_CORRECTIONS      — Wrong → Correct API dataset ID mapping
//   2. GROUND_TRUTH_REGISTRY — Full dataset definitions with fields
//   3. STATIC_FALLBACKS    — Realistic approximate data for P0/P1
//   4. STATE_NAMES         — Exact state name values for API filters
//   5. API_REFERENCE       — Developer docs, params, working examples
// ────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════

export type VerificationStatus = 'VERIFIED' | 'NEEDS_VERIFY';

export type DatasetFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'biennial'
  | 'irregular';

export type DatasetGeography = 'national' | 'state' | 'district' | 'mixed';

export type DatasetCategory =
  | 'Economy'
  | 'Prices'
  | 'Labour'
  | 'Trade'
  | 'Finance'
  | 'Demography'
  | 'Households'
  | 'Healthcare'
  | 'Environment'
  | 'Transport'
  | 'Safety'
  | 'Education'
  | 'Agriculture'
  | 'Digital'
  | 'Industry';

export type DatasetPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface FieldDef {
  name: string;
  type: 'string' | 'number' | 'date';
  /** For string fields, the set of possible values (if enumerable) */
  choices?: string[];
  /** Human-readable label */
  label: string;
  /** Is this field required for meaningful queries? */
  required?: boolean;
}

export interface GroundTruthDataset {
  /** Canonical API dataset ID used in api.data.gov.my/data-catalogue?id=... */
  apiId: string;
  /** YAML source file from github.com/data-gov-my/datagovmy-meta */
  yamlSource: string;
  /** Malay title */
  title_ms: string;
  /** English title */
  title_en: string;
  /** Data frequency */
  frequency: DatasetFrequency;
  /** Geographic granularity */
  geography: DatasetGeography;
  /** Statistical category */
  category: DatasetCategory;
  /** Priority tier */
  priority: DatasetPriority;
  /** All fields with exact names, types, and (where known) choices */
  fields: FieldDef[];
  /** Primary numeric field for KPI display */
  valueField: string;
  /** Date / time-period field */
  dateField: string;
  /** Field to group/split by for charts */
  groupField?: string;
  /** Default filter to apply on first load (e.g. { currency: 'USD' }) */
  defaultFilter?: Record<string, string>;
  /** Unit of measurement */
  unit: string;
  /** Display order within priority tier (lower = more prominent) */
  priority_order: number;
  /** Verification status — VERIFIED if YAML-confirmed, NEEDS_VERIFY if uncertain */
  status: VerificationStatus;
  /** Notes / caveats */
  notes?: string;
}

// ══════════════════════════════════════════════════════════════════
// 4. STATE_NAMES — Exact state name values for API filters
// ══════════════════════════════════════════════════════════════════
// These must match EXACTLY what the API returns/expects.
// Defined early so they can be referenced in GROUND_TRUTH_REGISTRY.

export const STATE_NAMES: readonly string[] = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'W.P. Kuala Lumpur',
  'W.P. Labuan',
  'W.P. Putrajaya',
] as const;

export type StateName = typeof STATE_NAMES[number];

// Alias used in field definitions for state choices
const STATE_NAMES_PLACEHOLDER: readonly string[] = STATE_NAMES;

// ══════════════════════════════════════════════════════════════════
// 1. ID_CORRECTIONS — Wrong IDs used in previous code → Correct IDs
// ══════════════════════════════════════════════════════════════════

export const ID_CORRECTIONS: ReadonlyMap<string, string> = new Map([
  // ── Economy ──
  ['gdp_annual_nominal_supply', 'gdp_annual'],
  ['gdp_qtr_nominal', 'gdp_qtr'],
  ['gdp_state_real_supply', 'gdp_state'],
  ['gdp_annual_real_supply_granular', 'gdp_state'], // This was misused for sector breakdown; gdp_state has state+series_type

  // ── Labour ──
  ['labour_unemployment', 'lfs_month'],
  ['labour_unemployment_state', 'lfs_state'],
  ['lfs_state_sex', 'lfs_state'],           // Old combined ID; API uses lfs_state

  // ── Finance ──
  ['exchange_rate', 'exchangerates_monthly'],
  ['exchangerates', 'exchangerates_monthly'],

  // ── Prices ──
  ['cpi_headline_inflation', 'cpi_headline'],   // Inflation is computed from CPI, not a separate dataset
  ['hpi_malaysia', 'hpi_malaysia'],              // ID is correct; verify field name "index" vs "hpi"
  ['crime_district', 'crime_index'],             // API dataset is crime_index

  // ── Demography ──
  ['population_age', 'population_malaysia'],
  ['births_annual', 'births'],

  // ── Households ──
  ['household_income', 'hies_malaysia'],
  ['hh_income_state', 'hies_state'],
  ['hh_poverty_state', 'poverty_absolute'],      // NEEDS_VERIFY: may be poverty or poverty_absolute

  // ── Trade ──
  ['trade_headline', 'trade_monthly'],

  // ── Finance (continued) ──
  ['bop_balance', 'bop'],
  ['fdi_flows', 'fdi'],
  ['federal_finance_year_revenue', 'federal_finance_year'], // Same dataset, filtered by series_type

  // ── Transport ──
  ['registration_transactions_all', 'registration_transactions_all'], // NEEDS_VERIFY exact ID

  // ── No change needed ──
  ['lfs_month_sa', 'lfs_month_sa'],   // Verify this exists separately from lfs_month
  ['fuelprice', 'fuelprice'],         // Correct as-is
  ['population_state', 'population_state'], // Correct as-is
]);

// ══════════════════════════════════════════════════════════════════
// 2. GROUND_TRUTH_REGISTRY
// ══════════════════════════════════════════════════════════════════

export const GROUND_TRUTH_REGISTRY = {
  // ══════════════════════════════════════════════════════════════
  // P0 — COMMAND CENTER KPIs (8 datasets)
  // ══════════════════════════════════════════════════════════════

  gdp_qtr: {
    apiId: 'gdp_qtr',
    yamlSource: 'gdp_qtr.yaml',
    title_ms: 'KDNK Suku Tahunan',
    title_en: 'Quarterly Gross Domestic Product',
    frequency: 'quarterly',
    geography: 'national',
    category: 'Economy',
    priority: 'P0',
    fields: [
      { name: 'date', type: 'date', label: 'Quarter', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', choices: ['abs', 'abs_sa', 'abs_current', 'growth_yoy', 'growth_qoq_sa'], required: true },
      { name: 'value', type: 'number', label: 'GDP Value (RM Billion)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: { series_type: 'abs' },
    unit: 'RM Billion',
    priority_order: 1,
    status: 'VERIFIED',
    notes: 'Quarterly GDP — use series_type=abs for constant 2015 prices, series_type=growth_yoy for YoY growth rate, series_type=abs_current for nominal. WRONG: old values real/nominal/real_sa do NOT exist in API.',
  } satisfies GroundTruthDataset,

  cpi_headline: {
    apiId: 'cpi_headline',
    yamlSource: 'cpi_headline.yaml',
    title_ms: 'IHP Keseluruhan',
    title_en: 'Headline Consumer Price Index',
    frequency: 'monthly',
    geography: 'national',
    category: 'Prices',
    priority: 'P0',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'cpi', type: 'number', label: 'CPI Index', required: true },
      { name: 'core_cpi', type: 'number', label: 'Core CPI Index' },
    ],
    valueField: 'cpi',
    dateField: 'date',
    defaultFilter: {},
    unit: 'Index',
    priority_order: 2,
    status: 'VERIFIED',
    notes: 'Inflation rate must be computed as YoY % change from CPI, not fetched as a separate dataset.',
  } satisfies GroundTruthDataset,

  lfs_month: {
    apiId: 'lfs_month',
    yamlSource: 'lfs_month.yaml',
    title_ms: 'Tenaga Buruh Bulanan',
    title_en: 'Monthly Labour Force Statistics',
    frequency: 'monthly',
    geography: 'national',
    category: 'Labour',
    priority: 'P0',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'lf', type: 'number', label: 'Labour Force (thousands)', required: true },
      { name: 'lf_employed', type: 'number', label: 'Employed (thousands)' },
      { name: 'lf_unemployed', type: 'number', label: 'Unemployed (thousands)' },
      { name: 'u_rate', type: 'number', label: 'Unemployment Rate (%)', required: true },
    ],
    valueField: 'u_rate',
    dateField: 'date',
    defaultFilter: {},
    unit: '%',
    priority_order: 3,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  fuelprice: {
    apiId: 'fuelprice',
    yamlSource: 'fuelprice.yaml',
    title_ms: 'Harga Bahan Api',
    title_en: 'Weekly Fuel Prices',
    frequency: 'weekly',
    geography: 'national',
    category: 'Prices',
    priority: 'P0',
    fields: [
      { name: 'date', type: 'date', label: 'Week', required: true },
      { name: 'ron95', type: 'number', label: 'RON95 (RM/litre)', required: true },
      { name: 'ron97', type: 'number', label: 'RON97 (RM/litre)' },
      { name: 'diesel', type: 'number', label: 'Diesel (RM/litre)' },
      { name: 'diesel_east', type: 'number', label: 'Diesel East Malaysia (RM/litre)' },
    ],
    valueField: 'ron95',
    dateField: 'date',
    defaultFilter: {},
    unit: 'RM/litre',
    priority_order: 4,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  trade_monthly: {
    apiId: 'trade_monthly',
    yamlSource: 'trade_monthly.yaml',
    title_ms: 'Perdagangan Luar Bulanan',
    title_en: 'Monthly External Trade',
    frequency: 'monthly',
    geography: 'national',
    category: 'Trade',
    priority: 'P0',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'exports', type: 'number', label: 'Exports (RM Million)', required: true },
      { name: 'imports', type: 'number', label: 'Imports (RM Million)', required: true },
      { name: 'balance', type: 'number', label: 'Trade Balance (RM Million)', required: true },
    ],
    valueField: 'balance',
    dateField: 'date',
    defaultFilter: {},
    unit: 'RM Million',
    priority_order: 5,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  exchangerates_monthly: {
    apiId: 'exchangerates_monthly',
    yamlSource: 'exchangerates_monthly.yaml',
    title_ms: 'Kadar Pertukaran Bulanan',
    title_en: 'Monthly Exchange Rates',
    frequency: 'monthly',
    geography: 'national',
    category: 'Finance',
    priority: 'P0',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'currency', type: 'string', label: 'Currency', choices: ['USD', 'EUR', 'GBP', 'JPY', 'SGD', 'CNY', 'THB', 'IDR', 'KRW', 'AUD'], required: true },
      { name: 'rate', type: 'number', label: 'Exchange Rate (MYR per unit)', required: true },
    ],
    valueField: 'rate',
    dateField: 'date',
    groupField: 'currency',
    defaultFilter: { currency: 'USD' },
    unit: 'MYR',
    priority_order: 6,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  population_state: {
    apiId: 'population_state',
    yamlSource: 'population_state.yaml',
    title_ms: 'Penduduk mengikut Negeri',
    title_en: 'Population by State',
    frequency: 'annual',
    geography: 'state',
    category: 'Demography',
    priority: 'P0',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'ethnicity', type: 'string', label: 'Ethnicity' },
      { name: 'sex', type: 'string', label: 'Sex', choices: ['male', 'female', 'both'] },
      { name: 'age', type: 'string', label: 'Age Group', choices: ['overall', '0-14', '15-64', '65+'] },
      { name: 'population', type: 'number', label: 'Population (thousands)', required: true },
    ],
    valueField: 'population',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: { sex: 'both', ethnicity: 'overall', age: 'overall' },
    unit: 'thousands',
    priority_order: 7,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  population_malaysia: {
    apiId: 'population_malaysia',
    yamlSource: 'population_malaysia.yaml',
    title_ms: 'Penduduk Malaysia',
    title_en: 'Malaysia Population',
    frequency: 'annual',
    geography: 'national',
    category: 'Demography',
    priority: 'P0',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'ethnicity', type: 'string', label: 'Ethnicity' },
      { name: 'sex', type: 'string', label: 'Sex', choices: ['male', 'female', 'both'] },
      { name: 'age', type: 'string', label: 'Age Group', choices: ['overall', '0-14', '15-64', '65+'] },
      { name: 'population', type: 'number', label: 'Population (thousands)', required: true },
    ],
    valueField: 'population',
    dateField: 'date',
    groupField: 'sex',
    defaultFilter: { sex: 'both', ethnicity: 'overall', age: 'overall' },
    unit: 'thousands',
    priority_order: 8,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  // ══════════════════════════════════════════════════════════════
  // P1 — Important Datasets (13 datasets)
  // ══════════════════════════════════════════════════════════════

  gdp_annual: {
    apiId: 'gdp_annual',
    yamlSource: 'gdp_annual.yaml',
    title_ms: 'KDNK Tahunan',
    title_en: 'Annual Gross Domestic Product',
    frequency: 'annual',
    geography: 'national',
    category: 'Economy',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', choices: ['abs', 'abs_current', 'growth_yoy'], required: true },
      { name: 'value', type: 'number', label: 'GDP Value (RM Billion)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: { series_type: 'abs' },
    unit: 'RM Billion',
    priority_order: 1,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  gdp_state: {
    apiId: 'gdp_state',
    yamlSource: 'gdp_state.yaml',
    title_ms: 'KDNK mengikut Negeri',
    title_en: 'GDP by State',
    frequency: 'annual',
    geography: 'state',
    category: 'Economy',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', choices: ['abs', 'abs_current', 'growth_yoy'], required: true },
      { name: 'value', type: 'number', label: 'GDP Value (RM Billion)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: { series_type: 'abs' },
    unit: 'RM Billion',
    priority_order: 2,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  cpi_2d: {
    apiId: 'cpi_2d',
    yamlSource: 'cpi_2d.yaml',
    title_ms: 'IHP mengikut Bahagian',
    title_en: 'CPI by Division',
    frequency: 'monthly',
    geography: 'national',
    category: 'Prices',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'division', type: 'string', label: 'COICOP Division', required: true },
      { name: 'cpi', type: 'number', label: 'CPI Index', required: true },
    ],
    valueField: 'cpi',
    dateField: 'date',
    groupField: 'division',
    defaultFilter: {},
    unit: 'Index',
    priority_order: 3,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  cpi_state: {
    apiId: 'cpi_state',
    yamlSource: 'cpi_state.yaml',
    title_ms: 'IHP mengikut Negeri',
    title_en: 'CPI by State',
    frequency: 'monthly',
    geography: 'state',
    category: 'Prices',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'cpi', type: 'number', label: 'CPI Index', required: true },
    ],
    valueField: 'cpi',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: 'Index',
    priority_order: 4,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  lfs_qtr: {
    apiId: 'lfs_qtr',
    yamlSource: 'lfs_qtr.yaml',
    title_ms: 'Tenaga Buruh Suku Tahunan',
    title_en: 'Quarterly Labour Force Statistics',
    frequency: 'quarterly',
    geography: 'national',
    category: 'Labour',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Quarter', required: true },
      { name: 'lf', type: 'number', label: 'Labour Force (thousands)', required: true },
      { name: 'lf_employed', type: 'number', label: 'Employed (thousands)' },
      { name: 'lf_unemployed', type: 'number', label: 'Unemployed (thousands)' },
      { name: 'u_rate', type: 'number', label: 'Unemployment Rate (%)', required: true },
    ],
    valueField: 'u_rate',
    dateField: 'date',
    defaultFilter: {},
    unit: '%',
    priority_order: 5,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  lfs_state: {
    apiId: 'lfs_state',
    yamlSource: 'lfs_state.yaml',
    title_ms: 'Tenaga Buruh mengikut Negeri',
    title_en: 'Labour Force by State',
    frequency: 'annual',
    geography: 'state',
    category: 'Labour',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'lf', type: 'number', label: 'Labour Force (thousands)' },
      { name: 'lf_employed', type: 'number', label: 'Employed (thousands)' },
      { name: 'lf_unemployed', type: 'number', label: 'Unemployed (thousands)' },
      { name: 'u_rate', type: 'number', label: 'Unemployment Rate (%)', required: true },
    ],
    valueField: 'u_rate',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: '%',
    priority_order: 6,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  exchangerates_daily: {
    apiId: 'exchangerates_daily',
    yamlSource: 'exchangerates_daily.yaml',
    title_ms: 'Kadar Pertukaran Harian',
    title_en: 'Daily Exchange Rates',
    frequency: 'daily',
    geography: 'national',
    category: 'Finance',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Date', required: true },
      { name: 'currency', type: 'string', label: 'Currency', choices: ['USD', 'EUR', 'GBP', 'JPY', 'SGD', 'CNY', 'THB', 'IDR', 'KRW', 'AUD'], required: true },
      { name: 'rate', type: 'number', label: 'Exchange Rate (MYR per unit)', required: true },
    ],
    valueField: 'rate',
    dateField: 'date',
    groupField: 'currency',
    defaultFilter: { currency: 'USD' },
    unit: 'MYR',
    priority_order: 7,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  hies_malaysia: {
    apiId: 'hies_malaysia',
    yamlSource: 'hies_malaysia.yaml',
    title_ms: 'Pendapatan dan Perbelanjaan Isi Rumah Malaysia',
    title_en: 'Household Income & Expenditure - Malaysia',
    frequency: 'biennial',
    geography: 'national',
    category: 'Households',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'variable', type: 'string', label: 'Variable', required: true },
      { name: 'value', type: 'number', label: 'Value', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'variable',
    defaultFilter: {},
    unit: 'RM',
    priority_order: 8,
    status: 'VERIFIED',
    notes: 'Variable choices include income_mean, income_median, expenditure_mean, gini. HIES = Household Income and Expenditure Survey.',
  } satisfies GroundTruthDataset,

  hies_state: {
    apiId: 'hies_state',
    yamlSource: 'hies_state.yaml',
    title_ms: 'Pendapatan dan Perbelanjaan Isi Rumah mengikut Negeri',
    title_en: 'Household Income & Expenditure by State',
    frequency: 'biennial',
    geography: 'state',
    category: 'Households',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'variable', type: 'string', label: 'Variable', required: true },
      { name: 'value', type: 'number', label: 'Value', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: 'RM',
    priority_order: 9,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  hpi_malaysia: {
    apiId: 'hpi_malaysia',
    yamlSource: 'hpi_malaysia.yaml',
    title_ms: 'Indeks Harga Rumah Malaysia',
    title_en: 'House Price Index - Malaysia',
    frequency: 'quarterly',
    geography: 'national',
    category: 'Prices',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Quarter', required: true },
      { name: 'series', type: 'string', label: 'Series Type', required: true },
      { name: 'index', type: 'number', label: 'House Price Index', required: true },
    ],
    valueField: 'index',
    dateField: 'date',
    groupField: 'series',
    defaultFilter: {},
    unit: 'Index',
    priority_order: 10,
    status: 'VERIFIED',
    notes: 'Field is "index" not "hpi". Series types may include overall, terrace, detached, high-rise, etc.',
  } satisfies GroundTruthDataset,

  births: {
    apiId: 'births',
    yamlSource: 'births.yaml',
    title_ms: 'Kelahiran Hidup',
    title_en: 'Live Births',
    frequency: 'monthly',
    geography: 'national',
    category: 'Demography',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'sex', type: 'string', label: 'Sex', choices: ['male', 'female', 'both'] },
      { name: 'abs', type: 'number', label: 'Absolute Count' },
      { name: 'rate', type: 'number', label: 'Crude Birth Rate (per 1000)' },
    ],
    valueField: 'abs',
    dateField: 'date',
    groupField: 'sex',
    defaultFilter: { sex: 'both' },
    unit: 'persons',
    priority_order: 11,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  deaths: {
    apiId: 'deaths',
    yamlSource: 'deaths.yaml',
    title_ms: 'Kematian',
    title_en: 'Deaths',
    frequency: 'monthly',
    geography: 'national',
    category: 'Demography',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'sex', type: 'string', label: 'Sex', choices: ['male', 'female', 'both'] },
      { name: 'abs', type: 'number', label: 'Absolute Count' },
      { name: 'rate', type: 'number', label: 'Crude Death Rate (per 1000)' },
    ],
    valueField: 'abs',
    dateField: 'date',
    groupField: 'sex',
    defaultFilter: { sex: 'both' },
    unit: 'persons',
    priority_order: 12,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  ipi: {
    apiId: 'ipi',
    yamlSource: 'ipi.yaml',
    title_ms: 'Indeks Pengeluaran Perindustrian',
    title_en: 'Industrial Production Index',
    frequency: 'monthly',
    geography: 'national',
    category: 'Economy',
    priority: 'P1',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', required: true },
      { name: 'value', type: 'number', label: 'IPI Value', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: {},
    unit: 'Index',
    priority_order: 13,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  // ══════════════════════════════════════════════════════════════
  // P2 — Standard Datasets (9 datasets)
  // ══════════════════════════════════════════════════════════════

  lfs_district: {
    apiId: 'lfs_district',
    yamlSource: 'lfs_district.yaml',
    title_ms: 'Tenaga Buruh mengikut Daerah',
    title_en: 'Labour Force by District',
    frequency: 'annual',
    geography: 'district',
    category: 'Labour',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', required: true },
      { name: 'district', type: 'string', label: 'District', required: true },
      { name: 'u_rate', type: 'number', label: 'Unemployment Rate (%)', required: true },
    ],
    valueField: 'u_rate',
    dateField: 'date',
    groupField: 'district',
    defaultFilter: {},
    unit: '%',
    priority_order: 1,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  cpi_3d: {
    apiId: 'cpi_3d',
    yamlSource: 'cpi_3d.yaml',
    title_ms: 'IHP mengikut Kategori',
    title_en: 'CPI by Category',
    frequency: 'monthly',
    geography: 'national',
    category: 'Prices',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'category', type: 'string', label: 'COICOP Category', required: true },
      { name: 'cpi', type: 'number', label: 'CPI Index', required: true },
    ],
    valueField: 'cpi',
    dateField: 'date',
    groupField: 'category',
    defaultFilter: {},
    unit: 'Index',
    priority_order: 2,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  trade_sitc_1d: {
    apiId: 'trade_sitc_1d',
    yamlSource: 'trade_sitc_1d.yaml',
    title_ms: 'Perdagangan mengikut Komoditi (SITC)',
    title_en: 'Trade by Commodity (SITC)',
    frequency: 'monthly',
    geography: 'national',
    category: 'Trade',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'sitc', type: 'string', label: 'SITC Category', required: true },
      { name: 'flow', type: 'string', label: 'Flow Direction', choices: ['exports', 'imports'], required: true },
      { name: 'value', type: 'number', label: 'Value (RM Million)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'sitc',
    defaultFilter: {},
    unit: 'RM Million',
    priority_order: 3,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  ridership_headline: {
    apiId: 'ridership_headline',
    yamlSource: 'ridership_headline.yaml',
    title_ms: 'Penumpang Pengangkutan Awam',
    title_en: 'Public Transport Ridership',
    frequency: 'monthly',
    geography: 'national',
    category: 'Transport',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'service', type: 'string', label: 'Service', required: true },
      { name: 'ridership', type: 'number', label: 'Ridership', required: true },
    ],
    valueField: 'ridership',
    dateField: 'date',
    groupField: 'service',
    defaultFilter: {},
    unit: 'persons',
    priority_order: 4,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  crime_index: {
    apiId: 'crime_index',
    yamlSource: 'crime_index.yaml',
    title_ms: 'Jenayah Indeks',
    title_en: 'Index Crime',
    frequency: 'annual',
    geography: 'state',
    category: 'Safety',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'type', type: 'string', label: 'Crime Type', required: true },
      { name: 'cases', type: 'number', label: 'Number of Cases', required: true },
    ],
    valueField: 'cases',
    dateField: 'date',
    groupField: 'type',
    defaultFilter: {},
    unit: 'cases',
    priority_order: 5,
    status: 'VERIFIED',
    notes: 'Previously used "crime_district" as API ID. The correct ID is "crime_index".',
  } satisfies GroundTruthDataset,

  blood_donations: {
    apiId: 'blood_donations',
    yamlSource: 'blood_donations.yaml',
    title_ms: 'Penderma Darah',
    title_en: 'Blood Donations',
    frequency: 'daily',
    geography: 'state',
    category: 'Healthcare',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Date', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'daily', type: 'number', label: 'Daily Donations', required: true },
    ],
    valueField: 'daily',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: 'persons',
    priority_order: 6,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  pricecatcher_week: {
    apiId: 'pricecatcher_week',
    yamlSource: 'pricecatcher_week.yaml',
    title_ms: 'Penangkap Harga (Mingguan)',
    title_en: 'PriceCatcher (Weekly)',
    frequency: 'weekly',
    geography: 'district',
    category: 'Prices',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Week', required: true },
      { name: 'district', type: 'string', label: 'District', required: true },
      { name: 'premise_type', type: 'string', label: 'Premise Type' },
      { name: 'item_code', type: 'string', label: 'Item Code' },
      { name: 'item_category', type: 'string', label: 'Item Category' },
      { name: 'price', type: 'number', label: 'Price (RM)', required: true },
    ],
    valueField: 'price',
    dateField: 'date',
    groupField: 'item_category',
    defaultFilter: {},
    unit: 'RM',
    priority_order: 7,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  marriages: {
    apiId: 'marriages',
    yamlSource: 'marriages.yaml',
    title_ms: 'Perkahwinan',
    title_en: 'Marriages',
    frequency: 'monthly',
    geography: 'national',
    category: 'Demography',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'religion', type: 'string', label: 'Religion', required: true },
      { name: 'abs', type: 'number', label: 'Absolute Count', required: true },
    ],
    valueField: 'abs',
    dateField: 'date',
    groupField: 'religion',
    defaultFilter: {},
    unit: 'couples',
    priority_order: 8,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  divorces: {
    apiId: 'divorces',
    yamlSource: 'divorces.yaml',
    title_ms: 'Perceraian',
    title_en: 'Divorces',
    frequency: 'monthly',
    geography: 'national',
    category: 'Demography',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'religion', type: 'string', label: 'Religion', required: true },
      { name: 'abs', type: 'number', label: 'Absolute Count', required: true },
    ],
    valueField: 'abs',
    dateField: 'date',
    groupField: 'religion',
    defaultFilter: {},
    unit: 'couples',
    priority_order: 9,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  // ══════════════════════════════════════════════════════════════
  // P3 — Supplementary Datasets (17 datasets)
  // ══════════════════════════════════════════════════════════════

  ppi: {
    apiId: 'ppi',
    yamlSource: 'ppi.yaml',
    title_ms: 'Indeks Harga Pengeluar',
    title_en: 'Producer Price Index',
    frequency: 'monthly',
    geography: 'national',
    category: 'Prices',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', required: true },
      { name: 'value', type: 'number', label: 'PPI Value', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: {},
    unit: 'Index',
    priority_order: 1,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  bop: {
    apiId: 'bop',
    yamlSource: 'bop.yaml',
    title_ms: 'Imbangan Pembayaran',
    title_en: 'Balance of Payments',
    frequency: 'quarterly',
    geography: 'national',
    category: 'Economy',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Quarter', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', required: true },
      { name: 'value', type: 'number', label: 'Value (RM Million)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: {},
    unit: 'RM Million',
    priority_order: 2,
    status: 'NEEDS_VERIFY',
    notes: 'Previously "bop_balance". Need to verify that the API ID is "bop" (not "bop_balance").',
  } satisfies GroundTruthDataset,

  fdi: {
    apiId: 'fdi',
    yamlSource: 'fdi.yaml',
    title_ms: 'Pelaburan Langsung Asing',
    title_en: 'Foreign Direct Investment',
    frequency: 'quarterly',
    geography: 'national',
    category: 'Economy',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Quarter', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', required: true },
      { name: 'value', type: 'number', label: 'Value (RM Million)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: {},
    unit: 'RM Million',
    priority_order: 3,
    status: 'NEEDS_VERIFY',
    notes: 'Previously "fdi_flows". Need to verify that the API ID is "fdi" (not "fdi_flows").',
  } satisfies GroundTruthDataset,

  interestrates: {
    apiId: 'interestrates',
    yamlSource: 'interestrates.yaml',
    title_ms: 'Kadar Faedah',
    title_en: 'Interest Rates',
    frequency: 'daily',
    geography: 'national',
    category: 'Finance',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Date', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', required: true },
      { name: 'rate', type: 'number', label: 'Rate (%)', required: true },
    ],
    valueField: 'rate',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: {},
    unit: '%',
    priority_order: 4,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  monetary_aggregates: {
    apiId: 'monetary_aggregates',
    yamlSource: 'monetary_aggregates.yaml',
    title_ms: 'Agregat Kewangan',
    title_en: 'Monetary Aggregates',
    frequency: 'monthly',
    geography: 'national',
    category: 'Finance',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', choices: ['M1', 'M2', 'M3'], required: true },
      { name: 'value', type: 'number', label: 'Value (RM Million)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: { series_type: 'M3' },
    unit: 'RM Million',
    priority_order: 5,
    status: 'NEEDS_VERIFY',
    notes: 'Need to verify exact API ID and field names from YAML.',
  } satisfies GroundTruthDataset,

  federal_finance_year: {
    apiId: 'federal_finance_year',
    yamlSource: 'federal_finance_year.yaml',
    title_ms: 'Kewangan Kerajaan Persekutuan Tahunan',
    title_en: 'Federal Government Finance (Annual)',
    frequency: 'annual',
    geography: 'national',
    category: 'Finance',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', required: true },
      { name: 'value', type: 'number', label: 'Value (RM Million)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: {},
    unit: 'RM Million',
    priority_order: 6,
    status: 'NEEDS_VERIFY',
    notes: 'Series types include revenue, operating_expenditure, development_expenditure, etc. The old "federal_finance_year_revenue" was just a filter on this same dataset.',
  } satisfies GroundTruthDataset,

  forest_reserve_state: {
    apiId: 'forest_reserve_state',
    yamlSource: 'forest_reserve_state.yaml',
    title_ms: 'Hutan Simpan mengikut Negeri',
    title_en: 'Forest Reserve by State',
    frequency: 'annual',
    geography: 'state',
    category: 'Environment',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'area_ha', type: 'number', label: 'Area (hectares)', required: true },
    ],
    valueField: 'area_ha',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: 'hectares',
    priority_order: 7,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  fertility: {
    apiId: 'fertility',
    yamlSource: 'fertility.yaml',
    title_ms: 'Kadar Kesuburan',
    title_en: 'Fertility Rate',
    frequency: 'annual',
    geography: 'national',
    category: 'Demography',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'sex', type: 'string', label: 'Sex', choices: ['male', 'female', 'both'] },
      { name: 'tfr', type: 'number', label: 'Total Fertility Rate', required: true },
    ],
    valueField: 'tfr',
    dateField: 'date',
    groupField: 'sex',
    defaultFilter: { sex: 'female' },
    unit: 'rate',
    priority_order: 8,
    status: 'VERIFIED',
  } satisfies GroundTruthDataset,

  lfs_month_sa: {
    apiId: 'lfs_month_sa',
    yamlSource: 'lfs_month_sa.yaml',
    title_ms: 'Tenaga Buruh Bulanan (Laras Musim)',
    title_en: 'Monthly Labour Force (Seasonally Adjusted)',
    frequency: 'monthly',
    geography: 'national',
    category: 'Labour',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'lf', type: 'number', label: 'Labour Force (thousands)' },
      { name: 'lf_employed', type: 'number', label: 'Employed (thousands)' },
      { name: 'lf_unemployed', type: 'number', label: 'Unemployed (thousands)' },
      { name: 'u_rate', type: 'number', label: 'Unemployment Rate (%)', required: true },
    ],
    valueField: 'u_rate',
    dateField: 'date',
    defaultFilter: {},
    unit: '%',
    priority_order: 9,
    status: 'NEEDS_VERIFY',
    notes: 'Need to verify that lfs_month_sa exists as a separate API dataset from lfs_month.',
  } satisfies GroundTruthDataset,

  poverty_absolute: {
    apiId: 'poverty_absolute',
    yamlSource: 'poverty_absolute.yaml',
    title_ms: 'Kemiskinan Mutlak',
    title_en: 'Absolute Poverty',
    frequency: 'biennial',
    geography: 'state',
    category: 'Households',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'value', type: 'number', label: 'Poverty Rate (%)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: '%',
    priority_order: 10,
    status: 'NEEDS_VERIFY',
    notes: 'Previously "hh_poverty_state". Need to verify exact API ID — could be "poverty" or "poverty_absolute".',
  } satisfies GroundTruthDataset,

  employment_sector: {
    apiId: 'employment_sector',
    yamlSource: 'employment_sector.yaml',
    title_ms: 'Pekerjaan mengikut Sektor',
    title_en: 'Employment by Sector',
    frequency: 'annual',
    geography: 'national',
    category: 'Labour',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'sector', type: 'string', label: 'Economic Sector', required: true },
      { name: 'employed', type: 'number', label: 'Employed (thousands)', required: true },
    ],
    valueField: 'employed',
    dateField: 'date',
    groupField: 'sector',
    defaultFilter: {},
    unit: 'thousands',
    priority_order: 11,
    status: 'NEEDS_VERIFY',
    notes: 'Need to verify exact API ID. May not exist as a standalone dataset — could be derived from lfs tables.',
  } satisfies GroundTruthDataset,

  productivity_annual: {
    apiId: 'productivity_annual',
    yamlSource: 'productivity_annual.yaml',
    title_ms: 'Produktiviti Buruh',
    title_en: 'Labour Productivity',
    frequency: 'annual',
    geography: 'national',
    category: 'Labour',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', required: true },
      { name: 'value', type: 'number', label: 'Productivity Index', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: {},
    unit: 'Index',
    priority_order: 12,
    status: 'NEEDS_VERIFY',
    notes: 'Need to verify exact API ID. May be part of a larger productivity dataset.',
  } satisfies GroundTruthDataset,

  school_enrolment: {
    apiId: 'enrolment_school_district',
    yamlSource: 'enrolment_school_district.yaml',
    title_ms: 'Enrolmen Sekolah',
    title_en: 'School Enrolment',
    frequency: 'annual',
    geography: 'state',
    category: 'Education',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', required: true },
      { name: 'level', type: 'string', label: 'Education Level', required: true },
      { name: 'enrolment', type: 'number', label: 'Enrolment Count', required: true },
    ],
    valueField: 'enrolment',
    dateField: 'date',
    groupField: 'level',
    defaultFilter: {},
    unit: 'persons',
    priority_order: 13,
    status: 'NEEDS_VERIFY',
    notes: 'Exact API ID uncertain. Could be "enrolment_school_district", "school_enrolment", or similar.',
  } satisfies GroundTruthDataset,

  vehicle_registration: {
    apiId: 'registration_transactions_all',
    yamlSource: 'registration_transactions_all.yaml',
    title_ms: 'Pendaftaran Kenderaan',
    title_en: 'Vehicle Registration',
    frequency: 'monthly',
    geography: 'national',
    category: 'Transport',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'type', type: 'string', label: 'Vehicle Type', required: true },
      { name: 'registered', type: 'number', label: 'Registered Count', required: true },
    ],
    valueField: 'registered',
    dateField: 'date',
    groupField: 'type',
    defaultFilter: {},
    unit: 'units',
    priority_order: 14,
    status: 'NEEDS_VERIFY',
    notes: 'Exact API ID uncertain. "registration_transactions_all" is the best guess from the YAML repo.',
  } satisfies GroundTruthDataset,

  air_pollution: {
    apiId: 'air_pollution',
    yamlSource: 'air_pollution.yaml',
    title_ms: 'Indeks Pencemaran Udara',
    title_en: 'Air Pollution Index',
    frequency: 'daily',
    geography: 'state',
    category: 'Environment',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Date', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'api', type: 'number', label: 'Air Pollutant Index', required: true },
    ],
    valueField: 'api',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: 'API',
    priority_order: 15,
    status: 'NEEDS_VERIFY',
    notes: 'Need to verify exact API ID and field names. "api" as value field may be "value" instead.',
  } satisfies GroundTruthDataset,

  electricity_supply: {
    apiId: 'electricity_supply',
    yamlSource: 'electricity_supply.yaml',
    title_ms: 'Bekalan Elektrik',
    title_en: 'Electricity Supply',
    frequency: 'monthly',
    geography: 'national',
    category: 'Environment',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', required: true },
      { name: 'value', type: 'number', label: 'Value (GWh)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: {},
    unit: 'GWh',
    priority_order: 16,
    status: 'NEEDS_VERIFY',
    notes: 'Need to verify exact API ID from YAML repo.',
  } satisfies GroundTruthDataset,

  crops_state: {
    apiId: 'crops_state',
    yamlSource: 'crops_state.yaml',
    title_ms: 'Tanaman Pertanian mengikut Negeri',
    title_en: 'Agricultural Crops by State',
    frequency: 'annual',
    geography: 'state',
    category: 'Agriculture',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'production', type: 'number', label: 'Production (metric tonnes)', required: true },
    ],
    valueField: 'production',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: 'metric tonnes',
    priority_order: 17,
    status: 'NEEDS_VERIFY',
    notes: 'Need to verify exact API ID and field names from YAML.',
  } satisfies GroundTruthDataset,

  fish_landings: {
    apiId: 'fish_landings',
    yamlSource: 'fish_landings.yaml',
    title_ms: 'Pendaratan Ikan',
    title_en: 'Fish Landings',
    frequency: 'monthly',
    geography: 'state',
    category: 'Agriculture',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'landings', type: 'number', label: 'Landings (metric tonnes)', required: true },
    ],
    valueField: 'landings',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: 'metric tonnes',
    priority_order: 18,
    status: 'NEEDS_VERIFY',
    notes: 'Need to verify exact API ID and field names from YAML.',
  } satisfies GroundTruthDataset,

  cellular_subscribers: {
    apiId: 'cellular_subscribers',
    yamlSource: 'cellular_subscribers.yaml',
    title_ms: 'Pelanggan Selular',
    title_en: 'Cellular Subscribers',
    frequency: 'quarterly',
    geography: 'national',
    category: 'Digital',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Quarter', required: true },
      { name: 'type', type: 'string', label: 'Subscription Type', required: true },
      { name: 'subscriptions', type: 'number', label: 'Subscriptions (millions)', required: true },
    ],
    valueField: 'subscriptions',
    dateField: 'date',
    groupField: 'type',
    defaultFilter: {},
    unit: 'millions',
    priority_order: 19,
    status: 'NEEDS_VERIFY',
    notes: 'Need to verify exact API ID and field names from YAML.',
  } satisfies GroundTruthDataset,

  // ══════════════════════════════════════════════════════════════
  // P2 — Additional Datasets (3 new)
  // ══════════════════════════════════════════════════════════════

  deaths_cause: {
    apiId: 'deaths_cause',
    yamlSource: 'deaths_cause.yaml',
    title_ms: 'Kematian mengikut Punca',
    title_en: 'Deaths by Cause',
    frequency: 'annual',
    geography: 'national',
    category: 'Demography',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'cause', type: 'string', label: 'Cause of Death', required: true },
      { name: 'sex', type: 'string', label: 'Sex', choices: ['male', 'female', 'both'] },
      { name: 'abs', type: 'number', label: 'Absolute Count', required: true },
    ],
    valueField: 'abs',
    dateField: 'date',
    groupField: 'cause',
    defaultFilter: { sex: 'both' },
    unit: 'persons',
    priority_order: 10,
    status: 'NEEDS_VERIFY',
    notes: 'High value — shows leading causes of death in Malaysia',
  } satisfies GroundTruthDataset,

  lfs_edu: {
    apiId: 'lfs_edu',
    yamlSource: 'lfs_edu.yaml',
    title_ms: 'Tenaga Buruh mengikut Pendidikan',
    title_en: 'Labour Force by Education',
    frequency: 'annual',
    geography: 'national',
    category: 'Labour',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'edu', type: 'string', label: 'Education Level', required: true },
      { name: 'lf_employed', type: 'number', label: 'Employed (thousands)' },
      { name: 'u_rate', type: 'number', label: 'Unemployment Rate (%)', required: true },
    ],
    valueField: 'u_rate',
    dateField: 'date',
    groupField: 'edu',
    defaultFilter: {},
    unit: '%',
    priority_order: 11,
    status: 'NEEDS_VERIFY',
    notes: 'Shows education-unemployment link',
  } satisfies GroundTruthDataset,

  trade_country: {
    apiId: 'trade_country',
    yamlSource: 'trade_country.yaml',
    title_ms: 'Perdagangan mengikut Negara Rakan',
    title_en: 'Trade by Partner Country',
    frequency: 'monthly',
    geography: 'national',
    category: 'Trade',
    priority: 'P2',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'country', type: 'string', label: 'Partner Country', required: true },
      { name: 'flow', type: 'string', label: 'Flow Direction', choices: ['exports', 'imports'], required: true },
      { name: 'value', type: 'number', label: 'Value (RM Million)', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'country',
    defaultFilter: {},
    unit: 'RM Million',
    priority_order: 12,
    status: 'NEEDS_VERIFY',
    notes: 'Shows top trading partners',
  } satisfies GroundTruthDataset,

  // ══════════════════════════════════════════════════════════════
  // P3 — Additional Datasets (4 new)
  // ══════════════════════════════════════════════════════════════

  population_parlimen: {
    apiId: 'population_parlimen',
    yamlSource: 'population_parlimen.yaml',
    title_ms: 'Penduduk mengikut Kawasan Parlimen',
    title_en: 'Population by Parliament Constituency',
    frequency: 'annual',
    geography: 'state',
    category: 'Demography',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', required: true },
      { name: 'parlimen', type: 'string', label: 'Parliament Constituency', required: true },
      { name: 'population', type: 'number', label: 'Population', required: true },
    ],
    valueField: 'population',
    dateField: 'date',
    groupField: 'parlimen',
    defaultFilter: {},
    unit: 'persons',
    priority_order: 9,
    status: 'NEEDS_VERIFY',
    notes: 'Combines demographics with electoral geography',
  } satisfies GroundTruthDataset,

  poverty_state: {
    apiId: 'poverty_state',
    yamlSource: 'poverty_state.yaml',
    title_ms: 'Kadar Kemiskinan mengikut Negeri',
    title_en: 'Poverty Rate by State',
    frequency: 'biennial',
    geography: 'state',
    category: 'Households',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'incidence', type: 'number', label: 'Poverty Incidence (%)', required: true },
      { name: 'hardcore', type: 'number', label: 'Hardcore Poverty (%)' },
    ],
    valueField: 'incidence',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: '%',
    priority_order: 10,
    status: 'NEEDS_VERIFY',
    notes: 'Critical for welfare intelligence. May be under different API ID.',
  } satisfies GroundTruthDataset,

  road_accidents: {
    apiId: 'road_accidents',
    yamlSource: 'road_accidents.yaml',
    title_ms: 'Kemalangan Jalan Raya',
    title_en: 'Road Accidents',
    frequency: 'annual',
    geography: 'state',
    category: 'Safety',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Year', required: true },
      { name: 'state', type: 'string', label: 'State', choices: STATE_NAMES_PLACEHOLDER, required: true },
      { name: 'accidents', type: 'number', label: 'Number of Accidents', required: true },
      { name: 'deaths', type: 'number', label: 'Number of Deaths' },
      { name: 'injuries', type: 'number', label: 'Number of Injuries' },
    ],
    valueField: 'accidents',
    dateField: 'date',
    groupField: 'state',
    defaultFilter: {},
    unit: 'cases',
    priority_order: 11,
    status: 'NEEDS_VERIFY',
    notes: 'Safety intelligence — can correlate with fuel prices',
  } satisfies GroundTruthDataset,

  palm_oil: {
    apiId: 'palm_oil',
    yamlSource: 'palm_oil.yaml',
    title_ms: 'Statistik Minyak Sawit',
    title_en: 'Palm Oil Statistics',
    frequency: 'monthly',
    geography: 'national',
    category: 'Agriculture',
    priority: 'P3',
    fields: [
      { name: 'date', type: 'date', label: 'Month', required: true },
      { name: 'series_type', type: 'string', label: 'Series Type', required: true },
      { name: 'value', type: 'number', label: 'Value', required: true },
    ],
    valueField: 'value',
    dateField: 'date',
    groupField: 'series_type',
    defaultFilter: {},
    unit: 'tonnes',
    priority_order: 12,
    status: 'NEEDS_VERIFY',
    notes: "Malaysia's top export commodity. NEEDS_VERIFY: exact API ID and field names.",
  } satisfies GroundTruthDataset,

} as const;

// Derive the union type from registry keys
export type GroundTruthDatasetId = keyof typeof GROUND_TRUTH_REGISTRY;

// ══════════════════════════════════════════════════════════════════
// 3. STATIC_FALLBACKS — Realistic approximate data for P0/P1
// ══════════════════════════════════════════════════════════════════
// These values are approximate (2024 era) so the UI is never empty.
// Field names match the GROUND_TRUTH_REGISTRY exactly.

export const STATIC_FALLBACKS: Record<string, { data: Record<string, unknown>[] }> = {

  gdp_qtr: {
    data: [
      { date: '2024-Q3', series_type: 'real', value: 432.1 },
      { date: '2024-Q2', series_type: 'real', value: 417.8 },
      { date: '2024-Q1', series_type: 'real', value: 408.5 },
      { date: '2023-Q4', series_type: 'real', value: 402.3 },
    ],
  },

  cpi_headline: {
    data: [
      { date: '2024-09', cpi: 132.4, core_cpi: 129.8 },
      { date: '2024-08', cpi: 132.1, core_cpi: 129.5 },
      { date: '2024-07', cpi: 131.8, core_cpi: 129.3 },
      { date: '2024-06', cpi: 131.5, core_cpi: 129.0 },
    ],
  },

  lfs_month: {
    data: [
      { date: '2024-09', lf: 16850, lf_employed: 16277, lf_unemployed: 573, u_rate: 3.4 },
      { date: '2024-08', lf: 16820, lf_employed: 16251, lf_unemployed: 569, u_rate: 3.4 },
      { date: '2024-07', lf: 16790, lf_employed: 16228, lf_unemployed: 562, u_rate: 3.3 },
      { date: '2024-06', lf: 16760, lf_employed: 16205, lf_unemployed: 555, u_rate: 3.3 },
    ],
  },

  fuelprice: {
    data: [
      { date: '2024-10-03', ron95: 2.05, ron97: 3.47, diesel: 3.35, diesel_east: 3.15 },
      { date: '2024-09-26', ron95: 2.05, ron97: 3.44, diesel: 3.30, diesel_east: 3.10 },
      { date: '2024-09-19', ron95: 2.05, ron97: 3.40, diesel: 3.25, diesel_east: 3.05 },
      { date: '2024-09-12', ron95: 2.05, ron97: 3.38, diesel: 3.20, diesel_east: 3.00 },
    ],
  },

  trade_monthly: {
    data: [
      { date: '2024-09', exports: 125400, imports: 109800, balance: 15600 },
      { date: '2024-08', exports: 123800, imports: 108500, balance: 15300 },
      { date: '2024-07', exports: 122100, imports: 107200, balance: 14900 },
      { date: '2024-06', exports: 120500, imports: 105800, balance: 14700 },
    ],
  },

  exchangerates_monthly: {
    data: [
      { date: '2024-09', currency: 'USD', rate: 4.72 },
      { date: '2024-09', currency: 'EUR', rate: 5.24 },
      { date: '2024-09', currency: 'GBP', rate: 6.28 },
      { date: '2024-08', currency: 'USD', rate: 4.68 },
      { date: '2024-08', currency: 'EUR', rate: 5.18 },
      { date: '2024-08', currency: 'GBP', rate: 6.20 },
    ],
  },

  population_malaysia: {
    data: [
      { date: '2024', ethnicity: 'Overall', sex: 'Both', age: 0, population: 33400 },
      { date: '2024', ethnicity: 'Overall', sex: 'Male', age: 0, population: 17300 },
      { date: '2024', ethnicity: 'Overall', sex: 'Female', age: 0, population: 16100 },
      { date: '2023', ethnicity: 'Overall', sex: 'Both', age: 0, population: 33080 },
    ],
  },

  population_state: {
    data: [
      { date: '2024', state: 'Selangor', ethnicity: 'Overall', sex: 'Both', age: 0, population: 7100 },
      { date: '2024', state: 'Johor', ethnicity: 'Overall', sex: 'Both', age: 0, population: 4050 },
      { date: '2024', state: 'Sabah', ethnicity: 'Overall', sex: 'Both', age: 0, population: 3900 },
      { date: '2024', state: 'W.P. Kuala Lumpur', ethnicity: 'Overall', sex: 'Both', age: 0, population: 1980 },
    ],
  },

  gdp_annual: {
    data: [
      { date: '2023', series_type: 'real', value: 1598.2 },
      { date: '2022', series_type: 'real', value: 1547.8 },
      { date: '2021', series_type: 'real', value: 1462.3 },
      { date: '2020', series_type: 'real', value: 1368.5 },
    ],
  },

  gdp_state: {
    data: [
      { date: '2023', state: 'Selangor', series_type: 'real', value: 348.5 },
      { date: '2023', state: 'W.P. Kuala Lumpur', series_type: 'real', value: 237.2 },
      { date: '2023', state: 'Johor', series_type: 'real', value: 178.4 },
      { date: '2023', state: 'Sarawak', series_type: 'real', value: 152.7 },
    ],
  },

  cpi_2d: {
    data: [
      { date: '2024-09', division: 'Food & Beverages', cpi: 148.3 },
      { date: '2024-09', division: 'Housing, Water, Electricity, Gas & Fuels', cpi: 126.5 },
      { date: '2024-09', division: 'Transport', cpi: 118.2 },
      { date: '2024-08', division: 'Food & Beverages', cpi: 147.9 },
    ],
  },

  cpi_state: {
    data: [
      { date: '2024-09', state: 'W.P. Kuala Lumpur', cpi: 138.7 },
      { date: '2024-09', state: 'Selangor', cpi: 134.2 },
      { date: '2024-09', state: 'Pulau Pinang', cpi: 131.5 },
      { date: '2024-09', state: 'Johor', cpi: 129.8 },
    ],
  },

  lfs_qtr: {
    data: [
      { date: '2024-Q3', lf: 16850, lf_employed: 16277, lf_unemployed: 573, u_rate: 3.4 },
      { date: '2024-Q2', lf: 16760, lf_employed: 16205, lf_unemployed: 555, u_rate: 3.3 },
      { date: '2024-Q1', lf: 16680, lf_employed: 16130, lf_unemployed: 550, u_rate: 3.3 },
    ],
  },

  lfs_state: {
    data: [
      { date: '2023', state: 'Selangor', lf: 4200, lf_employed: 4070, lf_unemployed: 130, u_rate: 3.1 },
      { date: '2023', state: 'Johor', lf: 2050, lf_employed: 1980, lf_unemployed: 70, u_rate: 3.4 },
      { date: '2023', state: 'Pulau Pinang', lf: 1180, lf_employed: 1145, lf_unemployed: 35, u_rate: 3.0 },
    ],
  },

  exchangerates_daily: {
    data: [
      { date: '2024-10-01', currency: 'USD', rate: 4.72 },
      { date: '2024-09-30', currency: 'USD', rate: 4.70 },
      { date: '2024-09-29', currency: 'USD', rate: 4.71 },
      { date: '2024-09-28', currency: 'USD', rate: 4.69 },
    ],
  },

  hies_malaysia: {
    data: [
      { date: '2023', variable: 'income_median', value: 6338 },
      { date: '2023', variable: 'income_mean', value: 8479 },
      { date: '2023', variable: 'gini', value: 0.407 },
      { date: '2022', variable: 'income_median', value: 6126 },
    ],
  },

  hies_state: {
    data: [
      { date: '2023', state: 'W.P. Kuala Lumpur', variable: 'income_median', value: 10249 },
      { date: '2023', state: 'Selangor', variable: 'income_median', value: 9573 },
      { date: '2023', state: 'Johor', variable: 'income_median', value: 7060 },
      { date: '2023', state: 'Kelantan', variable: 'income_median', value: 3562 },
    ],
  },

  hpi_malaysia: {
    data: [
      { date: '2024-Q2', series: 'overall', index: 223.4 },
      { date: '2024-Q1', series: 'overall', index: 220.8 },
      { date: '2023-Q4', series: 'overall', index: 218.2 },
      { date: '2023-Q3', series: 'overall', index: 215.7 },
    ],
  },

  births: {
    data: [
      { date: '2024-09', sex: 'Both', abs: 42100, rate: 13.1 },
      { date: '2024-08', sex: 'Both', abs: 41500, rate: 13.0 },
      { date: '2024-07', sex: 'Both', abs: 43200, rate: 13.4 },
    ],
  },

  deaths: {
    data: [
      { date: '2024-09', sex: 'Both', abs: 15800, rate: 5.1 },
      { date: '2024-08', sex: 'Both', abs: 15200, rate: 4.9 },
      { date: '2024-07', sex: 'Both', abs: 15500, rate: 5.0 },
    ],
  },

  ipi: {
    data: [
      { date: '2024-09', series_type: 'overall', value: 112.3 },
      { date: '2024-08', series_type: 'overall', value: 111.8 },
      { date: '2024-07', series_type: 'overall', value: 110.5 },
    ],
  },

  fuelprice_extended: {
    data: [
      { date: '2024-10-03', ron95: 2.05, ron97: 3.47, diesel: 3.35, diesel_east: 3.15 },
      { date: '2024-09-26', ron95: 2.05, ron97: 3.44, diesel: 3.30, diesel_east: 3.10 },
    ],
  },
};

// ══════════════════════════════════════════════════════════════════
// 5. API_REFERENCE — Developer documentation for api.data.gov.my
// ══════════════════════════════════════════════════════════════════

export const API_REFERENCE = {
  /** Base URL for all data catalogue queries */
  baseUrl: 'https://api.data.gov.my/data-catalogue',

  /** Proxy route used by our frontend */
  proxyUrl: '/api/dosm',

  /** Supported query parameters */
  params: {
    id: {
      type: 'string',
      required: true,
      description: 'Dataset ID (e.g. "gdp_qtr", "cpi_headline")',
      example: 'gdp_qtr',
    },
    limit: {
      type: 'number',
      required: false,
      description: 'Maximum number of rows to return (default varies by dataset)',
      example: '24',
    },
    sort: {
      type: 'string',
      required: false,
      description: 'Sort direction by date field: "asc" or "desc"',
      example: 'desc',
    },
    // Field filters — any column in the dataset can be used as a filter
    // e.g. ?currency=USD, ?state=Selangor, ?series_type=real
    fieldFilters: {
      type: 'string',
      required: false,
      description: 'Filter by any field name=value. Multiple filters supported.',
      example: 'currency=USD&series_type=real',
    },
    // Range filters
    dateRange: {
      type: 'string',
      required: false,
      description: 'Date range filter using date[from] and date[to] params',
      example: 'date[from]=2023-01-01&date[to]=2024-12-31',
    },
  },

  /** Working example queries — these are verified to return data */
  workingExamples: [
    {
      label: 'Quarterly GDP (real, latest 8)',
      url: '?id=gdp_qtr&series_type=real&limit=8&sort=desc',
    },
    {
      label: 'Headline CPI (latest 12)',
      url: '?id=cpi_headline&limit=12&sort=desc',
    },
    {
      label: 'Monthly Labour Force (latest 12)',
      url: '?id=lfs_month&limit=12&sort=desc',
    },
    {
      label: 'Weekly Fuel Prices (latest 4)',
      url: '?id=fuelprice&limit=4&sort=desc',
    },
    {
      label: 'Monthly Trade (latest 6)',
      url: '?id=trade_monthly&limit=6&sort=desc',
    },
    {
      label: 'Exchange Rate USD (latest 12)',
      url: '?id=exchangerates_monthly&currency=USD&limit=12&sort=desc',
    },
    {
      label: 'Population by State (Selangor, latest)',
      url: '?id=population_state&state=Selangor&sex=Both&limit=5&sort=desc',
    },
    {
      label: 'Population Malaysia (latest)',
      url: '?id=population_malaysia&sex=Both&limit=5&sort=desc',
    },
    {
      label: 'Annual GDP (real)',
      url: '?id=gdp_annual&series_type=real&limit=10&sort=desc',
    },
    {
      label: 'GDP by State (Selangor, real)',
      url: '?id=gdp_state&state=Selangor&series_type=real&limit=5&sort=desc',
    },
    {
      label: 'CPI by Division (latest 24)',
      url: '?id=cpi_2d&limit=24&sort=desc',
    },
    {
      label: 'CPI by State (Selangor)',
      url: '?id=cpi_state&state=Selangor&limit=12&sort=desc',
    },
    {
      label: 'IPI (latest 12)',
      url: '?id=ipi&limit=12&sort=desc',
    },
  ],

  /** Expected response format */
  responseFormat: {
    description: 'JSON array of objects, or object with "data" key containing array',
    successExample: {
      data: [
        { date: '2024-Q3', series_type: 'real', value: 432.1 },
        { date: '2024-Q2', series_type: 'real', value: 417.8 },
      ],
    },
    errorExample: {
      error: 'Dataset not found',
      message: 'The requested dataset ID does not exist',
    },
  },

  /** Rate limits and constraints */
  constraints: {
    rateLimit: 'No official rate limit published, but recommended ≤10 req/sec',
    maxLimit: 'Varies by dataset; typically 10,000 rows max per request',
    cors: 'Supported for browser requests',
    https: 'Required — no HTTP fallback',
  },
} as const;

// ══════════════════════════════════════════════════════════════════
// HELPER: Resolve dataset ID with automatic correction
// ══════════════════════════════════════════════════════════════════

/**
 * Resolves a possibly-wrong dataset ID to the correct one.
 * Checks ID_CORRECTIONS first, then returns the original if no correction found.
 */
export function resolveDatasetId(rawId: string): string {
  return ID_CORRECTIONS.get(rawId) ?? rawId;
}

/**
 * Gets the ground truth dataset entry, or null if not found.
 */
export function getGroundTruthDataset(id: GroundTruthDatasetId): GroundTruthDataset {
  return GROUND_TRUTH_REGISTRY[id];
}

/**
 * Gets the API dataset ID for a given ground truth key, with corrections applied.
 */
export function getApiDatasetId(id: GroundTruthDatasetId): string {
  const entry = GROUND_TRUTH_REGISTRY[id];
  return resolveDatasetId(entry.apiId);
}

/**
 * Gets static fallback data for a dataset, or null if none available.
 */
export function getStaticFallback(id: string): Record<string, unknown>[] | null {
  return STATIC_FALLBACKS[id]?.data ?? null;
}

/**
 * Returns all dataset IDs that need verification.
 */
export function getUnverifiedDatasetIds(): GroundTruthDatasetId[] {
  return (Object.keys(GROUND_TRUTH_REGISTRY) as GroundTruthDatasetId[]).filter(
    id => GROUND_TRUTH_REGISTRY[id].status === 'NEEDS_VERIFY'
  );
}

/**
 * Returns all dataset IDs grouped by priority.
 */
export function getDatasetsByPriority(): Record<DatasetPriority, GroundTruthDatasetId[]> {
  const result: Record<DatasetPriority, GroundTruthDatasetId[]> = { P0: [], P1: [], P2: [], P3: [] };
  for (const id of Object.keys(GROUND_TRUTH_REGISTRY) as GroundTruthDatasetId[]) {
    result[GROUND_TRUTH_REGISTRY[id].priority].push(id);
  }
  return result;
}

/**
 * Returns the P0 Command Center KPI dataset IDs.
 */
export function getCommandCenterKpiIds(): GroundTruthDatasetId[] {
  return (Object.keys(GROUND_TRUTH_REGISTRY) as GroundTruthDatasetId[]).filter(
    id => GROUND_TRUTH_REGISTRY[id].priority === 'P0'
  );
}
