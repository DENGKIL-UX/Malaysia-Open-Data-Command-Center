/**
 * Response Assembler
 * Generates contextual, conversational responses from parsed intent + dashboard context.
 * All responses are deterministic — no hallucination, no API calls.
 * Bilingual EN+BM responses for all 13 intent types.
 */

import {
  datasetIndex,
  metricGlossary,
  knowledgeFAQ,
  stateProfiles,
  searchDatasets,
  searchMetrics,
  searchFAQ,
  getStateByQuery,
  datasetByCategory,
  metricByName,
  stateByName,
  ontologyEdges,
  ontologyRelationshipTypes,
  ontologyConcepts,
  searchOntologyEdges,
  getEdgeById,
  getEdgesByType,
  getEdgesByNode,
  type OntologyEdgeKnowledge,
} from "@/lib/copilot/knowledge-base";
import { ParsedIntent, IntentType, getSuggestedQueries } from "@/components/copilot/intent-engine";

// ─── Types ───────────────────────────────────────────────────────────

export interface DashboardContext {
  currentView: string;
  selectedState?: string;
  selectedDataset?: string;
  visibleMetrics?: string[];
  activeComparison?: string[];
  chartType?: string;
}

export interface CopilotAction {
  type: "NAVIGATE" | "HIGHLIGHT" | "OPEN_DATASET" | "COMPARE" | "SCROLL_TO" | "FILTER" | "EXPORT" | "SHOW_METRIC";
  target?: string;
  highlightStates?: string[];
  states?: string[];
  category?: string;
  metric?: string;
}

export interface CopilotResponse {
  text: string;
  actions: CopilotAction[];
  suggestions: string[];
  metadata?: {
    confidence: string;
    dataSource?: string;
    lastUpdated?: string;
  };
}

type Lang = "en" | "ms" | "mixed";

// ─── Main Assembler ──────────────────────────────────────────────────

export function assembleResponse(intent: ParsedIntent, context: DashboardContext): CopilotResponse {
  const { type, entities, confidence, language } = intent;

  const baseMetadata = {
    confidence: confidence > 0.85 ? "high" : confidence > 0.6 ? "medium" : "low",
  };

  switch (type) {
    case "NAVIGATE":
      return handleNavigate(entities, context, language, baseMetadata);
    case "EXPLAIN":
      return handleExplain(entities, context, language, baseMetadata);
    case "COMPARE":
      return handleCompare(entities, context, language, baseMetadata);
    case "FIND_DATASET":
      return handleFindDataset(entities, intent.originalQuery, language, baseMetadata);
    case "SUMMARIZE":
      return handleSummarize(context, language, baseMetadata);
    case "RANKING":
      return handleRanking(entities, language, baseMetadata);
    case "TREND":
      return handleTrend(entities, language, baseMetadata);
    case "STATE_INFO":
      return handleStateInfo(entities, language, baseMetadata);
    case "HELP":
      return handleHelp(context, language, baseMetadata);
    case "GREETING":
      return handleGreeting(context, language, baseMetadata);
    case "INTEL_NAVIGATE":
      return handleIntelNavigate(entities, context, language, baseMetadata);
    case "ONTOLOGY_EXPLAIN":
      return handleOntologyExplain(entities, intent.originalQuery, language, baseMetadata);
    case "UNKNOWN":
    default:
      return handleUnknown(context, language, baseMetadata);
  }
}

// ─── Intent Handlers ───────────────────────────────────────────────

function handleNavigate(
  entities: ParsedIntent["entities"],
  _ctx: DashboardContext,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const target = entities.targetView || "overview";
  const states = entities.states;

  const viewNames: Record<string, { en: string; ms: string }> = {
    overview: { en: "National Overview", ms: "Gambaran Keseluruhan Negara" },
    geomap: { en: "Geographic Map", ms: "Peta Geografi" },
    datasets: { en: "Dataset Registry", ms: "Daftar Set Data" },
    analytics: { en: "Analytics Dashboard", ms: "Papan Pemuka Analitik" },
    comparison: { en: "Comparison Tool", ms: "Alat Perbandingan" },
    intelligence: { en: "Intelligence Center", ms: "Pusat Intelligen" },
  };

  const name = viewNames[target] || viewNames.overview;
  const displayName = lang === "ms" ? name.ms : name.en;

  let text = lang === "ms"
    ? `Berpindah ke bahagian **${displayName}** sekarang.`
    : `Navigating to the **${displayName}** section now.`;

  if (states?.length) {
    const stateList = states.map(s => titleCase(s)).join(" dan ");
    text += lang === "ms"
      ? ` Saya akan menumpukan pada **${stateList}**.`
      : ` I'll focus on **${stateList}**.`;
  }

  return {
    text,
    actions: [{ type: "NAVIGATE", target, highlightStates: states }],
    suggestions: generateNavSuggestions(target, lang),
    metadata: meta,
  };
}

