// Malaysia Open Data Command Center - Comprehensive Data Layer
// Data sourced from data.gov.my open data (datagovmy-meta GitHub repository)

export interface StateData {
  id: string;
  name: string;
  name_ms: string;
  abbr: string;
  population: number;
  gdp: number; // RM millions
  gdpGrowth: number; // %
  births: number;
  deaths: number;
  unemployment: number; // %
  datasets: number;
  area: number; // km²
  density: number; // per km²
  region: 'peninsular' | 'east_malaysia';
  coordinates: { x: number; y: number }; // SVG positioning
}

export const STATES: StateData[] = [
  { id: 'johor', name: 'Johor', name_ms: 'Johor', abbr: 'JHR', population: 4210, gdp: 148200, gdpGrowth: 4.2, births: 73.5, deaths: 17.8, unemployment: 3.4, datasets: 18, area: 19166, density: 219.7, region: 'peninsular', coordinates: { x: 320, y: 480 } },
  { id: 'kedah', name: 'Kedah', name_ms: 'Kedah', abbr: 'KDH', population: 2220, gdp: 52400, gdpGrowth: 3.8, births: 42.1, deaths: 11.2, unemployment: 3.8, datasets: 14, area: 9500, density: 233.7, region: 'peninsular', coordinates: { x: 160, y: 200 } },
  { id: 'kelantan', name: 'Kelantan', name_ms: 'Kelantan', abbr: 'KTN', population: 2010, gdp: 32100, gdpGrowth: 3.1, births: 44.2, deaths: 9.8, unemployment: 4.6, datasets: 12, area: 15099, density: 133.1, region: 'peninsular', coordinates: { x: 340, y: 160 } },
  { id: 'melaka', name: 'Melaka', name_ms: 'Melaka', abbr: 'MLK', population: 990, gdp: 40200, gdpGrowth: 5.1, births: 16.8, deaths: 5.2, unemployment: 2.8, datasets: 10, area: 1664, density: 594.9, region: 'peninsular', coordinates: { x: 260, y: 420 } },
  { id: 'negeri-sembilan', name: 'Negeri Sembilan', name_ms: 'Negeri Sembilan', abbr: 'NSN', population: 1230, gdp: 46800, gdpGrowth: 4.5, births: 20.5, deaths: 7.1, unemployment: 3.2, datasets: 11, area: 6686, density: 183.9, region: 'peninsular', coordinates: { x: 240, y: 370 } },
  { id: 'pahang', name: 'Pahang', name_ms: 'Pahang', abbr: 'PHG', population: 1770, gdp: 62400, gdpGrowth: 3.9, births: 32.8, deaths: 9.4, unemployment: 3.5, datasets: 13, area: 36137, density: 49.0, region: 'peninsular', coordinates: { x: 380, y: 330 } },
  { id: 'perak', name: 'Perak', name_ms: 'Perak', abbr: 'PRK', population: 2520, gdp: 74600, gdpGrowth: 3.6, births: 42.6, deaths: 14.3, unemployment: 3.9, datasets: 15, area: 21035, density: 119.8, region: 'peninsular', coordinates: { x: 150, y: 310 } },
  { id: 'perlis', name: 'Perlis', name_ms: 'Perlis', abbr: 'PLS', population: 290, gdp: 7200, gdpGrowth: 3.4, births: 5.8, deaths: 1.8, unemployment: 4.1, datasets: 8, area: 821, density: 353.2, region: 'peninsular', coordinates: { x: 140, y: 130 } },
  { id: 'pulau-pinang', name: 'Pulau Pinang', name_ms: 'Pulau Pinang', abbr: 'PNG', population: 1800, gdp: 87200, gdpGrowth: 5.8, births: 27.1, deaths: 10.5, unemployment: 2.4, datasets: 16, area: 1048, density: 1717.6, region: 'peninsular', coordinates: { x: 110, y: 240 } },
  { id: 'sabah', name: 'Sabah', name_ms: 'Sabah', abbr: 'SBH', population: 3900, gdp: 87600, gdpGrowth: 3.2, births: 68.4, deaths: 14.2, unemployment: 5.2, datasets: 17, area: 73631, density: 53.0, region: 'east_malaysia', coordinates: { x: 620, y: 300 } },
  { id: 'sarawak', name: 'Sarawak', name_ms: 'Sarawak', abbr: 'SRK', population: 2900, gdp: 122800, gdpGrowth: 4.0, births: 48.2, deaths: 11.6, unemployment: 3.8, datasets: 16, area: 124450, density: 23.3, region: 'east_malaysia', coordinates: { x: 550, y: 420 } },
  { id: 'selangor', name: 'Selangor', name_ms: 'Selangor', abbr: 'SGR', population: 7100, gdp: 362400, gdpGrowth: 5.6, births: 118.2, deaths: 26.8, unemployment: 2.8, datasets: 22, area: 8104, density: 876.1, region: 'peninsular', coordinates: { x: 220, y: 310 } },
  { id: 'terengganu', name: 'Terengganu', name_ms: 'Terengganu', abbr: 'TRG', population: 1280, gdp: 39600, gdpGrowth: 3.5, births: 25.8, deaths: 6.9, unemployment: 4.2, datasets: 11, area: 13035, density: 98.2, region: 'peninsular', coordinates: { x: 390, y: 240 } },
  { id: 'wp-kuala-lumpur', name: 'W.P. Kuala Lumpur', name_ms: 'W.P. Kuala Lumpur', abbr: 'KUL', population: 1940, gdp: 228600, gdpGrowth: 5.4, births: 32.4, deaths: 12.1, unemployment: 2.6, datasets: 20, area: 243, density: 7983.5, region: 'peninsular', coordinates: { x: 230, y: 320 } },
  { id: 'wp-labuan', name: 'W.P. Labuan', name_ms: 'W.P. Labuan', abbr: 'LBN', population: 110, gdp: 6800, gdpGrowth: 3.0, births: 1.9, deaths: 0.6, unemployment: 3.6, datasets: 7, area: 92, density: 1195.7, region: 'east_malaysia', coordinates: { x: 660, y: 340 } },
  { id: 'wp-putrajaya', name: 'W.P. Putrajaya', name_ms: 'W.P. Putrajaya', abbr: 'PJY', population: 120, gdp: 4800, gdpGrowth: 4.8, births: 2.1, deaths: 0.4, unemployment: 2.2, datasets: 6, area: 49, density: 2449.0, region: 'peninsular', coordinates: { x: 240, y: 340 } },
];

