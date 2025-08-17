// Centralized Brand Colors - Single source of truth
export const BRAND_COLORS = {
  primary: "#f59e0b",
  secondary: "#fbbf24", 
  dark: "#d97706",
  // RGB versions for use in rgba() functions
  primaryRgb: "245, 158, 11",
  secondaryRgb: "251, 191, 36",
  darkRgb: "217, 119, 6",
} as const;

// Helper functions for common gradient patterns
export const BRAND_GRADIENTS = {
  primary: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
  horizontal: `linear-gradient(to right, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary}, ${BRAND_COLORS.primary})`,
  diagonal: `linear-gradient(to right top, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary}, ${BRAND_COLORS.primary})`,
} as const;

// Helper functions for common rgba values
export const BRAND_RGBA = {
  primaryGlow: `rgba(${BRAND_COLORS.primaryRgb}, 0.6)`,
  primaryBorder: `rgba(${BRAND_COLORS.primaryRgb}, 0.4)`,
  secondaryGlow: `rgba(${BRAND_COLORS.secondaryRgb}, 0.6)`,
  secondaryBorder: `rgba(${BRAND_COLORS.secondaryRgb}, 0.4)`,
} as const;