function handleExplain(
  entities: ParsedIntent["entities"],
  _ctx: DashboardContext,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const metricQuery = entities.metrics?.[0] || entities.datasets?.[0] || "";
  const metric = searchMetrics(metricQuery);

  if (metric) {
    const higherLower = metric.higherIsGood === true
      ? (lang === "ms" ? "Lebih tinggi lebih baik" : "Higher is generally better")
      : metric.higherIsGood === false
        ? (lang === "ms" ? "Lebih rendah lebih baik" : "Lower is generally better")
        : (lang === "ms" ? "Bergantung pada konteks" : "Context-dependent");

    const text = lang === "ms" ? [
      `**${metric.nameMs || metric.name}** — ${metric.definitionMs || metric.definition}`,
      ``,
      `• **Unit:** ${metric.unit}`,
      metric.formula ? `• **Formula:** ${metric.formula}` : "",
      `• **Sumber:** ${metric.source || "data.gov.my"}`,
      `• **Panduan:** ${higherLower}`,
      metric.commonQuestionsMs?.[0] ? `\nSoalan biasa: *${metric.commonQuestionsMs[0]}*` : "",
    ].filter(Boolean).join("\n") : [
      `**${metric.name}** — ${metric.definition}`,
      ``,
      `• **Unit:** ${metric.unit}`,
      metric.formula ? `• **Formula:** ${metric.formula}` : "",
      `• **Source:** ${metric.source || "data.gov.my"}`,
      `• **Interpretation:** ${higherLower}`,
      metric.commonQuestions[0] ? `\nCommon question: *${metric.commonQuestions[0]}*` : "",
    ].filter(Boolean).join("\n");

    return {
      text,
      actions: [{ type: "SHOW_METRIC", metric: metric.name }],
      suggestions: metric.commonQuestions.slice(1, 4).map(q => q.replace("?", "")),
      metadata: { ...meta, dataSource: metric.source },
    };
  }

  // Fallback to FAQ
  const faq = searchFAQ(metricQuery, lang === "ms" ? "ms" : "en");
  if (faq) {
    const answer = lang === "ms" ? faq.answerMs : faq.answer;
    return {
      text: answer,
      actions: [],
      suggestions: [
        lang === "ms" ? "Beritahu saya lebih lanjut" : "Tell me more",
        lang === "ms" ? "Tunjuk set data berkaitan" : "Show related datasets",
        lang === "ms" ? "Banding dengan metrik lain" : "Compare with other metrics",
      ],
      metadata: meta,
    };
  }

  return {
    text: lang === "ms"
      ? `Saya tidak pasti metrik mana yang anda maksudkan. Boleh anda nyatakan dengan lebih terperinci? Contohnya: "Apa itu KDNK per kapita?" atau "Maksud CPI?"`
      : `I'm not sure which metric you're asking about. Could you be more specific? For example: "What is GDP per capita?" or "Explain CPI."`,
    actions: [],
    suggestions: [
      "What is GDP per capita?",
      "Explain unemployment rate",
      "What is CPI?",
      lang === "ms" ? "Tunjuk semua metrik" : "Show all metrics",
    ],
    metadata: meta,
  };
}

function handleCompare(
  entities: ParsedIntent["entities"],
  ctx: DashboardContext,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const states = entities.states || ctx.activeComparison || [];

  if (states.length < 2) {
    return {
      text: lang === "ms"
        ? `Untuk membandingkan, saya perlukan sekurang-kurangnya dua negeri. Cth: "Bandingkan Selangor dan Johor"`
        : `To compare, I need at least two states. Try: "Compare Selangor and Johor"`,
      actions: [],
      suggestions: [
        "Compare Selangor and Johor",
        "Compare Sabah and Sarawak",
        "Compare KL and Penang",
      ],
      metadata: meta,
    };
  }

  const [s1, s2] = states.slice(0, 2);
  const p1 = stateByName[s1.toLowerCase()];
  const p2 = stateByName[s2.toLowerCase()];

  const s1Name = p1?.name || titleCase(s1);
  const s2Name = p2?.name || titleCase(s2);

  let text = lang === "ms"
    ? `Membandingkan **${s1Name}** vs **${s2Name}**:\n\n`
    : `Comparing **${s1Name}** vs **${s2Name}**:\n\n`;

  if (p1 && p2) {
    const gdpDiff = p2.gdpPerCapita > 0
      ? ((p1.gdpPerCapita - p2.gdpPerCapita) / p2.gdpPerCapita * 100).toFixed(1)
      : "N/A";
    const unempDiff = (p1.unemploymentRate - p2.unemploymentRate).toFixed(1);

    text += lang === "ms" ? [
      `• **KDNK Per Kapita:** ${s1Name} (RM${p1.gdpPerCapita.toLocaleString()}) vs ${s2Name} (RM${p2.gdpPerCapita.toLocaleString()}) — beza ${gdpDiff}%`,
      `• **Kadar Pengangguran:** ${s1Name} (${p1.unemploymentRate}%) vs ${s2Name} (${p2.unemploymentRate}%) — beza ${unempDiff} mata peratusan`,
      `• **Penduduk:** ${s1Name} (${(p1.population).toLocaleString()}K) vs ${s2Name} (${(p2.population).toLocaleString()}K)`,
      `• **Industri Utama:** ${s1Name} (${p1.keyIndustries.slice(0, 3).join(", ")}) vs ${s2Name} (${p2.keyIndustries.slice(0, 3).join(", ")})`,
    ].join("\n") : [
      `• **GDP Per Capita:** ${s1Name} (RM${p1.gdpPerCapita.toLocaleString()}) vs ${s2Name} (RM${p2.gdpPerCapita.toLocaleString()}) — ${gdpDiff}% difference`,
      `• **Unemployment:** ${s1Name} (${p1.unemploymentRate}%) vs ${s2Name} (${p2.unemploymentRate}%) — ${unempDiff} percentage points`,
      `• **Population:** ${s1Name} (${(p1.population).toLocaleString()}K) vs ${s2Name} (${(p2.population).toLocaleString()}K)`,
      `• **Key Industries:** ${s1Name} (${p1.keyIndustries.slice(0, 3).join(", ")}) vs ${s2Name} (${p2.keyIndustries.slice(0, 3).join(", ")})`,
    ].join("\n");
  } else {
    text += lang === "ms"
      ? `Saya akan paparkan data perbandingan untuk kedua-dua negeri ini.`
      : `I'll pull up the comparison data for both states.`;
  }

  return {
    text,
    actions: [{ type: "COMPARE", states: [s1, s2] }],
    suggestions: [
      lang === "ms" ? `Apa pendorong kelebihan ${s1Name}?` : `What drives the ${s1Name} advantage?`,
      lang === "ms" ? "Tunjuk pada peta" : "Show on map side-by-side",
      lang === "ms" ? "Eksport jadual perbandingan" : "Export comparison table",
      `Add ${states[2] || "Kuala Lumpur"} to comparison`,
    ],
    metadata: meta,
  };
}

