// Design token system for Satori infographic rendering
// "Nano Banana Pro 2" aesthetic — ultra-clean, deep dark, hero numbers

export const DESIGN_TOKENS = {
  // Backgrounds
  bg: {
    primary: '#080C14',
    card: '#0D1220',
    cardAlt: '#111827',
    cardHover: '#141C2E',
    overlay: 'rgba(8,12,20,0.85)',
  },

  // Accent colors per dataset
  accent: {
    population: '#06b6d4',    // cyan
    gdp: '#f59e0b',           // amber
    demography: '#10b981',    // emerald
    healthcare: '#ec4899',    // pink
    environment: '#22c55e',   // green
    education: '#3b82f6',     // blue
    default: '#06b6d4',       // cyan fallback
  },

  // Text
  text: {
    hero: '#FFFFFF',
    primary: '#E2E8F0',
    secondary: '#94A3B8',
    muted: '#64748B',
    dim: '#475569',
    accent: '#06b6d4',
  },

  // Borders
  border: {
    subtle: 'rgba(6,182,212,0.08)',
    light: 'rgba(6,182,212,0.15)',
    medium: 'rgba(6,182,212,0.25)',
    accent: 'rgba(6,182,212,0.4)',
  },

  // Glows
  glow: {
    cyan: '0 0 20px rgba(6,182,212,0.15)',
    cyanStrong: '0 0 40px rgba(6,182,212,0.25)',
    accent: (color: string) => `0 0 20px ${color}25`,
  },

  // Spacing (in px for Satori)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
  },

  // Radii
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    full: 9999,
  },

  // Font families (mapped to loaded font weights)
  font: {
    display: 'Inter',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
} as const;

// Helper to get accent color for a layer
export function getAccentColor(layerId: string): string {
  return DESIGN_TOKENS.accent[layerId as keyof typeof DESIGN_TOKENS.accent] ?? DESIGN_TOKENS.accent.default;
}

// Helper to create a gradient background for Satori
export function cardBackground(color: string, opacity: number = 0.06): string {
  return `rgba(${hexToRgb(color)},${opacity})`;
}

export function borderAccent(color: string, opacity: number = 0.2): string {
  return `rgba(${hexToRgb(color)},${opacity})`;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '6,182,212';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

// Format numbers for infographic display
export function formatHeroNumber(value: number, type: 'population' | 'currency' | 'percentage' | 'raw'): string {
  switch (type) {
    case 'population':
      if (value >= 1000) return `${(value / 1000).toFixed(1)}M`;
      return `${value}K`;
    case 'currency':
      if (value >= 1000000) return `RM${(value / 1000000).toFixed(2)}T`;
      if (value >= 1000) return `RM${(value / 1000).toFixed(1)}B`;
      return `RM${value}M`;
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'raw':
      return value.toLocaleString();
    default:
      return value.toString();
  }
}
