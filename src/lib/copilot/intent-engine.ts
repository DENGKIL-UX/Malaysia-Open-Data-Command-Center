// Command Copilot Intent Engine
// Classifies user queries into intent types using keyword matching

export type IntentType =
  | 'NAVIGATE'
  | 'EXPLAIN'
  | 'COMPARE'
  | 'FIND_DATASET'
  | 'SUMMARIZE'
  | 'HELP'
  | 'GREETING'
  | 'STAT_QUERY'
  | 'ONTOLOGY_EXPLAIN'
  | 'UNKNOWN';

export interface Intent {
  type: IntentType;
  confidence: number;
  entities: string[];
  originalQuery: string;
}

// ─── Metric Name Mappings ───────────────────────────────────────────────
const METRIC_NAMES: Record<string, string[]> = {
  population: ['population', 'penduduk', 'populasi', 'people', 'orang', 'residents'],
  gdp: ['gdp', 'kdnk', 'economy', 'ekonomi', 'growth', 'pertumbuhan', 'economic'],
  births: ['births', 'kelahiran', 'born', 'dilahirkan', 'fertility', 'kesuburan'],
  deaths: ['deaths', 'kematian', 'mortality', 'maternal'],
  unemployment: ['unemployment', 'pengangguran', 'jobless', 'employment', 'pekerjaan', 'jobs', 'kerja'],
  datasets: ['datasets', 'set data', 'data', 'dataset'],
  area: ['area', 'kawasan', 'luas', 'size', 'density', 'kepadatan'],
};

// ─── State Name Mappings ────────────────────────────────────────────────
const STATE_MAPPINGS: Record<string, string[]> = {
  'selangor': ['selangor', 'sgr', 'sgd'],
  'johor': ['johor', 'jhr'],
  'sabah': ['sabah', 'sbh'],
  'sarawak': ['sarawak', 'srk'],
  'perak': ['perak', 'prk'],
  'kedah': ['kedah', 'kdh'],
  'kelantan': ['kelantan', 'ktn'],
  'kuala-lumpur': ['kuala lumpur', 'kl', 'wp kuala lumpur', 'kul', 'wpkl'],
  'penang': ['penang', 'pulau pinang', 'png', 'pinang'],
  'melaka': ['melaka', 'malacca', 'mlk'],
  'negeri-sembilan': ['negeri sembilan', 'nsn', 'ns'],
  'pahang': ['pahang', 'phg'],
  'terengganu': ['terengganu', 'trg'],
  'perlis': ['perlis', 'pls'],
  'labuan': ['labuan', 'lbn', 'wp labuan'],
  'putrajaya': ['putrajaya', 'pjy', 'wp putrajaya'],
};

// ─── Intent Patterns ────────────────────────────────────────────────────
const INTENT_PATTERNS: Record<IntentType, { en: string[]; ms: string[] }> = {
  NAVIGATE: {
    en: ['go to', 'show me', 'navigate', 'take me to', 'switch to', 'open', 'view the', 'display the', 'bring me'],
    ms: ['pergi ke', 'tunjuk', 'navigasi', 'bawa ke', 'buka', 'papar', 'tukar ke', 'lihat'],
  },
  EXPLAIN: {
    en: ['what is', 'explain', 'tell me about', 'describe', 'what does', 'how does', 'what are', 'define', 'meaning of'],
    ms: ['apa itu', 'terangkan', 'cerita tentang', 'jelaskan', 'apakah', 'bagaimana', 'maksud', 'definisi'],
  },
  COMPARE: {
    en: ['compare', 'vs', 'versus', 'difference between', 'compared to', 'between', 'against'],
    ms: ['bandingkan', 'berbanding', 'perbezaan antara', 'berbanding dengan'],
  },
  FIND_DATASET: {
    en: ['find dataset', 'search data', 'look for data', 'where is data', 'show datasets about', 'find data on', 'search for'],
    ms: ['cari data', 'cari set data', 'cari dataset', 'di mana data', 'tunjuk data tentang', 'cari tentang'],
  },
  SUMMARIZE: {
    en: ['summarize', 'overview', 'summary', 'give me an overview', 'big picture', 'recap', 'brief'],
    ms: ['ringkasan', 'gambaran', 'ringkas', 'gambaran besar', 'ikhtisar'],
  },
  HELP: {
    en: ['help', 'what can you do', 'how to use', 'capabilities', 'features', 'commands', 'instructions'],
    ms: ['bantuan', 'tolong', 'apa yang anda boleh buat', 'cara guna', 'keupayaan', 'arahan'],
  },
  GREETING: {
    en: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'sup', 'yo'],
    ms: ['selamat', 'hello', 'hai', 'apa khabar', 'selamat pagi', 'selamat petang', 'selamat malam'],
  },
  STAT_QUERY: {
    en: ['how much', 'how many', 'what is the', 'number of', 'rate of', 'total', 'percentage', 'count'],
    ms: ['berapa', 'berapa banyak', 'berapa ramai', 'jumlah', 'kadar', 'peratusan', 'bilangan'],
  },
  ONTOLOGY_EXPLAIN: {
    en: ['ontology', 'graph', 'relationship', 'force directed', 'data relationship', 'domain relationship', 'connection between'],
    ms: ['ontologi', 'graf', 'hubungan', 'graf terarah daya', 'hubungan data', 'hubungan domain', 'sambungan antara'],
  },
  UNKNOWN: {
    en: [],
    ms: [],
  },
};

