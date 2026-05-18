/**
 * Intent Engine
 * Pure TypeScript classifier — zero ML, zero API, zero latency.
 * Supports English and Malay keywords.
 * Bilingual intent patterns with all 13 intent types.
 */

export type IntentType =
  | "NAVIGATE"      // "Show me the map", "Buka peta"
  | "EXPLAIN"       // "What is GDP?", "Apa itu CPI?"
  | "COMPARE"       // "Compare Selangor and Johor"
  | "FIND_DATASET"  // "Find population data", "Cari data harga"
  | "SUMMARIZE"     // "What does this chart show?"
  | "RANKING"       // "Which state has the highest GDP?"
  | "TREND"         // "How has unemployment changed?"
  | "HELP"          // "How do I use this?"
  | "GREETING"      // "Hello", "Selamat datang"
  | "STATE_INFO"    // "Tell me about Selangor"
  | "INTEL_NAVIGATE"   // "Show me the intel tab", "Tunjuk tab intel"
  | "ONTOLOGY_EXPLAIN" // "What is the ontology graph?", "Apa itu graf ontologi?"
  | "UNKNOWN";

export interface ParsedIntent {
  type: IntentType;
  confidence: number;
  entities: {
    states?: string[];
    metrics?: string[];
    datasets?: string[];
    categories?: string[];
    timeRange?: string;
    targetView?: string;
    comparisonOperator?: "highest" | "lowest" | "vs" | "difference";
  };
  originalQuery: string;
  language: "en" | "ms" | "mixed";
}

// ─── Keyword Dictionaries ──────────────────────────────────────────

const INTENT_PATTERNS: Record<IntentType, { en: string[]; ms: string[] }> = {
  NAVIGATE: {
    en: ["show", "open", "go to", "display", "view", "navigate", "switch to", "take me to", "load"],
    ms: ["tunjuk", "buka", "papar", "pergi ke", "tukar ke", "pamer", "lihat"],
  },
  EXPLAIN: {
    en: ["what is", "how", "explain", "meaning", "define", "what does", "describe", "tell me about", "why is"],
    ms: ["apa itu", "maksud", "bagaimana", "kenapa", "terangkan", "jelaskan", "definisi", "apa maksud"],
  },
  COMPARE: {
    en: ["compare", "vs", "versus", "difference", "between", "contrast", "side by side", "how do they differ"],
    ms: ["banding", "beza", "perbandingan", "berbanding", "perbezaan", "berbeza"],
  },
  FIND_DATASET: {
    en: ["find", "search", "dataset", "data", "look for", "where is", "do you have", "any data on", "is there"],
    ms: ["cari", "carian", "data", "set data", "ada tak", "mana", "di mana"],
  },
  SUMMARIZE: {
    en: ["summarize", "summary", "overview", "what does this show", "what am i looking at", "describe this"],
    ms: ["rumusan", "ringkasan", "gambaran keseluruhan", "apa yang ditunjukkan"],
  },
  RANKING: {
    en: ["highest", "lowest", "top", "bottom", "rank", "best", "worst", "which state has", "who has the most", "leader"],
    ms: ["tertinggi", "terendah", "terbaik", "terburuk", "paling", "kedudukan", "ranking"],
  },
  TREND: {
    en: ["trend", "change", "over time", "historical", "growth", "decline", "increasing", "decreasing", "how has"],
    ms: ["trend", "perubahan", "sejarah", "pertumbuhan", "penurunan", "meningkat", "menurun"],
  },
  HELP: {
    en: ["help", "how to use", "tutorial", "guide", "instructions", "what can you do", "capabilities"],
    ms: ["bantuan", "panduan", "cara guna", "tutorial", "boleh buat apa", "kebolehan"],
  },
  GREETING: {
    en: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings"],
    ms: ["selamat", "assalamualaikum", "hai", "apa khabar", "helo"],
  },
  STATE_INFO: {
    en: ["tell me about", "info on", "profile of", "overview of", "what is special about", "economy of"],
    ms: ["cerita tentang", "info", "profil", "gambaran", "apa yang menarik"],
  },
  INTEL_NAVIGATE: {
    en: ["intel", "intelligence", "ontology", "graph", "graf", "causal", "domain", "correlation", "relationship", "edge", "node"],
    ms: ["intel", "intelligen", "ontologi", "graf", "peta", "sebab", "domain", "korelasi", "hubungan", "tepi", "nod"],
  },
  ONTOLOGY_EXPLAIN: {
    en: ["what is the ontology graph", "explain the graph", "how does the graph work", "what are domain edges", "what is anomaly detection", "what is confidence score"],
    ms: ["apa itu graf ontologi", "terangkan graf", "bagaimana graf berfungsi", "apa itu tepi domain", "apa itu pengesanan anomali", "apa itu skor keyakinan"],
  },
  UNKNOWN: { en: [], ms: [] },
};

