// src/lib/dosm/yaml-reality.ts
// The ACTUAL structure of datagovmy-meta YAML files
// Source: github.com/data-gov-my/datagovmy-meta/blob/main/data-catalogue/
//
// KEY DISCOVERIES FROM REAL YAML:
// 1. Field key is "name" NOT "id" when parsing YAML
// 2. Date format for quarterly is "YYYY-[Q]Q" e.g. "2024-Q2"
// 3. series_type choices include "abs", "abs_sa", "abs_current", "growth_yoy", "growth_qoq_sa"
//    NOT "real"/"nominal"/"real_sa" as previously assumed
// 4. There are Parquet and CSV download links in every YAML
// 5. "data_as_of" tells you the actual data currency
// 6. geography is an ARRAY not a string

// ── YAML FIELD KEY ──
// The YAML uses "name" as the field identifier, not "id"
export const YAML_FIELD_KEY = 'name' as const;

// ── QUARTERLY DATE FORMAT ──
// Quarterly dates use "2024-Q2" format, NOT "2024-04-01"
export const QUARTERLY_DATE_FORMAT = 'YYYY-[Q]Q';

// ── GDP SERIES TYPES (from actual YAML) ──
export const GDP_SERIES_TYPES = {
  gdp_qtr: {
    correct_choices: [
      'abs',           // GDP constant 2015 prices (REAL GDP in absolute terms)
      'abs_sa',        // GDP constant 2015 prices, seasonally adjusted
      'abs_current',   // GDP current prices (NOMINAL GDP)
      'growth_yoy',    // YoY growth rate (%)
      'growth_qoq_sa', // QoQ growth rate, seasonally adjusted
    ],
    wrong_was: ['real', 'nominal', 'real_sa'],
    forGrowthRate:  'growth_yoy',
    forAbsoluteGDP: 'abs',
    forTrendChart:  'abs',
  },
  gdp_annual: {
    correct_choices: [
      'abs',           // GDP constant 2015 prices
      'abs_current',   // GDP current prices
      'growth_yoy',    // YoY growth rate
    ],
    wrong_was: ['real', 'nominal'],
    forGrowthRate:  'growth_yoy',
    forAbsoluteGDP: 'abs',
  },
  gdp_state: {
    correct_choices: [
      'abs',           // GDP constant 2015 prices
      'abs_current',   // GDP current prices
      'growth_yoy',    // YoY growth rate
    ],
    wrong_was: ['real', 'nominal'],
    forGrowthRate:  'growth_yoy',
    forAbsoluteGDP: 'abs',
  },
} as const;

// ── DoSM-AWARE DATE PARSER ──
// Handles quarterly format "2024-Q2", annual "2024", monthly "2024-08" / "2024-08-01"
export function parseDosmDate(dateStr: string): Date {
  if (!dateStr) return new Date(0);

  // Handle quarterly format: "2024-Q2"
  if (/^\d{4}-Q\d$/.test(dateStr)) {
    const [year, q] = dateStr.split('-Q');
    const month = (parseInt(q) - 1) * 3;
    return new Date(parseInt(year), month, 1);
  }

  // Handle annual: "2024"
  if (/^\d{4}$/.test(dateStr)) {
    return new Date(parseInt(dateStr), 0, 1);
  }

  // Handle monthly: "2024-08" or full date "2024-08-01"
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;

  // Fallback: try to extract year
  const yearMatch = dateStr.match(/(\d{4})/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1]), 0, 1);
  }

  return new Date(0);
}

// ── FORMAT DoSM DATE FOR DISPLAY ──
export function formatDosmDate(dateStr: string): string {
  const d = parseDosmDate(dateStr);
  if (d.getTime() === 0) return dateStr;

  // Quarterly
  if (/^\d{4}-Q\d$/.test(dateStr)) {
    return dateStr; // Already human-readable
  }

  // Annual
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  // Monthly
  return d.toLocaleDateString('en-MY', { year: 'numeric', month: 'short' });
}

// ── CHECK IF DATE IS QUARTERLY FORMAT ──
export function isQuarterlyDate(dateStr: string): boolean {
  return /^\d{4}-Q\d$/.test(dateStr);
}

// ── CHECK IF DATE IS ANNUAL FORMAT ──
export function isAnnualDate(dateStr: string): boolean {
  return /^\d{4}$/.test(dateStr);
}
