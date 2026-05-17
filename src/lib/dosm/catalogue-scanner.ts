// src/lib/dosm/catalogue-scanner.ts
// Complete YAML catalogue from github.com/data-gov-my/datagovmy-meta
// Each entry corresponds to a .yaml file in the data-catalogue directory
// Source: https://github.com/data-gov-my/datagovmy-meta/tree/main/data-catalogue

export const COMPLETE_YAML_CATALOGUE: Record<string, string[]> = {
  // ── GDP prefix ──
  gdp: [
    'gdp_annual',
    'gdp_qtr',
    'gdp_state',
    'gdp_district',
    'gdp_income',
    'gdp_output',
  ],

  // ── CPI prefix ──
  cpi: [
    'cpi_headline',
    'cpi_2d',
    'cpi_3d',
    'cpi_4d',
    'cpi_state',
    'cpi_district',
  ],

  // ── LFS prefix (Labour Force Survey) ──
  lfs: [
    'lfs_month',
    'lfs_month_sa',
    'lfs_qtr',
    'lfs_qtr_sa',
    'lfs_state',
    'lfs_district',
    'lfs_sex',
    'lfs_age',
    'lfs_edu',
    'lfs_sector',
    'lfs_occupation',
  ],

  // ── HIES prefix (Household Income Survey) ──
  hies: [
    'hies_malaysia',
    'hies_state',
    'hies_district',
    'hies_stratum',
    'hies_ethnicity',
    'hies_expenditure',
  ],

  // ── Population prefix ──
  population: [
    'population_malaysia',
    'population_state',
    'population_district',
    'population_parlimen',
    'population_dun',
  ],

  // ── Vital stats ──
  vital: [
    'births',
    'births_state',
    'deaths',
    'deaths_state',
    'deaths_cause',
    'marriages',
    'marriages_state',
    'divorces',
    'divorces_state',
    'fertility',
    'lifetables',
  ],

  // ── Trade prefix ──
  trade: [
    'trade_monthly',
    'trade_annual',
    'trade_sitc_1d',
    'trade_sitc_2d',
    'trade_sitc_3d',
    'trade_bec_1d',
    'trade_country',
    'trade_state',
  ],

  // ── Exchange rates ──
  exchangerates: [
    'exchangerates_daily',
    'exchangerates_monthly',
    'exchangerates_annual',
  ],

  // ── Price catcher ──
  pricecatcher: [
    'pricecatcher_week',
    'pricecatcher_item',
    'pricecatcher_premise',
  ],

  // ── House prices ──
  hpi: [
    'hpi_malaysia',
    'hpi_state',
    'hpi_type',
  ],

  // ── Fuel prices ──
  fuel: [
    'fuelprice',
  ],

  // ── IPI ──
  ipi: [
    'ipi',
    'ipi_2d',
  ],

  // ── Crime ──
  crime: [
    'crime_index',
    'crime_violent',
    'crime_property',
  ],

  // ── Transport ──
  transport: [
    'ridership_headline',
    'ridership_lrt_ampang',
    'ridership_lrt_kelana',
    'ridership_mrt_kajang',
    'ridership_mrt_putrajaya',
    'ridership_monorail',
    'ridership_brt',
    'ridership_ktmb',
    'vehicle_registrations',
    'vehicle_stock',
    'road_accidents',
  ],

  // ── Health (data.gov.my) ──
  health: [
    'blood_donations',
    'hospital_beds',
    'healthcare_staff',
  ],

  // ── Education ──
  education: [
    'enrolment_school',
    'enrolment_hep',
    'teachers',
    'graduates',
  ],

  // ── Finance / Fiscal ──
  finance: [
    'federal_finance_annual',
    'federal_finance_qtr',
    'state_finance',
    'debt',
    'reserves',
    'interestrates',
    'monetary_aggregates',
    'klibor',
  ],

  // ── Agriculture ──
  agriculture: [
    'crops_production',
    'palm_oil',
    'rubber',
    'paddy',
    'livestock',
    'fisheries',
  ],

  // ── Environment ──
  environment: [
    'air_quality',
    'rainfall',
    'temperature',
    'forest_reserve_state',
  ],

  // ── Tourism ──
  tourism: [
    'tourism_arrivals',
    'tourism_receipts',
  ],

  // ── Poverty ──
  poverty: [
    'poverty_absolute',
    'poverty_hardcore',
    'poverty_state',
  ],

  // ── Misc ──
  misc: [
    'iowrt',
    'gni',
    'gfcf',
    'bop',
    'fdi',
    'ppi',
    'productivity',
    'registration_transactions_all',
  ],
};

/** Get all dataset IDs as a flat array */
export function getAllDatasetIds(): string[] {
  return Object.values(COMPLETE_YAML_CATALOGUE).flat();
}

/** Get total count of known datasets */
export function getDatasetCount(): number {
  return getAllDatasetIds().length;
}

/** Check if a dataset ID exists in the catalogue */
export function isKnownDataset(id: string): boolean {
  return getAllDatasetIds().includes(id);
}

/** Find which prefix group a dataset belongs to */
export function findDatasetGroup(id: string): string | null {
  for (const [group, ids] of Object.entries(COMPLETE_YAML_CATALOGUE)) {
    if (ids.includes(id)) return group;
  }
  return null;
}

/** Get datasets by prefix group */
export function getDatasetsByGroup(group: string): string[] {
  return COMPLETE_YAML_CATALOGUE[group] ?? [];
}
