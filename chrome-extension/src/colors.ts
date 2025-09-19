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