export const MALAYSIA_TOTALS = {
  population: 34300,
  gdp: 1682000,
  gdpGrowth: 4.5,
  births: 602.9,
  deaths: 159.7,
  unemployment: 3.4,
  datasets: 287,
  area: 331980,
  density: 103.3,
};

export interface DatasetEntry {
  id: string;
  title_en: string;
  title_ms: string;
  description_en: string;
  description_ms: string;
  frequency: string;
  geography: string[];
  demography: string[];
  dataset_begin: number;
  dataset_end: number;
  data_source: string[];
  category_en: string;
  category_ms: string;
  subcategory_en: string;
  subcategory_ms: string;
  category_sort: number;
  link_parquet: string;
  link_csv: string;
  last_updated: string;
  data_as_of: string;
}

export const DATASET_CATEGORIES = [
  { en: 'Demography', ms: 'Demografi', sort: 1, color: '#06b6d4' },
  { en: 'National Accounts', ms: 'Akaun Negara', sort: 20, color: '#f59e0b' },
  { en: 'Prices', ms: 'Harga', sort: 30, color: '#ef4444' },
  { en: 'Labour Markets', ms: 'Pasaran Buruh', sort: 40, color: '#8b5cf6' },
  { en: 'Financial Markets', ms: 'Pasaran Kewangan', sort: 50, color: '#10b981' },
  { en: 'Economic Sectors', ms: 'Sektor Ekonomi', sort: 60, color: '#f97316' },
  { en: 'Healthcare', ms: 'Kesihatan', sort: 70, color: '#ec4899' },
  { en: 'Environment', ms: 'Alam Sekitar', sort: 80, color: '#22c55e' },
  { en: 'Education', ms: 'Pendidikan', sort: 90, color: '#3b82f6' },
  { en: 'Transportation', ms: 'Pengangkutan', sort: 100, color: '#64748b' },
  { en: 'Households', ms: 'Isi Rumah', sort: 110, color: '#a855f7' },
  { en: 'Communications', ms: 'Komunikasi', sort: 120, color: '#0ea5e9' },
  { en: 'Public Safety', ms: 'Keselamatan Awam', sort: 130, color: '#dc2626' },
  { en: 'Public Administration', ms: 'Pentadbiran Awam', sort: 140, color: '#6366f1' },
  { en: 'Public Welfare', ms: 'Kebajikan Awam', sort: 150, color: '#d946ef' },
  { en: 'Statistical Indicators', ms: 'Penunjuk Statistik', sort: 160, color: '#14b8a6' },
  { en: 'Data Dictionaries', ms: 'Kamus Data', sort: 170, color: '#78716c' },
  { en: 'Metadata', ms: 'Metadata', sort: 180, color: '#525252' },
];

