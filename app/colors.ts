// Centralized brand colors tuned for a warmer, more editorial portfolio aesthetic.
export const BRAND_COLORS = {
  primary: "#f5efe2",
  secondary: "#b6c0b8",
  accent: "#f26b3a",
  dark: "#081311",
  primaryRgb: "245, 239, 226",
  secondaryRgb: "182, 192, 184",
  accentRgb: "242, 107, 58",
  darkRgb: "8, 19, 17",
} as const;

export const BACKGROUND_COLORS = {
  primary: "#091311",
  secondary: "#0d1c18",
  surface: "#13241f",
  overlay: "#1b3029",
} as const;

export const BRAND_GRADIENTS = {
  primary: `linear-gradient(135deg, ${BRAND_COLORS.accent}, #f1c37a)`,
  horizontal: `linear-gradient(to right, ${BRAND_COLORS.accent}, ${BRAND_COLORS.primary}, #91d0bd)`,
  diagonal: `linear-gradient(to right top, ${BRAND_COLORS.accent}, #d5b36f, #91d0bd)`,
  subtle: `linear-gradient(135deg, ${BACKGROUND_COLORS.primary}, ${BACKGROUND_COLORS.surface})`,
} as const;

export const SHAPE_COLORS = {
  lightPurple: "#9ad9c8",
  deepPurple: "#2f7f72",
  lavender: "#d8be84",
  gold: "#f0b45f",
  lightPurpleRgb: "154, 217, 200",
  deepPurpleRgb: "47, 127, 114",
  lavenderRgb: "216, 190, 132",
  goldRgb: "240, 180, 95",
} as const;

// Helper functions for common rgba values
export const BRAND_RGBA = {
  accentGlow: `rgba(${BRAND_COLORS.accentRgb}, 0.6)`,
  accentBorder: `rgba(${BRAND_COLORS.accentRgb}, 0.4)`,
  primaryGlow: `rgba(${BRAND_COLORS.primaryRgb}, 0.6)`,
  primaryBorder: `rgba(${BRAND_COLORS.primaryRgb}, 0.4)`,
  surface: `rgba(${BRAND_COLORS.darkRgb}, 0.8)`,
} as const;

// Shape rgba values for monochrome palette
export const SHAPE_RGBA = {
  lightPurpleGlow: `rgba(${SHAPE_COLORS.lightPurpleRgb}, 0.4)`,
  lightPurpleBorder: `rgba(${SHAPE_COLORS.lightPurpleRgb}, 0.3)`,
  deepPurpleGlow: `rgba(${SHAPE_COLORS.deepPurpleRgb}, 0.4)`,
  deepPurpleBorder: `rgba(${SHAPE_COLORS.deepPurpleRgb}, 0.3)`,
  lavenderGlow: `rgba(${SHAPE_COLORS.lavenderRgb}, 0.4)`,
  lavenderBorder: `rgba(${SHAPE_COLORS.lavenderRgb}, 0.3)`,
  goldGlow: `rgba(${SHAPE_COLORS.goldRgb}, 0.4)`,
  goldBorder: `rgba(${SHAPE_COLORS.goldRgb}, 0.3)`,
} as const;

// Diff colors for text changes and modifications
export const DIFF_COLORS = {
  // Text changes - consistent with DiffText component
  added: {
    background: '#eaffea',
    text: '#14532d',
    border: '#14532d',
  },
  removed: {
    background: '#ffecec',
    text: '#b91c1c',
    border: '#b91c1c',
  },
  // New elements (sections, bullet points, etc.)
  new: {
    background: 'rgba(76, 175, 80, 0.1)',
    border: 'rgba(76, 175, 80, 0.3)',
    accent: '#4caf50',
  }
} as const;