function handleFindDataset(
  entities: ParsedIntent["entities"],
  query: string,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  // If there's a category filter, use it
  if (entities.categories?.length) {
    const cat = entities.categories[0];
    const catKey = Object.keys(datasetByCategory).find(
      k => k.toLowerCase().includes(cat) ||
           datasetByCategory[k]?.[0]?.categoryMs?.toLowerCase().includes(cat)
    );
    if (catKey && datasetByCategory[catKey]) {
      const items = datasetByCategory[catKey].slice(0, 5);
      const catName = lang === "ms" ? items[0].categoryMs : catKey;
      const text = lang === "ms"
        ? `**${items.length}** set data dalam kategori **${catName}**:\n\n${items.map((d, i) => `${i + 1}. **${d.titleMs || d.title}**\n   ${d.descriptionMs?.slice(0, 100) || d.description.slice(0, 100)}...`).join("\n\n")}`
        : `**${items.length}** datasets in the **${catName}** category:\n\n${items.map((d, i) => `${i + 1}. **${d.title}**\n   ${d.description.slice(0, 100)}...`).join("\n\n")}`;

      return {
        text,
        actions: [{ type: "FILTER", category: catKey }, ...items.slice(0, 3).map(d => ({ type: "OPEN_DATASET" as const, target: d.id }))],
        suggestions: [
          lang === "ms" ? "Tunjuk semua kategori" : "Show all categories",
          lang === "ms" ? "Cari set data lain" : "Find different datasets",
          ...items.slice(0, 2).map(d => d.title),
        ],
        metadata: meta,
      };
    }
  }

  const matches = searchDatasets(query, 5);

  if (matches.length === 0) {
    return {
      text: lang === "ms"
        ? `Tiada set data yang sepadan dengan "${query}". Cuba istilah lain seperti "penduduk", "harga", atau "GDP".`
        : `No datasets matched "${query}". Try different terms like "population", "prices", or "GDP".`,
      actions: [],
      suggestions: [
        lang === "ms" ? "Tunjuk semua set data" : "Show all datasets",
        "Find population data",
        "Find price data",
        lang === "ms" ? "Layari mengikut kategori" : "Browse by category",
      ],
      metadata: meta,
    };
  }

  const text = lang === "ms"
    ? `Jumpa **${matches.length}** set data yang berkaitan:\n\n${matches.map((d, i) =>
        `${i + 1}. **${d.titleMs || d.title}** (${d.categoryMs || d.category})\n   ${d.descriptionMs?.slice(0, 100) || d.description.slice(0, 100)}...`
      ).join("\n\n")}`
    : `Found **${matches.length}** relevant datasets:\n\n${matches.map((d, i) =>
        `${i + 1}. **${d.title}** (${d.category})\n   ${d.description.slice(0, 100)}...`
      ).join("\n\n")}`;

  return {
    text,
    actions: matches.slice(0, 3).map(d => ({ type: "OPEN_DATASET" as const, target: d.id })),
    suggestions: matches.slice(0, 3).map(d => d.title),
    metadata: meta,
  };
}

