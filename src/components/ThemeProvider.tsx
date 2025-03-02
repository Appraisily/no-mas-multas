'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { themeConfig } from '@/lib/theme-config';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous classes for clean state
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      root.classList.add(systemTheme);
      root.style.colorScheme = systemTheme;
      return;
    }

    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  // Apply New York variant classes and custom CSS variables
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply variant-specific classes
    root.classList.add('new-york-variant');
    
    // Apply radius
    root.style.setProperty('--radius', themeConfig.radius === 'sm' ? '0.3rem' : '0.5rem');
    
    // Apply scaling
    if (themeConfig.scaling === 'compact') {
      root.classList.add('scaling-compact');
    }
    
    // Apply font family
    if (themeConfig.fonts.sans) {
      root.style.setProperty('--font-sans', themeConfig.fonts.sans);
    }
    if (themeConfig.fonts.mono) {
      root.style.setProperty('--font-mono', themeConfig.fonts.mono);
    }
    
    // Apply color variables
    Object.entries(themeConfig.colors).forEach(([colorName, colorValue]) => {
      if (typeof colorValue === 'string') {
        root.style.setProperty(`--${colorName}`, colorValue);
      } else if (typeof colorValue === 'object') {
        Object.entries(colorValue).forEach(([shade, value]) => {
          root.style.setProperty(
            `--${colorName}${shade === 'DEFAULT' ? '' : `-${shade}`}`, 
            value as string
          );
        });
      }
    });
    
    // Apply shadow variables
    Object.entries(themeConfig.newYorkStyles.shadows).forEach(([size, value]) => {
      root.style.setProperty(
        `--shadow${size === 'DEFAULT' ? '' : `-${size}`}`,
        value as string
      );
    });

  }, []);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom hook to consume the theme context
export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
    
  return context;
}; 