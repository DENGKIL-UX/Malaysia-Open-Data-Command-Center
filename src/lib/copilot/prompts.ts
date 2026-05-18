// Command Copilot Response Assembly
// Takes an Intent and returns a formatted CopilotResponse

import { classifyIntent, NAVIGATION_TARGETS, STATE_MAPPINGS } from './intent-engine';
import { searchKnowledge, ONTOLOGY_EDGES, KNOWLEDGE_ENTRIES } from './knowledge-base';
import type { Intent } from './intent-engine';

export interface CopilotResponse {
  text: string;
  type: 'text' | 'stat' | 'navigation' | 'comparison' | 'ontology';
  action?: {
    type: 'navigate' | 'highlight' | 'show-metric';
    target: string;
  };
}

// ─── Main Response Assembly ─────────────────────────────────────────────
export function assembleResponse(intent: Intent, lang: 'en' | 'ms'): CopilotResponse {
  switch (intent.type) {
    case 'GREETING':
      return assembleGreeting(lang);
    case 'HELP':
      return assembleHelp(lang);
    case 'NAVIGATE':
      return assembleNavigation(intent, lang);
    case 'EXPLAIN':
      return assembleExplain(intent, lang);
    case 'STAT_QUERY':
      return assembleStatQuery(intent, lang);
    case 'FIND_DATASET':
      return assembleFindDataset(intent, lang);
    case 'COMPARE':
      return assembleComparison(intent, lang);
    case 'ONTOLOGY_EXPLAIN':
      return assembleOntologyExplain(intent, lang);
    case 'SUMMARIZE':
      return assembleSummary(intent, lang);
    case 'UNKNOWN':
    default:
      return assembleFallback(intent, lang);
  }
}

// ─── Greeting ───────────────────────────────────────────────────────────
function assembleGreeting(lang: 'en' | 'ms'): CopilotResponse {
  const entry = KNOWLEDGE_ENTRIES.find(e => e.id === 'greeting');
  return {
    text: entry ? (lang === 'ms' ? entry.response_ms : entry.response_en) :
      lang === 'en'
        ? 'Hello! I\'m the **Command Copilot**. How can I help you explore Malaysia\'s data today?'
        : 'Selamat! Saya **Copilot Perintah**. Bagaimana saya boleh membantu anda meneroka data Malaysia hari ini?',
    type: 'text',
  };
}

// ─── Help ───────────────────────────────────────────────────────────────
function assembleHelp(lang: 'en' | 'ms'): CopilotResponse {
  const entry = KNOWLEDGE_ENTRIES.find(e => e.id === 'help-capabilities');
  return {
    text: entry ? (lang === 'ms' ? entry.response_ms : entry.response_en) :
      lang === 'en'
        ? 'I can help you navigate, explore data, and answer questions about Malaysia\'s open data.'
        : 'Saya boleh membantu anda navigasi, terokai data, dan menjawab soalan tentang data terbuka Malaysia.',
    type: 'text',
  };
}

// ─── Navigation ─────────────────────────────────────────────────────────
function assembleNavigation(intent: Intent, lang: 'en' | 'ms'): CopilotResponse {
  const navEntity = intent.entities.find(e => e.startsWith('nav:'));
  const target = navEntity ? navEntity.replace('nav:', '') : null;

  if (target && NAVIGATION_TARGETS[target]) {
    const entry = KNOWLEDGE_ENTRIES.find(e => e.id === `nav-${target}`);
    const labels: Record<string, { en: string; ms: string }> = {
      'overview': { en: 'Go to Overview', ms: 'Pergi ke Gambaran' },
      'geomap': { en: 'Go to GeoMap', ms: 'Pergi ke PetaGeo' },
      'datasets': { en: 'Go to Datasets', ms: 'Pergi ke Set Data' },
      'analytics': { en: 'Go to Analytics', ms: 'Pergi ke Analitik' },
    };

    const label = labels[target] || { en: `Go to ${target}`, ms: `Pergi ke ${target}` };

    return {
      text: entry
        ? (lang === 'ms' ? entry.response_ms : entry.response_en)
        : lang === 'en'
          ? `Navigating to **${target}** tab.`
          : `Navigasi ke tab **${target}**.`,
      type: 'navigation',
      action: {
        type: 'navigate',
        target: target,
      },
    };
  }

  // If no specific target found, try knowledge base
  const results = searchKnowledge(intent.originalQuery, lang);
  if (results.length > 0) {
    const entry = results[0];
    return {
      text: lang === 'ms' ? entry.response_ms : entry.response_en,
      type: 'navigation',
    };
  }

  return {
    text: lang === 'en'
      ? 'I can navigate you to: **Overview**, **GeoMap**, **Datasets**, or **Analytics**. Which would you like to see?'
      : 'Saya boleh navigasi anda ke: **Gambaran**, **PetaGeo**, **Set Data**, atau **Analitik**. Yang mana ingin anda lihat?',
    type: 'text',
  };
}

