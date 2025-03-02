'use client';

import { useState, useEffect } from 'react';
import { breakpoints } from './responsive';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Hook that tracks current viewport size and returns the active breakpoint
 * @returns The current active breakpoint ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 */
export function useBreakpoint(): Breakpoint {
  // Default to 'xs' when rendering on the server
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    // Function to determine current breakpoint based on window width
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.sm) {
        setCurrentBreakpoint('xs');
      } else if (width < breakpoints.md) {
        setCurrentBreakpoint('sm');
      } else if (width < breakpoints.lg) {
        setCurrentBreakpoint('md');
      } else if (width < breakpoints.xl) {
        setCurrentBreakpoint('lg');
      } else if (width < breakpoints['2xl']) {
        setCurrentBreakpoint('xl');
      } else {
        setCurrentBreakpoint('2xl');
      }
    };

    // Set initial breakpoint
    updateBreakpoint();

    // Update breakpoint when window is resized
    window.addEventListener('resize', updateBreakpoint);
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return currentBreakpoint;
}

/**
 * Hook that checks if the current breakpoint matches or exceeds the target breakpoint
 * @param target The breakpoint to check against ('sm', 'md', 'lg', 'xl', '2xl')
 * @returns Boolean indicating if the current viewport is at or above the target breakpoint
 */
export function useBreakpointMatch(target: Breakpoint): boolean {
  const currentBreakpoint = useBreakpoint();
  
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(target);
  
  return currentIndex >= targetIndex;
}

/**
 * Hook that returns values based on the current breakpoint
 * @param values Object with responsive values for each breakpoint
 * @returns The value for the current breakpoint, or the value for the closest smaller breakpoint
 */
export function useResponsiveValue<T>(values: { [key in Breakpoint]?: T }): T | undefined {
  const currentBreakpoint = useBreakpoint();
  
  // Order from largest to smallest
  const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  
  // Find the largest defined breakpoint that's smaller than or equal to the current one
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  // If no match is found, return the smallest defined breakpoint
  for (const bp of [...breakpointOrder].reverse()) {
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
}

export default useBreakpoint; 