// State names — both English and Malay forms
const STATE_NAMES = [
  "selangor", "johor", "penang", "pulau pinang", "perak", "kedah",
  "kelantan", "terengganu", "pahang", "negeri sembilan", "melaka", "malacca",
  "sabah", "sarawak", "kuala lumpur", "kl", "labuan", "putrajaya", "perlis",
  "wp kuala lumpur", "wp labuan", "wp putrajaya",
];

const STATE_ALIASES: Record<string, string> = {
  "kl": "kuala lumpur",
  "pulau pinang": "penang",
  "malacca": "melaka",
  "ns": "negeri sembilan",
  "wp kuala lumpur": "kuala lumpur",
  "wp labuan": "labuan",
  "wp putrajaya": "putrajaya",
};

const METRIC_NAMES = [
  "gdp", "population", "unemployment", "inflation", "cpi", "birth rate",
  "death rate", "poverty", "gni", "hdi", "household income", "median income",
  "labour force", "participation rate", "internet", "broadband", "penetration",
  "density", "fertility", "life expectancy", "schooling", "education",
  "trade", "export", "import", "manufacturing", "agriculture", "tourism",
  "gini", "kdnk", "ihp",
  "ontology", "intel", "confidence", "anomaly", "domain edge", "correlation",
  "force graph", "node", "edge", "causal", "leading indicator",
];

// Malay metric aliases mapped to canonical English names
const METRIC_ALIASES: Record<string, string> = {
  "kdnk": "gdp",
  "icp": "cpi",
  "ihp": "cpi",
  "gaji": "household income",
  "pendapatan": "household income",
  "kemiskinan": "poverty",
  "pekerjaan": "labour force",
  "buruh": "labour force",
  "tenaga kerja": "labour force",
  "harga": "inflation",
  "penduduk": "population",
  "populasi": "population",
  "kelahiran": "birth rate",
  "kematian": "death rate",
  "pengangguran": "unemployment",
  "kesuburan": "fertility",
  "kepadatan": "density",
};

const CATEGORY_NAMES = [
  "economy", "prices", "labour", "trade", "transport", "agriculture",
  "education", "health", "environment", "housing", "tourism", "ict",
  "social", "finance", "manufacturing", "population", "governance",
  "demography", "national accounts", "labour markets", "financial markets",
  "economic sectors", "healthcare", "households", "communications",
  "public safety", "public administration", "public welfare",
  "statistical indicators", "data dictionaries", "metadata",
  "intelligence", "ontology", "causal", "correlation",
  "demografi", "akaun negara", "harga", "pasaran buruh", "pasaran kewangan",
  "sektor ekonomi", "kesihatan", "isi rumah", "komunikasi",
  "keselamatan awam", "pentadbiran awam", "kebajikan awam",
  "penunjuk statististik", "kamus data",
];

const TIME_PATTERNS = [
  { pattern: /202[0-9]/, extract: (m: RegExpMatchArray) => m[0] },
  { pattern: /last year|tahun lepas/, extract: () => "last_year" },
  { pattern: /this year|tahun ini/, extract: () => "current_year" },
  { pattern: /5 years|5 tahun/, extract: () => "5_year" },
  { pattern: /10 years|10 tahun/, extract: () => "10_year" },
  { pattern: /since 20\d\d/, extract: (m: RegExpMatchArray) => m[0] },
];

// ─── Core Parser ─────────────────────────────────────────────────────

export function parseIntent(query: string): ParsedIntent {
  const q = query.toLowerCase().trim();
  const normalized = normalizeQuery(q);

  // 1. Detect language
  const language = detectLanguage(normalized);

  // 2. Classify intent
  const { type, confidence } = classifyIntent(normalized, language);

  // 3. Extract entities
  const entities = extractEntities(normalized);

  // 4. Refine intent based on entities
  const refinedType = refineIntent(type, entities, normalized);

  return {
    type: refinedType,
    confidence,
    entities,
    originalQuery: query,
    language,
  };
}

