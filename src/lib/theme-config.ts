// Theme configuration for shadcn/ui with New York variant
export const themeConfig = {
  variant: 'new-york',  // Use New York variant
  radius: 'sm',         // Sharper corners for a more authoritative look
  scaling: 'compact',   // Slightly denser UI for information-rich interfaces
  
  // Color palette configuration
  colors: {
    primary: {
      DEFAULT: '#1A1A1A', // User-specified black
      foreground: '#FFFFFF',
    },
    accent: {
      DEFAULT: '#9BB6CF', // Armadillo Blue
      foreground: '#FFFFFF',
    },
    secondary: {
      DEFAULT: '#527699', // Darker Blue
      foreground: '#FFFFFF',
    },
    destructive: {
      DEFAULT: '#991b1b', // Keeping this red for cautionary actions
      foreground: '#fef2f2',
    },
    muted: {
      DEFAULT: '#F5F5F5', // Gray-100
      foreground: '#6E6E6E', // Gray-600
    },
    card: {
      DEFAULT: '#FFFFFF',
      foreground: '#1A1A1A',
    },
    popover: {
      DEFAULT: '#FFFFFF',
      foreground: '#1A1A1A',
    },
    border: '#D1D1D1', // Gray-300
  },
  
  // Typography configuration
  fonts: {
    sans: 'Inter var, sans-serif',
    mono: 'JetBrains Mono, monospace', // For code snippets and legal references
  },
  
  // New York-specific styling overrides
  newYorkStyles: {
    // Sharper shadows for cards and interactive elements
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
    // Crisper borders with slightly increased contrast
    borders: {
      DEFAULT: '1px solid #D1D1D1', // Gray-300
      focus: '2px solid #9BB6CF', // Armadillo Blue
      error: '1px solid #ef4444', // red-500
    },
  },
};

// Semantic color mappings for application-specific elements
export const semanticColors = {
  // Appeal status colors
  appeal: {
    weak: '#ef4444',    // red-500
    moderate: '#f59e0b', // amber-500
    strong: '#10b981',  // emerald-500
  },
  
  // Status indicators
  status: {
    pending: '#f59e0b',  // amber-500
    approved: '#10b981', // emerald-500
    rejected: '#ef4444', // red-500
    deadline: '#f43f5e', // rose-500
  },
  
  // Element-specific colors
  element: {
    card: {
      light: '#FFFFFF',
      dark: '#1A1A1A',
    },
    input: {
      border: {
        light: '#D1D1D1', // Gray-300
        dark: '#6E6E6E',  // Gray-600
      },
      bg: {
        light: '#FFFFFF',
        dark: '#1A1A1A',
      }
    },
  }
};

// Helper function to get status badge styling
export function getStatusStyles(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500';
    case 'approved':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500';
    case 'rejected':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500';
    case 'urgent':
      return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
} 