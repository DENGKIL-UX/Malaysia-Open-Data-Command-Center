// Satori-compatible infographic template — Overview layout
// CRITICAL: Satori requires every <div> with multiple children to have explicit
// display: "flex" | "contents" | "none". No default block layout is supported.

import React from 'react';
import { DESIGN_TOKENS, cardBackground, borderAccent, formatHeroNumber } from '../styles';
import type { StateData } from '@/lib/data/malaysia-data';

export interface InfographicData {
  lang: 'en' | 'ms';
  selectedLayers: string[];
  format: '16:9' | '9:16';
  states: StateData[];
  totals: {
    population: number;
    gdp: number;
    gdpGrowth: number;
    births: number;
    deaths: number;
    unemployment: number;
    datasets: number;
  };
  sources: Array<{ abbr: string; full_en: string; full_ms: string }>;
  dateRange: { minBegin: number; maxEnd: number };
}

const T = {
  en: {
    title: 'MALAYSIA OPEN DATA COMMAND CENTER',
    subtitle: 'National Data Infographic',
    population: 'Population',
    gdp: 'GDP',
    datasets: 'Datasets',
    populationByState: 'POPULATION BY STATE',
    gdpByState: 'GDP BY STATE',
    vitalStats: 'VITAL STATISTICS',
    births: 'Live Births',
    deaths: 'Deaths',
    unemployment: 'Unemployment',
    healthcare: 'HEALTHCARE',
    environment: 'ENVIRONMENT',
    education: 'EDUCATION',
    healthcareDesc: 'Healthcare data covers infant immunisation, blood donations, hospital beds, and healthcare staffing from KKM.',
    environmentDesc: 'Environmental data covers air pollution, water access, electricity consumption, and forest reserves from DOSM and NRES.',
    educationDesc: 'Education data covers school enrolment, teachers, university lecturers, and school completion rates from KPM.',
    dataSources: 'DATA SOURCES & DATE RANGES',
    source: 'data.gov.my',
    cc: 'CC BY 4.0',
    disclaimer: 'Data sourced from data.gov.my open data. Values may be estimates subject to revision.',
  },
  ms: {
    title: 'PUSAT PERINTAH DATA TERBUKA MALAYSIA',
    subtitle: 'Infografik Data Nasional',
    population: 'Penduduk',
    gdp: 'KDNK',
    datasets: 'Set Data',
    populationByState: 'PENDUDUK MENGIKUT NEGERI',
    gdpByState: 'KDNK MENGIKUT NEGERI',
    vitalStats: 'STATISTIK VITAL',
    births: 'Kelahiran',
    deaths: 'Kematian',
    unemployment: 'Pengangguran',
    healthcare: 'KESIHATAN',
    environment: 'ALAM SEKITAR',
    education: 'PENDIDIKAN',
    healthcareDesc: 'Data penjagaan kesihatan merangkumi imunisasi bayi, penenderaan darah, katil hospital, dan kakitangan kesihatan dari KKM.',
    environmentDesc: 'Data alam sekitar merangkumi pencemaran udara, akses air, penggunaan elektrik, dan rizab hutan dari DOSM dan NRES.',
    educationDesc: 'Data pendidikan merangkumi pendaftaran sekolah, guru, pensyarah universiti, dan kadar tamat sekolah dari KPM.',
    dataSources: 'SUMBER DATA & JULAT TARIKH',
    source: 'data.gov.my',
    cc: 'CC BY 4.0',
    disclaimer: 'Data diperoleh daripada data.gov.my. Nilai mungkin anggaran tertakluk kepada semakan.',
  },
};

// ─── Reusable Satori-safe components ────────────────────────────────

function SectionCard({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: 12,
      borderRadius: 6,
      border: `1px solid ${color ? borderAccent(color, 0.12) : DESIGN_TOKENS.border.subtle}`,
      background: color ? cardBackground(color, 0.04) : DESIGN_TOKENS.bg.card,
      gap: 6,
    },
  }, children);
}

function SectionLabel({ icon, title, color }: { icon: string; title: string; color: string }) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
  },
    React.createElement('span', { style: { fontSize: 12 } }, icon),
    React.createElement('span', {
      style: {
        fontSize: 10,
        fontWeight: 700,
        fontFamily: DESIGN_TOKENS.font.mono,
        color: color,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
      },
    }, title),
  );
}

function KpiCard({ value, label, color }: { value: string; label: string; color: string }) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 8px',
      borderRadius: 6,
      background: cardBackground(color, 0.05),
      border: `1px solid ${borderAccent(color, 0.15)}`,
      flex: 1,
    },
  },
    React.createElement('div', {
      style: {
        fontSize: 28,
        fontWeight: 800,
        fontFamily: DESIGN_TOKENS.font.mono,
        color: color,
        letterSpacing: '-0.02em',
      },
    }, value),
    React.createElement('div', {
      style: {
        fontSize: 10,
        fontFamily: DESIGN_TOKENS.font.mono,
        color: DESIGN_TOKENS.text.secondary,
        marginTop: 2,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
      },
    }, label),
  );
}