// ─── Explain ────────────────────────────────────────────────────────────
function assembleExplain(intent: Intent, lang: 'en' | 'ms'): CopilotResponse {
  const results = searchKnowledge(intent.originalQuery, lang);

  if (results.length > 0) {
    const entry = results[0];
    const text = lang === 'ms' ? entry.response_ms : entry.response_en;

    // If it's a navigation-related explanation, add action
    if (entry.category === 'navigation') {
      const navId = entry.id.replace('nav-', '');
      return {
        text,
        type: 'navigation',
        action: { type: 'navigate', target: navId },
      };
    }

    return {
      text,
      type: entry.category === 'dataset' ? 'stat' : entry.category === 'ontology' ? 'ontology' : 'text',
    };
  }

  return {
    text: lang === 'en'
      ? 'I don\'t have specific information about that. Try asking about Malaysia\'s population, GDP, datasets, or navigation options.'
      : 'Saya tidak mempunyai maklumat khusus tentang itu. Cuba tanya tentang penduduk Malaysia, KDNK, set data, atau pilihan navigasi.',
    type: 'text',
  };
}

// ─── Stat Query ─────────────────────────────────────────────────────────
function assembleStatQuery(intent: Intent, lang: 'en' | 'ms'): CopilotResponse {
  // Check for state-specific query
  const stateEntity = intent.entities.find(e => e.startsWith('state:'));

  if (stateEntity) {
    const stateId = stateEntity.replace('state:', '');
    const results = searchKnowledge(stateId, lang);
    if (results.length > 0) {
      const entry = results[0];
      return {
        text: lang === 'ms' ? entry.response_ms : entry.response_en,
        type: 'stat',
        action: { type: 'show-metric', target: stateId },
      };
    }
  }

  // General stat query
  const results = searchKnowledge(intent.originalQuery, lang);
  if (results.length > 0) {
    const entry = results[0];
    let text = lang === 'ms' ? entry.response_ms : entry.response_en;

    // Add related info if available
    if (entry.relatedIds && entry.relatedIds.length > 0) {
      const relatedEntries = entry.relatedIds
        .map(id => KNOWLEDGE_ENTRIES.find(e => e.id === id))
        .filter(Boolean)
        .slice(0, 2);

      if (relatedEntries.length > 0) {
        const relatedText = lang === 'en' ? '\n\n**Related:** ' : '\n\n**Berkaitan:** ';
        text += relatedText + relatedEntries
          .map(e => e ? (lang === 'ms' ? e.keywords_ms[0] : e.keywords_en[0]) : '')
          .filter(Boolean)
          .join(', ');
      }
    }

    return {
      text,
      type: 'stat',
    };
  }

  return {
    text: lang === 'en'
      ? 'I couldn\'t find that specific statistic. Try asking about: population, GDP, births, deaths, or unemployment.'
      : 'Saya tidak dapat mencari statistik tersebut. Cuba tanya tentang: penduduk, KDNK, kelahiran, kematian, atau pengangguran.',
    type: 'text',
  };
}

