// src/design/blueprint-tokens.ts
// Real Palantir Blueprint.js design tokens
// Reference: @blueprintjs/core source code

export const BP_COLORS = {
  // Core backgrounds
  appBg: '#182026',
  panelBg: '#202B33',
  cardBg: '#1C2127',
  inputBg: '#1C2127',
  inputBgHover: '#252A31',

  // Blue (primary)
  blue1: '#1D4ED8',
  blue2: '#215DB0',
  blue3: '#137CBD',  // Primary interactive
  blue4: '#48AFF0',  // Data/accent
  blue5: '#7CC4F8',

  // Semantic
  success: '#0D8050',
  successLight: '#2D9C6F',
  warning: '#BF7326',
  warningLight: '#D9973B',
  danger: '#C23030',
  dangerLight: '#DB4D4D',

  // Text
  textPrimary: '#F5F8FA',
  textSecondary: '#BFCCD6',
  textMuted: '#738694',
  textDisabled: '#5C7080',

  // Borders
  border: '#1C2127',
  borderHover: '#2B3A45',
  divider: '#1C2127',
};

export const BP_FONT = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  mono: "'Consolas', 'Monaco', 'Courier New', monospace",
  size: 14,      // Blueprint uses 14px base
  sizeSmall: 12,
  sizeLarge: 16,
  sizeXLarge: 18,
  weightNormal: 400,
  weightMedium: 500,
  weightSemibold: 600,
  lineHeight: 1.4,
};

export const BP_SPACE = {
  unit: 4,        // 4px grid
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const BP_RADIUS = {
  none: 0,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

export const BP_SHADOW = {
  elevation0: 'none',
  elevation1: '0 0 0 1px rgba(16,22,26,0.4)',
  elevation2: '0 0 0 1px rgba(16,22,26,0.4), 0 1px 1px rgba(16,22,26,0.4)',
  elevation3: '0 0 0 1px rgba(16,22,26,0.4), 0 2px 4px rgba(16,22,26,0.4)',
  elevation4: '0 0 0 1px rgba(16,22,26,0.4), 0 4px 8px rgba(16,22,26,0.4), 0 0 8px rgba(16,22,26,0.2)',
};

export const BP_DATA_VIZ = {
  // Palantir data visualization palette
  series: ['#48AFF0', '#D9973B', '#2D9C6F', '#DB4D4D', '#7CC4F8', '#D9A0E0', '#5C7080', '#F5F8FA'],
  positive: '#2D9C6F',
  negative: '#DB4D4D',
  neutral: '#5C7080',
};

// ─── Legacy BP object (backward-compatible) ────────────────────────────
// Preserved for existing consumers. New code should use the named exports
// above (BP_COLORS, BP_FONT, etc.) for tree-shakeable imports.

export const BP = {
  colors: {
    // Backgrounds (Blueprint dark theme)
    appBg: BP_COLORS.appBg,
    panelBg: BP_COLORS.panelBg,
    cardBg: BP_COLORS.cardBg,
    elevated: '#293742',
    border: '#383E47',
    divider: '#404854',

    // Text
    textPrimary: BP_COLORS.textPrimary,
    textSecondary: BP_COLORS.textSecondary,
    textMuted: BP_COLORS.textMuted,
    textDisabled: BP_COLORS.textDisabled,

    // Interactive (Blueprint Blue)
    blue3: BP_COLORS.blue3,
    blue4: '#2B95D6',
    blue5: BP_COLORS.blue4,

    // Intent
    success: BP_COLORS.success,
    warning: BP_COLORS.warningLight,
    danger: BP_COLORS.dangerLight,
    primary: BP_COLORS.blue3,

    // Data viz palette
    dataBlue: BP_DATA_VIZ.series[0],
    dataGreen: BP_DATA_VIZ.positive,
    dataOrange: BP_DATA_VIZ.series[1],
    dataRed: BP_DATA_VIZ.negative,
    dataTeal: '#14CCBD',
    dataPurple: BP_DATA_VIZ.series[5],

    // Our current cyan (kept for backward compat)
    cyan: '#06b6d4',
    darkBg: '#0a0e1a',
  },

  font: {
    sans: BP_FONT.family,
    mono: BP_FONT.mono,
    size: {
      xs: 11,
      sm: BP_FONT.sizeSmall,
      base: BP_FONT.size,
      md: BP_FONT.sizeLarge,
      lg: BP_FONT.sizeXLarge,
      xl: 20,
      h4: BP_FONT.sizeLarge,
      h3: BP_FONT.sizeXLarge,
      h2: 22,
      h1: 28,
    },
    weight: {
      normal: BP_FONT.weightNormal,
      medium: BP_FONT.weightMedium,
      bold: BP_FONT.weightSemibold,
    },
    lineHeight: {
      tight: 1.28581,
      normal: BP_FONT.lineHeight,
    },
  },

  space: {
    0: 0,
    1: BP_SPACE.xs,
    2: BP_SPACE.sm,
    3: BP_SPACE.md,
    4: BP_SPACE.lg,
    5: BP_SPACE.xl,
    6: BP_SPACE.xxl,
    7: 30,
    8: 40,
    9: 50,
  },

  radius: {
    sm: BP_RADIUS.sm,
    base: BP_RADIUS.md,
    md: BP_RADIUS.lg,
    lg: BP_RADIUS.xl,
    pill: 100,
  },

  shadow: {
    1: BP_SHADOW.elevation1,
    2: BP_SHADOW.elevation2,
    3: BP_SHADOW.elevation3,
    4: BP_SHADOW.elevation4,
  },
} as const;

/**
 * Category color mapping aligned with the Malaysia Open Data taxonomy.
 * Each entry carries a display color, representative emoji icon, and
 * sorting priority (lower = shown first).
 */
export const CATEGORY_COLORS: Record<
  string,
  { color: string; icon: string; priority: number }
> = {
  Economy: { color: '#00D4FF', icon: '💹', priority: 1 },
  Prices: { color: '#F59E0B', icon: '🛒', priority: 2 },
  Labour: { color: '#10B981', icon: '👷', priority: 3 },
  Demography: { color: '#8B5CF6', icon: '👥', priority: 4 },
  Households: { color: '#FB923C', icon: '🤝', priority: 5 },
  Trade: { color: '#06B6D4', icon: '🚢', priority: 6 },
  Finance: { color: '#3B82F6', icon: '🏦', priority: 7 },
  Healthcare: { color: '#EC4899', icon: '🏥', priority: 9 },
  Education: { color: '#F97316', icon: '🎓', priority: 10 },
  Industry: { color: '#6366F1', icon: '🏭', priority: 11 },
  Transport: { color: '#14B8A6', icon: '🚗', priority: 12 },
  Agriculture: { color: '#84CC16', icon: '🌾', priority: 13 },
  Environment: { color: '#22C55E', icon: '🌿', priority: 15 },
  Safety: { color: '#EF4444', icon: '🔒', priority: 16 },
  Digital: { color: '#0EA5E9', icon: '💻', priority: 18 },
};
