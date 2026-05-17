// src/lib/dosm/api-filter-syntax.ts
// The REAL filter syntax from developer.data.gov.my
// Based on actual API documentation and testing
//
// CRITICAL FIXES:
// - Sort uses "-field" prefix for descending, NOT "field desc" (SQL-style)
// - Multiple values via repeating params: ?state=Selangor&state=Johor
// - Range filters: field__gte, field__lte
// - Contains filter: field__contains

export const API_FILTER = {
  // ── SIMPLE EQUALITY ──
  // ?field=value
  // Example: ?id=lfs_state&state=Selangor
  equality: '?{field}={value}',

  // ── CONTAINS (partial match for string fields) ──
  // ?field__contains=value
  // Example: ?id=trade_country&country__contains=China
  contains: '?{field}__contains={value}',

  // ── RANGE (for date and numeric) ──
  // ?field__gte=value  (greater than or equal)
  // ?field__lte=value  (less than or equal)
  // Example: ?date__gte=2020-01-01&date__lte=2024-01-01
  range: {
    gte: '?{field}__gte={value}',
    lte: '?{field}__lte={value}',
    between: '?{field}__gte={from}&{field}__lte={to}',
  },

  // ── MULTIPLE VALUES (OR filter) ──
  // Repeat the parameter
  // Example: ?state=Selangor&state=Johor&state=Perak
  multiple: '?{field}={v1}&{field}={v2}',

  // ── SORT ──
  // ?sort={field}  (ascending)
  // ?sort=-{field} (descending) — NOTE: use "-" prefix for desc
  sort: {
    asc:  '?sort={field}',
    desc: '?sort=-{field}',
  },

  // ── PAGINATION ──
  // ?limit=N       number of records
  pagination: '?limit={n}',

  // ── CORRECT SORT BUILDER ──
  buildSort: (field: string, direction: 'asc' | 'desc' = 'desc'): string =>
    direction === 'desc' ? `-${field}` : field,

  // ── WHAT WAS WRONG BEFORE ──
  sortSyntaxWasWrong: {
    wrong:   '?sort=date desc',    // Was using SQL-style
    correct: '?sort=-date',        // API uses "-" prefix for desc
  },
} as const;

// ── CORRECT API QUERY EXAMPLES ──
export const CORRECT_API_EXAMPLES = [
  // GDP quarterly real values last 8 quarters
  'https://api.data.gov.my/data-catalogue?id=gdp_qtr&series_type=abs&limit=8&sort=-date',

  // GDP quarterly growth rate
  'https://api.data.gov.my/data-catalogue?id=gdp_qtr&series_type=growth_yoy&limit=8&sort=-date',

  // CPI last 24 months descending
  'https://api.data.gov.my/data-catalogue?id=cpi_headline&limit=24&sort=-date',

  // LFS monthly last 12 months
  'https://api.data.gov.my/data-catalogue?id=lfs_month&limit=12&sort=-date',

  // Fuel prices last 8 weeks
  'https://api.data.gov.my/data-catalogue?id=fuelprice&limit=8&sort=-date',

  // Exchange rate USD monthly
  'https://api.data.gov.my/data-catalogue?id=exchangerates_monthly&currency=usd&limit=24&sort=-date',

  // Population by state (with 3-way filter)
  'https://api.data.gov.my/data-catalogue?id=population_state&sex=both&ethnicity=overall&age=overall&sort=-date',

  // Trade by date range
  'https://api.data.gov.my/data-catalogue?id=trade_monthly&date__gte=2022-01-01&sort=-date',

  // Multiple states
  'https://api.data.gov.my/data-catalogue?id=lfs_state&state=Selangor&state=Johor&sort=-date',
] as const;
