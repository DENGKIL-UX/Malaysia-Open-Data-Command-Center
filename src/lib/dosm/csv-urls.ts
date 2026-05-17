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
  // ── CPI ──
  cpi_headline: { category: 'cpi', file: 'cpi_headline' },
  cpi_2d: { category: 'cpi', file: 'cpi_2d' },
  cpi_3d: { category: 'cpi', file: 'cpi_3d' },
  cpi_state: { category: 'cpi', file: 'cpi_state' },

  // ── GDP ──
  // gdp_qtr and gdp_annual share the same CSV file which has ALL GDP data
  gdp_qtr: { category: 'gdp', file: 'gdp' },
  gdp_annual: { category: 'gdp', file: 'gdp' },
  gdp_state: { category: 'gdp', file: 'gdp_state' },

  // ── Labour ──
  lfs_month: { category: 'labour', file: 'lfs_month' },
  lfs_month_sa: { category: 'labour', file: 'lfs_month_sa' },
  lfs_qtr: { category: 'labour', file: 'lfs_qtr' },

  // ── Population ──
  population_state: { category: 'population', file: 'population_state' },
  population_malaysia: { category: 'population', file: 'population_malaysia' },

  // ── Demography ──
  marriages: { category: 'demography', file: 'marriages' },

  // ── PPI ──
  ppi: { category: 'ppi', file: 'ppi' },

  // ── HIES (Household Income & Expenditure) ──
  hies_state: { category: 'hies', file: 'hies_state' },
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
