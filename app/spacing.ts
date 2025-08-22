// Consistent spacing system for the entire app
export const SPACING = {
  // Container constraints
  maxWidth: 'lg' as const, // Consistent max width for all containers
  
  // Horizontal padding - aligned with navbar
  containerPadding: {
    xs: 2, // 16px on mobile (matches navbar)
    md: 3, // 24px on desktop (matches navbar) 
  },
  
  // Section spacing
  sectionPadding: {
    xs: 4, // 32px vertical on mobile
    md: 6, // 48px vertical on desktop
  },
  
  // Page margins (to account for fixed navbar)
  pageTop: {
    xs: '80px', // Space for mobile navbar
    md: '100px', // Space for desktop navbar
  }
} as const;

// Helper function to get consistent container sx props
export const getContainerSx = () => ({
  maxWidth: SPACING.maxWidth,
  px: SPACING.containerPadding,
  mx: 'auto',
  width: '100%',
});

// Helper function for consistent section spacing
export const getSectionSx = () => ({
  py: SPACING.sectionPadding,
});

// Helper function for consistent page layout
export const getPageSx = () => ({
  pt: SPACING.pageTop,
  pb: SPACING.sectionPadding,
});