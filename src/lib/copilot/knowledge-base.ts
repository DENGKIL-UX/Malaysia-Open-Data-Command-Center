// Command Copilot Knowledge Base
// Rule-based knowledge entries for the Malaysia Open Data Command Center

export interface KnowledgeEntry {
  id: string;
  keywords_en: string[];
  keywords_ms: string[];
  category: 'statistic' | 'dataset' | 'navigation' | 'ontology' | 'faq' | 'help';
  response_en: string;
  response_ms: string;
  relatedIds?: string[];
}

export interface OntologyEdge {
  id: string;
  source: string;
  target: string;
  sourceBM: string;
  targetBM: string;
  type: string;
  strength: number;
  lag: number;
  description_en: string;
  description_ms: string;
}

// ─── Ontology Edges (Domain Relationships) ──────────────────────────────
export const ONTOLOGY_EDGES: OntologyEdge[] = [
  {
    id: 'edge-pop-gdp',
    source: 'Population',
    target: 'GDP',
    sourceBM: 'Penduduk',
    targetBM: 'KDNK',
    type: 'drives',
    strength: 0.85,
    lag: 2,
    description_en: 'Population growth drives GDP through labour supply and domestic demand. A larger workforce and consumer base directly contribute to economic output.',
    description_ms: 'Pertumbuhan penduduk memacu KDNK melalui bekalan tenaga kerja dan permintaan domestik. Tenaga kerja yang lebih besar dan pengguna menyumbang kepada keluaran ekonomi.',
  },
  {
    id: 'edge-gdp-employment',
    source: 'GDP',
    target: 'Employment',
    sourceBM: 'KDNK',
    targetBM: 'Pekerjaan',
    type: 'creates',
    strength: 0.90,
    lag: 1,
    description_en: 'GDP growth creates employment opportunities. Higher economic output leads to business expansion and new job creation across sectors.',
    description_ms: 'Pertumbuhan KDNK mewujudkan peluang pekerjaan. Keluaran ekonomi yang lebih tinggi membawa kepada perluasan perniagaan dan penciptaan pekerjaan baru merentasi sektor.',
  },
  {
    id: 'edge-gdp-inflation',
    source: 'GDP',
    target: 'Inflation',
    sourceBM: 'KDNK',
    targetBM: 'Inflasi',
    type: 'influences',
    strength: 0.70,
    lag: 3,
    description_en: 'GDP growth influences inflation through demand-pull effects. Rapid economic growth can increase price levels if supply does not keep pace.',
    description_ms: 'Pertumbuhan KDNK mempengaruhi inflasi melalui kesan tarikan permintaan. Pertumbuhan ekonomi yang pesat boleh meningkatkan tahap harga jika bekalan tidak mengikuti.',
  },
  {
    id: 'edge-pop-healthcare',
    source: 'Population',
    target: 'Healthcare',
    sourceBM: 'Penduduk',
    targetBM: 'Kesihatan',
    type: 'demands',
    strength: 0.80,
    lag: 0,
    description_en: 'Population size and demographics directly determine healthcare demand. An aging population increases healthcare expenditure and facility requirements.',
    description_ms: 'Saiz dan demografi penduduk secara langsung menentukan permintaan penjagaan kesihatan. Penduduk yang semakin tua meningkatkan perbelanjaan kesihatan dan keperluan kemudahan.',
  },
  {
    id: 'edge-pop-education',
    source: 'Population',
    target: 'Education',
    sourceBM: 'Penduduk',
    targetBM: 'Pendidikan',
    type: 'requires',
    strength: 0.85,
    lag: 1,
    description_en: 'Population determines education demand. School-age population directly affects the number of schools, teachers, and educational resources needed.',
    description_ms: 'Penduduk menentukan permintaan pendidikan. Penduduk usia sekolah secara langsung mempengaruhi bilangan sekolah, guru, dan sumber pendidikan yang diperlukan.',
  },
  {
    id: 'edge-employment-household',
    source: 'Employment',
    target: 'Household Income',
    sourceBM: 'Pekerjaan',
    targetBM: 'Pendapatan Isi Rumah',
    type: 'determines',
    strength: 0.95,
    lag: 0,
    description_en: 'Employment is the primary determinant of household income. Labour force participation and wage levels directly shape household economic well-being.',
    description_ms: 'Pekerjaan adalah penentu utama pendapatan isi rumah. Penyertaan tenaga kerja dan tahap gaji secara langsung membentuk kesejahteraan ekonomi isi rumah.',
  },
  {
    id: 'edge-household-consumption',
    source: 'Household Income',
    target: 'Consumption',
    sourceBM: 'Pendapatan Isi Rumah',
    targetBM: 'Penggunaan',
    type: 'enables',
    strength: 0.88,
    lag: 0,
    description_en: 'Household income enables consumption spending. Higher income levels drive consumer spending, which constitutes about 55% of Malaysia\'s GDP.',
    description_ms: 'Pendapatan isi rumah membolehkan perbelanjaan penggunaan. Tahap pendapatan yang lebih tinggi memacu perbelanjaan pengguna, yang merupakan kira-kira 55% daripada KDNK Malaysia.',
  },
  {
    id: 'edge-gdp-environment',
    source: 'GDP',
    target: 'Environment',
    sourceBM: 'KDNK',
    targetBM: 'Alam Sekitar',
    type: 'impacts',
    strength: 0.65,
    lag: 5,
    description_en: 'Economic activity impacts the environment. Industrial output, energy consumption, and urbanisation associated with GDP growth can affect air quality, water resources, and biodiversity.',
    description_ms: 'Aktiviti ekonomi memberi kesan kepada alam sekitar. Keluaran perindustrian, penggunaan tenaga, dan urbanisasi yang berkaitan dengan pertumbuhan KDNK boleh menjejaskan kualiti udara, sumber air, dan biodiversiti.',
  },
  {
    id: 'edge-inflation-interest',
    source: 'Inflation',
    target: 'Interest Rates',
    sourceBM: 'Inflasi',
    targetBM: 'Kadar Faedah',
    type: 'triggers',
    strength: 0.75,
    lag: 2,
    description_en: 'Inflation triggers interest rate adjustments by Bank Negara Malaysia. Higher inflation typically leads to monetary tightening to maintain price stability.',
    description_ms: 'Inflasi mencetuskan pelarasan kadar faedah oleh Bank Negara Malaysia. Inflasi yang lebih tinggi biasanya membawa kepada pengukuhan monetari untuk mengekalkan kestabilan harga.',
  },
  {
    id: 'edge-education-employment',
    source: 'Education',
    target: 'Employment',
    sourceBM: 'Pendidikan',
    targetBM: 'Pekerjaan',
    type: 'qualifies',
    strength: 0.82,
    lag: 4,
    description_en: 'Education qualifies the workforce for employment. Higher education levels improve employability and shift the labour force toward higher-value sectors.',
    description_ms: 'Pendidikan memenuhi syarat tenaga kerja untuk pekerjaan. Tahap pendidikan yang lebih tinggi meningkatkan kebolehpasaran dan mengalihkan tenaga kerja ke sektor bernilai tinggi.',
  },
  {
    id: 'edge-healthcare-productivity',
    source: 'Healthcare',
    target: 'Labour Productivity',
    sourceBM: 'Kesihatan',
    targetBM: 'Produktiviti Buruh',
    type: 'supports',
    strength: 0.72,
    lag: 3,
    description_en: 'Healthcare supports labour productivity. A healthy workforce is more productive, reduces absenteeism, and contributes more effectively to economic output.',
    description_ms: 'Kesihatan menyokong produktiviti buruh. Tenaga kerja yang sihat lebih produktif, mengurangkan ketidakhadiran, dan menyumbang dengan lebih berkesan kepada keluaran ekonomi.',
  },
  {
    id: 'edge-pop-transport',
    source: 'Population',
    target: 'Transportation',
    sourceBM: 'Penduduk',
    targetBM: 'Pengangkutan',
    type: 'requires',
    strength: 0.78,
    lag: 2,
    description_en: 'Population growth requires transportation infrastructure. Urban population density drives demand for public transit, roads, and connectivity.',
    description_ms: 'Pertumbuhan penduduk memerlukan infrastruktur pengangkutan. Kepadatan penduduk bandar memacu permintaan untuk pengangkutan awam, jalan raya, dan konektiviti.',
  },
  {
    id: 'edge-gdp-public-revenue',
    source: 'GDP',
    target: 'Public Revenue',
    sourceBM: 'KDNK',
    targetBM: 'Hasil Awam',
    type: 'generates',
    strength: 0.87,
    lag: 1,
    description_en: 'GDP generates public revenue through taxation. Higher economic output increases tax collections, enabling government spending on public services and development.',
    description_ms: 'KDNK menjana hasil awam melalui percukaian. Keluaran ekonomi yang lebih tinggi meningkatkan kutipan cukai, membolehkan perbelanjaan kerajaan ke atas perkhidmatan awam dan pembangunan.',
  },
  {
    id: 'edge-consumption-trade',
    source: 'Consumption',
    target: 'Trade',
    sourceBM: 'Penggunaan',
    targetBM: 'Perdagangan',
    type: 'drives',
    strength: 0.76,
    lag: 1,
    description_en: 'Domestic consumption drives trade volumes. Consumer demand for goods and services influences both imports and the development of domestic supply chains.',
    description_ms: 'Penggunaan domestik memacu jumlah perdagangan. Permintaan pengguna untuk barang dan perkhidmatan mempengaruhi kedua-dua import dan pembangunan rantaian bekalan domestik.',
  },
];

