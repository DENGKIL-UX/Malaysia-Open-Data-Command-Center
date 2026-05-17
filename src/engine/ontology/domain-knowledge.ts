/**
 * Domain Knowledge Edges — Malaysia-Specific Economic Causal Relationships
 *
 * Expert-defined causal and correlational relationships between Malaysian
 * economic datasets. These edges are sourced from economic theory, BNM
 * reports, and DoSM analytical publications.
 *
 * IDs are omitted — they are generated at graph build time by the
 * ontology builder.
 *
 * source/target use the `ds:{key}` format matching DOSM_REGISTRY keys.
 */

import type { OntologyEdge } from "@/engine/ontology/types";

/** Subset of OntologyEdge with `id` omitted (generated at build time) */
type DomainEdge = Omit<OntologyEdge, "id">;

// ---------------------------------------------------------------------------
// Expert-Defined Domain Knowledge Edges
// ---------------------------------------------------------------------------

export const MALAYSIA_DOMAIN_EDGES: DomainEdge[] = [
  // 1. Fuel price → CPI (cost-push inflation channel)
  {
    source: "ds:fuelprice",
    target: "ds:cpi_headline",
    type: "DRIVES",
    strength: 0.74,
    lagMonths: 1,
    direction: "positive",
    isComputed: false,
    confidence: 0.85,
    label: "Fuel price rise feeds into consumer prices",
    labelBM: "Kenaikan harga bahan api meningkatkan IHP",
  },

  // 2. Exchange rate → CPI (imported inflation channel)
  {
    source: "ds:exchange_rate",
    target: "ds:cpi_headline",
    type: "DRIVES",
    strength: 0.58,
    lagMonths: 2,
    direction: "positive",
    isComputed: false,
    confidence: 0.72,
    label: "Ringgit weakness raises import prices → CPI",
    labelBM: "Ringgit lemah → harga import naik → IHP naik",
  },

  // 3. GDP → Labour force (Okun's Law — inverse relationship)
  {
    source: "ds:gdp_qtr",
    target: "ds:labour_monthly",
    type: "DRIVES",
    strength: 0.87,
    lagMonths: 2,
    direction: "negative",
    isComputed: false,
    confidence: 0.91,
    label: "GDP growth reduces unemployment (Okun's Law)",
    labelBM: "Pertumbuhan KDNK mengurangkan pengangguran",
  },

  // 4. Trade → Exchange rate (current account channel)
  {
    source: "ds:trade_monthly",
    target: "ds:exchange_rate",
    type: "DRIVES",
    strength: 0.62,
    lagMonths: 1,
    direction: "positive",
    isComputed: false,
    confidence: 0.68,
    label: "Trade surplus strengthens Ringgit",
    labelBM: "Lebihan dagangan menguatkan Ringgit",
  },

  // 5. IPI → GDP (industrial production as leading indicator)
  {
    source: "ds:ipi",
    target: "ds:gdp_qtr",
    type: "LEADS",
    strength: 0.82,
    lagMonths: 1,
    direction: "positive",
    isComputed: false,
    confidence: 0.88,
    label: "IPI is a leading indicator for GDP",
    labelBM: "IPI petunjuk awal KDNK",
  },

  // 6. CPI → Household income (inflation erosion of real income)
  {
    source: "ds:cpi_headline",
    target: "ds:household_income",
    type: "DRIVES",
    strength: 0.55,
    lagMonths: 6,
    direction: "negative",
    isComputed: false,
    confidence: 0.70,
    label: "Inflation erodes real household income",
    labelBM: "Inflasi menghakis pendapatan isi rumah benar",
  },

  // 7. Population → GDP (domestic demand channel)
  {
    source: "ds:population_malaysia",
    target: "ds:gdp_qtr",
    type: "CORRELATES_POSITIVE",
    strength: 0.71,
    direction: "positive",
    isComputed: false,
    confidence: 0.78,
    label: "Population size drives domestic demand",
    labelBM: "Penduduk memacu permintaan domestik",
  },

  // 8. House price index → Household debt (affordability channel)
  {
    source: "ds:hpi_malaysia",
    target: "ds:household_income",
    type: "DRIVES",
    strength: 0.65,
    lagMonths: 4,
    direction: "negative",
    isComputed: false,
    confidence: 0.73,
    label: "Rising house prices increase household debt burden",
    labelBM: "Harga rumah naik → beban hutang isi rumah meningkat",
  },

  // 9. Labour force → Crime (socioeconomic stress channel)
  {
    source: "ds:labour_monthly",
    target: "ds:crime_district",
    type: "CORRELATES_POSITIVE",
    strength: 0.48,
    lagMonths: 3,
    direction: "positive",
    isComputed: false,
    confidence: 0.52,
    label: "Unemployment correlates with crime rates",
    labelBM: "Pengangguran berkait dengan kadar jenayah",
  },

  // 10. Births → School enrolment (demographic pipeline channel, ~6 year lag)
  {
    source: "ds:births",
    target: "ds:school_enrolment",
    type: "LEADS",
    strength: 0.95,
    lagMonths: 72,
    direction: "positive",
    isComputed: false,
    confidence: 0.97,
    label: "Birth cohorts drive school enrolment (6-year lag)",
    labelBM: "Kohort kelahiran memacu enrolmen sekolah (6 tahun lag)",
  },

  // 11. Trade → GDP (net exports component of GDP)
  {
    source: "ds:trade_monthly",
    target: "ds:gdp_qtr",
    type: "DRIVES",
    strength: 0.52,
    direction: "positive",
    isComputed: false,
    confidence: 0.75,
    label: "Trade contributes to GDP",
    labelBM: "Perdagangan menyumbang kepada KDNK",
  },

  // 12. Tourism → Trade (visitor spending channel)
  {
    source: "ds:tourism_arrivals",
    target: "ds:trade_monthly",
    type: "CORRELATES_POSITIVE",
    strength: 0.52,
    lagMonths: 1,
    direction: "positive",
    isComputed: false,
    confidence: 0.65,
    label: "Tourist spending boosts trade activity",
    labelBM: "Perbelanjaan pelancong meningkatkan aktiviti perdagangan",
  },

  // 13. Fuel price → Road accidents (mobility-risk channel)
  {
    source: "ds:fuelprice",
    target: "ds:road_accidents",
    type: "CORRELATES_NEGATIVE",
    strength: 0.38,
    lagMonths: 2,
    direction: "negative",
    isComputed: false,
    confidence: 0.42,
    label: "Higher fuel prices reduce driving and accidents",
    labelBM: "Harga bahan api tinggi mengurangkan pemanduan dan kemalangan",
  },
];