function StateRow({ abbr, value, color }: { abbr: string; value: string; color: string }) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: 4,
      background: cardBackground(color, 0.03),
      border: `1px solid ${borderAccent(color, 0.08)}`,
    },
  },
    React.createElement('span', {
      style: { fontSize: 9, fontFamily: DESIGN_TOKENS.font.mono, color: DESIGN_TOKENS.text.secondary },
    }, abbr),
    React.createElement('span', {
      style: { fontSize: 11, fontWeight: 700, fontFamily: DESIGN_TOKENS.font.mono, color: '#E2E8F0' },
    }, value),
  );
}

function StateGrid({ states, color, valueFn }: {
  states: StateData[];
  color: string;
  valueFn: (s: StateData) => string;
}) {
  return React.createElement('div', {
    style: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  },
    ...states.map(s =>
      React.createElement(StateRow, { key: s.id, abbr: s.abbr, value: valueFn(s), color })
    )
  );
}

function DescriptionBlock({ text, color }: { text: string; color: string }) {
  return React.createElement('div', {
    style: {
      fontSize: 9,
      fontFamily: DESIGN_TOKENS.font.body,
      color: DESIGN_TOKENS.text.secondary,
      lineHeight: 1.5,
      padding: '4px 8px',
      background: cardBackground(color, 0.03),
      borderRadius: 4,
      border: `1px solid ${borderAccent(color, 0.08)}`,
    },
  }, text);
}

function SourceBadge({ label, color }: { label: string; color: string }) {
  return React.createElement('div', {
    style: {
      padding: '3px 8px',
      borderRadius: 4,
      border: `1px solid ${DESIGN_TOKENS.border.light}`,
      background: cardBackground(color, 0.05),
      fontSize: 8,
      fontFamily: DESIGN_TOKENS.font.mono,
      color: color,
      fontWeight: 600,
    },
  }, label);
}

// ─── Build content sections ─────────────────────────────────────────

function buildLayerSections(data: InfographicData) {
  const t = T[data.lang];
  const popStates = [...data.states].sort((a, b) => b.population - a.population).slice(0, 8);
  const gdpStates = [...data.states].sort((a, b) => b.gdp - a.gdp).slice(0, 8);
  const sections: React.ReactNode[] = [];

  if (data.selectedLayers.includes('population')) {
    sections.push(
      React.createElement(SectionCard, { key: 'pop', color: '#06b6d4' },
        React.createElement(SectionLabel, { icon: '🧑', title: t.populationByState, color: '#06b6d4' }),
        React.createElement(StateGrid, { states: popStates, color: '#06b6d4', valueFn: s => `${(s.population / 1000).toFixed(1)}M` }),
      )
    );
  }

  if (data.selectedLayers.includes('gdp')) {
    sections.push(
      React.createElement(SectionCard, { key: 'gdp', color: '#f59e0b' },
        React.createElement(SectionLabel, { icon: '💰', title: t.gdpByState, color: '#f59e0b' }),
        React.createElement(StateGrid, { states: gdpStates, color: '#f59e0b', valueFn: s => `RM${(s.gdp / 1000).toFixed(1)}B` }),
      )
    );
  }

  if (data.selectedLayers.includes('demography')) {
    sections.push(
      React.createElement(SectionCard, { key: 'demo', color: '#10b981' },
        React.createElement(SectionLabel, { icon: '📊', title: t.vitalStats, color: '#10b981' }),
        React.createElement('div', { style: { display: 'flex', gap: 10 } },
          React.createElement(KpiCard, { value: `${data.totals.births}K`, label: t.births, color: '#10b981' }),
          React.createElement(KpiCard, { value: `${data.totals.deaths}K`, label: t.deaths, color: '#ef4444' }),
          React.createElement(KpiCard, { value: `${data.totals.unemployment}%`, label: t.unemployment, color: '#8b5cf6' }),
        ),
      )
    );
  }

  if (data.selectedLayers.includes('healthcare')) {
    sections.push(
      React.createElement(SectionCard, { key: 'health', color: '#ec4899' },
        React.createElement(SectionLabel, { icon: '❤️', title: t.healthcare, color: '#ec4899' }),
        React.createElement(DescriptionBlock, { text: t.healthcareDesc, color: '#ec4899' }),
      )
    );
  }

  if (data.selectedLayers.includes('environment')) {
    sections.push(
      React.createElement(SectionCard, { key: 'env', color: '#22c55e' },
        React.createElement(SectionLabel, { icon: '🌿', title: t.environment, color: '#22c55e' }),
        React.createElement(DescriptionBlock, { text: t.environmentDesc, color: '#22c55e' }),
      )
    );
  }

  if (data.selectedLayers.includes('education')) {
    sections.push(
      React.createElement(SectionCard, { key: 'edu', color: '#3b82f6' },
        React.createElement(SectionLabel, { icon: '🎓', title: t.education, color: '#3b82f6' }),
        React.createElement(DescriptionBlock, { text: t.educationDesc, color: '#3b82f6' }),
      )
    );
  }

  return sections;
}