// ─── Find Dataset ───────────────────────────────────────────────────────
function assembleFindDataset(intent: Intent, lang: 'en' | 'ms'): CopilotResponse {
  const results = searchKnowledge(intent.originalQuery, lang);

  // Look specifically for dataset category entries
  const datasetResults = results.filter(e => e.category === 'dataset');
  const searchResults = datasetResults.length > 0 ? datasetResults : results;

  if (searchResults.length > 0) {
    const entry = searchResults[0];
    return {
      text: lang === 'ms' ? entry.response_ms : entry.response_en,
      type: 'stat',
      action: { type: 'navigate', target: 'datasets' },
    };
  }

  return {
    text: lang === 'en'
      ? 'I couldn\'t find matching datasets. The 18 categories include: Demography, National Accounts, Prices, Labour Markets, Financial Markets, Economic Sectors, Healthcare, Environment, Education, Transportation, Households, Communications, Public Safety, Public Administration, Public Welfare, Statistical Indicators, Data Dictionaries, and Metadata.'
      : 'Saya tidak dapat mencari set data yang sepadan. 18 kategori termasuk: Demografi, Akaun Negara, Harga, Pasaran Buruh, Pasaran Kewangan, Sektor Ekonomi, Kesihatan, Alam Sekitar, Pendidikan, Pengangkutan, Isi Rumah, Komunikasi, Keselamatan Awam, Pentadbiran Awam, Kebajikan Awam, Penunjuk Statistik, Kamus Data, dan Metadata.',
    type: 'text',
    action: { type: 'navigate', target: 'datasets' },
  };
}

// ─── Comparison ─────────────────────────────────────────────────────────
function assembleComparison(intent: Intent, lang: 'en' | 'ms'): CopilotResponse {
  const stateEntities = intent.entities.filter(e => e.startsWith('state:'));

  if (stateEntities.length >= 1) {
    const stateNames = stateEntities.map(e => {
      const key = e.replace('state:', '');
      const mapping = STATE_MAPPINGS[key];
      return mapping ? mapping[0].charAt(0).toUpperCase() + mapping[0].slice(1) : key;
    });

    // Get data for each state from knowledge base
    const stateData = stateEntities.map(e => {
      const key = e.replace('state:', '');
      const entry = KNOWLEDGE_ENTRIES.find(en => en.id === `state-${key}`);
      return entry;
    }).filter(Boolean);

    if (stateData.length > 0) {
      const texts = stateData.map(entry =>
        entry ? (lang === 'ms' ? entry.response_ms : entry.response_en) : ''
      ).filter(Boolean);

      return {
        text: texts.join('\n\n---\n\n'),
        type: 'comparison',
        action: { type: 'navigate', target: 'geomap' },
      };
    }

    return {
      text: lang === 'en'
        ? `Comparing **${stateNames.join(' vs ')}**. Switch to the GeoMap tab for a visual comparison, or ask about specific metrics like population, GDP, or unemployment for each state.`
        : `Membandingkan **${stateNames.join(' vs ')}**. Tukar ke tab PetaGeo untuk perbandingan visual, atau tanya tentang metrik tertentu seperti penduduk, KDNK, atau pengangguran untuk setiap negeri.`,
      type: 'comparison',
      action: { type: 'navigate', target: 'geomap' },
    };
  }

  return {
    text: lang === 'en'
      ? 'To compare, mention two or more states. For example: "Compare Selangor vs Johor" or "Johor vs Sabah population".'
      : 'Untuk membandingkan, nyatakan dua atau lebih negeri. Contoh: "Bandingkan Selangor vs Johor" atau "Johor vs Sabah penduduk".',
    type: 'text',
  };
}

// ─── Ontology Explain ───────────────────────────────────────────────────
function assembleOntologyExplain(intent: Intent, lang: 'en' | 'ms'): CopilotResponse {
  // Check for specific edge query
  const q = intent.originalQuery.toLowerCase();

  for (const edge of ONTOLOGY_EDGES) {
    const sourceMatch = q.includes(edge.source.toLowerCase()) || q.includes(edge.sourceBM.toLowerCase());
    const targetMatch = q.includes(edge.target.toLowerCase()) || q.includes(edge.targetBM.toLowerCase());

    if (sourceMatch && targetMatch) {
      return {
        text: lang === 'ms' ? edge.description_ms : edge.description_en +
          `\n\n**${edge.source} → ${edge.target}** | Type: ${edge.type} | Strength: ${edge.strength} | Lag: ${edge.lag} year(s)`,
        type: 'ontology',
      };
    }
  }

  // General ontology explanation
  const entry = KNOWLEDGE_ENTRIES.find(e => e.id === 'onto-overview');
  if (entry) {
    const edgeList = ONTOLOGY_EDGES.slice(0, 6).map(edge =>
      `• **${edge.source} → ${edge.target}** (${edge.type}, strength: ${edge.strength})`
    ).join('\n');

    const text = (lang === 'ms' ? entry.response_ms : entry.response_en) +
      `\n\n**Key Relationships:**\n${edgeList}`;

    return {
      text,
      type: 'ontology',
    };
  }

  return {
    text: lang === 'en'
      ? 'The **Data Ontology** shows relationships between data domains. Key connections include Population → GDP, GDP → Employment, and Population → Healthcare. Ask about a specific relationship to learn more!'
      : '**Ontologi Data** menunjukkan hubungan antara domain data. Hubungan utama termasuk Penduduk → KDNK, KDNK → Pekerjaan, dan Penduduk → Kesihatan. Tanya tentang hubungan tertentu untuk mengetahui lebih lanjut!',
    type: 'ontology',
  };
}

