// Malaysian Government Ministries Icon & Data Module
// Comprehensive bilingual (EN/MS) data for all federal ministries, icon sets, and state data
// Icons use lucide-react names verified available in v0.525.0

// ============================================================================
// MINISTRY INTERFACE & DATA
// ============================================================================

export interface Ministry {
  id: string;                    // kebab-case ID
  abbr_en: string;               // English abbreviation (e.g., "MOF", "MOH", "MOE")
  abbr_ms: string;               // Malay abbreviation (e.g., "KKB", "KKM", "KPM")
  name_en: string;               // Full English name
  name_ms: string;               // Full Malay name
  icon: string;                  // Lucide icon name for the ministry
  emoji: string;                 // Emoji representation
  color: string;                 // Hex color for the ministry
  category: 'core' | 'economic' | 'social' | 'security' | 'infrastructure';
  dataGovSource: boolean;        // Whether this ministry provides data to data.gov.my
  website: string;               // Official website URL
  description_en: string;        // Brief English description
  description_ms: string;        // Brief Malay description
}

export const MINISTRIES: Ministry[] = [
  // ---- Core Ministries ----
  {
    id: 'prime-ministers-department',
    abbr_en: 'JPM',
    abbr_ms: 'JPM',
    name_en: "Prime Minister's Department",
    name_ms: 'Jabatan Perdana Menteri',
    icon: 'Crown',
    emoji: '👑',
    color: '#dc2626',
    category: 'core',
    dataGovSource: true,
    website: 'https://www.pmo.gov.my',
    description_en: "The central administrative body supporting the Prime Minister in executive governance, policy coordination, and national strategic initiatives.",
    description_ms: 'Badan pentadbiran pusat yang menyokong Perdana Menteri dalam tadbir urus eksekutif, penyelarasan dasar, dan inisiatif strategi negara.',
  },
  {
    id: 'ministry-of-finance',
    abbr_en: 'MOF',
    abbr_ms: 'KKB',
    name_en: 'Ministry of Finance',
    name_ms: 'Kementerian Kewangan',
    icon: 'Banknote',
    emoji: '💰',
    color: '#f59e0b',
    category: 'core',
    dataGovSource: true,
    website: 'https://www.mof.gov.my',
    description_en: 'Responsible for federal budget, taxation, fiscal policy, and management of government finances and economic stability.',
    description_ms: 'Bertanggungjawab terhadap belanjawan persekutuan, percukaian, dasar fiskal, dan pengurusan kewangan serta kestabilan ekonomi kerajaan.',
  },
  {
    id: 'ministry-of-home-affairs',
    abbr_en: 'KDN',
    abbr_ms: 'KDN',
    name_en: 'Ministry of Home Affairs',
    name_ms: 'Kementerian Dalam Negeri',
    icon: 'Shield',
    emoji: '🛡️',
    color: '#1e40af',
    category: 'security',
    dataGovSource: true,
    website: 'https://www.moha.gov.my',
    description_en: 'Oversees internal security, immigration, civil defence, and public order through agencies like PDRM, JIM, and APMM.',
    description_ms: 'Mengawasi keselamatan dalam negeri, imigresen, pertahanan awam, dan ketenteraman awam melalui agensi seperti PDRM, JIM, dan APMM.',
  },
  {
    id: 'ministry-of-defence',
    abbr_en: 'MINDEF',
    abbr_ms: 'KPert',
    name_en: 'Ministry of Defence',
    name_ms: 'Kementerian Pertahanan',
    icon: 'Swords',
    emoji: '⚔️',
    color: '#374151',
    category: 'security',
    dataGovSource: true,
    website: 'https://www.mod.gov.my',
    description_en: 'Responsible for national defence policy, armed forces management, and safeguarding Malaysia sovereignty and territorial integrity.',
    description_ms: 'Bertanggungjawab terhadap dasar pertahanan negara, pengurusan angkatan tentera, dan menjaga kedaulatan serta keutuhan wilayah Malaysia.',
  },
  {
    id: 'ministry-of-foreign-affairs',
    abbr_en: 'KLN',
    abbr_ms: 'KLN',
    name_en: 'Ministry of Foreign Affairs',
    name_ms: 'Kementerian Luar Negeri',
    icon: 'Globe',
    emoji: '🌍',
    color: '#0ea5e9',
    category: 'core',
    dataGovSource: false,
    website: 'https://www.kln.gov.my',
    description_en: "Manages Malaysia's diplomatic relations, international cooperation, and consular services through Wisma Putra and overseas missions.",
    description_ms: 'Mengurus hubungan diplomatik Malaysia, kerjasama antarabangsa, dan perkhidmatan konsular melalui Wisma Putra dan misi luar negara.',
  },

  // ---- Economic Ministries ----
  {
    id: 'ministry-of-economy',
    abbr_en: 'EKPN',
    abbr_ms: 'KEkonomi',
    name_en: 'Ministry of Economy',
    name_ms: 'Kementerian Ekonomi',
    icon: 'TrendingUp',
    emoji: '📈',
    color: '#10b981',
    category: 'economic',
    dataGovSource: true,
    website: 'https://www.ekonomi.gov.my',
    description_en: 'Formulates economic development plans, including Malaysia Plans, and coordinates national economic strategy and sustainable growth.',
    description_ms: 'Merangka rancangan pembangunan ekonomi, termasuk Rancangan Malaysia, dan menyelaras strategi ekonomi negara serta pertumbuhan mampan.',
  },
  {
    id: 'ministry-of-investment-trade-and-industry',
    abbr_en: 'MITI',
    abbr_ms: 'KPUD',
    name_en: 'Ministry of Investment, Trade and Industry',
    name_ms: 'Kementerian Pelaburan, Perdagangan dan Industri',
    icon: 'Factory',
    emoji: '🏭',
    color: '#f97316',
    category: 'economic',
    dataGovSource: true,
    website: 'https://www.miti.gov.my',
    description_en: 'Drives investment promotion, international trade negotiations, industrial development, and automotive policy for Malaysia.',
    description_ms: 'Memacu promosi pelaburan, rundingan perdagangan antarabangsa, pembangunan perindustrian, dan dasar automotif Malaysia.',
  },
  {
    id: 'ministry-of-agriculture-and-food-security',
    abbr_en: 'KPKM',
    abbr_ms: 'KPKM',
    name_en: 'Ministry of Agriculture and Food Security',
    name_ms: 'Kementerian Pertanian dan Keterjaminan Makanan',
    icon: 'Wheat',
    emoji: '🌾',
    color: '#84cc16',
    category: 'economic',
    dataGovSource: true,
    website: 'https://www.moa.gov.my',
    description_en: 'Ensures national food security, develops the agricultural sector, and manages agro-based industries and fisheries.',
    description_ms: 'Memastikan keterjaminan makanan negara, membangunkan sektor pertanian, dan mengurus industri berasaskan agro serta perikanan.',
  },
  {
    id: 'ministry-of-plantations-and-commodities',
    abbr_en: 'KPP',
    abbr_ms: 'KKomoditi',
    name_en: 'Ministry of Plantations and Commodities',
    name_ms: 'Kementerian Perladangan dan Komoditi',
    icon: 'TreePine',
    emoji: '🌴',
    color: '#065f46',
    category: 'economic',
    dataGovSource: true,
    website: 'https://www.kppk.gov.my',
    description_en: 'Oversees commodity sectors including palm oil, rubber, timber, cocoa, and pepper, driving sustainable commodity development.',
    description_ms: 'Mengawasi sektor komoditi termasuk minyak sawit, getah, kayu, koko, dan lada, memacu pembangunan komoditi mampan.',
  },
  {
    id: 'ministry-of-natural-resources-and-environmental-sustainability',
    abbr_en: 'NRES',
    abbr_ms: 'KNRES',
    name_en: 'Ministry of Natural Resources and Environmental Sustainability',
    name_ms: 'Kementerian Sumber Asli dan Kelestarian Alam Sekitar',
    icon: 'Leaf',
    emoji: '🍃',
    color: '#22c55e',
    category: 'economic',
    dataGovSource: true,
    website: 'https://www.nres.gov.my',
    description_en: 'Manages natural resources, environmental protection, climate change mitigation, and promotes sustainable development practices.',
    description_ms: 'Mengurus sumber asli, perlindungan alam sekitar, mitigasi perubahan iklim, dan menggalakkan amalan pembangunan mampan.',
  },
  {
    id: 'ministry-of-digital',
    abbr_en: 'KD',
    abbr_ms: 'KDigital',
    name_en: 'Ministry of Digital',
    name_ms: 'Kementerian Digital',
    icon: 'Cpu',
    emoji: '💻',
    color: '#8b5cf6',
    category: 'economic',
    dataGovSource: true,
    website: 'https://www.digital.gov.my',
    description_en: 'Drives Malaysia digital economy, ICT development, data governance, and digital transformation of government services.',
    description_ms: 'Memacu ekonomi digital Malaysia, pembangunan ICT, tadbir urus data, dan transformasi digital perkhidmatan kerajaan.',
  },
  {
    id: 'ministry-of-tourism-arts-and-culture',
    abbr_en: 'MOTAC',
    abbr_ms: 'KMOTAC',
    name_en: 'Ministry of Tourism, Arts and Culture',
    name_ms: 'Kementerian Pelancongan, Seni dan Budaya',
    icon: 'Palmtree',
    emoji: '🏖️',
    color: '#06b6d4',
    category: 'economic',
    dataGovSource: true,
    website: 'https://www.motac.gov.my',
    description_en: 'Promotes tourism industry, preserves cultural heritage, and develops creative arts for national identity and economic contribution.',
    description_ms: 'Mempromosikan industri pelancongan, memelihara warisan budaya, dan membangunkan seni kreatif untuk identiti negara dan sumbangan ekonomi.',
  },
  {
    id: 'ministry-of-entrepreneur-development-and-cooperatives',
    abbr_en: 'KUSKOP',
    abbr_ms: 'KUsahawan',
    name_en: 'Ministry of Entrepreneur Development and Cooperatives',
    name_ms: 'Kementerian Pembangunan Usahawan dan Koperasi',
    icon: 'Store',
    emoji: '🏪',
    color: '#e11d48',
    category: 'economic',
    dataGovSource: true,
    website: 'https://www.kuskop.gov.my',
    description_en: 'Develops Bumiputera entrepreneurs, cooperatives, and SME ecosystem to foster inclusive economic participation.',
    description_ms: 'Membangunkan usahawan Bumiputera, koperasi, dan ekosistem PKS untuk memupuk penyertaan ekonomi yang inklusif.',
  },
  {
    id: 'ministry-of-domestic-trade-and-cost-of-living',
    abbr_en: 'KPDN',
    abbr_ms: 'KPDN',
    name_en: 'Ministry of Domestic Trade and Cost of Living',
    name_ms: 'Kementerian Perdagangan Dalam Negeri dan Kos Sara Hidup',
    icon: 'ShoppingCart',
    emoji: '🛒',
    color: '#eab308',
    category: 'economic',
    dataGovSource: true,
    website: 'https://www.kpdn.gov.my',
    description_en: 'Regulates domestic trade, protects consumer rights, manages price controls, and addresses cost of living issues.',
    description_ms: 'Mengawal selia perdagangan dalam negeri, melindungi hak pengguna, mengurus kawalan harga, dan menangani isu kos sara hidup.',
  },

  // ---- Social Ministries ----
  {
    id: 'ministry-of-health',
    abbr_en: 'MOH',
    abbr_ms: 'KKM',
    name_en: 'Ministry of Health',
    name_ms: 'Kementerian Kesihatan',
    icon: 'Heart',
    emoji: '❤️',
    color: '#ef4444',
    category: 'social',
    dataGovSource: true,
    website: 'https://www.moh.gov.my',
    description_en: 'Responsible for public health services, disease prevention, healthcare facilities, and national health policy and regulation.',
    description_ms: 'Bertanggungjawab terhadap perkhidmatan kesihatan awam, pencegahan penyakit, kemudahan kesihatan, serta dasar dan peraturan kesihatan negara.',
  },
  {
    id: 'ministry-of-education',
    abbr_en: 'MOE',
    abbr_ms: 'KPM',
    name_en: 'Ministry of Education',
    name_ms: 'Kementerian Pendidikan',
    icon: 'GraduationCap',
    emoji: '🎓',
    color: '#2563eb',
    category: 'social',
    dataGovSource: true,
    website: 'https://www.moe.gov.my',
    description_en: 'Manages primary and secondary education, curriculum development, teacher training, and national education policy.',
    description_ms: 'Mengurus pendidikan rendah dan menengah, pembangunan kurikulum, latihan guru, dan dasar pendidikan kebangsaan.',
  },
  {
    id: 'ministry-of-higher-education',
    abbr_en: 'MOHE',
    abbr_ms: 'KPT',
    name_en: 'Ministry of Higher Education',
    name_ms: 'Kementerian Pengajian Tinggi',
    icon: 'BookOpen',
    emoji: '📚',
    color: '#4f46e5',
    category: 'social',
    dataGovSource: true,
    website: 'https://www.mohe.gov.my',
    description_en: 'Oversees universities, polytechnics, community colleges, and higher education quality assurance and research policy.',
    description_ms: 'Mengawasi universiti, politeknik, kolej komuniti, dan jaminan kualiti pengajian tinggi serta dasar penyelidikan.',
  },
  {
    id: 'ministry-of-human-resources',
    abbr_en: 'KESUMA',
    abbr_ms: 'KSM',
    name_en: 'Ministry of Human Resources',
    name_ms: 'Kementerian Sumber Manusia',
    icon: 'Users',
    emoji: '👥',
    color: '#a855f7',
    category: 'social',
    dataGovSource: true,
    website: 'https://www.mohr.gov.my',
    description_en: 'Manages labour policy, occupational safety, skills training, and workforce development for a productive labour market.',
    description_ms: 'Mengurus dasar buruh, keselamatan pekerjaan, latihan kemahiran, dan pembangunan tenaga kerja untuk pasaran buruh yang produktif.',
  },
  {
    id: 'ministry-of-women-family-and-community-development',
    abbr_en: 'KPWKM',
    abbr_ms: 'KPWKM',
    name_en: 'Ministry of Women, Family and Community Development',
    name_ms: 'Kementerian Pembangunan Wanita, Keluarga dan Masyarakat',
    icon: 'Baby',
    emoji: '👶',
    color: '#ec4899',
    category: 'social',
    dataGovSource: true,
    website: 'https://www.kpwkm.gov.my',
    description_en: "Champions women's rights, family welfare, child protection, and community development for social inclusivity.",
    description_ms: 'Mempertahankan hak wanita, kebajikan keluarga, perlindungan kanak-kanak, dan pembangunan masyarakat untuk inklusiviti sosial.',
  },
  {
    id: 'ministry-of-youth-and-sports',
    abbr_en: 'KBS',
    abbr_ms: 'KBS',
    name_en: 'Ministry of Youth and Sports',
    name_ms: 'Kementerian Belia dan Sukan',
    icon: 'Dumbbell',
    emoji: '🏋️',
    color: '#14b8a6',
    category: 'social',
    dataGovSource: true,
    website: 'https://www.kbs.gov.my',
    description_en: 'Develops youth potential, promotes sports excellence, and fosters healthy lifestyles and community engagement.',
    description_ms: 'Membangunkan potensi belia, mempromosikan kecemerlangan sukan, dan memupuk gaya hidup sihat serta penyertaan masyarakat.',
  },
  {
    id: 'ministry-of-national-unity',
    abbr_en: 'KPN',
    abbr_ms: 'KPerpaduan',
    name_en: 'Ministry of National Unity',
    name_ms: 'Kementerian Perpaduan Negara',
    icon: 'Handshake',
    emoji: '🤝',
    color: '#d97706',
    category: 'social',
    dataGovSource: false,
    website: 'https://www.perpaduan.gov.my',
    description_en: 'Promotes national unity, racial harmony, and social cohesion through community programmes and integration initiatives.',
    description_ms: 'Mempromosikan perpaduan negara, keharmonian kaum, dan kohesi sosial melalui program komuniti dan inisiatif integrasi.',
  },
  {
    id: 'ministry-of-religious-affairs',
    abbr_en: 'JPM-AGAMA',
    abbr_ms: 'JPM-Agama',
    name_en: 'Ministry of Religious Affairs',
    name_ms: 'Kementerian Hal Ehwal Agama',
    icon: 'Moon',
    emoji: '🌙',
    color: '#059669',
    category: 'social',
    dataGovSource: true,
    website: 'https://www.islam.gov.my',
    description_en: "Manages Islamic affairs under the Prime Minister's Department, including zakat, hajj, and Islamic judicial administration.",
    description_ms: 'Mengurus hal ehwal Islam di bawah Jabatan Perdana Menteri, termasuk zakat, haji, dan pentadbiran kehakiman Islam.',
  },

  // ---- Infrastructure Ministries ----
  {
    id: 'ministry-of-transport',
    abbr_en: 'MOT',
    abbr_ms: 'KPengangkutan',
    name_en: 'Ministry of Transport',
    name_ms: 'Kementerian Pengangkutan',
    icon: 'TrainFront',
    emoji: '🚄',
    color: '#64748b',
    category: 'infrastructure',
    dataGovSource: true,
    website: 'https://www.mot.gov.my',
    description_en: 'Oversees land, maritime, and air transportation including rail, ports, airports, and road transport regulation.',
    description_ms: 'Mengawasi pengangkutan darat, maritim, dan udara termasuk kereta api, pelabuhan, lapangan terbang, dan peraturan pengangkutan jalan.',
  },
  {
    id: 'ministry-of-works',
    abbr_en: 'KKR',
    abbr_ms: 'KKR',
    name_en: 'Ministry of Works',
    name_ms: 'Kementerian Kerja Raya',
    icon: 'HardHat',
    emoji: '🏗️',
    color: '#78716c',
    category: 'infrastructure',
    dataGovSource: true,
    website: 'https://www.kkr.gov.my',
    description_en: 'Responsible for public works, road infrastructure, building construction, and engineering standards for national development.',
    description_ms: 'Bertanggungjawab terhadap kerja raya awam, infrastruktur jalan, pembinaan bangunan, dan standard kejuruteraan untuk pembangunan negara.',
  },
  {
    id: 'ministry-of-housing-and-local-government',
    abbr_en: 'KPKT',
    abbr_ms: 'KPKT',
    name_en: 'Ministry of Housing and Local Government',
    name_ms: 'Kementerian Perumahan dan Kerajaan Tempatan',
    icon: 'Building2',
    emoji: '🏢',
    color: '#7c3aed',
    category: 'infrastructure',
    dataGovSource: true,
    website: 'https://www.kpkt.gov.my',
    description_en: 'Manages housing policy, local government oversight, fire services, and urban planning and development.',
    description_ms: 'Mengurus dasar perumahan, pengawasan kerajaan tempatan, perkhidmatan bomba, dan perancangan serta pembangunan bandar.',
  },
  {
    id: 'ministry-of-rural-and-regional-development',
    abbr_en: 'KKDW',
    abbr_ms: 'KPLB',
    name_en: 'Ministry of Rural and Regional Development',
    name_ms: 'Kementerian Kemajuan Desa dan Wilayah',
    icon: 'Mountain',
    emoji: '⛰️',
    color: '#92400e',
    category: 'infrastructure',
    dataGovSource: true,
    website: 'https://www.kkdw.gov.my',
    description_en: 'Develops rural infrastructure, bridges the urban-rural divide, and empowers regional economies and Bumiputera communities.',
    description_ms: 'Membangunkan infrastruktur luar bandar, merapatkan jurang bandar-luar bandar, dan memperkasa ekonomi wilayah serta komuniti Bumiputera.',
  },
  {
    id: 'ministry-of-communications',
    abbr_en: 'KK',
    abbr_ms: 'KKomunikasi',
    name_en: 'Ministry of Communications',
    name_ms: 'Kementerian Komunikasi',
    icon: 'Radio',
    emoji: '📡',
    color: '#0284c7',
    category: 'infrastructure',
    dataGovSource: true,
    website: 'https://www.kk.gov.my',
    description_en: 'Manages broadcasting, telecommunications, postal services, and personal data protection and media regulation.',
    description_ms: 'Mengurus penyiaran, telekomunikasi, perkhidmatan pos, dan perlindungan data peribadi serta peraturan media.',
  },
  {
    id: 'ministry-of-energy-transition-and-water-transformation',
    abbr_en: 'PETRA',
    abbr_ms: 'KPETRA',
    name_en: 'Ministry of Energy Transition and Water Transformation',
    name_ms: 'Kementerian Peralihan Tenaga dan Transformasi Air',
    icon: 'Zap',
    emoji: '⚡',
    color: '#eab308',
    category: 'infrastructure',
    dataGovSource: true,
    website: 'https://www.petra.gov.my',
    description_en: 'Drives energy transition to renewables, manages water resources and supply, and oversees the power sector transformation.',
    description_ms: 'Memacu peralihan tenaga ke sumber boleh diperbaharui, mengurus sumber dan bekalan air, serta mengawasi transformasi sektor tenaga.',
  },

  // ---- Security/Justice ----
  {
    id: 'ministry-of-law-and-institutional-reform',
    abbr_en: 'KPK',
    abbr_ms: 'KUndang2',
    name_en: 'Ministry of Law and Institutional Reform',
    name_ms: 'Kementerian Undang-Undang dan Pembaharuan Institusi',
    icon: 'Scale',
    emoji: '⚖️',
    color: '#1e3a5f',
    category: 'security',
    dataGovSource: true,
    website: 'https://www.mol.gov.my',
    description_en: 'Oversees legal affairs, legislative drafting, institutional reforms, and governance improvement for rule of law.',
    description_ms: 'Mengawasi hal ehwal undang-undang, penggubalan perundangan, pembaharuan institusi, dan peningkatan tadbir urus untuk kedaulatan undang-undang.',
  },
  {
    id: 'attorney-generals-chambers',
    abbr_en: 'AGC',
    abbr_ms: 'JPN-AG',
    name_en: "Attorney General's Chambers",
    name_ms: 'Jabatan Peguam Negara',
    icon: 'Gavel',
    emoji: '🔨',
    color: '#475569',
    category: 'security',
    dataGovSource: true,
    website: 'https://www.agc.gov.my',
    description_en: "Provides legal advice to the government, drafts legislation, and represents the state in legal proceedings under the PM's Department.",
    description_ms: 'Memberi nasihat undang-undang kepada kerajaan, menggubal perundangan, dan mewakili negeri dalam prosiding undang-undang di bawah JPM.',
  },
];


