// Centralized Brand Colors - Single source of truth
// 2025 TREND: Dark gray with electric violet accent (sophisticated, modern)
export const BRAND_COLORS = {
  primary: "#e8e8e8",     // Slightly dimmed white for better readability (2025 best practice)
  secondary: "#a0a0a0",   // Neutral gray for secondary elements
  accent: "#a855f7",      // Electric violet - 2025 trend, stands out without being garish
  dark: "#0a0a0a",        // Near black for maximum contrast
  // RGB versions for use in rgba() functions
  primaryRgb: "232, 232, 232",
  secondaryRgb: "160, 160, 160", 
  accentRgb: "168, 85, 247",  // Electric violet RGB
  darkRgb: "10, 10, 10",
} as const;

// Pure grayscale backgrounds - 2025 dark mode best practices
export const BACKGROUND_COLORS = {
  primary: "#0f0f0f",     // Main background - true dark gray (not pure black for comfort)
  secondary: "#050505",   // Deeper sections for visual hierarchy
  surface: "#1a1a1a",     // Cards/surfaces - subtle elevation
  overlay: "#242424",     // Overlays/modals - clear separation from background
} as const;

// Helper functions for common gradient patterns
export const BRAND_GRADIENTS = {
  primary: `linear-gradient(135deg, ${BRAND_COLORS.accent}, ${BRAND_COLORS.secondary})`,
  horizontal: `linear-gradient(to right, ${BRAND_COLORS.accent}, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent})`,
  diagonal: `linear-gradient(to right top, ${BRAND_COLORS.accent}, ${BRAND_COLORS.secondary}, ${BRAND_COLORS.primary})`,
  subtle: `linear-gradient(135deg, ${BACKGROUND_COLORS.primary}, ${BACKGROUND_COLORS.surface})`,
} as const;

// Varied colors for interesting shapes - modern but diverse
export const SHAPE_COLORS = {
  // Warm metallics
  gold: "#d4af37",         // Elegant gold
  copper: "#b87333",       // Warm copper
  rose: "#e8b4b8",         // Rose gold tint
  
  // Cool metallics  
  silver: "#c0c0c0",       // Classic silver
  platinum: "#e6e6fa",     // Cool platinum
  steel: "#708090",        // Blue-gray steel
  
  // Subtle accent colors (desaturated, sophisticated)
  teal: "#5f9ea0",         // Muted teal
  coral: "#cd5c5c",        // Soft coral
  sage: "#9caf88",         // Sage green
  lavender: "#b19cd9",     // Soft lavender
  
  // RGB versions for rgba() functions
  goldRgb: "212, 175, 55",
  copperRgb: "184, 115, 51", 
  roseRgb: "232, 180, 184",
  silverRgb: "192, 192, 192",
  platinumRgb: "230, 230, 250",
  steelRgb: "112, 128, 144",
  tealRgb: "95, 158, 160",
  coralRgb: "205, 92, 92",
  sageRgb: "156, 175, 136",
  lavenderRgb: "177, 156, 217",
} as const;

// Helper functions for common rgba values
export const BRAND_RGBA = {
  accentGlow: `rgba(${BRAND_COLORS.accentRgb}, 0.6)`,
  accentBorder: `rgba(${BRAND_COLORS.accentRgb}, 0.4)`,
  primaryGlow: `rgba(${BRAND_COLORS.primaryRgb}, 0.6)`,
  primaryBorder: `rgba(${BRAND_COLORS.primaryRgb}, 0.4)`,
  surface: `rgba(${BRAND_COLORS.darkRgb}, 0.8)`,
} as const;

// Shape rgba values for varied colors
export const SHAPE_RGBA = {
  goldGlow: `rgba(${SHAPE_COLORS.goldRgb}, 0.4)`,
  goldBorder: `rgba(${SHAPE_COLORS.goldRgb}, 0.3)`,
  tealGlow: `rgba(${SHAPE_COLORS.tealRgb}, 0.4)`,
  tealBorder: `rgba(${SHAPE_COLORS.tealRgb}, 0.3)`,
  coralGlow: `rgba(${SHAPE_COLORS.coralRgb}, 0.4)`,
  coralBorder: `rgba(${SHAPE_COLORS.coralRgb}, 0.3)`,
  sageGlow: `rgba(${SHAPE_COLORS.sageRgb}, 0.4)`,
  sageBorder: `rgba(${SHAPE_COLORS.sageRgb}, 0.3)`,
  lavenderGlow: `rgba(${SHAPE_COLORS.lavenderRgb}, 0.4)`,
  lavenderBorder: `rgba(${SHAPE_COLORS.lavenderRgb}, 0.3)`,
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