function handleSummarize(
  ctx: DashboardContext,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const viewName = ctx.currentView || "overview";

  const summaries: Record<string, { en: string; ms: string }> = {
    overview: {
      en: `This is the **National Overview** dashboard showing Malaysia's key metrics across ${datasetIndex.length} datasets. The top KPIs show population (34.3M), GDP (RM1.68T), and national unemployment (3.4%). The category distribution chart breaks down datasets by domain — Demography leads with the most datasets.`,
      ms: `Ini adalah papan pemuka **Gambaran Keseluruhan Negara** yang menunjukkan metrik utama Malaysia merentasi ${datasetIndex.length} set data. KPI utama menunjukkan penduduk (34.3M), KDNK (RM1.68T), dan pengangguran kebangsaan (3.4%). Carta taburan kategori mengpecahkan set data mengikut domain — Demografi memimpin dengan set data terbanyak.`,
    },
    geomap: {
      en: `This **Geographic Map** visualizes state-level metrics across Malaysia's 16 states and territories. Use the layer controls to switch between Population, GDP, Births, Deaths, Unemployment, and Dataset counts. Click any state for detailed metrics and comparisons.`,
      ms: `**Peta Geografi** ini mengvisualisasikan metrik peringkat negeri merentasi 16 negeri dan wilayah Malaysia. Gunakan kawalan lapisan untuk bertukar antara Penduduk, KDNK, Kelahiran, Kematian, Pengangguran, dan kiraan Set Data. Klik mana-mana negeri untuk metrik terperinci dan perbandingan.`,
    },
    datasets: {
      en: `This **Dataset Registry** lists all ${datasetIndex.length} open datasets from data.gov.my. You can search, filter by category, and click any dataset for full metadata including download links (CSV/Parquet), data sources, and time coverage.`,
      ms: `**Daftar Set Data** ini menyenaraikan semua ${datasetIndex.length} set data terbuka dari data.gov.my. Anda boleh mencari, menapis mengikut kategori, dan mengklik mana-mana set data untuk metadata penuh termasuk pautan muat turun (CSV/Parquet), sumber data, dan liputan masa.`,
    },
    analytics: {
      en: `The **Analytics Dashboard** provides deeper insights with interactive charts and the Data Quality monitor. It shows data source health, dataset freshness, API performance, and uptime tracking across all data tiers.`,
      ms: `**Papan Pemuka Analitik** menyediakan pandangan lebih mendalam dengan carta interaktif dan pemantau Kualiti Data. Ia menunjukkan kesihatan sumber data, kesegaran set data, prestasi API, dan penjejakan masa aktif merentasi semua peringkat data.`,
    },
    comparison: {
      en: `The **Comparison Tool** lets you select 2-4 datasets for side-by-side analysis. Compare metadata, time ranges, and similarity scores. Export results as PNG or CSV.`,
      ms: `**Alat Perbandingan** membolehkan anda memilih 2-4 set data untuk analisis berdampingan. Bandingkan metadata, julat masa, dan skor keserupaan. Eksport keputusan sebagai PNG atau CSV.`,
    },
    intelligence: {
      en: `The **Intelligence Center** displays the **Data Ontology Graph** — an interactive visualization showing causal and correlational relationships between 47+ Malaysian open datasets. It includes anomaly detection (statistical outlier flagging), confidence scoring (5-dimension data trustworthiness), and intelligence findings (auto-discovered patterns).`,
      ms: `**Pusat Intelligen** memaparkan **Graf Ontologi Data** — visualisasi interaktif yang menunjukkan hubungan sebab dan korelasi antara 47+ set data terbuka Malaysia. Ia termasuk pengesanan anomali (penandaan outlier statistik), skor keyakinan (kebolehpercayaan data 5 dimensi), dan penemuan intelligens (corak yang ditemui secara automatik).`,
    },
  };

  const summary = summaries[viewName] || summaries.overview;

  return {
    text: lang === "ms" ? summary.ms : summary.en,
    actions: [],
    suggestions: getSuggestedQueries(viewName),
    metadata: meta,
  };
}

function handleRanking(
  entities: ParsedIntent["entities"],
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const metricKey = entities.metrics?.[0] || "gdp";
  const operator = entities.comparisonOperator || "highest";

  // Find matching metric in glossary
  const metricInfo = metricByName[metricKey.toLowerCase()] ||
    metricGlossary.find(m => m.name.toLowerCase().includes(metricKey.toLowerCase()));

  // Rank states by the requested metric
  const metricField = getMetricField(metricKey);
  const sorted = [...stateProfiles].sort((a, b) => {
    const av = (a as Record<string, unknown>)[metricField] as number;
    const bv = (b as Record<string, unknown>)[metricField] as number;
    return operator === "lowest" ? av - bv : bv - av;
  });

  const top5 = sorted.slice(0, 5);
  const metricDisplay = metricInfo?.name || titleCase(metricKey);

  const text = lang === "ms"
    ? `**${operator === "lowest" ? "5 Terendah" : "5 Tertinggi"} — ${metricInfo?.nameMs || metricDisplay}:**\n\n${top5.map((s, i) =>
        `${i + 1}. **${s.nameMs || s.name}** — ${formatMetricValue(metricKey, (s as Record<string, unknown>)[metricField] as number)}`
      ).join("\n")}\n\n_Sumber: ${metricInfo?.source || "DOSM / data.gov.my"}_`
    : `**${operator === "lowest" ? "Bottom 5" : "Top 5"} — ${metricDisplay}:**\n\n${top5.map((s, i) =>
        `${i + 1}. **${s.name}** — ${formatMetricValue(metricKey, (s as Record<string, unknown>)[metricField] as number)}`
      ).join("\n")}\n\n_Source: ${metricInfo?.source || "DOSM / data.gov.my"}_`;

  return {
    text,
    actions: [{ type: "HIGHLIGHT", highlightStates: top5.map(s => s.name.toLowerCase()) }],
    suggestions: [
      lang === "ms" ? `Tunjuk ${operator === "lowest" ? "tertinggi" : "terendah"}` : `Show ${operator === "lowest" ? "highest" : "lowest"}`,
      lang === "ms" ? "Bandingkan negeri teratas" : "Compare top states",
      lang === "ms" ? "Terangkan metrik ini" : "Explain this metric",
      lang === "ms" ? "Tunjuk pada peta" : "Show on map",
    ],
    metadata: meta,
  };
}