// ============================================================================
// ICON SET INTERFACE & DATA
// ============================================================================

export interface IconSetItem {
  icon: string;
  label_en: string;
  label_ms: string;
  color: string;
}

export interface IconSet {
  id: string;
  name_en: string;
  name_ms: string;
  description_en: string;
  description_ms: string;
  icons: IconSetItem[];
}

export const ICON_SETS: IconSet[] = [
  // ---- 1. Data Categories ----
  {
    id: 'data-categories',
    name_en: 'Data Categories',
    name_ms: 'Kategori Data',
    description_en: 'Icons representing the 18 data categories available on data.gov.my',
    description_ms: 'Ikon mewakili 18 kategori data yang tersedia di data.gov.my',
    icons: [
      { icon: 'Users', label_en: 'Demography', label_ms: 'Demografi', color: '#06b6d4' },
      { icon: 'TrendingUp', label_en: 'National Accounts', label_ms: 'Akaun Negara', color: '#f59e0b' },
      { icon: 'Tag', label_en: 'Prices', label_ms: 'Harga', color: '#ef4444' },
      { icon: 'Briefcase', label_en: 'Labour Markets', label_ms: 'Pasaran Buruh', color: '#8b5cf6' },
      { icon: 'Landmark', label_en: 'Financial Markets', label_ms: 'Pasaran Kewangan', color: '#10b981' },
      { icon: 'Factory', label_en: 'Economic Sectors', label_ms: 'Sektor Ekonomi', color: '#f97316' },
      { icon: 'Heart', label_en: 'Healthcare', label_ms: 'Kesihatan', color: '#ec4899' },
      { icon: 'Leaf', label_en: 'Environment', label_ms: 'Alam Sekitar', color: '#22c55e' },
      { icon: 'GraduationCap', label_en: 'Education', label_ms: 'Pendidikan', color: '#3b82f6' },
      { icon: 'TrainFront', label_en: 'Transportation', label_ms: 'Pengangkutan', color: '#64748b' },
      { icon: 'Home', label_en: 'Households', label_ms: 'Isi Rumah', color: '#a855f7' },
      { icon: 'Radio', label_en: 'Communications', label_ms: 'Komunikasi', color: '#0ea5e9' },
      { icon: 'Shield', label_en: 'Public Safety', label_ms: 'Keselamatan Awam', color: '#dc2626' },
      { icon: 'Building2', label_en: 'Public Administration', label_ms: 'Pentadbiran Awam', color: '#6366f1' },
      { icon: 'Baby', label_en: 'Public Welfare', label_ms: 'Kebajikan Awam', color: '#d946ef' },
      { icon: 'BarChart3', label_en: 'Statistical Indicators', label_ms: 'Penunjuk Statistik', color: '#14b8a6' },
      { icon: 'BookOpen', label_en: 'Data Dictionaries', label_ms: 'Kamus Data', color: '#78716c' },
      { icon: 'Database', label_en: 'Metadata', label_ms: 'Metadata', color: '#525252' },
    ],
  },

  // ---- 2. Economic Indicators ----
  {
    id: 'economic-indicators',
    name_en: 'Economic Indicators',
    name_ms: 'Penunjuk Ekonomi',
    description_en: 'Key economic indicators tracked across Malaysia datasets',
    description_ms: 'Penunjuk ekonomi utama yang dijejaki merentasi set data Malaysia',
    icons: [
      { icon: 'TrendingUp', label_en: 'GDP', label_ms: 'KDNK', color: '#f59e0b' },
      { icon: 'TrendingDown', label_en: 'Inflation', label_ms: 'Inflasi', color: '#ef4444' },
      { icon: 'Users', label_en: 'Unemployment', label_ms: 'Pengangguran', color: '#8b5cf6' },
      { icon: 'ArrowLeftRight', label_en: 'Trade Balance', label_ms: 'Imbangan Perdagangan', color: '#10b981' },
      { icon: 'Banknote', label_en: 'FDI', label_ms: 'FDI', color: '#0ea5e9' },
      { icon: 'DollarSign', label_en: 'Exchange Rate', label_ms: 'Kadar Pertukaran', color: '#06b6d4' },
      { icon: 'Percent', label_en: 'Interest Rate', label_ms: 'Kadar Faedah', color: '#f97316' },
      { icon: 'Wallet', label_en: 'Government Revenue', label_ms: 'Hasil Kerajaan', color: '#22c55e' },
      { icon: 'CreditCard', label_en: 'Government Debt', label_ms: 'Hutang Kerajaan', color: '#dc2626' },
      { icon: 'Factory', label_en: 'Industrial Production', label_ms: 'Pengeluaran Perindustrian', color: '#64748b' },
      { icon: 'ShoppingCart', label_en: 'Retail Sales', label_ms: 'Jualan Runcit', color: '#eab308' },
      { icon: 'Home', label_en: 'House Prices', label_ms: 'Harga Rumah', color: '#a855f7' },
      { icon: 'Ship', label_en: 'Exports', label_ms: 'Eksport', color: '#0284c7' },
      { icon: 'Plane', label_en: 'Imports', label_ms: 'Import', color: '#7c3aed' },
      { icon: 'PiggyBank', label_en: 'Savings Rate', label_ms: 'Kadar Simpanan', color: '#14b8a6' },
      { icon: 'Receipt', label_en: 'CPI', label_ms: 'IHP', color: '#e11d48' },
      { icon: 'CircleDollarSign', label_en: 'PPI', label_ms: 'IHPH', color: '#78716c' },
      { icon: 'Landmark', label_en: 'Monetary Aggregates', label_ms: 'Agregat Kewangan', color: '#1e40af' },
    ],
  },

  // ---- 3. Social Indicators ----
  {
    id: 'social-indicators',
    name_en: 'Social Indicators',
    name_ms: 'Penunjuk Sosial',
    description_en: 'Key social and demographic indicators for Malaysia',
    description_ms: 'Penunjuk sosial dan demografi utama untuk Malaysia',
    icons: [
      { icon: 'Users', label_en: 'Population', label_ms: 'Penduduk', color: '#06b6d4' },
      { icon: 'Baby', label_en: 'Births', label_ms: 'Kelahiran', color: '#ec4899' },
      { icon: 'Heart', label_en: 'Deaths', label_ms: 'Kematian', color: '#ef4444' },
      { icon: 'TrendingUp', label_en: 'Life Expectancy', label_ms: 'Jangka Hayat', color: '#10b981' },
      { icon: 'GraduationCap', label_en: 'Education Level', label_ms: 'Tahap Pendidikan', color: '#3b82f6' },
      { icon: 'Stethoscope', label_en: 'Health Status', label_ms: 'Status Kesihatan', color: '#f97316' },
      { icon: 'Wallet', label_en: 'Poverty Rate', label_ms: 'Kadar Kemiskinan', color: '#dc2626' },
      { icon: 'Home', label_en: 'Household Income', label_ms: 'Pendapatan Isi Rumah', color: '#8b5cf6' },
      { icon: 'Users', label_en: 'Migration', label_ms: 'Penghijrahan', color: '#0ea5e9' },
      { icon: 'BookOpen', label_en: 'Literacy Rate', label_ms: 'Kadar Celik Huruf', color: '#14b8a6' },
      { icon: 'Bed', label_en: 'Hospital Beds', label_ms: 'Katil Hospital', color: '#a855f7' },
      { icon: 'Pill', label_en: 'Immunisation', label_ms: 'Imunisasi', color: '#22c55e' },
      { icon: 'Scale', label_en: 'Gini Coefficient', label_ms: 'Pekali Gini', color: '#eab308' },
      { icon: 'Dumbbell', label_en: 'Sports Participation', label_ms: 'Penyertaan Sukan', color: '#64748b' },
      { icon: 'Handshake', label_en: 'Social Cohesion', label_ms: 'Kohesi Sosial', color: '#d97706' },
    ],
  },

  // ---- 4. Infrastructure ----
  {
    id: 'infrastructure',
    name_en: 'Infrastructure',
    name_ms: 'Infrastruktur',
    description_en: 'Infrastructure sectors and facilities tracked in national datasets',
    description_ms: 'Sektor dan kemudahan infrastruktur yang dijejaki dalam set data kebangsaan',
    icons: [
      { icon: 'TrainFront', label_en: 'Rail Transport', label_ms: 'Pengangkutan Rel', color: '#64748b' },
      { icon: 'Car', label_en: 'Road Transport', label_ms: 'Pengangkutan Jalan', color: '#0ea5e9' },
      { icon: 'Plane', label_en: 'Aviation', label_ms: 'Penerbangan', color: '#3b82f6' },
      { icon: 'Ship', label_en: 'Maritime', label_ms: 'Maritim', color: '#0284c7' },
      { icon: 'Bus', label_en: 'Public Transit', label_ms: 'Transit Awam', color: '#10b981' },
      { icon: 'Zap', label_en: 'Energy', label_ms: 'Tenaga', color: '#eab308' },
      { icon: 'Plug', label_en: 'Electricity', label_ms: 'Elektrik', color: '#f59e0b' },
      { icon: 'Droplets', label_en: 'Water Supply', label_ms: 'Bekalan Air', color: '#06b6d4' },
      { icon: 'Wifi', label_en: 'Telecommunications', label_ms: 'Telekomunikasi', color: '#8b5cf6' },
      { icon: 'Smartphone', label_en: 'Broadband', label_ms: 'Jalur Lebar', color: '#a855f7' },
      { icon: 'Building2', label_en: 'Housing', label_ms: 'Perumahan', color: '#7c3aed' },
      { icon: 'HardHat', label_en: 'Construction', label_ms: 'Pembinaan', color: '#78716c' },
      { icon: 'Mountain', label_en: 'Rural Roads', label_ms: 'Jalan Luar Bandar', color: '#92400e' },
      { icon: 'Landmark', label_en: 'Bridges', label_ms: 'Jambatan', color: '#64748b' },
      { icon: 'Fuel', label_en: 'Fuel Supply', label_ms: 'Bekalan Bahan Api', color: '#f97316' },
    ],
  },

  // ---- 5. Government Agencies ----
  {
    id: 'government-agencies',
    name_en: 'Government Agencies',
    name_ms: 'Agensi Kerajaan',
    description_en: 'Key government agencies that provide data to the national open data portal',
    description_ms: 'Agensi kerajaan utama yang menyediakan data ke portal data terbuka kebangsaan',
    icons: [
      { icon: 'BarChart3', label_en: 'DOSM', label_ms: 'JPM', color: '#06b6d4' },
      { icon: 'Landmark', label_en: 'BNM', label_ms: 'BNM', color: '#f59e0b' },
      { icon: 'FileText', label_en: 'JPN', label_ms: 'JPN', color: '#ef4444' },
      { icon: 'Database', label_en: 'JDN', label_ms: 'JDN', color: '#8b5cf6' },
      { icon: 'Heart', label_en: 'KKM', label_ms: 'KKM', color: '#ec4899' },
      { icon: 'TrainFront', label_en: 'MOT', label_ms: 'KPengangkutan', color: '#64748b' },
      { icon: 'Cpu', label_en: 'KD', label_ms: 'KDigital', color: '#10b981' },
      { icon: 'Scroll', label_en: 'JDN', label_ms: 'JDN', color: '#6366f1' },
      { icon: 'Shield', label_en: 'PDRM', label_ms: 'PDRM', color: '#1e40af' },
      { icon: 'Swords', label_en: 'ATM', label_ms: 'ATM', color: '#374151' },
      { icon: 'Gavel', label_en: 'AGC', label_ms: 'Jabatan Peguam Negara', color: '#475569' },
      { icon: 'Banknote', label_en: 'MOF', label_ms: 'KKB', color: '#f59e0b' },
      { icon: 'GraduationCap', label_en: 'MOE', label_ms: 'KPM', color: '#3b82f6' },
      { icon: 'BookOpen', label_en: 'MOHE', label_ms: 'KPT', color: '#4f46e5' },
      { icon: 'Users', label_en: 'KESUMA', label_ms: 'KSM', color: '#a855f7' },
      { icon: 'Leaf', label_en: 'NRES', label_ms: 'KNRES', color: '#22c55e' },
      { icon: 'Wheat', label_en: 'KPKM', label_ms: 'KPKM', color: '#84cc16' },
      { icon: 'Factory', label_en: 'MITI', label_ms: 'KPUD', color: '#f97316' },
      { icon: 'Activity', label_en: 'JANM', label_ms: 'JANM', color: '#0ea5e9' },
      { icon: 'Scale', label_en: 'BPK', label_ms: 'BPK', color: '#78716c' },
    ],
  },

  // ---- 6. Malaysian States ----
  {
    id: 'malaysian-states',
    name_en: 'Malaysian States & Federal Territories',
    name_ms: 'Negeri & Wilayah Persekutuan Malaysia',
    description_en: 'All 13 states and 3 federal territories of Malaysia with abbreviations and colors',
    description_ms: 'Semua 13 negeri dan 3 wilayah persekutuan Malaysia dengan singkatan dan warna',
    icons: [
      { icon: 'MapPin', label_en: 'Johor (JHR)', label_ms: 'Johor (JHR)', color: '#dc2626' },
      { icon: 'MapPin', label_en: 'Kedah (KDH)', label_ms: 'Kedah (KDH)', color: '#16a34a' },
      { icon: 'MapPin', label_en: 'Kelantan (KTN)', label_ms: 'Kelantan (KTN)', color: '#eab308' },
      { icon: 'MapPin', label_en: 'Melaka (MLK)', label_ms: 'Melaka (MLK)', color: '#2563eb' },
      { icon: 'MapPin', label_en: 'Negeri Sembilan (NSN)', label_ms: 'Negeri Sembilan (NSN)', color: '#9333ea' },
      { icon: 'MapPin', label_en: 'Pahang (PHG)', label_ms: 'Pahang (PHG)', color: '#059669' },
      { icon: 'MapPin', label_en: 'Perak (PRK)', label_ms: 'Perak (PRK)', color: '#ca8a04' },
      { icon: 'MapPin', label_en: 'Perlis (PLS)', label_ms: 'Perlis (PLS)', color: '#e11d48' },
      { icon: 'MapPin', label_en: 'Pulau Pinang (PNG)', label_ms: 'Pulau Pinang (PNG)', color: '#0ea5e9' },
      { icon: 'MapPin', label_en: 'Sabah (SBH)', label_ms: 'Sabah (SBH)', color: '#f97316' },
      { icon: 'MapPin', label_en: 'Sarawak (SRK)', label_ms: 'Sarawak (SRK)', color: '#dc2626' },
      { icon: 'MapPin', label_en: 'Selangor (SGR)', label_ms: 'Selangor (SGR)', color: '#e11d48' },
      { icon: 'MapPin', label_en: 'Terengganu (TRG)', label_ms: 'Terengganu (TRG)', color: '#059669' },
      { icon: 'Flag', label_en: 'W.P. Kuala Lumpur (KUL)', label_ms: 'W.P. Kuala Lumpur (KUL)', color: '#3b82f6' },
      { icon: 'Flag', label_en: 'W.P. Labuan (LBN)', label_ms: 'W.P. Labuan (LBN)', color: '#8b5cf6' },
      { icon: 'Flag', label_en: 'W.P. Putrajaya (PJY)', label_ms: 'W.P. Putrajaya (PJY)', color: '#6366f1' },
    ],
  },
];


