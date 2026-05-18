import { NextRequest, NextResponse } from 'next/server';

// ══════════════════════════════════════════════════════════════════
// CRITICAL: These two lines MUST be at the top of the file.
// Without them, Cloudflare Workers returns 404 for this route.
// ══════════════════════════════════════════════════════════════════
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// ─── Rule-based engine (edge-safe, always available) ───────────
let processQueryFn: ((query: string, lang: 'en' | 'ms') => {
  text: string;
  type: string;
  action?: { type: string; target: string };
}) | null = null;

async function getRuleBasedResponse(message: string, lang: 'en' | 'ms') {
  if (!processQueryFn) {
    try {
      const mod = await import('@/lib/copilot/prompts');
      processQueryFn = mod.processQuery;
    } catch {
      return null;
    }
  }
  return processQueryFn(message, lang);
}

// ─── LLM via direct fetch (edge-safe) ──────────────────────────
// The z-ai-web-dev-sdk uses Node.js 'os' module which is NOT
// available in edge runtime. We call the ZAI API directly via fetch.

const ZAI_API_BASE = 'https://api.zhiwu.ai';

interface ZAIConfig {
  apiKey: string;
  model: string;
}

function getZAIConfig(): ZAIConfig | null {
  const apiKey = process.env.ZAI_API_KEY ?? '';
  const model = process.env.ZAI_MODEL ?? 'gpt-4o-mini';
  if (!apiKey) return null;
  return { apiKey, model };
}