function handleTrend(
  entities: ParsedIntent["entities"],
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const metricKey = entities.metrics?.[0] || "gdp";
  const metricInfo = metricByName[metricKey.toLowerCase()] ||
    metricGlossary.find(m => m.name.toLowerCase().includes(metricKey.toLowerCase()));
  const metricDisplay = metricInfo?.name || titleCase(metricKey);

  // Find relevant datasets for trend analysis
  const relevantDatasets = searchDatasets(metricKey, 3);

  const text = lang === "ms"
    ? [
        `**Trend ${metricInfo?.nameMs || metricDisplay}:**`,
        ``,
        metricInfo
          ? `${metricInfo.definitionMs || metricInfo.definition}`
          : `Data trend untuk ${metricDisplay}.`,
        ``,
        relevantDatasets.length > 0
          ? `Set data berkaitan:\n${relevantDatasets.map((d, i) => `${i + 1}. **${d.titleMs || d.title}** (${d.beginYear}–${d.endYear})`).join("\n")}`
          : `Cari set data dalam tab Set Data untuk data trend terperinci.`,
        ``,
        entities.timeRange
          ? `Julat masa: **${entities.timeRange}**`
          : `Petunjuk: Tambah julat masa seperti "5 tahun" atau "sejak 2020" untuk tumpuan analisis.`,
      ].join("\n")
    : [
        `**Trend: ${metricDisplay}:**`,
        ``,
        metricInfo
          ? `${metricInfo.definition}`
          : `Trend data for ${metricDisplay}.`,
        ``,
        relevantDatasets.length > 0
          ? `Relevant datasets:\n${relevantDatasets.map((d, i) => `${i + 1}. **${d.title}** (${d.beginYear}–${d.endYear})`).join("\n")}`
          : `Search the Datasets tab for detailed trend data.`,
        ``,
        entities.timeRange
          ? `Time range: **${entities.timeRange}**`
          : `Tip: Add a time range like "5 years" or "since 2020" for focused analysis.`,
      ].join("\n");

  return {
    text,
    actions: relevantDatasets.slice(0, 2).map(d => ({ type: "OPEN_DATASET" as const, target: d.id })),
    suggestions: [
      lang === "ms" ? "Terangkan metrik ini" : "Explain this metric",
      lang === "ms" ? "Bandingkan negeri" : "Compare across states",
      lang === "ms" ? "Tunjuk carta" : "Show chart",
      lang === "ms" ? "Eksport data" : "Export data",
    ],
    metadata: { ...meta, dataSource: metricInfo?.source },
  };
}

function handleStateInfo(
  entities: ParsedIntent["entities"],
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const stateName = entities.states?.[0] || "";
  const profile = getStateByQuery(stateName) || stateByName[stateName.toLowerCase()];

  if (!profile) {
    return {
      text: lang === "ms"
        ? `Saya tidak dapat mencari maklumat negeri untuk "${stateName}". Cuba nama negeri seperti "Selangor", "Johor", atau "Sabah".`
        : `I couldn't find state information for "${stateName}". Try a state name like "Selangor", "Johor", or "Sabah".`,
      actions: [],
      suggestions: [
        "Tell me about Selangor",
        "Tell me about Sabah",
        "Tell me about Kuala Lumpur",
        lang === "ms" ? "Bandingkan negeri" : "Compare states",
      ],
      metadata: meta,
    };
  }

  const regionLabel = profile.region === "east_malaysia"
    ? (lang === "ms" ? "Malaysia Timur" : "East Malaysia")
    : (lang === "ms" ? "Semenanjung" : "Peninsular");

  const text = lang === "ms"
    ? [
        `**${profile.nameMs || profile.name}** (${profile.code}) — ${regionLabel}`,
        ``,
        `• **Penduduk:** ${profile.population.toLocaleString()}K`,
        `• **KDNK:** RM${profile.gdp.toLocaleString()} juta`,
        `• **KDNK Per Kapita:** RM${profile.gdpPerCapita.toLocaleString()}`,
        `• **Kadar Pengangguran:** ${profile.unemploymentRate}%`,
        `• **Industri Utama:** ${profile.keyIndustries.join(", ")}`,
        ``,
        profile.commonComparisons.length > 0
          ? `_Negeri perbandingan biasa: ${profile.commonComparisons.join(", ")}_`
          : "",
      ].filter(Boolean).join("\n")
    : [
        `**${profile.name}** (${profile.code}) — ${regionLabel}`,
        ``,
        `• **Population:** ${profile.population.toLocaleString()}K`,
        `• **GDP:** RM${profile.gdp.toLocaleString()} million`,
        `• **GDP Per Capita:** RM${profile.gdpPerCapita.toLocaleString()}`,
        `• **Unemployment Rate:** ${profile.unemploymentRate}%`,
        `• **Key Industries:** ${profile.keyIndustries.join(", ")}`,
        ``,
        profile.commonComparisons.length > 0
          ? `_Common comparisons: ${profile.commonComparisons.join(", ")}_`
          : "",
      ].filter(Boolean).join("\n");

  return {
    text,
    actions: [{ type: "HIGHLIGHT", highlightStates: [profile.name.toLowerCase()] }],
    suggestions: [
      lang === "ms" ? `Bandingkan ${profile.nameMs || profile.name}` : `Compare ${profile.name}`,
      lang === "ms" ? "Tunjuk pada peta" : "Show on map",
      ...profile.commonComparisons.slice(0, 2).map(c =>
        lang === "ms" ? `Info ${c}` : `Tell me about ${c}`
      ),
    ],
    metadata: meta,
  };
}

