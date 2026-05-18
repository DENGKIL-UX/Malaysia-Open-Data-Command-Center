/**
 * Knowledge Base Ingestion
 * Reads existing DATASETS from datasets.ts and STATES/FAQ_DATA from malaysia-data.ts at build time.
 * Zero runtime cost — pure static data transformation.
 * Adapted to the ACTUAL data schema (bilingual fields: title_en/ms, category_en/ms, etc.)
 */

import { DATASETS } from "@/lib/data/datasets";
import { STATES, FAQ_DATA, DATASET_CATEGORIES } from "@/lib/data/malaysia-data";

// ─── Types ─────────────────────────────────────────────────────────

export interface DatasetKnowledge {
  id: string;
  title: string;
  titleMs: string;
  category: string;
  categoryMs: string;
  description: string;
  descriptionMs: string;
  keywords: string[];
  dataSource: string;
  frequency: string;
  geography: string[];
  beginYear: number;
  endYear: number;
  lastUpdated?: string;
}

export interface MetricKnowledge {
  name: string;
  nameMs: string;
  definition: string;
  definitionMs: string;
  unit: string;
  formula?: string;
  source?: string;
  commonQuestions: string[];
  commonQuestionsMs: string[];
  relatedMetrics: string[];
  higherIsGood?: boolean | null;
}

export interface FAQKnowledge {
  question: string;
  questionMs: string;
  answer: string;
  answerMs: string;
  questionLower: string;
  tags: string[];
}

export interface StateProfile {
  name: string;
  nameMs: string;
  code: string;
  population: number;
  gdp: number;
  gdpPerCapita: number;
  unemploymentRate: number;
  region: string;
  keyIndustries: string[];
  commonComparisons: string[];
}

// ─── Dataset Keyword Overrides (Bilingual EN+BM) ──────────────────

const DATASET_KEYWORD_OVERRIDES: Record<string, string[]> = {
  "Demography": ["penduduk", "populasi", "demografi", "demographic", "people", "rakyat", "kelahiran", "kematian", "kesuburan", "perkahwinan", "migrasi"],
  "National Accounts": ["ekonomi", "economy", "growth", "pendapatan", "kdnk", "keluaran dalam negeri kasar", "gdp"],
  "Prices": ["harga", "inflasi", "inflation", "cpi", "icp", "index harga pengguna", "consumer price"],
  "Labour Markets": ["pekerjaan", "employment", "unemployment", "gaji", "wages", "buruh", "tenaga kerja", "pengangguran", "pekerja"],
  "Financial Markets": ["kewangan", "finance", "bank", "loan", "pinjaman", "investment", "pelaburan", "pertukaran", "exchange", "interest rate"],
  "Economic Sectors": ["perkilangan", "manufacturing", "industry", "industri", "factory", "pertanian", "agriculture", "perkhidmatan", "services"],
  "Healthcare": ["kesihatan", "health", "hospital", "disease", "penyakit", "covid", "kesihatan awam"],
  "Environment": ["alam sekitar", "environment", "climate", "pollution", "hujan", "rainfall", "cuaca", "hutan", "forest"],
  "Education": ["pendidikan", "education", "school", "university", "student", "pelajar", "sekolah"],
  "Transportation": ["pengangkutan", "transport", "highway", "road", "jalan", "kereta", "lrt", "mrt", "bas"],
  "Households": ["isi rumah", "household", "pendapatan", "income", "perbelanjaan", "expenditure", "kemiskinan", "poverty", "gini"],
  "Communications": ["digital", "internet", "broadband", "telekomunikasi", "telecommunication", "ict", "komunikasi"],
  "Public Safety": ["keselamatan", "safety", "crime", "jenayah", "polis", "police"],
  "Public Administration": ["pentadbiran", "administration", "kerajaan", "government", "awam", "persekutuan"],
  "Public Welfare": ["kebajikan", "welfare", "bantuan", "assistance", "sosial", "social"],
  "Statistical Indicators": ["penunjuk", "indicators", "statistik", "statistics", "indeks", "index"],
  "Data Dictionaries": ["kamus", "dictionary", "referensi", "reference", "definisi"],
  "Metadata": ["metadata", "info", "maklumat", "penerangan"],
};