function normalizeQuery(q: string): string {
  return q
    .replace(/[?.!,;:'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectLanguage(q: string): "en" | "ms" | "mixed" {
  const malayWords = [
    "yang", "dan", "atau", "dengan", "untuk", "dari", "pada", "ke", "di",
    "ini", "itu", "ada", "boleh", "tak", "apa", "maksud", "tunjuk", "buka",
    "cari", "peta", "kerajaan", "negeri", "rakyat", "banding", "beza",
    "terangkan", "jelaskan", "panduan", "bantuan", "cara", "guna",
  ];
  const malayCount = malayWords.filter(w =>
    q.includes(` ${w} `) || q.startsWith(`${w} `) || q.endsWith(` ${w}`)
  ).length;

  if (malayCount >= 2) return "ms";
  if (malayCount >= 1) return "mixed";
  return "en";
}

function classifyIntent(q: string, lang: "en" | "ms" | "mixed"): { type: IntentType; confidence: number } {
  let bestIntent: IntentType = "UNKNOWN";
  let maxScore = 0;

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (intent === "UNKNOWN") continue;

    const keywords = lang === "ms"
      ? patterns.ms
      : lang === "mixed"
        ? [...patterns.en, ...patterns.ms]
        : patterns.en;

    const score = keywords.filter(k => q.includes(k)).length;

    // Boost exact phrase matches at the start of query
    const phraseBoost = keywords.filter(k => q.startsWith(k)).length * 0.5;
    const totalScore = score + phraseBoost;

    if (totalScore > maxScore) {
      maxScore = totalScore;
      bestIntent = intent as IntentType;
    }
  }

  // Special case: if query contains "vs", "and", or "between" + 2 states → COMPARE
  const stateMatches = STATE_NAMES.filter(s => q.includes(s));
  if (stateMatches.length >= 2 && (q.includes(" vs ") || q.includes(" and ") || q.includes("between") || q.includes("berbanding"))) {
    if (maxScore < 2 || bestIntent === "UNKNOWN") {
      bestIntent = "COMPARE";
      maxScore = Math.max(maxScore, 2);
    }
  }

  // Special case: "highest" / "lowest" + metric → RANKING
  if ((q.includes("highest") || q.includes("lowest") || q.includes("tertinggi") || q.includes("terendah") || q.includes("paling"))
      && METRIC_NAMES.some(m => q.includes(m))) {
    if (bestIntent === "UNKNOWN" || bestIntent === "EXPLAIN") {
      bestIntent = "RANKING";
      maxScore = Math.max(maxScore, 2);
    }
  }

  const confidence = maxScore > 0 ? Math.min(maxScore * 0.25 + 0.4, 0.98) : 0.25;
  return { type: bestIntent, confidence };
}

function extractEntities(q: string) {
  // States (with alias resolution)
  const rawStates = STATE_NAMES.filter(s => q.includes(s));
  const states = [...new Set(rawStates.map(s => STATE_ALIASES[s] || s))];
  const uniqueStates = states.length > 0 ? states : undefined;

  // Metrics (with aliases)
  const metricMatches = METRIC_NAMES.filter(m => q.includes(m));
  const aliasMatches = Object.entries(METRIC_ALIASES)
    .filter(([alias]) => q.includes(alias))
    .map(([, canonical]) => canonical);
  const metrics = [...new Set([...metricMatches, ...aliasMatches])];

  // Categories
  const categories = CATEGORY_NAMES.filter(c => q.includes(c));

  // Datasets (generic terms)
  const datasets: string[] = [];
  if (q.includes("dataset") || q.includes("data") || q.includes("set data")) datasets.push("generic");

  // Time range
  let timeRange: string | undefined;
  for (const tp of TIME_PATTERNS) {
    const match = q.match(tp.pattern);
    if (match) {
      timeRange = tp.extract(match);
      break;
    }
  }

  // Target view
  let targetView: string | undefined;
  if (q.includes("map") || q.includes("geomap") || q.includes("peta")) targetView = "geomap";
  else if (q.includes("dataset") || q.includes("registry") || q.includes("daftar")) targetView = "datasets";
  else if (q.includes("analytics") || q.includes("chart") || q.includes("graph") || q.includes("graf") || q.includes("analitik")) targetView = "analytics";
  else if (q.includes("overview") || q.includes("summary") || q.includes("dashboard") || q.includes("gambaran")) targetView = "overview";
  else if (q.includes("comparison") || q.includes("compare tool") || q.includes("perbandingan")) targetView = "comparison";
  else if (q.includes("intel") || q.includes("intelligence") || q.includes("ontology") || q.includes("ontologi") || q.includes("graf ontologi")) targetView = "intelligence";

  // Comparison operator
  let comparisonOperator: "highest" | "lowest" | "vs" | "difference" | undefined;
  if (q.includes("highest") || q.includes("tertinggi") || q.includes("best") || q.includes("top") || q.includes("paling tinggi")) comparisonOperator = "highest";
  else if (q.includes("lowest") || q.includes("terendah") || q.includes("worst") || q.includes("bottom") || q.includes("paling rendah")) comparisonOperator = "lowest";
  else if (q.includes("vs") || q.includes("versus") || q.includes("compare") || q.includes("banding")) comparisonOperator = "vs";
  else if (q.includes("difference") || q.includes("beza") || q.includes("gap") || q.includes("perbezaan")) comparisonOperator = "difference";

  return {
    states: uniqueStates,
    metrics: metrics.length > 0 ? metrics : undefined,
    categories: categories.length > 0 ? categories : undefined,
    datasets: datasets.length > 0 ? datasets : undefined,
    timeRange,
    targetView,
    comparisonOperator,
  };
}

function refineIntent(type: IntentType, entities: ParsedIntent["entities"], _q: string): IntentType {
  // If no intent detected but has state name → STATE_INFO
  if (type === "UNKNOWN" && entities.states?.length === 1 && !entities.metrics?.length) {
    return "STATE_INFO";
  }

  // If EXPLAIN but has 2 states → COMPARE
  if (type === "EXPLAIN" && entities.states && entities.states.length >= 2) {
    return "COMPARE";
  }

  // If FIND_DATASET but has metric → could be EXPLAIN
  if (type === "FIND_DATASET" && entities.metrics && !entities.datasets?.length) {
    return "EXPLAIN";
  }

  // If GREETING but has substantive content → keep greeting (it's contextual)
  if (type === "GREETING" && (entities.metrics || entities.states || entities.targetView)) {
    return type;
  }

  // If UNKNOWN but mentions ontology/intel/domain → ONTOLOGY_EXPLAIN
  if (type === "UNKNOWN" && (q.includes("ontology") || q.includes("graf") || q.includes("intel") || q.includes("domain") || q.includes("ontologi") || q.includes("causal") || q.includes("korelasi"))) {
    return "ONTOLOGY_EXPLAIN";
  }

  // If NAVIGATE but targeting intel/ontology → INTEL_NAVIGATE
  if (type === "NAVIGATE" && (q.includes("intel") || q.includes("ontology") || q.includes("graf") || q.includes("ontologi"))) {
    return "INTEL_NAVIGATE";
  }

  return type;
}

// ─── Utility Exports ───────────────────────────────────────────────

export function getSuggestedQueries(context: string): string[] {
  const suggestions: Record<string, string[]> = {
    overview: [
      "Which state has the highest GDP?",
      "Show me the map",
      "What datasets are available?",
      "Explain unemployment rate",
    ],
    geomap: [
      "Compare Selangor and Johor",
      "What does this color mean?",
      "Show me Sabah details",
      "Which state has the lowest poverty?",
    ],
    datasets: [
      "Find population data",
      "Show me price statistics",
      "What is the latest dataset?",
      "Filter by Labour category",
    ],
    analytics: [
      "Summarize this chart",
      "What is the trend for CPI?",
      "Compare manufacturing across states",
      "Explain this metric",
    ],
    comparison: [
      "Add Kuala Lumpur to comparison",
      "What drives the difference?",
      "Show GDP breakdown",
      "Export this comparison",
    ],
    intelligence: [
      "Explain the ontology graph",
      "What are domain edges?",
      "Show causal relationships",
      "What is anomaly detection?",
      "Explain confidence scores",
    ],
  };

  return suggestions[context] || suggestions.overview;
}

export function formatConfidence(confidence: number): string {
  if (confidence > 0.85) return "high";
  if (confidence > 0.6) return "medium";
  return "low";
}