function handleHelp(
  ctx: DashboardContext,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const text = lang === "ms"
    ? [
        `**Bantuan Pusat Perintah** 🎯`,
        ``,
        `Saya boleh membantu anda dengan:`,
        ``,
        `• **Navigasi** — "Buka peta", "Tunjuk set data"`,
        `• **Terangkan** — "Apa itu CPI?", "Maksud pengangguran?"`,
        `• **Bandingkan** — "Bandingkan Selangor dan Johor"`,
        `• **Cari Data** — "Cari data penduduk", "Ada data harga?"`,
        `• **Ringkasan** — "Ringkaskan papan pemuka ini"`,
        `• **Kedudukan** — "Negeri mana KDNK tertinggi?"`,
        `• **Trend** — "Trend pengangguran sejak 2020"`,
        `• **Info Negeri** — "Cerita tentang Sabah"`,
        `• **Intelligen** — "Tunjuk tab intel", "Apa itu graf ontologi?"`,
        ``,
        `Anda boleh bertanya dalam Bahasa Melayu atau English! 🇲🇾`,
      ].join("\n")
    : [
        `**Command Center Help** 🎯`,
        ``,
        `I can help you with:`,
        ``,
        `• **Navigate** — "Show me the map", "Open datasets"`,
        `• **Explain** — "What is CPI?", "Explain unemployment"`,
        `• **Compare** — "Compare Selangor and Johor"`,
        `• **Find Data** — "Find population data", "Any price data?"`,
        `• **Summarize** — "Summarize this dashboard"`,
        `• **Ranking** — "Which state has the highest GDP?"`,
        `• **Trend** — "Unemployment trend since 2020"`,
        `• **State Info** — "Tell me about Sabah"`,
        `• **Intelligence** — "Show me the intel tab", "What is the ontology graph?"`,
        ``,
        `You can ask in English or Bahasa Melayu! 🇲🇾`,
      ].join("\n");

  return {
    text,
    actions: [],
    suggestions: getSuggestedQueries(ctx.currentView),
    metadata: meta,
  };
}

function handleGreeting(
  _ctx: DashboardContext,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const text = lang === "ms"
    ? `Selamat datang ke **Pusat Perintah Data Terbuka Malaysia**! 🇲🇾\n\nSaya pembantu pintar anda — boleh membantu navigasi papan pemuka, terangkan metrik, cari set data, dan banyak lagi. Apa yang ingin anda ketahui?`
    : `Welcome to the **Malaysia Open Data Command Center**! 🇲🇾\n\nI'm your smart assistant — I can help navigate the dashboard, explain metrics, find datasets, and more. What would you like to know?`;

  return {
    text,
    actions: [],
    suggestions: [
      lang === "ms" ? "Apa yang boleh anda bantu?" : "What can you help with?",
      lang === "ms" ? "Negeri mana KDNK tertinggi?" : "Which state has the highest GDP?",
      lang === "ms" ? "Cari data penduduk" : "Find population data",
      lang === "ms" ? "Tunjuk peta" : "Show me the map",
    ],
    metadata: meta,
  };
}

function handleUnknown(
  _ctx: DashboardContext,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const text = lang === "ms"
    ? `Saya tidak pasti apa yang anda maksudkan. Boleh cuba:\n\n• Soal tentang metrik: "Apa itu CPI?"\n• Cari data: "Cari data penduduk"\n• Banding negeri: "Bandingkan Selangor dan Johor"\n• Minta bantuan: "Panduan"`
    : `I'm not sure what you mean. Try:\n\n• Ask about a metric: "What is CPI?"\n• Find data: "Find population data"\n• Compare states: "Compare Selangor and Johor"\n• Get help: "Guide me"`;

  return {
    text,
    actions: [],
    suggestions: getSuggestedQueries("overview"),
    metadata: meta,
  };
}

// ─── Helper Functions ──────────────────────────────────────────────