// ─── Extract Keywords ─────────────────────────────────────────────

function extractKeywords(dataset: (typeof DATASETS)[0]): string[] {
  const baseKeywords = [
    dataset.title_en.toLowerCase(),
    dataset.title_ms.toLowerCase(),
    dataset.category_en.toLowerCase(),
    dataset.category_ms.toLowerCase(),
    dataset.description_en.toLowerCase(),
    dataset.description_ms.toLowerCase(),
    dataset.data_source.join(" ").toLowerCase(),
    dataset.subcategory_en.toLowerCase(),
    dataset.subcategory_ms.toLowerCase(),
  ].join(" ");

  const tokens = baseKeywords
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2);

  // Add category-specific Malay/English synonyms
  const categoryExtras = DATASET_KEYWORD_OVERRIDES[dataset.category_en] || [];

  // Add generic dashboard terms
  const genericTerms = ["dataset", "data", "statistics", "statistik", "open data", "data.gov.my", "dosm"];

  return [...new Set([...tokens, ...categoryExtras, ...genericTerms])];
}

// ─── Dataset Index (built from actual DATASETS) ──────────────────

export const datasetIndex: DatasetKnowledge[] = DATASETS.map(d => ({
  id: d.id,
  title: d.title_en,
  titleMs: d.title_ms,
  category: d.category_en,
  categoryMs: d.category_ms,
  description: d.description_en,
  descriptionMs: d.description_ms,
  keywords: extractKeywords(d),
  dataSource: d.data_source.join(", ") || "data.gov.my",
  frequency: d.frequency,
  geography: d.geography,
  beginYear: d.dataset_begin,
  endYear: d.dataset_end,
  lastUpdated: d.last_updated,
}));

