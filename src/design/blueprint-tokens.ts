/**
 * Blueprint Design Tokens
 *
 * Palantir Blueprint–accurate design tokens for the Malaysia Open Data
 * Command Center. This is NOT Blueprint.js — it is a token system we
 * reference across the dashboard to bring our visual design closer to
 * Palantir's actual Blueprint design system
 * (github.com/palantir/blueprint).
 *
 * All color values are sourced from the Blueprint dark-theme palette.
 * Spacing, radii, and shadow values mirror Blueprint's CSS variables.
 */

export const BP = {
  colors: {
    // Backgrounds (Blueprint dark theme)
    appBg: "#182026", // darkGray1
    panelBg: "#202B33", // darkGray2
    cardBg: "#1C2127", // Between darkGray1/2
    elevated: "#293742", // darkGray3
    border: "#383E47",
    divider: "#404854",

    // Text
    textPrimary: "#F6F7F9",
    textSecondary: "#ABB3BF",
    textMuted: "#5F6B7C",
    textDisabled: "#404854",

    // Interactive (Blueprint Blue)
    blue3: "#137CBD", // Primary
    blue4: "#2B95D6", // Hover
    blue5: "#48AFF0", // Active

    // Intent
    success: "#0F9960",
    warning: "#D9822B",
    danger: "#DB3737",
    primary: "#137CBD",

    // Data viz palette
    dataBlue: "#48AFF0",
    dataGreen: "#3DCC91",
    dataOrange: "#FFB366",
    dataRed: "#FF7373",
    dataTeal: "#14CCBD",
    dataPurple: "#AD99FF",

    // Our current cyan (kept for backward compat)
    cyan: "#06b6d4",
    darkBg: "#0a0e1a",
  },

  font: {
    sans: "-apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Consolas', 'Courier New', monospace",
    size: {
      xs: 11,
      sm: 12,
      base: 14,
      md: 16,
      lg: 18,
      xl: 20,
      h4: 16,
      h3: 18,
      h2: 22,
      h1: 28,
    },
    weight: {
      normal: 400,
      medium: 500,
      bold: 600,
    },
    lineHeight: {
      tight: 1.28581,
      normal: 1.45,
    },
  },

  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 30,
    8: 40,
    9: 50,
  },

  radius: {
    sm: 2,
    base: 3,
    md: 4,
    lg: 6,
    pill: 100,
  },

  shadow: {
    1: "0 0 0 1px rgba(17, 20, 24, 0.1), 0 1px 1px rgba(17, 20, 24, 0.2)",
    2: "0 0 0 1px rgba(17, 20, 24, 0.1), 0 1px 1px rgba(17, 20, 24, 0.2), 0 2px 6px rgba(17, 20, 24, 0.2)",
    3: "0 0 0 1px rgba(17, 20, 24, 0.1), 0 2px 4px rgba(17, 20, 24, 0.4), 0 8px 24px rgba(17, 20, 24, 0.4)",
    4: "0 0 0 1px rgba(17, 20, 24, 0.1), 0 4px 8px rgba(17, 20, 24, 0.4), 0 18px 46px 6px rgba(17, 20, 24, 0.4)",
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
  Economy: { color: "#00D4FF", icon: "💹", priority: 1 },
  Prices: { color: "#F59E0B", icon: "🛒", priority: 2 },
  Labour: { color: "#10B981", icon: "👷", priority: 3 },
  Demography: { color: "#8B5CF6", icon: "👥", priority: 4 },
  Households: { color: "#FB923C", icon: "🤝", priority: 5 },
  Trade: { color: "#06B6D4", icon: "🚢", priority: 6 },
  Finance: { color: "#3B82F6", icon: "🏦", priority: 7 },
  Healthcare: { color: "#EC4899", icon: "🏥", priority: 9 },
  Education: { color: "#F97316", icon: "🎓", priority: 10 },
  Industry: { color: "#6366F1", icon: "🏭", priority: 11 },
  Transport: { color: "#14B8A6", icon: "🚗", priority: 12 },
  Agriculture: { color: "#84CC16", icon: "🌾", priority: 13 },
  Environment: { color: "#22C55E", icon: "🌿", priority: 15 },
  Safety: { color: "#EF4444", icon: "🔒", priority: 16 },
  Digital: { color: "#0EA5E9", icon: "💻", priority: 18 },
};