export const FREQUENCY_COLORS: Record<string, string> = {
  DAILY: '#06b6d4',
  WEEKLY: '#8b5cf6',
  MONTHLY: '#f59e0b',
  QUARTERLY: '#f97316',
  YEARLY: '#10b981',
  ADHOC: '#64748b',
  UNKNOWN: '#525252',
};

export const MAP_LAYERS = [
  { id: 'population', label_en: 'Population', label_ms: 'Penduduk', unit: "'000", icon: 'Users' },
  { id: 'gdp', label_en: 'GDP', label_ms: 'KDNK', unit: 'RM M', icon: 'TrendingUp' },
  { id: 'births', label_en: 'Births', label_ms: 'Kelahiran', unit: "'000", icon: 'Baby' },
  { id: 'deaths', label_en: 'Deaths', label_ms: 'Kematian', unit: "'000", icon: 'Heart' },
  { id: 'unemployment', label_en: 'Unemployment', label_ms: 'Pengangguran', unit: '%', icon: 'Briefcase' },
  { id: 'datasets', label_en: 'Datasets', label_ms: 'Set Data', unit: '', icon: 'Database' },
];

// Timeline events for the command center
export const TIMELINE_EVENTS = [
  { date: '2025-07', event_en: 'Population estimates updated to 2025', event_ms: 'Anggaran penduduk dikemas kini ke 2025' },
  { date: '2025-04', event_en: 'Q1 2025 GDP data released', event_ms: 'Data KDNK Q1 2025 dikeluarkan' },
  { date: '2025-03', event_en: 'Labour Force Survey Q1 2025', event_ms: 'Survei Tenaga Buruh Q1 2025' },
  { date: '2025-01', event_en: 'CPI Annual Inflation 2024 released', event_ms: 'Inflasi Tahunan CPI 2024 dikeluarkan' },
  { date: '2024-11', event_en: 'Vital Statistics 2024 published', event_ms: 'Statistik Utama 2024 diterbitkan' },
  { date: '2024-10', event_en: 'Census 2024 preliminary results', event_ms: 'Keputusan awal Banci 2024' },
  { date: '2024-08', event_en: 'GDP by State 2023 updated', event_ms: 'KDNK mengikut Negeri 2023 dikemas kini' },
  { date: '2024-07', event_en: 'Household Income Survey 2023', event_ms: 'Survei Pendapatan Isi Rumah 2023' },
  { date: '2024-06', event_en: 'Environmental Quality Report 2023', event_ms: 'Laporan Kualiti Alam Sekitar 2023' },
  { date: '2024-04', event_en: 'Education Statistics 2024', event_ms: 'Statistik Pendidikan 2024' },
];