// Quick lookup maps
function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    acc[k] = acc[k] || [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export const datasetByCategory = groupBy(datasetIndex, d => d.category);
export const datasetById = Object.fromEntries(datasetIndex.map(d => [d.id, d]));

// ─── Metric Glossary (10+ Malaysian metrics) ─────────────────────

export const metricGlossary: MetricKnowledge[] = [
  {
    name: "GDP Per Capita",
    nameMs: "KDNK Per Kapita",
    definition: "Economic output divided by total population, indicating the average economic productivity and standard of living in a state.",
    definitionMs: "Keluaran ekonomi dibahagi dengan jumlah penduduk, menunjukkan produktiviti ekonomi purata dan tahap kehidupan di sesebuah negeri.",
    unit: "RM (Ringgit Malaysia)",
    formula: "State GDP ÷ State Population",
    source: "Department of Statistics Malaysia (DOSM)",
    commonQuestions: [
      "What is GDP per capita?",
      "Why is Selangor's GDP per capita higher?",
      "Which state has the highest GDP per capita?",
      "What does GDP per capita mean for businesses?",
    ],
    commonQuestionsMs: [
      "Apakah KDNK per kapita?",
      "Mengapa KDNK per kapita Selangor lebih tinggi?",
      "Negeri mana yang mempunyai KDNK per kapita tertinggi?",
    ],
    relatedMetrics: ["GDP Growth Rate", "GNI Per Capita", "Household Income"],
    higherIsGood: true,
  },
  {
    name: "Unemployment Rate",
    nameMs: "Kadar Pengangguran",
    definition: "Percentage of the labour force that is without work but actively seeking employment.",
    definitionMs: "Peratusan tenaga buruh yang tiada pekerjaan tetapi aktif mencari pekerjaan.",
    unit: "%",
    formula: "Unemployed Population ÷ Total Labour Force × 100",
    source: "DOSM Labour Force Survey",
    commonQuestions: [
      "Which state has the highest unemployment?",
      "How is unemployment calculated?",
      "What is the national average unemployment rate?",
    ],
    commonQuestionsMs: [
      "Negeri mana pengangguran tertinggi?",
      "Bagaimana pengangguran dikira?",
      "Apakah purata kadar pengangguran kebangsaan?",
    ],
    relatedMetrics: ["Labour Force Participation", "Youth Unemployment", "Underemployment"],
    higherIsGood: false,
  },
  {
    name: "Consumer Price Index (CPI)",
    nameMs: "Indeks Harga Pengguna (IHP)",
    definition: "Measures the average change over time in prices paid by consumers for a basket of goods and services. The primary measure of inflation.",
    definitionMs: "Mengukur perubahan purata dari semasa ke semasa dalam harga yang dibayar oleh pengguna untuk bakul barangan dan perkhidmatan. Ukuran utama inflasi.",
    unit: "Index points (base year = 100)",
    formula: "Weighted average of price changes across 12 categories",
    source: "DOSM Price Statistics",
    commonQuestions: [
      "What is CPI?",
      "How is inflation calculated?",
      "Which state has the highest inflation?",
      "What does CPI mean for my business?",
    ],
    commonQuestionsMs: [
      "Apakah IHP?",
      "Bagaimana inflasi dikira?",
      "Negeri mana inflasi tertinggi?",
    ],
    relatedMetrics: ["Inflation Rate", "Producer Price Index", "Core Inflation"],
    higherIsGood: false,
  },
  {
    name: "Population Density",
    nameMs: "Kepadatan Penduduk",
    definition: "Number of people per square kilometre, indicating urbanisation pressure and infrastructure demand.",
    definitionMs: "Bilangan orang per kilometer persegi, menunjukkan tekanan urbanisasi dan keperluan infrastruktur.",
    unit: "persons/km²",
    formula: "Total Population ÷ Land Area",
    source: "DOSM Population and Housing Census",
    commonQuestions: [
      "Which state is most densely populated?",
      "What does population density affect?",
    ],
    commonQuestionsMs: [
      "Negeri mana paling padat penduduk?",
      "Apa kesan kepadatan penduduk?",
    ],
    relatedMetrics: ["Urbanisation Rate", "Household Size", "Migration Rate"],
    higherIsGood: null,
  },
  {
    name: "Median Household Income",
    nameMs: "Pendapatan Isi Rumah Median",
    definition: "The middle value of household income distribution — half earn more, half earn less. More robust than mean (average) against outliers.",
    definitionMs: "Nilai tengah taburan pendapatan isi rumah — separuh lagi tinggi, separuh lagi rendah. Lebih kukuh daripada purata terhadap outlier.",
    unit: "RM per month",
    source: "DOSM Household Income Survey",
    commonQuestions: [
      "What is median household income?",
      "Which state has the highest household income?",
      "Mean vs median income — what's the difference?",
    ],
    commonQuestionsMs: [
      "Apakah pendapatan isi rumah median?",
      "Negeri mana pendapatan isi rumah tertinggi?",
      "Perbezaan purata dan median?",
    ],
    relatedMetrics: ["Mean Household Income", "Poverty Rate", "Gini Coefficient"],
    higherIsGood: true,
  },
  {
    name: "Poverty Rate",
    nameMs: "Kadar Kemiskinan",
    definition: "Percentage of population living below the national poverty line (PLI — Poverty Line Income).",
    definitionMs: "Peratusan penduduk yang hidup di bawah garis kemiskinan negara (PGK — Pendapatan Garis Kemiskinan).",
    unit: "%",
    source: "DOSM Household Income & Expenditure Survey",
    commonQuestions: [
      "What is the poverty line in Malaysia?",
      "Which states have the highest poverty?",
      "How is poverty measured?",
    ],
    commonQuestionsMs: [
      "Apakah garis kemiskinan di Malaysia?",
      "Negeri mana kemiskinan tertinggi?",
      "Bagaimana kemiskinan diukur?",
    ],
    relatedMetrics: ["Hardcore Poverty", "Relative Poverty", "Income Inequality"],
    higherIsGood: false,
  },
  {
    name: "Labour Force Participation Rate",
    nameMs: "Kadar Penyertaan Tenaga Buruh",
    definition: "Percentage of working-age population (15-64) that is either employed or actively seeking employment.",
    definitionMs: "Peratusan penduduk usia bekerja (15-64) yang sama ada bekerja atau aktif mencari pekerjaan.",
    unit: "%",
    formula: "Labour Force ÷ Working Age Population × 100",
    source: "DOSM Labour Force Statistics",
    commonQuestions: [
      "What is labour force participation?",
      "Why is female participation lower?",
      "Which state has the highest participation?",
    ],
    commonQuestionsMs: [
      "Apakah penyertaan tenaga buruh?",
      "Mengapa penyertaan wanita lebih rendah?",
    ],
    relatedMetrics: ["Employment-to-Population Ratio", "Youth NEET Rate", "Female LFPR"],
    higherIsGood: true,
  },
  {
    name: "Crude Birth Rate",
    nameMs: "Kadar Kelahiran Kasar",
    definition: "Number of live births per 1,000 population in a given year.",
    definitionMs: "Bilangan kelahiran hidup per 1,000 penduduk dalam setahun.",
    unit: "per 1,000 population",
    source: "DOSM Vital Statistics",
    commonQuestions: [
      "What is birth rate?",
      "Which state has the highest birth rate?",
    ],
    commonQuestionsMs: [
      "Apakah kadar kelahiran?",
      "Negeri mana kadar kelahiran tertinggi?",
    ],
    relatedMetrics: ["Total Fertility Rate", "Crude Death Rate", "Natural Increase"],
    higherIsGood: null,
  },
  {
    name: "Crude Death Rate",
    nameMs: "Kadar Kematian Kasar",
    definition: "Number of deaths per 1,000 population in a given year.",
    definitionMs: "Bilangan kematian per 1,000 penduduk dalam setahun.",
    unit: "per 1,000 population",
    source: "DOSM Vital Statistics",
    commonQuestions: [
      "What is death rate?",
      "Which state has the highest death rate?",
      "How does Malaysia's death rate compare globally?",
    ],
    commonQuestionsMs: [
      "Apakah kadar kematian?",
      "Negeri mana kadar kematian tertinggi?",
    ],
    relatedMetrics: ["Maternal Mortality", "Infant Mortality", "Life Expectancy"],
    higherIsGood: false,
  },
  {
    name: "GDP Growth Rate",
    nameMs: "Kadar Pertumbuhan KDNK",
    definition: "Year-on-year percentage change in Gross Domestic Product, indicating economic expansion or contraction.",
    definitionMs: "Perubahan peratusan tahunan ke tahunan dalam Keluaran Dalam Negara Kasar, menunjukkan pengembangan atau pengecutan ekonomi.",
    unit: "%",
    formula: "((Current Year GDP − Previous Year GDP) ÷ Previous Year GDP) × 100",
    source: "DOSM National Accounts",
    commonQuestions: [
      "What is Malaysia's GDP growth rate?",
      "How does GDP growth vary by state?",
      "What drives GDP growth?",
    ],
    commonQuestionsMs: [
      "Apakah kadar pertumbuhan KDNK Malaysia?",
      "Bagaimana pertumbuhan KDNK berbeza mengikut negeri?",
    ],
    relatedMetrics: ["GDP Per Capita", "Quarterly GDP", "GDP by Sector"],
    higherIsGood: true,
  },
  {
    name: "Gini Coefficient",
    nameMs: "Pekali Gini",
    definition: "Measure of income inequality ranging from 0 (perfect equality) to 1 (perfect inequality). Higher values indicate greater inequality.",
    definitionMs: "Ukuran ketidaksamaan pendapatan dari 0 (kesamaan sempurna) hingga 1 (ketidaksamaan sempurna). Nilai lebih tinggi bermakna ketidaksamaan lebih besar.",
    unit: "Coefficient (0 to 1)",
    source: "DOSM Household Income & Expenditure Survey",
    commonQuestions: [
      "What is the Gini coefficient?",
      "Which state has the highest inequality?",
      "How does Malaysia's Gini compare?",
    ],
    commonQuestionsMs: [
      "Apakah pekali Gini?",
      "Negeri mana ketidaksamaan tertinggi?",
    ],
    relatedMetrics: ["Income Distribution", "Poverty Rate", "Household Income"],
    higherIsGood: false,
  },
  {
    name: "Total Fertility Rate",
    nameMs: "Jumlah Kadar Kesuburan",
    definition: "Average number of children a woman would bear over her lifetime based on current age-specific fertility rates.",
    definitionMs: "Purata bilangan anak yang akan dilahirkan oleh seorang wanita sepanjang hayatnya berdasarkan kadar kesuburan mengikut umur semasa.",
    unit: "children per woman",
    source: "DOSM Vital Statistics",
    commonQuestions: [
      "What is Malaysia's fertility rate?",
      "Why is fertility declining?",
      "Which state has the highest fertility?",
    ],
    commonQuestionsMs: [
      "Apakah kadar kesuburan Malaysia?",
      "Mengapa kesuburan menurun?",
    ],
    relatedMetrics: ["Crude Birth Rate", "Population Growth", "Replacement Rate"],
    higherIsGood: null,
  },
];

export const metricByName = Object.fromEntries(metricGlossary.map(m => [m.name.toLowerCase(), m]));

// ─── State Profiles (derived from actual STATES data) ─────────────

// Map state IDs to key industries
const STATE_INDUSTRIES: Record<string, string[]> = {
  "johor": ["Manufacturing", "Oil & Gas", "Agriculture", "Tourism", "Logistics"],
  "kedah": ["Agriculture", "Rice", "Tourism", "Manufacturing", "Aerospace"],
  "kelantan": ["Agriculture", "Fisheries", "Handicraft", "Tourism", "Islamic Finance"],
  "melaka": ["Tourism", "Manufacturing", "Services", "Education", "Healthcare"],
  "negeri-sembilan": ["Manufacturing", "Agriculture", "Services", "Education", "Tourism"],
  "pahang": ["Oil & Gas", "Timber", "Agriculture", "Tourism", "Mining"],
  "perak": ["Agriculture", "Mining", "Manufacturing", "Tourism"],
  "perlis": ["Agriculture", "Rice", "Border Trade", "Tourism", "Education"],
  "pulau-pinang": ["Electronics", "Manufacturing", "Tourism", "Services", "Medical Tourism"],
  "sabah": ["Agriculture", "Oil & Gas", "Tourism", "Fisheries", "Timber"],
  "sarawak": ["Oil & Gas", "Palm Oil", "Timber", "Hydroelectric", "Tourism"],
  "selangor": ["Manufacturing", "Services", "Finance", "ICT", "Logistics"],
  "terengganu": ["Oil & Gas", "Petrochemical", "Fisheries", "Tourism", "Agriculture"],
  "wp-kuala-lumpur": ["Finance", "Services", "ICT", "Real Estate", "Tourism"],
  "wp-labuan": ["Offshore Finance", "Oil & Gas", "Tourism", "Shipping"],
  "wp-putrajaya": ["Government", "Services", "ICT", "Education", "Smart City"],
};

const STATE_COMPARISONS: Record<string, string[]> = {
  "selangor": ["Kuala Lumpur", "Johor", "Penang"],
  "johor": ["Selangor", "Penang", "Melaka"],
  "pulau-pinang": ["Selangor", "Johor", "Kuala Lumpur"],
  "sabah": ["Sarawak", "Johor", "Penang"],
  "sarawak": ["Sabah", "Johor", "Selangor"],
  "wp-kuala-lumpur": ["Selangor", "Putrajaya", "Penang"],
  "perak": ["Penang", "Selangor", "Kedah"],
  "kedah": ["Penang", "Perlis", "Perak"],
  "kelantan": ["Terengganu", "Pahang", "Kedah"],
  "terengganu": ["Kelantan", "Pahang", "Sabah"],
  "pahang": ["Terengganu", "Kelantan", "Johor"],
  "negeri-sembilan": ["Selangor", "Melaka", "Kuala Lumpur"],
  "melaka": ["Negeri Sembilan", "Johor", "Selangor"],
  "perlis": ["Kedah", "Kelantan"],
  "wp-putrajaya": ["Kuala Lumpur", "Selangor"],
  "wp-labuan": ["Kuala Lumpur", "Sabah", "Putrajaya"],
};

export const stateProfiles: StateProfile[] = STATES.map(s => ({
  name: s.name,
  nameMs: s.name_ms,
  code: s.abbr,
  population: s.population,
  gdp: s.gdp,
  gdpPerCapita: Math.round((s.gdp * 1000000) / (s.population * 1000)), // RM millions / ('000 pop)
  unemploymentRate: s.unemployment,
  region: s.region,
  keyIndustries: STATE_INDUSTRIES[s.id] || ["Services", "Agriculture"],
  commonComparisons: STATE_COMPARISONS[s.id] || [],
}));

export const stateByName = Object.fromEntries(
  stateProfiles.map(s => [s.name.toLowerCase(), s])
);
export const stateByCode = Object.fromEntries(
  stateProfiles.map(s => [s.code.toLowerCase(), s])
);

// ─── FAQ Knowledge (from actual FAQ_DATA) ─────────────────────────

export const knowledgeFAQ: FAQKnowledge[] = FAQ_DATA.map(faq => ({
  question: faq.q_en,
  questionMs: faq.q_ms,
  answer: faq.a_en,
  answerMs: faq.a_ms,
  questionLower: faq.q_en.toLowerCase(),
  tags: extractFAQTags(faq.q_en + " " + faq.a_en),
}));

function extractFAQTags(text: string): string[] {
  const tagMap: Record<string, string[]> = {
    "command center": ["overview", "dashboard"],
    "data.gov.my": ["source", "open data"],
    "updated": ["frequency", "refresh"],
    "projects": ["license", "usage"],
    "geospatial": ["map", "accuracy"],
    "infographic": ["export", "image"],
  };
  const tags: string[] = [];
  const lower = text.toLowerCase();
  for (const [keyword, t] of Object.entries(tagMap)) {
    if (lower.includes(keyword)) tags.push(...t);
  }
  return [...new Set(tags)];
}

// ─── Smart Search Utilities ──────────────────────────────────────

export function searchDatasets(query: string, limit = 5): DatasetKnowledge[] {
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(t => t.length > 2);

  return datasetIndex
    .map(d => {
      let score = 0;
      // Title match (highest weight)
      if (d.title.toLowerCase().includes(q)) score += 10;
      if (d.titleMs.toLowerCase().includes(q)) score += 8;
      // Category match
      if (d.category.toLowerCase().includes(q)) score += 6;
      if (d.categoryMs.toLowerCase().includes(q)) score += 5;
      // Description match
      if (d.description.toLowerCase().includes(q)) score += 4;
      if (d.descriptionMs.toLowerCase().includes(q)) score += 3;
      // Keyword token match
      terms.forEach(term => {
        if (d.keywords.some(k => k.includes(term))) score += 2;
      });
      return { ...d, _score: score };
    })
    .filter(d => (d as DatasetKnowledge & { _score: number })._score > 0)
    .sort((a, b) =>
      (b as DatasetKnowledge & { _score: number })._score -
      (a as DatasetKnowledge & { _score: number })._score
    )
    .slice(0, limit)
    .map(({ _score, ...rest }) => rest as DatasetKnowledge);
}

export function searchMetrics(query: string): MetricKnowledge | undefined {
  const q = query.toLowerCase();
  return metricGlossary.find(m =>
    m.name.toLowerCase().includes(q) ||
    m.nameMs.toLowerCase().includes(q) ||
    m.commonQuestions.some(cq => cq.toLowerCase().includes(q)) ||
    m.commonQuestionsMs.some(cq => cq.toLowerCase().includes(q)) ||
    m.definition.toLowerCase().includes(q)
  );
}

export function searchFAQ(query: string, lang: "en" | "ms" = "en"): FAQKnowledge | undefined {
  const q = query.toLowerCase();
  return knowledgeFAQ.find(f =>
    f.questionLower.includes(q) ||
    (lang === "ms" && f.questionMs.toLowerCase().includes(q)) ||
    f.tags.some(t => t.toLowerCase().includes(q))
  );
}

export function getStateByQuery(query: string): StateProfile | undefined {
  const q = query.toLowerCase();
  return stateProfiles.find(s =>
    s.name.toLowerCase().includes(q) ||
    s.nameMs.toLowerCase().includes(q) ||
    s.code.toLowerCase() === q ||
    s.keyIndustries.some(i => i.toLowerCase().includes(q))
  );
}