// ============================================================================
// HELPER LOOKUPS
// ============================================================================

/** Lookup a ministry by its English abbreviation */
export function getMinistryByAbbr(abbr: string): Ministry | undefined {
  return MINISTRIES.find(m => m.abbr_en === abbr);
}

/** Lookup a ministry by its ID */
export function getMinistryById(id: string): Ministry | undefined {
  return MINISTRIES.find(m => m.id === id);
}

/** Get all ministries in a given category */
export function getMinistriesByCategory(category: Ministry['category']): Ministry[] {
  return MINISTRIES.filter(m => m.category === category);
}

/** Get all ministries that provide data to data.gov.my */
export function getDataGovMinistries(): Ministry[] {
  return MINISTRIES.filter(m => m.dataGovSource);
}

/** Get an icon set by its ID */
export function getIconSetById(id: string): IconSet | undefined {
  return ICON_SETS.find(s => s.id === id);
}

/** Ministry category display names */
export const MINISTRY_CATEGORY_LABELS: Record<Ministry['category'], { en: string; ms: string; color: string }> = {
  core: { en: 'Core Government', ms: 'Teras Kerajaan', color: '#dc2626' },
  economic: { en: 'Economic', ms: 'Ekonomi', color: '#f59e0b' },
  social: { en: 'Social', ms: 'Sosial', color: '#ec4899' },
  security: { en: 'Security & Justice', ms: 'Keselamatan & Kehakiman', color: '#374151' },
  infrastructure: { en: 'Infrastructure', ms: 'Infrastruktur', color: '#64748b' },
};