function generateNavSuggestions(target: string, lang: Lang): string[] {
  const suggestions: Record<string, { en: string[]; ms: string[] }> = {
    overview: {
      en: ["Which state has the highest GDP?", "Show me the map", "Find population data"],
      ms: ["Negeri mana KDNK tertinggi?", "Tunjuk peta", "Cari data penduduk"],
    },
    geomap: {
      en: ["Compare Selangor and Johor", "Show me Sabah details", "What does this color mean?"],
      ms: ["Bandingkan Selangor dan Johor", "Tunjuk detail Sabah", "Apa maksud warna ini?"],
    },
    datasets: {
      en: ["Find population data", "Show price statistics", "Filter by category"],
      ms: ["Cari data penduduk", "Tunjuk statistik harga", "Tapis mengikut kategori"],
    },
    analytics: {
      en: ["Summarize this chart", "What is the CPI trend?", "Explain this metric"],
      ms: ["Ringkaskan carta ini", "Apa trend CPI?", "Terangkan metrik ini"],
    },
    comparison: {
      en: ["Add Kuala Lumpur", "Show GDP breakdown", "Export comparison"],
      ms: ["Tambah Kuala Lumpur", "Tunjuk pecahan KDNK", "Eksport perbandingan"],
    },
    intelligence: {
      en: ["Explain the ontology graph", "What are domain edges?", "Show causal relationships", "What is anomaly detection?"],
      ms: ["Terangkan graf ontologi", "Apa itu tepi domain?", "Tunjuk hubungan sebab", "Apa itu pengesanan anomali?"],
    },
  };

  const view = suggestions[target] || suggestions.overview;
  return lang === "ms" ? view.ms : view.en;
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getMetricField(metricKey: string): string {
  const map: Record<string, string> = {
    "gdp": "gdpPerCapita",
    "population": "population",
    "unemployment": "unemploymentRate",
    "income": "gdpPerCapita",
    "household income": "gdpPerCapita",
  };
  return map[metricKey.toLowerCase()] || "gdpPerCapita";
}

function formatMetricValue(metricKey: string, value: number): string {
  const key = metricKey.toLowerCase();
  if (key.includes("unemployment") || key.includes("rate") || key.includes("%")) {
    return `${value}%`;
  }
  if (key.includes("gdp") || key.includes("income")) {
    return `RM${value.toLocaleString()}`;
  }
  return value.toLocaleString();
}

// ─── Intelligence / Ontology Handlers ───────────────────────────────

function handleIntelNavigate(
  entities: ParsedIntent["entities"],
  _ctx: DashboardContext,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const text = lang === "ms"
    ? `Berpindah ke tab **Pusat Intelligen** sekarang. Tab ini memaparkan **Graf Ontologi Data** — visualisasi interaktif yang menunjukkan hubungan sebab dan korelasi antara 47+ set data terbuka Malaysia.`
    : `Navigating to the **Intelligence Center** tab now. This tab displays the **Data Ontology Graph** — an interactive visualization showing causal and correlational relationships between 47+ Malaysian open datasets.`;

  return {
    text,
    actions: [{ type: "NAVIGATE", target: "intelligence" }],
    suggestions: [
      "Explain the ontology graph",
      "What are domain edges?",
      "Show causal relationships",
      "What is anomaly detection?",
      "Explain confidence scores",
    ],
    metadata: meta,
  };
}

function handleOntologyExplain(
  _entities: ParsedIntent["entities"],
  query: string,
  lang: Lang,
  meta: { confidence: string }
): CopilotResponse {
  const q = query.toLowerCase();

  // Check for specific edge questions
  if ((q.includes("fuel") && q.includes("cpi")) || q.includes("harga api") && q.includes("ihp")) {
    const edge = getEdgeById("fuel-cpi");
    if (edge) return formatEdgeResponse(edge, lang, meta);
  }
  if ((q.includes("gdp") && q.includes("unemp")) || (q.includes("kdnk") && q.includes("pengangguran"))) {
    const edge = getEdgeById("gdp-unemp");
    if (edge) return formatEdgeResponse(edge, lang, meta);
  }
  if (q.includes("exchange") || q.includes("ringgit") || q.includes("pertukaran")) {
    const edges = searchOntologyEdges("exchange");
    if (edges.length) return formatEdgesResponse(edges, lang, meta);
  }

  // Check for relationship type questions
  if (q.includes("drives") || q.includes("causal") || q.includes("sebab")) {
    return formatRelationshipTypeResponse("DRIVES", lang, meta);
  }
  if (q.includes("leads") || q.includes("leading") || q.includes("petunjuk awal")) {
    return formatRelationshipTypeResponse("LEADS", lang, meta);
  }
  if (q.includes("correlates") || q.includes("correlation") || q.includes("korelasi")) {
    return formatRelationshipTypeResponse("CORRELATES_POSITIVE", lang, meta);
  }

  // Check for concept questions
  if (q.includes("anomaly") || q.includes("anomali")) {
    const concept = ontologyConcepts.find(c => c.name === "Anomaly Detection");
    if (concept) return formatConceptResponse(concept, lang, meta);
  }
  if (q.includes("confidence") || q.includes("keyakinan")) {
    const concept = ontologyConcepts.find(c => c.name === "Confidence Score");
    if (concept) return formatConceptResponse(concept, lang, meta);
  }
  if (q.includes("domain edge") || q.includes("expert edge") || q.includes("tepi domain")) {
    const concept = ontologyConcepts.find(c => c.name === "Domain Knowledge Edge");
    if (concept) return formatConceptResponse(concept, lang, meta);
  }

  // General ontology explanation
  const text = lang === "ms" ? `
**Graf Ontologi Data** adalah visualisasi interaktif yang menunjukkan bagaimana 47+ set data terbuka Malaysia berhubung antara satu sama lain.

Komponen utama:

🔹 **Nod Kategori** — 15 kategori data (Ekonomi, Harga, Buruh, dll.)
🔹 **Nod Set Data** — 47+ set data individu dengan saiz mengikut prioriti (P0–P3)
🔹 **Tepi Domain** — 13 hubungan sebab/korelasi yang ditentukan pakar
🔹 **Tepi Geografi** — Set data yang liputan geonya sama
🔹 **Tepi Kekerapan** — Set data yang dikemas kini pada kadar sama

Anda boleh:
• Seret nod untuk menyusun semula
• Tatal untuk zum masuk/keluar
• Togol jenis tepi (DRIVES, LEADS, CORRELATES)
• Tapis mengikut kekuatan hubungan

Mahu saya terangkan hubungan sebab tertentu?
  `.trim() : `
The **Data Ontology Graph** is an interactive visualization showing how 47+ Malaysian open datasets connect to one another.

Key components:

🔹 **Category Nodes** — 15 data categories (Economy, Prices, Labour, etc.)
🔹 **Dataset Nodes** — 47+ individual datasets sized by priority (P0–P3)
🔹 **Domain Edges** — 13 expert-defined causal/correlational relationships
🔹 **Geography Edges** — Datasets sharing the same geographic scope
🔹 **Frequency Edges** — Datasets updated at the same rate

You can:
• Drag nodes to rearrange
• Scroll to zoom in/out
• Toggle edge types (DRIVES, LEADS, CORRELATES)
• Filter by relationship strength

Would you like me to explain a specific causal relationship?
  `.trim();

  return {
    text,
    actions: [{ type: "NAVIGATE", target: "intelligence" }],
    suggestions: [
      "What is a domain edge?",
      "Explain fuel price → CPI",
      "What does DRIVES mean?",
      "Show all causal relationships",
      "What is anomaly detection?",
    ],
    metadata: meta,
  };
}

// ─── Ontology Helper Formatters ───────────────────────────────────────

function formatEdgeResponse(edge: OntologyEdgeKnowledge, lang: Lang, meta: { confidence: string }): CopilotResponse {
  const isBM = lang === "ms";
  const typeInfo = ontologyRelationshipTypes.find(t => t.type === edge.type);

  const text = isBM ? `
**${edge.sourceBM} → ${edge.targetBM}**

• **Jenis:** ${typeInfo?.labelBM || edge.type} (${typeInfo?.color})
• **Kekuatan:** ${(edge.strength * 100).toFixed(0)}%
${edge.lag ? `• **Kelewatan:** ${edge.lag}` : ""}
• **Huraian:** ${edge.descriptionBM}

Ini adalah salah satu 13 tepi domain pakar dalam Graf Ontologi Data.
  `.trim() : `
**${edge.source} → ${edge.target}**

• **Type:** ${typeInfo?.label || edge.type} (${typeInfo?.color})
• **Strength:** ${(edge.strength * 100).toFixed(0)}%
${edge.lag ? `• **Lag:** ${edge.lag}` : ""}
• **Description:** ${edge.description}

This is one of 13 expert-defined domain edges in the Data Ontology Graph.
  `.trim();

  return {
    text,
    actions: [{ type: "NAVIGATE", target: "intelligence" }, { type: "HIGHLIGHT", target: edge.id }],
    suggestions: [
      `What affects ${isBM ? edge.sourceBM : edge.source}?`,
      `What is driven by ${isBM ? edge.targetBM : edge.target}?`,
      "Show all DRIVES edges",
      "Compare with other causal links",
    ],
    metadata: meta,
  };
}

function formatEdgesResponse(edges: OntologyEdgeKnowledge[], lang: Lang, meta: { confidence: string }): CopilotResponse {
  const isBM = lang === "ms";
  const text = isBM ? `
Jumpa **${edges.length}** hubungan ontologi:

${edges.map((e, i) => {
  const type = ontologyRelationshipTypes.find(t => t.type === e.type);
  return `${i + 1}. **${e.sourceBM} → ${e.targetBM}** (${type?.labelBM || e.type}, ${(e.strength * 100).toFixed(0)}%)`;
}).join("\n")}
  `.trim() : `
Found **${edges.length}** ontology relationships:

${edges.map((e, i) => {
  const type = ontologyRelationshipTypes.find(t => t.type === e.type);
  return `${i + 1}. **${e.source} → ${e.target}** (${type?.label || e.type}, ${(e.strength * 100).toFixed(0)}%)`;
}).join("\n")}
  `.trim();

  return {
    text,
    actions: [{ type: "NAVIGATE", target: "intelligence" }],
    suggestions: edges.slice(0, 3).map(e => `Explain ${e.source} → ${e.target}`),
    metadata: meta,
  };
}

function formatRelationshipTypeResponse(type: string, lang: Lang, meta: { confidence: string }): CopilotResponse {
  const typeInfo = ontologyRelationshipTypes.find(t => t.type === type);
  const edges = getEdgesByType(type);

  const descriptions: Record<string, { en: string; ms: string }> = {
    DRIVES: {
      en: "**DRIVES** edges represent causal relationships where one dataset directly influences another. The arrow points from cause to effect.",
      ms: "**DRIVES** mewakili hubungan sebab di mana satu set data mempengaruhi set data lain secara langsung. Anak panah menunjuk dari sebab ke kesan.",
    },
    LEADS: {
      en: "**LEADS** edges indicate predictive relationships — one dataset is a leading indicator for another. Used for early warning signals.",
      ms: "**LEADS** menunjukkan hubungan ramalan — satu set data adalah petunjuk awal untuk set data lain. Digunakan untuk isyarat amaran awal.",
    },
    CORRELATES_POSITIVE: {
      en: "**CORRELATES_POSITIVE** means two datasets move in the same direction. When one increases, the other tends to increase too.",
      ms: "**CORRELATES_POSITIVE** bermaksud dua set data bergerak ke arah sama. Apabila satu meningkat, yang lain cenderung meningkat juga.",
    },
    CORRELATES_NEGATIVE: {
      en: "**CORRELATES_NEGATIVE** means two datasets move in opposite directions. When one increases, the other tends to decrease.",
      ms: "**CORRELATES_NEGATIVE** bermaksud dua set data bergerak ke arah berlawanan. Apabila satu meningkat, yang lain cenderung menurun.",
    },
  };

  const desc = descriptions[type] || { en: "Unknown relationship type.", ms: "Jenis hubungan tidak diketahui." };
  const isBM = lang === "ms";

  const text = `${isBM ? desc.ms : desc.en}

${isBM ? `Terdapat **${edges.length}** tepi jenis ini dalam graf:` : `There are **${edges.length}** edges of this type in the graph:`}

${edges.map((e, i) => `${i + 1}. **${isBM ? e.sourceBM : e.source} → ${isBM ? e.targetBM : e.target}** (${(e.strength * 100).toFixed(0)}%)`).join("\n")}`;

  return {
    text,
    actions: [{ type: "NAVIGATE", target: "intelligence" }],
    suggestions: edges.slice(0, 3).map(e => `Explain ${e.source} → ${e.target}`),
    metadata: meta,
  };
}

interface OntologyConcept {
  name: string;
  nameBM: string;
  description: string;
  descriptionBM: string;
}

function formatConceptResponse(concept: OntologyConcept, lang: Lang, meta: { confidence: string }): CopilotResponse {
  const isBM = lang === "ms";
  return {
    text: isBM ? `**${concept.nameBM}**\n\n${concept.descriptionBM}` : `**${concept.name}**\n\n${concept.description}`,
    actions: [{ type: "NAVIGATE", target: "intelligence" }],
    suggestions: ["Show me the graph", "What are domain edges?", "Explain confidence scoring", "What is anomaly detection?"],
    metadata: meta,
  };
}
