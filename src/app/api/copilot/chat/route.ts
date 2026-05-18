import { NextRequest, NextResponse } from 'next/server';

// ─── Lazy-loaded ZAI SDK ───────────────────────────────────────────────
let zaiInstance: Awaited<ReturnType<typeof import('z-ai-web-dev-sdk').default.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// ─── Knowledge Base for System Prompt ──────────────────────────────────
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
1. Be concise but informative — use bullet points and bold text for key metrics
2. Always include specific numbers when available
3. For navigation requests, mention the tab name and what users will find there
4. For dataset queries, mention category, frequency, and source
5. For state queries, include population, GDP, unemployment, and notable features
6. Use emojis sparingly for visual clarity (📊 👶 ✝️ 📦 🗺️ 💡 ⚠️)
7. If you don't have specific data, suggest where to find it in the dashboard
8. Keep responses under 200 words unless the user asks for detail
9. For comparison questions, present data side-by-side
10. When explaining trends, reference specific years and growth rates`;

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
1. Ringkas tetapi bermaklumat — gunakan titik peluru dan teks tebal untuk metrik utama
2. Sentiasa sertakan nombor khusus apabila tersedia
3. Untuk permintaan navigasi, sebut nama tab dan apa yang pengguna akan temui
4. Untuk pertanyaan set data, sebut kategori, kekerapan, dan sumber
5. Untuk pertanyaan negeri, sertakan penduduk, KDNK, pengangguran, dan ciri ketara
6. Gunakan emoji secara berhemah (📊 👶 ✝️ 📦 🗺️ 💡 ⚠️)
7. Jika tiada data khusus, cadangkan tempat mencarinya di papan pemuka
8. Kekal respons di bawah 200 patah perkataan melainkan pengguna meminta butiran
9. Untuk soalan perbandingan, bentangkan data sebelah-menyebelah
10. Apabila menerangkan trend, rujuk tahun dan kadar pertumbuhan khusus`;

// ─── Conversation Message Type ─────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── POST Handler ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, lang = 'en', history = [] }: { message: string; lang: 'en' | 'ms'; history: ChatMessage[] } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get ZAI instance
    const zai = await getZAI();

    // Select system prompt based on language
    const systemPrompt = lang === 'ms' ? SYSTEM_PROMPT_MS : SYSTEM_PROMPT_EN;

    // Build messages array with conversation history
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
      { role: 'assistant', content: systemPrompt },
    ];

    // Add conversation history (last 10 messages max for context window management)
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
      content: message.trim(),
    });

    // Call LLM
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse || aiResponse.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Empty response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      type: 'text',
    });
  } catch (error) {
    console.error('[Copilot API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