// ─── Summary ────────────────────────────────────────────────────────────
function assembleSummary(_intent: Intent, lang: 'en' | 'ms'): CopilotResponse {
  if (lang === 'ms') {
    return {
      text: '**Ringkasan Pusat Perintah Data Malaysia** 🇲🇾\n\n' +
        '📊 **Penduduk**: 34.3 juta | **KDNK**: RM1.68T | **Pengangguran**: 3.4%\n' +
        '👶 **Kelahiran**: 602,900 | ✝️ **Kematian**: 159,700\n' +
        '📦 **Set Data**: 287+ merentasi 18 kategori\n' +
        '🗺️ **Negeri/FT**: 16 negeri + 3 Wilayah Persekutuan\n\n' +
        'Negeri terbesar mengikut penduduk: Selangor (7.1M), Johor (4.2M), Sabah (3.9M)\n' +
        'Negeri terbesar mengikut KDNK: Selangor (RM362.4B), W.P. Kuala Lumpur (RM228.6B), Sarawak (RM122.8B)',
      type: 'stat',
    };
  }

  return {
    text: '**Malaysia Data Command Center Summary** 🇲🇾\n\n' +
      '📊 **Population**: 34.3M | **GDP**: RM1.68T | **Unemployment**: 3.4%\n' +
      '👶 **Births**: 602,900 | ✝️ **Deaths**: 159,700\n' +
      '📦 **Datasets**: 287+ across 18 categories\n' +
      '🗺️ **States/FT**: 16 states + 3 Federal Territories\n\n' +
      'Top states by population: Selangor (7.1M), Johor (4.2M), Sabah (3.9M)\n' +
      'Top states by GDP: Selangor (RM362.4B), W.P. Kuala Lumpur (RM228.6B), Sarawak (RM122.8B)',
    type: 'stat',
  };
}

// ─── Fallback ───────────────────────────────────────────────────────────
function assembleFallback(intent: Intent, lang: 'en' | 'ms'): CopilotResponse {
  // Try knowledge base search as last resort
  const results = searchKnowledge(intent.originalQuery, lang);
  if (results.length > 0) {
    const entry = results[0];
    return {
      text: lang === 'ms' ? entry.response_ms : entry.response_en,
      type: entry.category === 'statistic' ? 'stat' : 'text',
    };
  }

  return {
    text: lang === 'en'
      ? 'I\'m not sure I understand. Here are some things you can try:\n\n' +
        '• **"What is Malaysia\'s population?"** — Key statistics\n' +
        '• **"Go to GeoMap"** — Navigate the dashboard\n' +
        '• **"Find healthcare datasets"** — Search datasets\n' +
        '• **"Explain the ontology"** — Data relationships\n' +
        '• **"Help"** — Full list of capabilities'
      : 'Saya tidak pasti saya faham. Berikut adalah beberapa perkara yang anda boleh cuba:\n\n' +
        '• **"Berapa penduduk Malaysia?"** — Statistik utama\n' +
        '• **"Pergi ke PetaGeo"** — Navigasi papan pemuka\n' +
        '• **"Cari set data kesihatan"** — Cari set data\n' +
        '• **"Terangkan ontologi"** — Hubungan data\n' +
        '• **"Bantuan"** — Senarai penuh keupayaan',
    type: 'text',
  };
}

// ─── Convenience: Full Pipeline ─────────────────────────────────────────
export function processQuery(query: string, lang: 'en' | 'ms'): CopilotResponse {
  const intent = classifyIntent(query);
  return assembleResponse(intent, lang);
}