// ─── 16:9 Landscape Template ────────────────────────────────────────

export function OverviewTemplate16x9({ data }: { data: InfographicData }) {
  const t = T[data.lang];
  const layerSections = buildLayerSections(data);

  // Split sections into left and right columns
  const midPoint = Math.ceil(layerSections.length / 2);
  const leftSections = layerSections.slice(0, midPoint);
  const rightSections = layerSections.slice(midPoint);

  return React.createElement('div', {
    style: {
      width: 1920,
      height: 1080,
      background: DESIGN_TOKENS.bg.primary,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: DESIGN_TOKENS.font.body,
      color: DESIGN_TOKENS.text.primary,
      overflow: 'hidden',
    },
  },
    // ═══ HEADER ═══
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 16,
        marginBottom: 16,
        borderBottom: `1px solid ${DESIGN_TOKENS.border.light}`,
      },
    },
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
      },
        React.createElement('div', {
          style: {
            padding: '4px 16px',
            borderRadius: 6,
            border: '1px solid rgba(6,182,212,0.25)',
            background: 'rgba(6,182,212,0.06)',
            fontFamily: DESIGN_TOKENS.font.mono,
            fontWeight: 800,
            fontSize: 14,
            color: '#06b6d4',
            letterSpacing: '0.2em',
          },
        }, '🇲🇾 MALAYSIA'),
      ),
      React.createElement('div', {
        style: {
          fontSize: 9,
          fontFamily: DESIGN_TOKENS.font.mono,
          color: 'rgba(6,182,212,0.5)',
          letterSpacing: '0.3em',
          marginBottom: 2,
        },
      }, 'DATA.GOV.MY'),
      React.createElement('div', {
        style: {
          fontSize: 22,
          fontWeight: 800,
          fontFamily: DESIGN_TOKENS.font.display,
          color: '#06b6d4',
        },
      }, t.title),
      React.createElement('div', {
        style: {
          fontSize: 10,
          fontFamily: DESIGN_TOKENS.font.mono,
          color: DESIGN_TOKENS.text.secondary,
          marginTop: 2,
        },
      }, `${t.subtitle} — ${new Date().getFullYear()}`),
    ),

    // ═══ KPI ROW ═══
    React.createElement('div', {
      style: { display: 'flex', gap: 10, marginBottom: 16 },
    },
      React.createElement(KpiCard, {
        value: formatHeroNumber(data.totals.population, 'population'),
        label: t.population,
        color: '#06b6d4',
      }),
      React.createElement(KpiCard, {
        value: formatHeroNumber(data.totals.gdp, 'currency'),
        label: t.gdp,
        color: '#f59e0b',
      }),
      React.createElement(KpiCard, {
        value: `${data.totals.datasets}`,
        label: t.datasets,
        color: '#10b981',
      }),
    ),

    // ═══ TWO-COLUMN LAYOUT ═══
    React.createElement('div', {
      style: { display: 'flex', flex: 1, gap: 16 },
    },
      // Left column
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', flex: 1, gap: 10 },
      }, ...leftSections),

      // Right column
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', flex: 1, gap: 10 },
      },
        ...rightSections,
        // Data sources (always in right column bottom)
        React.createElement(SectionCard, { color: '#06b6d4' },
          React.createElement(SectionLabel, { icon: '🏛️', title: t.dataSources, color: '#06b6d4' }),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 4 } },
            ...data.sources.slice(0, 8).map(src =>
              React.createElement(SourceBadge, { key: src.abbr, label: src.abbr, color: '#06b6d4' })
            ),
            React.createElement(SourceBadge, { label: `${data.dateRange.minBegin}–${data.dateRange.maxEnd}`, color: '#06b6d4' }),
          ),
        ),
      ),
    ),

    // ═══ FOOTER ═══
    React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        marginTop: 12,
        borderTop: `1px solid ${DESIGN_TOKENS.border.subtle}`,
      },
    },
      React.createElement('div', {
        style: {
          fontSize: 7,
          fontFamily: DESIGN_TOKENS.font.mono,
          color: DESIGN_TOKENS.text.dim,
          maxWidth: '70%',
          lineHeight: 1.4,
        },
      }, t.disclaimer),
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: 8 },
      },
        React.createElement('span', {
          style: { fontSize: 7, fontFamily: DESIGN_TOKENS.font.mono, color: DESIGN_TOKENS.text.dim },
        }, t.source),
        React.createElement('span', {
          style: {
            fontSize: 7,
            fontFamily: DESIGN_TOKENS.font.mono,
            color: '#06b6d4',
            padding: '2px 6px',
            borderRadius: 3,
            border: '1px solid rgba(6,182,212,0.2)',
            background: 'rgba(6,182,212,0.05)',
          },
        }, t.cc),
      ),
    ),
  );
}