// ─── Knowledge Entries ──────────────────────────────────────────────────
export const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  // ── Key Statistics ──────────────────────────────────
  {
    id: 'stat-population',
    keywords_en: ['population', 'people', 'how many people', 'residents', 'citizens', 'total population'],
    keywords_ms: ['penduduk', 'populasi', 'orang', 'berapa ramai', 'jumlah penduduk', 'rakyat'],
    category: 'statistic',
    response_en: '**Malaysia Population**: 34.3 million (2025 estimate)\n\nThis figure represents the total estimated population of Malaysia. Selangor is the most populous state with 7.1M people, followed by Johor (4.2M) and Sabah (3.9M). Population data is sourced from DOSM intercensal estimates.',
    response_ms: '**Penduduk Malaysia**: 34.3 juta (anggaran 2025)\n\nAngka ini mewakili jumlah anggaran penduduk Malaysia. Selangor ialah negeri paling ramai penduduk dengan 7.1 juta orang, diikuti Johor (4.2 juta) dan Sabah (3.9 juta). Data penduduk diperoleh daripada anggaran antara banci DOSM.',
    relatedIds: ['stat-births', 'stat-deaths', 'cat-demography'],
  },
  {
    id: 'stat-gdp',
    keywords_en: ['gdp', 'gross domestic product', 'economy', 'economic output', 'economic size'],
    keywords_ms: ['kdnk', 'keluaran domestik kasar', 'ekonomi', 'keluaran ekonomi', 'saiz ekonomi'],
    category: 'statistic',
    response_en: '**Malaysia GDP**: RM1.68 trillion (2024)\n\nMalaysia\'s GDP growth rate is 4.5%. Selangor contributes the largest share at RM362.4B, followed by W.P. Kuala Lumpur at RM228.6B. The services sector is the largest contributor to GDP.',
    response_ms: '**KDNK Malaysia**: RM1.68 trilion (2024)\n\nKadar pertumbuhan KDNK Malaysia ialah 4.5%. Selangor menyumbang bahagian terbesar pada RM362.4B, diikuti W.P. Kuala Lumpur pada RM228.6B. Sektor perkhidmatan ialah penyumbang terbesar kepada KDNK.',
    relatedIds: ['stat-unemployment', 'cat-national-accounts', 'edge-pop-gdp'],
  },
  {
    id: 'stat-births',
    keywords_en: ['births', 'born', 'birth rate', 'live births', 'fertility'],
    keywords_ms: ['kelahiran', 'dilahirkan', 'kadar kelahiran', 'kelahiran hidup', 'kesuburan'],
    category: 'statistic',
    response_en: '**Annual Births**: 602,900 (\'000)\n\nMalaysia\'s birth rate has been gradually declining. The Total Fertility Rate (TFR) has fallen below replacement level at approximately 1.6 children per woman. Daily birth data is also available from 1920 to present.',
    response_ms: '**Kelahiran Tahunan**: 602,900 (\'000)\n\nKadar kelahiran Malaysia telah menurun secara beransur. Kadar Kesuburan Keseluruhan (TFR) telah jatuh di bawah tahap penggantian pada kira-kira 1.6 anak per wanita. Data kelahiran harian juga tersedia dari 1920 hingga kini.',
    relatedIds: ['stat-population', 'stat-deaths', 'cat-demography'],
  },
  {
    id: 'stat-deaths',
    keywords_en: ['deaths', 'mortality', 'death rate', 'mortality rate'],
    keywords_ms: ['kematian', 'kadar kematian', 'kematian tahunan'],
    category: 'statistic',
    response_en: '**Annual Deaths**: 159,700 (\'000)\n\nDeath statistics include breakdowns by state, sex, and ethnicity. Maternal deaths and early childhood deaths are tracked separately. Data is sourced from JPN (Jabatan Pendaftaran Negara) registrations.',
    response_ms: '**Kematian Tahunan**: 159,700 (\'000)\n\nStatistik kematian termasuk pecahan mengikut negeri, jantina, dan etnik. Kematian ibu bersalin dan kematian kanak-kanak awal dijejaki secara berasingan. Data diperoleh daripada pendaftaran JPN.',
    relatedIds: ['stat-births', 'stat-population', 'cat-demography'],
  },
  {
    id: 'stat-unemployment',
    keywords_en: ['unemployment', 'jobless', 'unemployed', 'employment', 'jobs', 'labour force'],
    keywords_ms: ['pengangguran', 'tanpa kerja', 'pekerjaan', 'pekerja', 'tenaga kerja', 'buruh'],
    category: 'statistic',
    response_en: '**Unemployment Rate**: 3.4%\n\nMalaysia\'s unemployment rate is relatively low. Sabah has the highest rate at 5.2%, while W.P. Putrajaya has the lowest at 2.2%. The Labour Force Survey is conducted quarterly by DOSM.',
    response_ms: '**Kadar Pengangguran**: 3.4%\n\nKadar pengangguran Malaysia agak rendah. Sabah mempunyai kadar tertinggi pada 5.2%, manakala W.P. Putrajaya mempunyai kadar terendah pada 2.2%. Survei Tenaga Buruh dijalankan suku tahunan oleh DOSM.',
    relatedIds: ['stat-gdp', 'cat-labour-markets'],
  },
  {
    id: 'stat-datasets',
    keywords_en: ['datasets', 'total datasets', 'data available', 'open data', 'data count'],
    keywords_ms: ['set data', 'jumlah set data', 'data tersedia', 'data terbuka', 'bilangan data'],
    category: 'statistic',
    response_en: '**Total Datasets**: 287+ datasets across 18 categories\n\nData spans from daily frequency (e.g., exchange rates, births) to yearly (e.g., population, household income). All datasets are available in CSV and Parquet formats from data.gov.my.',
    response_ms: '**Jumlah Set Data**: 287+ set data merentasi 18 kategori\n\nData merangkumi dari kekerapan harian (cth., kadar pertukaran, kelahiran) hingga tahunan (cth., penduduk, pendapatan isi rumah). Semua set data tersedia dalam format CSV dan Parquet dari data.gov.my.',
    relatedIds: ['cat-metadata', 'cat-data-dictionaries'],
  },
  {
    id: 'stat-area',
    keywords_en: ['area', 'land area', 'size', 'square km', 'km2', 'density'],
    keywords_ms: ['kawasan', 'luas', 'kilometer persegi', 'km2', 'kepadatan'],
    category: 'statistic',
    response_en: '**Total Area**: 331,980 km² | **Density**: 103.3/km²\n\nSarawak is the largest state by area (124,450 km²) while W.P. Kuala Lumpur is the most densely populated (7,983.5/km²). East Malaysia (Sabah + Sarawak) accounts for about 60% of total land area.',
    response_ms: '**Jumlah Kawasan**: 331,980 km² | **Kepadatan**: 103.3/km²\n\nSarawak ialah negeri terbesar mengikut kawasan (124,450 km²) manakala W.P. Kuala Lumpur paling padat penduduk (7,983.5/km²). Malaysia Timur (Sabah + Sarawak) merangkumi kira-kira 60% daripada jumlah keluasan tanah.',
    relatedIds: ['stat-population'],
  },

  // ── State Statistics ─────────────────────────────────
  {
    id: 'state-selangor',
    keywords_en: ['selangor', 'selangor state', 'sgd', 'sgr'],
    keywords_ms: ['selangor', 'negeri selangor'],
    category: 'statistic',
    response_en: '**Selangor** — The most populous and economically dominant state\n• Population: 7.1M | GDP: RM362.4B (5.6% growth)\n• Unemployment: 2.8% | Datasets: 22\n• Area: 8,104 km² | Density: 876.1/km²\n• Home to Malaysia\'s largest city (KL-adjacent) and major industrial zones.',
    response_ms: '**Selangor** — Negeri paling ramai penduduk dan dominan secara ekonomi\n• Penduduk: 7.1M | KDNK: RM362.4B (pertumbuhan 5.6%)\n• Pengangguran: 2.8% | Set Data: 22\n• Luas: 8,104 km² | Kepadatan: 876.1/km²\n• Rumah kepada bandar terbesar Malaysia (bersebelahan KL) dan zon perindustrian utama.',
    relatedIds: ['stat-population', 'stat-gdp'],
  },
  {
    id: 'state-johor',
    keywords_en: ['johor', 'jhr', 'johor bahru'],
    keywords_ms: ['johor', 'negeri johor'],
    category: 'statistic',
    response_en: '**Johor** — Southern gateway and second most populous state\n• Population: 4.2M | GDP: RM148.2B (4.2% growth)\n• Unemployment: 3.4% | Datasets: 18\n• Area: 19,166 km² | Density: 219.7/km²\n• Key economic zones include Iskandar Malaysia and Pasir Gudang port.',
    response_ms: '**Johor** — Pintu masuk selatan dan negeri kedua paling ramai penduduk\n• Penduduk: 4.2M | KDNK: RM148.2B (pertumbuhan 4.2%)\n• Pengangguran: 3.4% | Set Data: 18\n• Luas: 19,166 km² | Kepadatan: 219.7/km²\n• Zon ekonomi utama termasuk Iskandar Malaysia dan pelabuhan Pasir Gudang.',
    relatedIds: ['stat-population', 'stat-gdp'],
  },
  {
    id: 'state-sabah',
    keywords_en: ['sabah', 'sbh', 'kota kinabalu', 'east malaysia', 'borneo'],
    keywords_ms: ['sabah', 'malaysia timur', 'borneo'],
    category: 'statistic',
    response_en: '**Sabah** — Third most populous, largest land area in East Malaysia\n• Population: 3.9M | GDP: RM87.6B (3.2% growth)\n• Unemployment: 5.2% (highest) | Datasets: 17\n• Area: 73,631 km² | Density: 53.0/km²\n• Rich in natural resources and biodiversity. Tourism is a major sector.',
    response_ms: '**Sabah** — Ketiga paling ramai penduduk, kawasan tanah terbesar di Malaysia Timur\n• Penduduk: 3.9M | KDNK: RM87.6B (pertumbuhan 3.2%)\n• Pengangguran: 5.2% (tertinggi) | Set Data: 17\n• Luas: 73,631 km² | Kepadatan: 53.0/km²\n• Kaya dengan sumber asli dan biodiversiti. Pelancongan ialah sektor utama.',
    relatedIds: ['stat-population', 'stat-unemployment'],
  },
  {
    id: 'state-sarawak',
    keywords_en: ['sarawak', 'srk', 'kuching', 'east malaysia'],
    keywords_ms: ['sarawak', 'malaysia timur'],
    category: 'statistic',
    response_en: '**Sarawak** — Largest state by area, major resource economy\n• Population: 2.9M | GDP: RM122.8B (4.0% growth)\n• Unemployment: 3.8% | Datasets: 16\n• Area: 124,450 km² (largest) | Density: 23.3/km²\n• LNG production, timber, and palm oil are key economic drivers.',
    response_ms: '**Sarawak** — Negeri terbesar mengikut luas, ekonomi sumber utama\n• Penduduk: 2.9M | KDNK: RM122.8B (pertumbuhan 4.0%)\n• Pengangguran: 3.8% | Set Data: 16\n• Luas: 124,450 km² (terbesar) | Kepadatan: 23.3/km²\n• Pengeluaran LNG, kayu, dan minyak sawit adalah pemacu ekonomi utama.',
    relatedIds: ['stat-population', 'stat-gdp'],
  },
  {
    id: 'state-perak',
    keywords_en: ['perak', 'prk', 'ipoh'],
    keywords_ms: ['perak', 'negeri perak'],
    category: 'statistic',
    response_en: '**Perak** — Historic mining state, now diversified economy\n• Population: 2.52M | GDP: RM74.6B (3.6% growth)\n• Unemployment: 3.9% | Datasets: 15\n• Area: 21,035 km² | Density: 119.8/km²\n• Manufacturing, agriculture, and tourism (including Pangkor & Belum) drive the economy.',
    response_ms: '**Perak** — Negeri perlombongan bersejarah, kini ekonomi pelbagai\n• Penduduk: 2.52M | KDNK: RM74.6B (pertumbuhan 3.6%)\n• Pengangguran: 3.9% | Set Data: 15\n• Luas: 21,035 km² | Kepadatan: 119.8/km²\n• Pembuatan, pertanian, dan pelancongan (termasuk Pangkor & Belum) memacu ekonomi.',
    relatedIds: ['stat-population', 'stat-gdp'],
  },
  {
    id: 'state-kedah',
    keywords_en: ['kedah', 'kdh', 'alor setar', 'rice bowl'],
    keywords_ms: ['kedah', 'negeri kedah', 'jelapang padi'],
    category: 'statistic',
    response_en: '**Kedah** — The Rice Bowl of Malaysia\n• Population: 2.22M | GDP: RM52.4B (3.8% growth)\n• Unemployment: 3.8% | Datasets: 14\n• Area: 9,500 km² | Density: 233.7/km²\n• Agriculture (paddy) is historically significant; Kulim Hi-Tech Park is a modern industrial hub.',
    response_ms: '**Kedah** — Jelapang Padi Malaysia\n• Penduduk: 2.22M | KDNK: RM52.4B (pertumbuhan 3.8%)\n• Pengangguran: 3.8% | Set Data: 14\n• Luas: 9,500 km² | Kepadatan: 233.7/km²\n• Pertanian (padi) adalah penting secara bersejarah; Taman Hi-Tech Kulim ialah hab perindustrian moden.',
    relatedIds: ['stat-population', 'cat-economic-sectors'],
  },
  {
    id: 'state-kelantan',
    keywords_en: ['kelantan', 'ktn', 'kota bharu'],
    keywords_ms: ['kelantan', 'negeri kelantan'],
    category: 'statistic',
    response_en: '**Kelantan** — Cultural heartland with unique heritage\n• Population: 2.01M | GDP: RM32.1B (3.1% growth)\n• Unemployment: 4.6% | Datasets: 12\n• Area: 15,099 km² | Density: 133.1/km²\n• Known for traditional arts, crafts, and the Sultan Ismail Petra Airport.',
    response_ms: '**Kelantan** — Jantung budaya dengan warisan unik\n• Penduduk: 2.01M | KDNK: RM32.1B (pertumbuhan 3.1%)\n• Pengangguran: 4.6% | Set Data: 12\n• Luas: 15,099 km² | Kepadatan: 133.1/km²\n• Dikenali dengan seni tradisional, kraf, dan Lapangan Terbang Sultan Ismail Petra.',
    relatedIds: ['stat-population'],
  },
  {
    id: 'state-kl',
    keywords_en: ['kuala lumpur', 'kl', 'wp kuala lumpur', 'kul', 'capital'],
    keywords_ms: ['kuala lumpur', 'wp kuala lumpur', 'ibu kota'],
    category: 'statistic',
    response_en: '**W.P. Kuala Lumpur** — The capital and financial hub\n• Population: 1.94M | GDP: RM228.6B (5.4% growth)\n• Unemployment: 2.6% | Datasets: 20\n• Area: 243 km² | Density: 7,983.5/km² (most dense)\n• Hosts the central business district, KLCC, and major financial institutions.',
    response_ms: '**W.P. Kuala Lumpur** — Ibu kota dan hab kewangan\n• Penduduk: 1.94M | KDNK: RM228.6B (pertumbuhan 5.4%)\n• Pengangguran: 2.6% | Set Data: 20\n• Luas: 243 km² | Kepadatan: 7,983.5/km² (paling padat)\n• Menempatkan daerah perniagaan pusat, KLCC, dan institusi kewangan utama.',
    relatedIds: ['stat-gdp', 'stat-population'],
  },

  // ── Dataset Categories ──────────────────────────────
  {
    id: 'cat-demography',
    keywords_en: ['demography', 'population data', 'birth data', 'death data', 'vital statistics', 'demographic'],
    keywords_ms: ['demografi', 'data penduduk', 'data kelahiran', 'data kematian', 'statistik utama'],
    category: 'dataset',
    response_en: '**Demography** — The largest data category with 25+ datasets\n\nCovers: Population (national, state, district, parlimen, DUN), births (daily, annual, by state/sex/ethnicity), deaths (annual, by state/sex/ethnicity, early childhood, maternal), marriages, stillbirths, fertility rates, and migration/arrivals.\n\nKey sources: JPN, DOSM | Frequency: Daily to Yearly',
    response_ms: '**Demografi** — Kategori data terbesar dengan 25+ set data\n\nMerangkumi: Penduduk (nasional, negeri, daerah, parlimen, DUN), kelahiran (harian, tahunan, mengikut negeri/jantina/etnik), kematian (tahunan, mengikut negeri/jantina/etnik, kanak-kanak awal, ibu bersalin), perkahwinan, kelahiran mati, kadar kesuburan, dan migrasi/kemasukan.\n\nSumber utama: JPN, DOSM | Kekerapan: Harian hingga Tahunan',
    relatedIds: ['stat-population', 'stat-births', 'stat-deaths'],
  },
  {
    id: 'cat-national-accounts',
    keywords_en: ['national accounts', 'gdp data', 'economic accounts', 'national income'],
    keywords_ms: ['akaun negara', 'data kdnk', 'pendapatan negara'],
    category: 'dataset',
    response_en: '**National Accounts** — GDP and macroeconomic indicators\n\nCovers: GDP by state, quarterly GDP, national income accounts. This category provides the core economic measurement framework for Malaysia.\n\nKey sources: DOSM | Frequency: Quarterly to Yearly | Color: Amber',
    response_ms: '**Akaun Negara** — KDNK dan penunjuk makroekonomi\n\nMerangkumi: KDNK mengikut negeri, KDNK suku tahunan, akaun pendapatan negara. Kategori ini menyediakan rangka pengukuran ekonomi teras untuk Malaysia.\n\nSumber utama: DOSM | Kekerapan: Suku tahunan hingga Tahunan | Warna: Amber',
    relatedIds: ['stat-gdp'],
  },
  {
    id: 'cat-prices',
    keywords_en: ['prices', 'inflation', 'cpi', 'consumer price', 'cost of living'],
    keywords_ms: ['harga', 'inflasi', 'ipi', 'harga pengguna', 'kos sara hidup'],
    category: 'dataset',
    response_en: '**Prices** — CPI, inflation, and cost of living data\n\nCovers: Consumer Price Index (CPI), Producer Price Index, inflation rates by category and state. Essential for understanding purchasing power and economic stability.\n\nKey sources: DOSM | Frequency: Monthly to Yearly | Color: Red',
    response_ms: '**Harga** — IPI, inflasi, dan data kos sara hidup\n\nMerangkumi: Indeks Harga Pengguna (IPI), Indeks Harga Pengeluar, kadar inflasi mengikut kategori dan negeri. Penting untuk memahami kuasa beli dan kestabilan ekonomi.\n\nSumber utama: DOSM | Kekerapan: Bulanan hingga Tahunan | Warna: Merah',
    relatedIds: ['stat-gdp'],
  },
  {
    id: 'cat-labour-markets',
    keywords_en: ['labour', 'labour market', 'employment', 'workforce', 'wages', 'salary'],
    keywords_ms: ['pasaran buruh', 'pekerjaan', 'tenaga kerja', 'gaji', 'upahan'],
    category: 'dataset',
    response_en: '**Labour Markets** — Employment, wages, and workforce data\n\nCovers: Labour force survey, unemployment rates, employment by sector, wages and salaries. Critical for understanding the health of Malaysia\'s job market.\n\nKey sources: DOSM | Frequency: Monthly to Yearly | Color: Purple',
    response_ms: '**Pasaran Buruh** — Pekerjaan, gaji, dan data tenaga kerja\n\nMerangkumi: Survei tenaga buruh, kadar pengangguran, pekerjaan mengikut sektor, gaji dan upahan. Penting untuk memahami kesihatan pasaran pekerjaan Malaysia.\n\nSumber utama: DOSM | Kekerapan: Bulanan hingga Tahunan | Warna: Ungu',
    relatedIds: ['stat-unemployment'],
  },
  {
    id: 'cat-financial-markets',
    keywords_en: ['financial', 'financial markets', 'stock', 'bonds', 'interest rate', 'exchange rate', 'banking'],
    keywords_ms: ['pasaran kewangan', 'saham', 'bon', 'kadar faedah', 'kadar pertukaran', 'perbankan'],
    category: 'dataset',
    response_en: '**Financial Markets** — Banking, rates, and market data\n\nCovers: Exchange rates, interest rates, monetary aggregates, banking statistics, capital market data. All sourced from Bank Negara Malaysia.\n\nKey sources: BNM | Frequency: Daily to Quarterly | Color: Green',
    response_ms: '**Pasaran Kewangan** — Perbankan, kadar, dan data pasaran\n\nMerangkumi: Kadar pertukaran, kadar faedah, agregat monetari, statistik perbankan, data pasaran modal. Semua diperoleh daripada Bank Negara Malaysia.\n\nSumber utama: BNM | Kekerapan: Harian hingga Suku tahunan | Warna: Hijau',
    relatedIds: ['stat-gdp'],
  },
  {
    id: 'cat-economic-sectors',
    keywords_en: ['economic sectors', 'industry', 'manufacturing', 'services', 'agriculture', 'mining', 'construction'],
    keywords_ms: ['sektor ekonomi', 'perindustrian', 'pembuatan', 'perkhidmatan', 'pertanian', 'perlombongan', 'pembinaan'],
    category: 'dataset',
    response_en: '**Economic Sectors** — Sectoral economic performance\n\nCovers: Manufacturing output, services sector data, agriculture production, mining (including petroleum), construction statistics. Shows the composition of Malaysia\'s economy.\n\nKey sources: DOSM, MIDA | Frequency: Monthly to Yearly | Color: Orange',
    response_ms: '**Sektor Ekonomi** — Prestasi ekonomi sektoral\n\nMerangkumi: Keluaran pembuatan, data sektor perkhidmatan, pengeluaran pertanian, perlombongan (termasuk petroleum), statistik pembinaan. Menunjukkan komposisi ekonomi Malaysia.\n\nSumber utama: DOSM, MIDA | Kekerapan: Bulanan hingga Tahunan | Warna: Oren',
    relatedIds: ['stat-gdp'],
  },
  {
    id: 'cat-healthcare',
    keywords_en: ['healthcare', 'health', 'medical', 'hospital', 'disease', 'covid', 'vaccination'],
    keywords_ms: ['kesihatan', 'perubatan', 'hospital', 'penyakit', 'covid', 'vaksinasi'],
    category: 'dataset',
    response_en: '**Healthcare** — Health statistics and medical data\n\nCovers: Disease surveillance, hospital statistics, COVID-19 data, immunisation records, health expenditure. Essential for public health planning.\n\nKey sources: KKM, MOH | Frequency: Daily to Yearly | Color: Pink',
    response_ms: '**Kesihatan** — Statistik kesihatan dan data perubatan\n\nMerangkumi: Pengawasan penyakit, statistik hospital, data COVID-19, rekod imunisasi, perbelanjaan kesihatan. Penting untuk perancangan kesihatan awam.\n\nSumber utama: KKM, MOH | Kekerapan: Harian hingga Tahunan | Warna: Merah Jambu',
    relatedIds: ['stat-deaths', 'stat-population'],
  },
  {
    id: 'cat-environment',
    keywords_en: ['environment', 'pollution', 'climate', 'air quality', 'water', 'weather'],
    keywords_ms: ['alam sekitar', 'pencemaran', 'iklim', 'kualiti udara', 'air', 'cuaca'],
    category: 'dataset',
    response_en: '**Environment** — Environmental quality and climate data\n\nCovers: Air quality index, water quality, environmental pollution, climate data, weather statistics. Important for sustainable development monitoring.\n\nKey sources: DOE, MetMalaysia | Frequency: Daily to Yearly | Color: Green',
    response_ms: '**Alam Sekitar** — Kualiti alam sekitar dan data iklim\n\nMerangkumi: Indeks kualiti udara, kualiti air, pencemaran alam sekitar, data iklim, statistik cuaca. Penting untuk pemantauan pembangunan mampan.\n\nSumber utama: JAS, MetMalaysia | Kekerapan: Harian hingga Tahunan | Warna: Hijau',
    relatedIds: ['stat-gdp'],
  },
  {
    id: 'cat-education',
    keywords_en: ['education', 'school', 'university', 'students', 'literacy', 'academic'],
    keywords_ms: ['pendidikan', 'sekolah', 'universiti', 'pelajar', 'literasi', 'akademik'],
    category: 'dataset',
    response_en: '**Education** — Education system statistics\n\nCovers: Student enrollment, school statistics, higher education, literacy rates, academic performance. Key for understanding human capital development.\n\nKey sources: MOE | Frequency: Yearly | Color: Blue',
    response_ms: '**Pendidikan** — Statistik sistem pendidikan\n\nMerangkumi: Pendaftaran pelajar, statistik sekolah, pendidikan tinggi, kadar literasi, prestasi akademik. Penting untuk memahami pembangunan modal insan.\n\nSumber utama: KPM | Kekerapan: Tahunan | Warna: Biru',
    relatedIds: ['stat-population', 'cat-labour-markets'],
  },
  {
    id: 'cat-transportation',
    keywords_en: ['transportation', 'transport', 'vehicles', 'traffic', 'roads', 'public transport', 'rail'],
    keywords_ms: ['pengangkutan', 'kenderaan', 'trafik', 'jalan raya', 'pengangkutan awam', 'keretapi'],
    category: 'dataset',
    response_en: '**Transportation** — Transport and infrastructure data\n\nCovers: Vehicle registrations, road network statistics, public transport ridership, aviation data, maritime statistics.\n\nKey sources: MOT, JPJ, MAHB | Frequency: Monthly to Yearly | Color: Slate',
    response_ms: '**Pengangkutan** — Data pengangkutan dan infrastruktur\n\nMerangkumi: Pendaftaran kenderaan, statistik rangkaian jalan, penumpang pengangkutan awam, data penerbangan, statistik maritim.\n\nSumber utama: MOT, JPJ, MAHB | Kekerapan: Bulanan hingga Tahunan | Warna: Batu',
    relatedIds: ['stat-population'],
  },
  {
    id: 'cat-households',
    keywords_en: ['household', 'households', 'household income', 'household expenditure', 'poverty', 'amenities'],
    keywords_ms: ['isi rumah', 'pendapatan isi rumah', 'perbelanjaan isi rumah', 'kemiskinan', 'kemudahan'],
    category: 'dataset',
    response_en: '**Households** — Income, expenditure, and living standards\n\nCovers: Household income & expenditure survey (HIES), poverty rates, access to amenities, Gini coefficient. Available at national, state, district, parlimen, and DUN levels.\n\nKey sources: DOSM | Frequency: Yearly | Color: Purple',
    response_ms: '**Isi Rumah** — Pendapatan, perbelanjaan, dan taraf hidup\n\nMerangkumi: Survei Pendapatan dan Isi Rumah (HIES), kadar kemiskinan, akses kepada kemudahan, pekali Gini. Tersedia di peringkat nasional, negeri, daerah, parlimen, dan DUN.\n\nSumber utama: DOSM | Kekerapan: Tahunan | Warna: Ungu',
    relatedIds: ['stat-unemployment', 'stat-gdp'],
  },
  {
    id: 'cat-communications',
    keywords_en: ['communications', 'telecommunications', 'internet', 'broadband', 'ict', 'digital'],
    keywords_ms: ['komunikasi', 'telekomunikasi', 'internet', 'jalur lebar', 'tik', 'digital'],
    category: 'dataset',
    response_en: '**Communications** — ICT and digital connectivity\n\nCovers: Internet penetration, broadband coverage, telecommunications statistics, digital economy indicators. Tracks Malaysia\'s digital transformation.\n\nKey sources: MCMC, MDEC | Frequency: Yearly | Color: Sky Blue',
    response_ms: '**Komunikasi** — TIK dan konektiviti digital\n\nMerangkumi: Penembusan internet, liputan jalur lebar, statistik telekomunikasi, penunjuk ekonomi digital. Menjejaki transformasi digital Malaysia.\n\nSumber utama: MCMC, MDEC | Kekerapan: Tahunan | Warna: Biru Langit',
    relatedIds: ['cat-economic-sectors'],
  },
  {
    id: 'cat-public-safety',
    keywords_en: ['public safety', 'crime', 'security', 'police', 'fire', 'emergency'],
    keywords_ms: ['keselamatan awam', 'jenayah', 'keselamatan', 'polis', 'bomba', 'kecemasan'],
    category: 'dataset',
    response_en: '**Public Safety** — Crime and safety statistics\n\nCovers: Crime statistics, fire incidents, emergency response data, road safety. Important for community well-being assessment.\n\nKey sources: PDRM, JBPM | Frequency: Monthly to Yearly | Color: Red',
    response_ms: '**Keselamatan Awam** — Statistik jenayah dan keselamatan\n\nMerangkumi: Statistik jenayah, kejadian kebakaran, data tindak balas kecemasan, keselamatan jalan raya. Penting untuk penilaian kesejahteraan komuniti.\n\nSumber utama: PDRM, JBPM | Kekerapan: Bulanan hingga Tahunan | Warna: Merah',
    relatedIds: ['stat-population'],
  },
  {
    id: 'cat-public-admin',
    keywords_en: ['public administration', 'government', 'civil service', 'public service'],
    keywords_ms: ['pentadbiran awam', 'kerajaan', 'perkhidmatan awam', 'perkhidmatan sipil'],
    category: 'dataset',
    response_en: '**Public Administration** — Government operations data\n\nCovers: Government spending, civil service statistics, public sector performance. Provides transparency into government operations.\n\nFrequency: Yearly | Color: Indigo',
    response_ms: '**Pentadbiran Awam** — Data operasi kerajaan\n\nMerangkumi: Perbelanjaan kerajaan, statistik perkhidmatan awam, prestasi sektor awam. Menyediakan ketelusan ke dalam operasi kerajaan.\n\nKekerapan: Tahunan | Warna: Indigo',
    relatedIds: ['cat-statistical-indicators'],
  },
  {
    id: 'cat-public-welfare',
    keywords_en: ['public welfare', 'social welfare', 'welfare', 'social security', 'bantuan'],
    keywords_ms: ['kebajikan awam', 'kebajikan sosial', 'keselamatan sosial', 'bantuan'],
    category: 'dataset',
    response_en: '**Public Welfare** — Social safety net data\n\nCovers: Social welfare programs, aid distribution, social security coverage, vulnerable population statistics.\n\nFrequency: Yearly | Color: Fuchsia',
    response_ms: '**Kebajikan Awam** — Data jaringan keselamatan sosial\n\nMerangkumi: Program kebajikan sosial, pengedaran bantuan, liputan keselamatan sosial, statistik penduduk terdedah.\n\nKekerapan: Tahunan | Warna: Fuchsia',
    relatedIds: ['cat-households'],
  },
  {
    id: 'cat-statistical-indicators',
    keywords_en: ['statistical indicators', 'indicators', 'indices', 'composite index'],
    keywords_ms: ['penunjuk statistik', 'penunjuk', 'indeks', 'indeks komposit'],
    category: 'dataset',
    response_en: '**Statistical Indicators** — Composite and derived indicators\n\nCovers: Leading/lagging indicators, composite indices, economic sentiment indicators, development benchmarks. These are derived from multiple data sources.\n\nFrequency: Monthly to Yearly | Color: Teal',
    response_ms: '**Penunjuk Statistik** — Penunjuk komposit dan terbitan\n\nMerangkumi: Penunjuk utama/lewat, indeks komposit, penunjuk sentimen ekonomi, penanda aras pembangunan. Ini diperoleh daripada pelbagai sumber data.\n\nKekerapan: Bulanan hingga Tahunan | Warna: Teal',
    relatedIds: ['cat-national-accounts'],
  },
  {
    id: 'cat-data-dictionaries',
    keywords_en: ['data dictionary', 'data dictionaries', 'schema', 'definition', 'codebook'],
    keywords_ms: ['kamus data', 'skema', 'definisi', 'buku kod'],
    category: 'dataset',
    response_en: '**Data Dictionaries** — Definitions and metadata for datasets\n\nCovers: Column definitions, value codes, data type specifications, and documentation for all datasets. Essential reference for data interpretation.\n\nFrequency: As needed | Color: Stone',
    response_ms: '**Kamus Data** — Definisi dan metadata untuk set data\n\nMerangkumi: Definisi lajur, kod nilai, spesifikasi jenis data, dan dokumentasi untuk semua set data. Rujukan penting untuk tafsiran data.\n\nKekerapan: Mengikut keperluan | Warna: Batu',
    relatedIds: ['cat-metadata'],
  },
  {
    id: 'cat-metadata',
    keywords_en: ['metadata', 'data catalog', 'catalogue', 'data about data'],
    keywords_ms: ['metadata', 'katalog data', 'data tentang data'],
    category: 'dataset',
    response_en: '**Metadata** — Data about the data\n\nCovers: Dataset catalog entries, update timestamps, source attribution, quality indicators, and lineage information. This is the top-level reference for all 287+ datasets.\n\nFrequency: Updated with each dataset release | Color: Neutral Gray',
    response_ms: '**Metadata** — Data tentang data\n\nMerangkumi: Entri katalog set data, cap masa kemas kini, atribusi sumber, penunjuk kualiti, dan maklumat garis keturunan. Ini ialah rujukan peringkat atas untuk semua 287+ set data.\n\nKekerapan: Dikemas kini dengan setiap keluaran set data | Warna: Kelabu Neutral',
    relatedIds: ['cat-data-dictionaries', 'stat-datasets'],
  },

  // ─── Navigation ─────────────────────────────────────
  {
    id: 'nav-overview',
    keywords_en: ['overview', 'home', 'dashboard', 'main', 'landing', 'go to overview'],
    keywords_ms: ['gambaran', 'utama', 'papan pemuka', 'pergi ke gambaran'],
    category: 'navigation',
    response_en: '**Navigate to Overview** — The main dashboard view showing:\n• KPI cards (population, GDP, births, deaths, unemployment, datasets)\n• Data Engine Pulse with live activity feed\n• State mini cards with key metrics\n• Health Index gauge\n• Category distribution charts\n• Source attribution and timeline',
    response_ms: '**Navigasi ke Gambaran** — Paparan papan pemuka utama menunjukkan:\n• Kad KPI (penduduk, KDNK, kelahiran, kematian, pengangguran, set data)\n• Denyut Enjin Data dengan suapan aktiviti langsung\n• Kad mini negeri dengan metrik utama\n• Tolok Indeks Kesihatan\n• Carta pengedaran kategori\n• Atribusi sumber dan garis masa',
    relatedIds: ['nav-geomap', 'nav-datasets'],
  },
  {
    id: 'nav-geomap',
    keywords_en: ['geomap', 'map', 'geographic', 'spatial', 'go to map', 'show map'],
    keywords_ms: ['peta geo', 'peta', 'geografi', 'ruang', 'pergi ke peta', 'tunjuk peta'],
    category: 'navigation',
    response_en: '**Navigate to GeoMap** — Interactive geographic visualization showing:\n• SVG map of Malaysia with state-level data\n• 6 data layers: Population, GDP, Births, Deaths, Unemployment, Datasets\n• Click any state for a detailed profile modal\n• Year-over-year comparison panels',
    response_ms: '**Navigasi ke PetaGeo** — Visualisasi geografi interaktif menunjukkan:\n• Peta SVG Malaysia dengan data peringkat negeri\n• 6 lapisan data: Penduduk, KDNK, Kelahiran, Kematian, Pengangguran, Set Data\n• Klik mana-mana negeri untuk modal profil terperinci\n• Panel perbandingan tahun ke tahun',
    relatedIds: ['nav-overview', 'nav-datasets'],
  },
  {
    id: 'nav-datasets',
    keywords_en: ['datasets', 'data catalog', 'browse data', 'go to datasets', 'dataset list'],
    keywords_ms: ['set data', 'katalog data', 'semak data', 'pergi ke set data', 'senarai set data'],
    category: 'navigation',
    response_en: '**Navigate to Datasets** — Browse and explore 287+ datasets:\n• Filter by category, frequency, geography, demography\n• Search by keyword\n• View dataset details, sources, and download links\n• Export to CSV or Parquet format',
    response_ms: '**Navigasi ke Set Data** — Semak dan terokai 287+ set data:\n• Tapis mengikut kategori, kekerapan, geografi, demografi\n• Cari mengikut kata kunci\n• Lihat butiran set data, sumber, dan pautan muat turun\n• Eksport ke format CSV atau Parquet',
    relatedIds: ['nav-overview', 'nav-analytics'],
  },
  {
    id: 'nav-analytics',
    keywords_en: ['analytics', 'analysis', 'insights', 'charts', 'go to analytics', 'analytics tab'],
    keywords_ms: ['analitik', 'analisis', 'wawasan', 'carta', 'pergi ke analitik'],
    category: 'navigation',
    response_en: '**Navigate to Analytics** — Advanced analytics and visualizations:\n• YoY comparison charts\n• State rankings\n• Correlation analysis\n• Trend visualizations\n• Data insights engine',
    response_ms: '**Navigasi ke Analitik** — Analitik lanjutan dan visualisasi:\n• Carta perbandingan YoY\n• Kedudukan negeri\n• Analisis korelasi\n• Visualisasi trend\n• Enjin wawasan data',
    relatedIds: ['nav-overview', 'nav-datasets'],
  },
  {
    id: 'nav-intelligence',
    keywords_en: ['intelligence', 'intel', 'ontology', 'graph', 'correlation', 'go to intelligence', 'intel tab', 'causal', 'domain graph'],
    keywords_ms: ['intelligent', 'intel', 'ontologi', 'graf', 'korelasi', 'pergi ke intelijen', 'tab intel', 'sebab', 'graf domain'],
    category: 'navigation',
    response_en: '**Navigate to Intelligence** — Data domain relationship analysis:\n• Force-directed ontology graph with 14+ domain edges\n• Causal relationship mapping (Population → GDP → Employment)\n• Anomaly detection with confidence scores\n• Domain correlation analysis\n• Edge strength and lag visualization',
    response_ms: '**Navigasi ke Intelijen** — Analisis hubungan domain data:\n• Graf ontologi terarah daya dengan 14+ tepi domain\n• Pemetaan hubungan kausal (Penduduk → KDNK → Pekerjaan)\n• Pengesanan anomali dengan skor keyakinan\n• Analisis korelasi domain\n• Visualisasi kekuatan tepi dan lengah',
    relatedIds: ['nav-overview', 'nav-analytics'],
  },

  // ─── FAQ ─────────────────────────────────────────────
  {
    id: 'faq-what',
    keywords_en: ['what is this', 'what is the command center', 'about this dashboard', 'about command center'],
    keywords_ms: ['apa ini', 'apakah pusat perintah', 'tentang papan pemuka ini'],
    category: 'faq',
    response_en: '**Malaysia Open Data Command Center** is a premium SaaS-grade intelligence dashboard powered entirely by data.gov.my open data. It provides comprehensive visualizations and analytics across 287+ datasets covering demography, economy, healthcare, environment, and more.',
    response_ms: '**Pusat Perintah Data Terbuka Malaysia** adalah papan pemuka kecerdasan gred SaaS premium yang dikuasakan sepenuhnya oleh data terbuka data.gov.my. Ia menyediakan visualisasi dan analitik komprehensif merentasi 287+ set data yang merangkumi demografi, ekonomi, kesihatan, alam sekitar, dan banyak lagi.',
    relatedIds: ['faq-source', 'faq-update'],
  },
  {
    id: 'faq-source',
    keywords_en: ['where does data come from', 'data source', 'source of data', 'who provides data', 'data origin'],
    keywords_ms: ['dari mana data', 'sumber data', 'siapa menyediakan data', 'asal data'],
    category: 'faq',
    response_en: 'All data is sourced from the official **data.gov.my** open data portal, maintained by Jabatan Data Negara (JDN) and Kementerian Digital (KD). Primary data providers include:\n\n• **DOSM** — Population, GDP, CPI, Labour Force, Trade\n• **BNM** — Exchange rates, interest rates, monetary aggregates\n• **JPN** — Births, deaths, marriages registrations\n• **KKM** — Healthcare, immunisation data\n• **MCMC** — Internet and communications statistics',
    response_ms: 'Semua data diperoleh daripada portal **data.gov.my** rasmi, yang dikekalkan oleh Jabatan Data Negara (JDN) dan Kementerian Digital (KD). Penyedia data utama termasuk:\n\n• **DOSM** — Penduduk, KDNK, IPI, Tenaga Buruh, Perdagangan\n• **BNM** — Kadar pertukaran, kadar faedah, agregat monetari\n• **JPN** — Pendaftaran kelahiran, kematian, perkahwinan\n• **KKM** — Kesihatan, data imunisasi\n• **MCMC** — Statistik internet dan komunikasi',
    relatedIds: ['faq-what', 'faq-license'],
  },
  {
    id: 'faq-update',
    keywords_en: ['how often updated', 'update frequency', 'when was data updated', 'freshness', 'data freshness'],
    keywords_ms: ['berapa kerap dikemas kini', 'kekerapan kemas kini', 'bila data dikemas kini', 'kesegaran data'],
    category: 'faq',
    response_en: 'Data update frequency varies by dataset:\n\n• **Daily** — Exchange rates, births/deaths registrations\n• **Monthly** — CPI, trade statistics, arrivals\n• **Quarterly** — GDP, labour force survey\n• **Yearly** — Population estimates, household income\n\nThe dashboard reflects the latest available data from data.gov.my.',
    response_ms: 'Kekerapan kemas kini data berbeza mengikut set data:\n\n• **Harian** — Kadar pertukaran, pendaftaran kelahiran/kematian\n• **Bulanan** — IPI, statistik perdagangan, kemasukan\n• **Suku tahunan** — KDNK, survei tenaga buruh\n• **Tahunan** — Anggaran penduduk, pendapatan isi rumah\n\nPapan pemuka ini mencerminkan data terkini yang tersedia dari data.gov.my.',
    relatedIds: ['faq-source'],
  },
  {
    id: 'faq-license',
    keywords_en: ['license', 'can i use', 'open data license', 'cc by', 'creative commons', 'data usage', 'permission'],
    keywords_ms: ['lesen', 'boleh guna', 'lesen data terbuka', 'cc by', 'creative commons', 'kebenaran'],
    category: 'faq',
    response_en: 'Yes! All data on data.gov.my is published under the **Creative Commons Attribution 4.0 International (CC BY 4.0)** license. You are free to:\n\n• **Share** — copy and redistribute in any medium\n• **Adapt** — remix, transform, and build upon\n\nProvided you give appropriate credit to the original data source.',
    response_ms: 'Ya! Semua data di data.gov.my diterbitkan di bawah lesen **Creative Commons Attribution 4.0 International (CC BY 4.0)**. Anda bebas untuk:\n\n• **Berkongsi** — salin dan edarkan semula dalam mana-mana medium\n• **Menyesuaikan** — olah, ubah, dan bina atas\n\nDengan syarat anda memberikan kredit yang sesuai kepada sumber data asal.',
    relatedIds: ['faq-source'],
  },
  {
    id: 'faq-accuracy',
    keywords_en: ['accuracy', 'how accurate', 'reliable', 'data quality', 'geospatial accuracy'],
    keywords_ms: ['ketepatan', 'sejauh mana tepat', 'boleh dipercayai', 'kualiti data', 'ketepatan georuang'],
    category: 'faq',
    response_en: 'Geospatial boundaries are based on official Malaysian administrative boundaries. Population and economic data are sourced from DOSM intercensal estimates and surveys. Some values may be estimates and subject to revision. Always refer to the source data for the most accurate figures.\n\n*Note: State-level GDP for W.P. Putrajaya is subsumed under W.P. Kuala Lumpur.*',
    response_ms: 'Sempadan georuang adalah berdasarkan sempadan pentadbiran Malaysia yang rasmi. Data penduduk dan ekonomi diperoleh daripada anggaran antara banci dan survei DOSM. Sesetengah nilai mungkin merupakan anggaran dan tertakluk kepada semakan. Sentiasa rujuk data sumber untuk angka yang paling tepat.\n\n*Nota: KDNK peringkat negeri bagi W.P. Putrajaya dimasukkan di bawah W.P. Kuala Lumpur.*',
    relatedIds: ['faq-source', 'faq-update'],
  },
  {
    id: 'faq-infographic',
    keywords_en: ['infographic', 'export', 'png', 'image export', 'download chart', 'report'],
    keywords_ms: ['infografik', 'eksport', 'png', 'eksport imej', 'muat turun carta', 'laporan'],
    category: 'faq',
    response_en: 'The **Infographic Export** feature allows you to generate high-quality PNG images of selected data layers in a branded dark-mode design. You can:\n\n• Choose which data categories to include\n• Adjust font sizes\n• Export at 2x resolution for presentations or reports\n\nAccess it via the Printer icon in the navigation bar.',
    response_ms: 'Ciri **Eksport Infografik** membolehkan anda menjana imej PNG berkualiti tinggi bagi lapisan data yang dipilih dalam reka bentuk mod gelap berjenama. Anda boleh:\n\n• Memilih kategori data yang ingin disertakan\n• Melaraskan saiz fon\n• Mengeksport pada resolusi 2x untuk pembentangan atau laporan\n\nAkses melalui ikon Pencetak dalam bar navigasi.',
    relatedIds: ['nav-overview'],
  },

  // ─── Ontology Concepts ──────────────────────────────
  {
    id: 'onto-overview',
    keywords_en: ['ontology', 'graph', 'relationship', 'domain', 'data relationship', 'data graph', 'force directed'],
    keywords_ms: ['ontologi', 'graf', 'hubungan', 'domain', 'hubungan data', 'graf data', 'graf terarah daya'],
    category: 'ontology',
    response_en: '**Data Ontology Graph** — Visualizing domain relationships\n\nThe ontology graph shows how different data domains are connected. It uses a **Force-Directed Graph** layout where:\n\n• **Nodes** represent data categories (e.g., Population, GDP, Healthcare)\n• **Edges** represent relationships (e.g., Population → GDP, GDP → Employment)\n• **Edge thickness** indicates relationship strength\n• **Colors** distinguish different relationship types\n\nThe graph reveals how economic, social, and environmental data domains interconnect.',
    response_ms: '**Graf Ontologi Data** — Memvisualisasikan hubungan domain\n\nGraf ontologi menunjukkan bagaimana domain data yang berbeza dihubungkan. Ia menggunakan susunan **Graf Terarah Daya** di mana:\n\n• **Nod** mewakili kategori data (cth., Penduduk, KDNK, Kesihatan)\n• **Tepi** mewakili hubungan (cth., Penduduk → KDNK, KDNK → Pekerjaan)\n• **Ketebalan tepi** menunjukkan kekuatan hubungan\n• **Warna** membezakan jenis hubungan yang berbeza\n\nGraf ini mendedahkan bagaimana domain data ekonomi, sosial, dan alam sekitar saling berhubung.',
    relatedIds: ['onto-pop-gdp', 'onto-gdp-employment'],
  },
  {
    id: 'onto-pop-gdp',
    keywords_en: ['population gdp', 'population to gdp', 'how does population affect economy', 'population economy'],
    keywords_ms: ['penduduk kdnk', 'penduduk kepada kdnk', 'bagaimana penduduk mempengaruhi ekonomi'],
    category: 'ontology',
    response_en: '**Population → GDP** (Strength: 0.85, Lag: 2 years)\n\nPopulation growth drives GDP through two main channels:\n1. **Labour supply** — More people means a larger workforce\n2. **Domestic demand** — More consumers drive economic activity\n\nThis relationship has a ~2 year lag, meaning population changes take about 2 years to fully manifest in GDP figures.',
    response_ms: '**Penduduk → KDNK** (Kekuatan: 0.85, Lengah: 2 tahun)\n\nPertumbuhan penduduk memacu KDNK melalui dua saluran utama:\n1. **Bekalan tenaga kerja** — Lebih ramai orang bermaksud tenaga kerja yang lebih besar\n2. **Permintaan domestik** — Lebih ramai pengguna memacu aktiviti ekonomi\n\nHubungan ini mempunyai lengah ~2 tahun, bermakna perubahan penduduk mengambil masa kira-kira 2 tahun untuk nyata sepenuhnya dalam angka KDNK.',
    relatedIds: ['onto-overview', 'onto-gdp-employment'],
  },
  {
    id: 'onto-gdp-employment',
    keywords_en: ['gdp employment', 'gdp to employment', 'economic growth jobs', 'economy creates jobs'],
    keywords_ms: ['kdnk pekerjaan', 'kdnk kepada pekerjaan', 'pertumbuhan ekonomi pekerjaan'],
    category: 'ontology',
    response_en: '**GDP → Employment** (Strength: 0.90, Lag: 1 year)\n\nThis is one of the strongest relationships in the ontology. GDP growth creates employment through:\n1. **Business expansion** — Growing output requires more workers\n2. **New market opportunities** — Economic growth spawns new industries\n3. **Investment multiplier** — Higher GDP attracts more investment\n\nThe 1-year lag means job creation follows economic growth relatively quickly.',
    response_ms: '**KDNK → Pekerjaan** (Kekuatan: 0.90, Lengah: 1 tahun)\n\nIni adalah salah satu hubungan terkuat dalam ontologi. Pertumbuhan KDNK mewujudkan pekerjaan melalui:\n1. **Perluasan perniagaan** — Keluaran yang semakin meningkat memerlukan lebih ramai pekerja\n2. **Peluang pasaran baru** — Pertumbuhan ekonomi melahirkan industri baru\n3. **Pendarab pelaburan** — KDNK yang lebih tinggi menarik lebih banyak pelaburan\n\nLengah 1 tahun bermakna penciptaan pekerjaan mengikuti pertumbuhan ekonomi agak cepat.',
    relatedIds: ['onto-overview', 'onto-pop-gdp'],
  },

  // ─── Help / Greeting ────────────────────────────────
  {
    id: 'help-capabilities',
    keywords_en: ['what can you do', 'help', 'capabilities', 'features', 'commands', 'how to use'],
    keywords_ms: ['apa yang anda boleh buat', 'bantuan', 'keupayaan', 'ciri', 'arahan', 'cara guna'],
    category: 'help',
    response_en: '**Command Copilot Capabilities:**\n\n📊 **Ask about data** — "What is Malaysia\'s population?", "GDP of Selangor"\n🗺️ **Navigate** — "Go to GeoMap", "Show me datasets"\n🔍 **Find datasets** — "Find healthcare data", "Search demography datasets"\n📈 **Explain concepts** — "What is GDP?", "Explain the ontology graph"\n📋 **Compare** — "Compare Selangor vs Johor"\n❓ **FAQ** — "Where does data come from?", "Can I use this data?"\n\nI work entirely offline — no external AI APIs needed! Try asking in English or Bahasa Malaysia.',
    response_ms: '**Keupayaan Copilot Perintah:**\n\n📊 **Tanya tentang data** — "Berapa penduduk Malaysia?", "KDNK Selangor"\n🗺️ **Navigasi** — "Pergi ke PetaGeo", "Tunjuk set data"\n🔍 **Cari set data** — "Cari data kesihatan", "Cari set data demografi"\n📈 **Terangkan konsep** — "Apa itu KDNK?", "Terangkan graf ontologi"\n📋 **Bandingkan** — "Bandingkan Selangor vs Johor"\n❓ **FAQ** — "Dari mana data datang?", "Bolehkah saya guna data ini?"\n\nSaya berfungsi sepenuhnya luar talian — tiada API AI luar diperlukan! Cuba tanya dalam Bahasa Inggeris atau Bahasa Malaysia.',
    relatedIds: ['help-keyboard'],
  },
  {
    id: 'help-keyboard',
    keywords_en: ['keyboard shortcuts', 'keyboard', 'shortcuts', 'hotkeys', 'key bindings'],
    keywords_ms: ['pintasan papan kekunci', 'pintasan', 'kekunci panas'],
    category: 'help',
    response_en: '**Keyboard Shortcuts:**\n\n• **Ctrl+K** — Open Command Palette\n• **1/2/3/4** — Switch to Overview/GeoMap/Datasets/Analytics\n• **L** — Toggle language (EN/MS)\n• **I** — Toggle Info panel\n• **E** — Open Infographic Export\n• **?** — Show keyboard shortcuts\n• **Esc** — Close any modal',
    response_ms: '**Pintasan Papan Kekunci:**\n\n• **Ctrl+K** — Buka Palet Perintah\n• **1/2/3/4** — Tukar ke Gambaran/PetaGeo/Set Data/Analitik\n• **L** — Togol bahasa (EN/BM)\n• **I** — Togol panel Maklumat\n• **E** — Buka Eksport Infografik\n• **?** — Tunjuk pintasan papan kekunci\n• **Esc** — Tutup mana-mana modal',
    relatedIds: ['help-capabilities'],
  },
  {
    id: 'greeting',
    keywords_en: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings'],
    keywords_ms: ['selamat', 'hello', 'hai', 'selamat pagi', 'selamat petang', 'apa khabar'],
    category: 'help',
    response_en: 'Hello! I\'m the **Command Copilot** for the Malaysia Open Data Command Center. 🇲🇾\n\nI can help you explore Malaysia\'s data, navigate the dashboard, and answer questions about datasets, statistics, and data relationships.\n\nType **"help"** to see what I can do, or just ask me anything!',
    response_ms: 'Selamat! Saya **Copilot Perintah** untuk Pusat Perintah Data Terbuka Malaysia. 🇲🇾\n\nSaya boleh membantu anda meneroka data Malaysia, navigasi papan pemuka, dan menjawab soalan tentang set data, statistik, dan hubungan data.\n\nTaip **"bantuan"** untuk melihat apa yang saya boleh lakukan, atau hanya tanya saya apa-apa!',
    relatedIds: ['help-capabilities'],
  },
  {
    id: 'copilot-identity',
    keywords_en: ['who are you', 'what are you', 'your name', 'are you ai', 'are you a bot', 'copilot'],
    keywords_ms: ['siapa anda', 'apa anda', 'nama anda', 'adakah anda ai', 'adakah anda bot', 'copilot'],
    category: 'help',
    response_en: 'I\'m the **Command Copilot** — a rule-based assistant built into the Malaysia Open Data Command Center. I work with **zero external AI APIs** — all my knowledge is stored locally. I can help you:\n\n• Navigate the dashboard\n• Query Malaysia statistics\n• Find and explain datasets\n• Explore data domain relationships\n• Answer frequently asked questions\n\nI understand both **English** and **Bahasa Malaysia**!',
    response_ms: 'Saya **Copilot Perintah** — pembantu berasaskan peraturan yang dibina dalam Pusat Perintah Data Terbuka Malaysia. Saya berfungsi dengan **sifar API AI luar** — semua pengetahuan saya disimpan secara tempatan. Saya boleh membantu anda:\n\n• Navigasi papan pemuka\n• Pertanyaan statistik Malaysia\n• Cari dan terangkan set data\n• Terokai hubungan domain data\n• Jawab soalan yang sering ditanya\n\nSaya faham **Bahasa Inggeris** dan **Bahasa Malaysia**!',
    relatedIds: ['greeting', 'help-capabilities'],
  },
];

