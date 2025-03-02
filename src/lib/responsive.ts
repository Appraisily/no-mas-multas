/**
 * Responsive design utilities for NoMasMultas
 * 
 * This file contains constants, types, and utility functions to help
 * implement consistent responsive design throughout the application.
 */

// Standard breakpoints for responsive design
export const breakpoints = {
  xs: 320,  // Extra small devices (phones)
  sm: 640,  // Small devices (large phones, small tablets)
  md: 768,  // Medium devices (tablets)
  lg: 1024, // Large devices (desktops)
  xl: 1280, // Extra large devices (large desktops)
  '2xl': 1536 // Extra extra large devices
};

// Export the Breakpoint type
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Type for responsive value objects
export type ResponsiveValue<T> = {
  base: T;       // Default value (mobile-first approach)
  xs?: T;        // Extra small screens
  sm?: T;        // Small screens
  md?: T;        // Medium screens
  lg?: T;        // Large screens
  xl?: T;        // Extra large screens
  '2xl'?: T;     // Extra extra large screens
};

// Spacing scale (in pixels) for consistent spacing
export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
};

// Common z-index values for layering
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
};

// Layout presets for common responsive patterns
export const layoutPresets = {
  // Two-column layout that stacks on mobile
  twoColumnStack: {
    container: 'flex flex-col md:flex-row w-full gap-4 md:gap-6',
    primaryColumn: 'w-full md:w-2/3',
    secondaryColumn: 'w-full md:w-1/3',
  },
  
  // Three-column layout that stacks on mobile
  threeColumnStack: {
    container: 'grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6',
    column: 'w-full',
  },

  // Grid that adapts from 1 column on mobile to 2-3-4 columns on larger screens
  responsiveGrid: {
    container: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
    item: 'w-full',
  },
  
  // Full-width mobile, constrained width on larger screens
  containerBreakout: {
    container: 'w-full px-4 sm:px-6 md:max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto',
  },
  
  // Card layout that adapts to screen size
  responsiveCard: {
    container: 'rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800',
    content: 'p-4 sm:p-6',
    title: 'text-lg sm:text-xl font-semibold',
    footerContainer: 'p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50',
  }
};

// Common responsive typography classes
export const typography = {
  heading1: 'text-3xl sm:text-4xl md:text-5xl font-bold',
  heading2: 'text-2xl sm:text-3xl md:text-4xl font-bold',
  heading3: 'text-xl sm:text-2xl md:text-3xl font-bold',
  subtitle: 'text-lg sm:text-xl text-gray-600 dark:text-gray-400',
  body: 'text-base sm:text-lg',
  small: 'text-sm sm:text-base',
  tiny: 'text-xs sm:text-sm',
};

// Responsive spacing classes
export const responsiveSpacing = {
  section: 'py-8 sm:py-12 md:py-16 lg:py-20',
  container: 'px-4 sm:px-6 lg:px-8',
  stack: 'space-y-4 sm:space-y-6 md:space-y-8',
  inline: 'space-x-2 sm:space-x-4 md:space-x-6',
};

// Utility function to determine if client is on a mobile device
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}

// Re-export the breakpoint hooks from useBreakpoint
export { 
  useBreakpoint, 
  useBreakpointMatch, 
  useResponsiveValue 
} from './useBreakpoint';

// Export everything as the default export
export default {
  breakpoints,
  spacing,
  zIndex,
  layoutPresets,
  typography,
  responsiveSpacing,
  isMobileDevice,
}; 