// ─── 9:16 Portrait Template ─────────────────────────────────────────

export function OverviewTemplate9x16({ data }: { data: InfographicData }) {
  const t = T[data.lang];
  const layerSections = buildLayerSections(data);

  return React.createElement('div', {
    style: {
      width: 1080,
      height: 1920,
      background: DESIGN_TOKENS.bg.primary,
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: DESIGN_TOKENS.font.body,
      color: DESIGN_TOKENS.text.primary,
      overflow: 'hidden',
    },
  },
    // ═══ HEADER ═══
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 14,
        marginBottom: 14,
        borderBottom: `1px solid ${DESIGN_TOKENS.border.light}`,
      },
    },
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
      },
        React.createElement('div', {
          style: {
            padding: '3px 12px',
            borderRadius: 6,
            border: '1px solid rgba(6,182,212,0.25)',
            background: 'rgba(6,182,212,0.06)',
            fontFamily: DESIGN_TOKENS.font.mono,
            fontWeight: 800,
            fontSize: 12,
            color: '#06b6d4',
            letterSpacing: '0.2em',
          },
        }, '🇲🇾 MALAYSIA'),
      ),
      React.createElement('div', {
        style: { fontSize: 8, fontFamily: DESIGN_TOKENS.font.mono, color: 'rgba(6,182,212,0.5)', letterSpacing: '0.3em', marginBottom: 2 },
      }, 'DATA.GOV.MY'),
      React.createElement('div', {
        style: { fontSize: 18, fontWeight: 800, fontFamily: DESIGN_TOKENS.font.display, color: '#06b6d4' },
      }, t.title),
      React.createElement('div', {
        style: { fontSize: 9, fontFamily: DESIGN_TOKENS.font.mono, color: DESIGN_TOKENS.text.secondary, marginTop: 2 },
      }, `${t.subtitle} — ${new Date().getFullYear()}`),
    ),

    // ═══ KPI ROW ═══
    React.createElement('div', {
      style: { display: 'flex', gap: 8, marginBottom: 14 },
    },
      React.createElement(KpiCard, { value: formatHeroNumber(data.totals.population, 'population'), label: t.population, color: '#06b6d4' }),
      React.createElement(KpiCard, { value: formatHeroNumber(data.totals.gdp, 'currency'), label: t.gdp, color: '#f59e0b' }),
      React.createElement(KpiCard, { value: `${data.totals.datasets}`, label: t.datasets, color: '#10b981' }),
    ),

    // ═══ LAYER CONTENT (single column) ═══
    React.createElement('div', {
      style: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
    }, ...layerSections),

    // ═══ DATA SOURCES ═══
    React.createElement(SectionCard, { color: '#06b6d4' },
      React.createElement(SectionLabel, { icon: '🏛️', title: t.dataSources, color: '#06b6d4' }),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 3 } },
        ...data.sources.slice(0, 6).map(src =>
          React.createElement(SourceBadge, { key: src.abbr, label: src.abbr, color: '#06b6d4' })
        ),
        React.createElement(SourceBadge, { label: `${data.dateRange.minBegin}–${data.dateRange.maxEnd}`, color: '#06b6d4' }),
      ),
    ),

    // ═══ FOOTER ═══
    React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        marginTop: 8,
        borderTop: `1px solid ${DESIGN_TOKENS.border.subtle}`,
      },
    },
      React.createElement('div', { style: { fontSize: 6, fontFamily: DESIGN_TOKENS.font.mono, color: DESIGN_TOKENS.text.dim, maxWidth: '70%', lineHeight: 1.4 } }, t.disclaimer),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement('span', { style: { fontSize: 6, fontFamily: DESIGN_TOKENS.font.mono, color: DESIGN_TOKENS.text.dim } }, t.source),
        React.createElement('span', { style: { fontSize: 6, fontFamily: DESIGN_TOKENS.font.mono, color: '#06b6d4', padding: '1px 4px', borderRadius: 2, border: '1px solid rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.05)' } }, t.cc),
      ),
    ),
  );
}