async function callLLMDirect(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  config: ZAIConfig,
): Promise<string | null> {
  try {
    const response = await fetch(`${ZAI_API_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      console.warn(`[Copilot LLM] API returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    return content && content.trim().length > 0 ? content.trim() : null;
  } catch (err) {
    console.warn('[Copilot LLM] Direct fetch failed:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

// ─── System Prompts ─────────────────────────────────────────────
const SYSTEM_PROMPT_EN = `You are **AI Penasihat** (AI Advisor) for the **Malaysia Open Data Command Center** (Pusat Perintah Data Terbuka Malaysia). You are an expert AI assistant that helps users explore, understand, and navigate Malaysia's open data ecosystem.

## Your Knowledge:
- **Population**: 34.3 million (2025 estimate). Selangor 7.1M, Johor 4.2M, Sabah 3.9M, Sarawak 2.9M
- **GDP**: RM1.68 trillion (2024). Growth rate 4.5%. Selangor RM362.4B, KL RM228.6B, Sarawak RM122.8B
- **Births**: ~602,900 annually. TFR below replacement at ~1.6
- **Deaths**: ~159,700 annually
- **Unemployment**: 3.4% nationally. Sabah highest at 5.2%, Putrajaya lowest at 2.2%
- **Datasets**: 287+ datasets across 18 categories from data.gov.my
- **Categories**: Demography, National Accounts, Prices, Labour Markets, Financial Markets, Economic Sectors, Healthcare, Environment, Education, Transportation, Households, Communications, Public Safety, Public Administration, Public Welfare, Statistical Indicators, Data Dictionaries, Metadata
- **Data Sources**: DOSM, BNM, KKM, JDN (Jabatan Pendaftaran Negara)
- **States/FT**: 13 states + 3 Federal Territories (KL, Putrajaya, Labuan)
- **Geography**: Total area 331,980 km². Sarawak largest (124,450 km²), KL most dense (7,983.5/km²)

## Dashboard Navigation:
- **Overview**: KPI cards, data engine pulse, state mini cards, health index, category charts
- **GeoMap**: Interactive map with 6 data layers (Population, GDP, Births, Deaths, Unemployment, Datasets)
- **Datasets**: Browse 287+ datasets, filter by category/frequency/geography
- **Analytics**: GDP trends, state comparison radar, correlation matrix, population pyramid, sector analysis
- **Intelligence**: Data ontology graph showing domain relationships and anomalies

## Data Ontology Key Relationships:
- Population → GDP (drives, strength 0.85)
- GDP → Employment (creates, strength 0.90)
- GDP → Inflation (influences, strength 0.70)
- Population → Healthcare (demands, strength 0.80)
- Employment → Household Income (determines, strength 0.95)
- Education → Employment (qualifies, strength 0.82)
- Healthcare → Labour Productivity (supports, strength 0.72)

## Response Guidelines:
1. **ALWAYS answer the specific question asked first** — If asked about Malaysia's GDP, give the NATIONAL figure (RM1.68T) first, then state breakdowns as supplementary
2. Be concise but informative — use bullet points and bold text for key metrics
3. Always include specific numbers when available
4. For navigation requests, mention the tab name and what users will find there
5. For dataset queries, mention category, frequency, and source
6. For state queries, include population, GDP, unemployment, and notable features
7. Use emojis sparingly for visual clarity (📊 👶 ✝️ 📦 🗺️ 💡 ⚠️)
8. If you don't have specific data, suggest where to find it in the dashboard
9. Keep responses under 200 words unless the user asks for detail
10. For comparison questions, present data side-by-side
11. When explaining trends, reference specific years and growth rates
12. **Distinguish between national and state-level data** — national figures first, state details second`;

const SYSTEM_PROMPT_MS = `Anda adalah **AI Penasihat** untuk **Pusat Perintah Data Terbuka Malaysia**. Anda adalah pembantu AI pakar yang membantu pengguna meneroka, memahami, dan menavigasi ekosistem data terbuka Malaysia.

## Pengetahuan Anda:
- **Penduduk**: 34.3 juta (anggaran 2025). Selangor 7.1M, Johor 4.2M, Sabah 3.9M, Sarawak 2.9M
- **KDNK**: RM1.68 trilion (2024). Kadar pertumbuhan 4.5%. Selangor RM362.4B, KL RM228.6B, Sarawak RM122.8B
- **Kelahiran**: ~602,900 setahun. TFR di bawah penggantian pada ~1.6
- **Kematian**: ~159,700 setahun
- **Pengangguran**: 3.4% nasional. Sabah tertinggi 5.2%, Putrajaya terendah 2.2%
- **Set Data**: 287+ set data merentasi 18 kategori dari data.gov.my
- **Kategori**: Demografi, Akaun Negara, Harga, Pasaran Buruh, Pasaran Kewangan, Sektor Ekonomi, Kesihatan, Alam Sekitar, Pendidikan, Pengangkutan, Isi Rumah, Komunikasi, Keselamatan Awam, Pentadbiran Awam, Kebajikan Awam, Penunjuk Statistik, Kamus Data, Metadata
- **Sumber Data**: DOSM, BNM, KKM, JDN
- **Negeri/WT**: 13 negeri + 3 Wilayah Persekutuan (KL, Putrajaya, Labuan)
- **Geografi**: Jumlah kawasan 331,980 km². Sarawak terbesar (124,450 km²), KL paling padat (7,983.5/km²)

## Navigasi Papan Pemuka:
- **Gambaran**: Kad KPI, denyut enjin data, kad mini negeri, indeks kesihatan, carta kategori
- **PetaGeo**: Peta interaktif dengan 6 lapisan data (Penduduk, KDNK, Kelahiran, Kematian, Pengangguran, Set Data)
- **Set Data**: Semak 287+ set data, tapis mengikut kategori/kekerapan/geografi
- **Analitik**: Trend KDNK, radar perbandingan negeri, matriks korelasi, piramid penduduk, analisis sektor
- **Intelijen**: Graf ontologi data menunjukkan hubungan domain dan anomali

## Garis Panduan Respons:
1. **SENTIASA jawab soalan khusus yang ditanya dahulu** — Jika ditanya tentang KDNK Malaysia, berikan angka NASIONAL (RM1.68T) dahulu, kemudian pecahan negeri sebagai tambahan
2. Ringkas tetapi bermaklumat — gunakan titik peluru dan teks tebal untuk metrik utama
3. Sentiasa sertakan nombor khusus apabila tersedia
4. Untuk permintaan navigasi, sebut nama tab dan apa yang pengguna akan temui
5. Untuk pertanyaan set data, sebut kategori, kekerapan, dan sumber
6. Untuk pertanyaan negeri, sertakan penduduk, KDNK, pengangguran, dan ciri ketara
7. Gunakan emoji secara berhemah (📊 👶 ✝️ 📦 🗺️ 💡 ⚠️)
8. Jika tiada data khusus, cadangkan tempat mencarinya di papan pemuka
9. Kekal respons di bawah 200 patah perkataan melainkan pengguna meminta butiran
10. Untuk soalan perbandingan, bentangkan data sebelah-menyebelah
11. Apabila menerangkan trend, rujuk tahun dan kadar pertumbuhan khusus
12. **Beza antara data peringkat nasional dan negeri** — angka nasional dahulu, butiran negeri kedua`;

// ─── Conversation Message Type ─────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── POST Handler ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // ── Body size limit ──
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 50_000) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }

  // Parse body once before try block so it's available in catch
  let parsedBody: { message?: string; lang?: 'en' | 'ms'; history?: ChatMessage[] } = {};
  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  try {
    const { message, lang = 'en', history = [] }: { message: string; lang: 'en' | 'ms'; history: ChatMessage[] } = parsedBody;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();

    // ── Step 1: Always try rule-based first (instant, edge-safe) ──
    const ruleResponse = await getRuleBasedResponse(trimmedMessage, lang);

    // ── Step 2: Try LLM if available (adds conversational depth) ──
    const zaiConfig = getZAIConfig();
    let llmResponse: string | null = null;

    if (zaiConfig) {
      const systemPrompt = lang === 'ms' ? SYSTEM_PROMPT_MS : SYSTEM_PROMPT_EN;
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
      ];

      // Add conversation history (last 10 messages)
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }

      // Add current user message
      messages.push({
        role: 'user',
        content: trimmedMessage,
      });

      llmResponse = await callLLMDirect(messages, zaiConfig);
    }

    // ── Step 3: Return best available response ──
    // Prefer LLM response (more conversational), fall back to rule-based
    if (llmResponse) {
      return NextResponse.json({
        success: true,
        response: llmResponse,
        type: 'text',
        action: ruleResponse?.action, // Use rule-based action for navigation
        source: 'llm',
      });
    }

    if (ruleResponse) {
      return NextResponse.json({
        success: true,
        response: ruleResponse.text,
        type: ruleResponse.type,
        action: ruleResponse.action,
        source: 'rule-based',
      });
    }

    // Neither LLM nor rule-based could handle it
    const fallbackText = lang === 'ms'
      ? 'Maaf, saya tidak dapat memproses permintaan anda. Cuba tanya tentang penduduk Malaysia, KDNK, set data, atau navigasi papan pemuka.'
      : 'Sorry, I couldn\'t process your request. Try asking about Malaysia\'s population, GDP, datasets, or dashboard navigation.';
    return NextResponse.json({
      success: true,
      response: fallbackText,
      type: 'text',
      source: 'fallback',
    });
  } catch (error) {
    console.error('[Copilot API] Error:', error);
    // Final fallback: try rule-based engine using pre-parsed body
    try {
      const msg = parsedBody?.message ?? '';
      const ln = parsedBody?.lang ?? 'en';
      if (msg) {
        const ruleResponse = await getRuleBasedResponse(msg, ln);
        if (ruleResponse) {
          return NextResponse.json({
            success: true,
            response: ruleResponse.text,
            type: ruleResponse.type,
            action: ruleResponse.action,
            source: 'rule-based',
          });
        }
      }
    } catch {
      // Rule-based also failed
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