// ─── Navigation Targets ─────────────────────────────────────────────────
const NAVIGATION_TARGETS: Record<string, string[]> = {
  'overview': ['overview', 'home', 'main', 'dashboard', 'gambaran', 'utama', 'papan pemuka'],
  'geomap': ['geomap', 'map', 'geographic', 'spatial', 'peta', 'peta geo', 'geografi'],
  'datasets': ['datasets', 'data catalog', 'browse data', 'set data', 'katalog data', 'senarai data'],
  'analytics': ['analytics', 'analysis', 'charts', 'insights', 'analitik', 'analisis', 'carta', 'wawasan'],
  'intelligence': ['intelligence', 'intel', 'ontology', 'graph', 'correlation', 'intelijen', 'ontologi', 'graf', 'korelasi', 'causal', 'domain'],
};

// ─── Intent Classification ──────────────────────────────────────────────
export function classifyIntent(query: string): Intent {
  const q = query.toLowerCase().trim();
  const entities: string[] = [];
  let bestIntent: IntentType = 'UNKNOWN';
  let bestScore = 0;

  // Check each intent type
  for (const [intentType, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (intentType === 'UNKNOWN') continue;
    const allPatterns = [...patterns.en, ...patterns.ms];
    let score = 0;

    for (const pattern of allPatterns) {
      if (q.includes(pattern)) {
        // Longer pattern matches are more specific
        score += pattern.split(' ').length * 2 + 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intentType as IntentType;
    }
  }

  // Extract metric entities
  for (const [metric, keywords] of Object.entries(METRIC_NAMES)) {
    for (const kw of keywords) {
      if (q.includes(kw)) {
        entities.push(metric);
        break;
      }
    }
  }

  // Extract state entities
  for (const [state, keywords] of Object.entries(STATE_MAPPINGS)) {
    for (const kw of keywords) {
      if (q.includes(kw)) {
        entities.push(`state:${state}`);
        break;
      }
    }
  }

  // Extract navigation targets
  for (const [target, keywords] of Object.entries(NAVIGATION_TARGETS)) {
    for (const kw of keywords) {
      if (q.includes(kw)) {
        entities.push(`nav:${target}`);
        break;
      }
    }
  }

  // Check for numbers (stat queries)
  const numberMatch = q.match(/\d+/);
  if (numberMatch) {
    entities.push('number');
  }

  // Greeting detection (boost priority if simple greeting)
  const greetingWords = [...INTENT_PATTERNS.GREETING.en, ...INTENT_PATTERNS.GREETING.ms];
  const isSimpleGreeting = greetingWords.some(g => q === g || q === `${g}!` || q === `${g}.`);

  if (isSimpleGreeting && bestScore <= 2) {
    bestIntent = 'GREETING';
    bestScore = 10;
  }

  // If we have metric entities but no strong intent, default to STAT_QUERY
  if (bestIntent === 'UNKNOWN' && entities.some(e => !e.startsWith('state:') && !e.startsWith('nav:'))) {
    const metricEntities = entities.filter(e => !e.startsWith('state:') && !e.startsWith('nav:') && e !== 'number');
    if (metricEntities.length > 0) {
      bestIntent = 'STAT_QUERY';
      bestScore = 3;
    }
  }

  // If we have nav entities but a weak NAVIGATE score, boost it
  const navEntities = entities.filter(e => e.startsWith('nav:'));
  if (navEntities.length > 0 && bestIntent !== 'NAVIGATE' && bestScore < 5) {
    bestIntent = 'NAVIGATE';
    bestScore = 5;
  }

  // Calculate confidence (0-1)
  const confidence = bestScore > 0 ? Math.min(bestScore / 10, 1) : 0.1;

  return {
    type: bestIntent,
    confidence,
    entities,
    originalQuery: query,
  };
}

export { METRIC_NAMES, STATE_MAPPINGS, NAVIGATION_TARGETS };
