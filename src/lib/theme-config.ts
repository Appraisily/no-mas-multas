// Theme configuration for shadcn/ui with New York variant
export const themeConfig = {
  variant: 'new-york',  // Use New York variant
  radius: 'sm',         // Sharper corners for a more authoritative look
  scaling: 'compact',   // Slightly denser UI for information-rich interfaces
  
  // Color palette configuration
  colors: {
    primary: {
      DEFAULT: '#0f172a', // Deep blue for primary elements
      foreground: '#f8fafc',
    },
    accent: {
      DEFAULT: '#0369a1', // Strategic blue accent for important actions
      foreground: '#f8fafc',
    },
    secondary: {
      DEFAULT: '#334155', // Slate-700 for secondary elements
      foreground: '#f8fafc',
    },
    destructive: {
      DEFAULT: '#991b1b', // Subdued red for cautionary actions
      foreground: '#fef2f2',
    },
    muted: {
      DEFAULT: '#f1f5f9', // Slate-100 for muted backgrounds
      foreground: '#64748b', // Slate-500 for muted text
    },
    card: {
      DEFAULT: 'white',
      foreground: '#0f172a', // slate-900
    },
    popover: {
      DEFAULT: 'white',
      foreground: '#0f172a', // slate-900
    },
    border: '#e2e8f0', // slate-200
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
      DEFAULT: '1px solid #e2e8f0', // slate-200
      focus: '2px solid #3b82f6', // blue-500
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
      light: 'white',
      dark: '#0f172a', // slate-950
    },
    input: {
      border: {
        light: '#e2e8f0', // slate-200
        dark: '#334155',  // slate-700
      },
      bg: {
        light: 'white',
        dark: '#0f172a',  // slate-950
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