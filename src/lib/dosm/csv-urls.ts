// src/lib/dosm/csv-urls.ts
// Mapping of dataset_id → { category, file } for storage.dosm.gov.my
// URL format: https://storage.dosm.gov.my/{category}/{file}.csv
//
// VERIFIED working CSV URLs on storage.dosm.gov.my (2024-12):
//   gdp/gdp.csv, gdp/gdp_state.csv, population/population_state.csv, etc.
//
// NOTE: The old base URL `https://storage.data.gov.my/data-catalogue/{id}.csv`
// returns 404 for ALL datasets. This mapping uses the correct per-category URLs.

export const CSV_URL_MAP: Record<string, { category: string; file: string }> = {
  // ══════════════════════════════════════════════════════════════════
  // CSV URL mapping for storage.dosm.gov.my
  // URL format: https://storage.dosm.gov.my/{category}/{file}.csv
  //
  // NOTE: CSV IDs must match the REAL working API IDs (not the short aliases).
  // Also includes entries for registry keys so the CSV proxy can find them.
  // ══════════════════════════════════════════════════════════════════

  // ── CPI ──
  cpi_headline: { category: 'cpi', file: 'cpi_headline' },
  cpi_2d: { category: 'cpi', file: 'cpi_2d' },
  cpi_3d: { category: 'cpi', file: 'cpi_3d' },
  cpi_state: { category: 'cpi', file: 'cpi_state' },

  // ── GDP (real API IDs) ──
  gdp_qtr_nominal: { category: 'gdp', file: 'gdp' },
  gdp_annual_nominal_supply: { category: 'gdp', file: 'gdp' },
  gdp_state_real_supply: { category: 'gdp', file: 'gdp_state' },
  // Aliases for registry keys
  gdp_qtr: { category: 'gdp', file: 'gdp' },
  gdp_annual: { category: 'gdp', file: 'gdp' },
  gdp_state: { category: 'gdp', file: 'gdp_state' },
  gdp_growth: { category: 'gdp', file: 'gdp' },

  // ── Labour ──
  lfs_month: { category: 'labour', file: 'lfs_month' },
  lfs_month_sa: { category: 'labour', file: 'lfs_month_sa' },
  lfs_qtr: { category: 'labour', file: 'lfs_qtr' },
  lfs_state_sex: { category: 'labour', file: 'lfs_state' },
  lfs_state: { category: 'labour', file: 'lfs_state' },
  lfs_district: { category: 'labour', file: 'lfs_district' },

  // ── Population ──
  population_state: { category: 'population', file: 'population_state' },
  population_malaysia: { category: 'population', file: 'population_malaysia' },
  population_district: { category: 'population', file: 'population_district' },

  // ── Demography ──
  marriages: { category: 'demography', file: 'marriages' },
  divorces: { category: 'demography', file: 'divorces' },
  births: { category: 'demography', file: 'births' },
  deaths: { category: 'demography', file: 'deaths' },

  // ── PPI / IPI ──
  ppi: { category: 'ppi', file: 'ppi' },
  ipi: { category: 'ipi', file: 'ipi' },

  // ── HIES (Household Income & Expenditure) ──
  hies_state: { category: 'hies', file: 'hies_state' },
  hh_income: { category: 'hies', file: 'hh_income' },
  hh_poverty_state: { category: 'hies', file: 'hh_poverty_state' },

  // ── Trade ──
  trade_headline: { category: 'trade', file: 'trade_headline' },
  trade_monthly: { category: 'trade', file: 'trade_headline' },

  // ── Finance ──
  exchangerates: { category: 'finance', file: 'exchangerates' },
  exchangerates_monthly: { category: 'finance', file: 'exchangerates' },
  exchangerates_daily_0900: { category: 'finance', file: 'exchangerates_daily' },
  interestrates: { category: 'finance', file: 'interestrates' },
  monetary_aggregates: { category: 'finance', file: 'monetary_aggregates' },
  federal_finance_year: { category: 'finance', file: 'federal_finance_year' },
  bop_balance: { category: 'finance', file: 'bop' },
  fdi_flows: { category: 'finance', file: 'fdi' },

  // ── Safety ──
  crime_district: { category: 'safety', file: 'crime_district' },

  // ── Prices ──
  fuelprice: { category: 'prices', file: 'fuelprice' },

  // ── Environment ──
  forest_reserve_state: { category: 'environment', file: 'forest_reserve_state' },
  air_pollution: { category: 'environment', file: 'air_pollution' },

  // ── Transport ──
  ridership_headline: { category: 'transport', file: 'ridership_headline' },

  // ── Healthcare ──
  blood_donations: { category: 'healthcare', file: 'blood_donations' },

  // ── Other ──
  fertility: { category: 'demography', file: 'fertility' },
  employment_sector: { category: 'labour', file: 'employment_sector' },
  productivity_annual: { category: 'productivity', file: 'productivity_annual' },
  cpi_headline_inflation: { category: 'cpi', file: 'cpi_headline_inflation' },
};

/**
 * Returns the full CSV URL for a dataset ID, or null if no mapping exists.
 * URL format: https://storage.dosm.gov.my/{category}/{file}.csv
 */
export function getCsvUrl(datasetId: string): string | null {
  const mapping = CSV_URL_MAP[datasetId];
  if (!mapping) return null;
  return `https://storage.dosm.gov.my/${mapping.category}/${mapping.file}.csv`;
}