// ─── Search Function ────────────────────────────────────────────────────
export function searchKnowledge(query: string, lang: 'en' | 'ms'): KnowledgeEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored = KNOWLEDGE_ENTRIES.map(entry => {
    const keywords = lang === 'ms' ? entry.keywords_ms : entry.keywords_en;
    const allKeywords = [...entry.keywords_en, ...entry.keywords_ms];

    let score = 0;

    // Exact keyword match (highest priority)
    for (const kw of keywords) {
      if (q === kw.toLowerCase()) {
        score += 10;
      }
    }

    // Partial keyword match
    for (const kw of allKeywords) {
      const kwLower = kw.toLowerCase();
      if (q.includes(kwLower) || kwLower.includes(q)) {
        score += 5;
      }
    }

    // Word-level match
    const queryWords = q.split(/\s+/);
    for (const word of queryWords) {
      if (word.length < 2) continue;
      for (const kw of allKeywords) {
        if (kw.toLowerCase().includes(word)) {
          score += 2;
        }
        if (word.includes(kw.toLowerCase())) {
          score += 2;
        }
      }
    }

    // Also search in the response text for relevant terms
    const responseText = lang === 'ms' ? entry.response_ms : entry.response_en;
    const responseLower = responseText.toLowerCase();
    for (const word of queryWords) {
      if (word.length < 3) continue;
      if (responseLower.includes(word)) {
        score += 1;
      }
    }

    return { entry, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.entry);
}