// FAQ data
export const FAQ_DATA = [
  {
    q_en: 'What is the Malaysia Open Data Command Center?',
    q_ms: 'Apakah Pusat Perintah Data Terbuka Malaysia?',
    a_en: 'The Malaysia Open Data Command Center is a premium SaaS-grade intelligence dashboard powered entirely by data.gov.my open data. It provides comprehensive visualizations and analytics across 287+ datasets covering demography, economy, healthcare, environment, and more.',
    a_ms: 'Pusat Perintah Data Terbuka Malaysia adalah papan pemuka kecerdasan gred SaaS premium yang dikuasakan sepenuhnya oleh data terbuka data.gov.my. Ia menyediakan visualisasi dan analitik komprehensif merentasi 287+ set data yang merangkumi demografi, ekonomi, kesihatan, alam sekitar, dan banyak lagi.',
  },
  {
    q_en: 'Where does the data come from?',
    q_ms: 'Dari manakah data ini datang?',
    a_en: 'All data is sourced from the official data.gov.my open data portal, maintained by the Jabatan Data Negara (JDN) and the Kementerian Digital (KD). Primary data providers include the Department of Statistics Malaysia (DOSM), Bank Negara Malaysia (BNM), and various government agencies.',
    a_ms: 'Semua data diperoleh daripada portal data terbuka data.gov.my rasmi, yang dikekalkan oleh Jabatan Data Negara (JDN) dan Kementerian Digital (KD). Penyedia data utama termasuk Jabatan Perangkaan Malaysia (DOSM), Bank Negara Malaysia (BNM), dan pelbagai agensi kerajaan.',
  },
  {
    q_en: 'How often is the data updated?',
    q_ms: 'Berapa kerap data dikemas kini?',
    a_en: 'Data update frequency varies by dataset: daily (e.g., exchange rates), monthly (e.g., CPI, trade), quarterly (e.g., GDP, labour force), and yearly (e.g., population, household income). The dashboard reflects the latest available data from data.gov.my.',
    a_ms: 'Frekuensi kemas kini data berbeza mengikut set data: harian (cth., kadar pertukaran), bulanan (cth., CPI, perdagangan), suku tahunan (cth., KDNK, tenaga buruh), dan tahunan (cth., penduduk, pendapatan isi rumah). Papan pemuka ini mencerminkan data terkini yang tersedia dari data.gov.my.',
  },
  {
    q_en: 'Can I use this data for my own projects?',
    q_ms: 'Bolehkah saya menggunakan data ini untuk projek saya sendiri?',
    a_en: 'Yes! All data on data.gov.my is published under the Creative Commons Attribution 4.0 International (CC BY 4.0) license. You are free to share, adapt, and build upon the data, provided appropriate credit is given.',
    a_ms: 'Ya! Semua data di data.gov.my diterbitkan di bawah lesen Creative Commons Attribution 4.0 International (CC BY 4.0). Anda bebas untuk berkongsi, menyesuaikan, dan membina data tersebut, dengan syarat kredit yang sesuai diberikan.',
  },
  {
    q_en: 'How accurate is the geospatial data on the map?',
    q_ms: 'Sejauh manakah ketepatan data georuang pada peta?',
    a_en: 'The geospatial boundaries are based on official Malaysian administrative boundaries. Population and economic data are sourced from DOSM intercensal estimates and surveys. Some values may be estimates and subject to revision. Always refer to the source data for the most accurate figures.',
    a_ms: 'Sempadan georuang adalah berdasarkan sempadan pentadbiran Malaysia yang rasmi. Data penduduk dan ekonomi diperoleh daripada anggaran antara banci dan survei DOSM. Sesetengah nilai mungkin merupakan anggaran dan tertakluk kepada semakan. Sentiasa rujuk data sumber untuk angka yang paling tepat.',
  },
  {
    q_en: 'What is the infographic export feature?',
    q_ms: 'Apakah ciri eksport infografik?',
    a_en: 'The infographic export feature allows you to generate high-quality PNG images of selected data layers in a branded dark-mode design. You can choose which data categories to include, adjust font sizes, and export at 2x resolution for presentations or reports.',
    a_ms: 'Ciri eksport infografik membolehkan anda menjana imej PNG berkualiti tinggi bagi lapisan data yang dipilih dalam reka bentuk mod gelap berjenama. Anda boleh memilih kategori data yang ingin disertakan, melaraskan saiz fon, dan mengeksport pada resolusi 2x untuk pembentangan atau laporan.',
  },
];

// Disclaimers
export const DISCLAIMERS = {
  en: [
    'Data is sourced from data.gov.my and is subject to the CC BY 4.0 license.',
    'Values shown may be estimates and subject to revision upon release of updated official figures.',
    'State-level GDP for W.P. Putrajaya is subsumed under W.P. Kuala Lumpur.',
    'Population figures are in thousands (\'000). GDP figures are in RM millions.',
    'This dashboard is not affiliated with the Government of Malaysia.',
  ],
  ms: [
    'Data diperoleh daripada data.gov.my dan tertakluk kepada lesen CC BY 4.0.',
    'Nilai yang dipaparkan mungkin merupakan anggaran dan tertakluk kepada semakan apabila angka rasmi terkini dikeluarkan.',
    'KDNK peringkat negeri bagi W.P. Putrajaya dimasukkan di bawah W.P. Kuala Lumpur.',
    'Angka penduduk adalah dalam ribuan (\'000). Angka KDNK adalah dalam RM juta.',
    'Papan pemuka ini tidak bergabung dengan Kerajaan Malaysia.',
  ],
};

// Citations
export const CITATIONS = [
  { source: 'Jabatan Perangkaan Malaysia (DOSM)', url: 'https://open.dosm.gov.my', description: 'Population, GDP, CPI, Labour Force, Trade statistics' },
  { source: 'Bank Negara Malaysia (BNM)', url: 'https://www.bnm.gov.my', description: 'Exchange rates, interest rates, monetary aggregates' },
  { source: 'Jabatan Data Negara (JDN)', url: 'https://data.gov.my', description: 'Data catalogue, open data portal' },
  { source: 'Kementerian Kesihatan Malaysia (KKM)', url: 'https://data.gov.my', description: 'Healthcare, COVID-19, immunisation data' },
  { source: 'Kementerian Digital (KD)', url: 'https://data.gov.my', description: 'Digital economy, ICT statistics' },
  { source: 'data.gov.my Open Data Portal', url: 'https://data.gov.my/data-catalogue/', description: 'Central data catalogue with 287+ datasets' },
];
