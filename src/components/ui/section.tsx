import React from 'react';
import { cn } from "@/lib/utils";
import { Container } from './container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
  background?: 'white' | 'light' | 'dark' | 'gradient' | 'none';
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  paddingY?: boolean | string;
}

/**
 * A responsive section component for page content
 * 
 * @param children - The content inside the section
 * @param className - Additional classes to apply to the section
 * @param id - ID for the section (useful for navigation)
 * @param containerClassName - Additional classes for the container inside the section
 * @param background - Background type for the section
 * @param containerSize - Size of the container inside the section
 * @param paddingY - Vertical padding (true for responsive padding, string for custom)
 */
export function Section({
  children,
  className,
  id,
  containerClassName,
  background = 'none',
  containerSize = 'xl',
  paddingY = true,
}: SectionProps) {
  // Background classes based on the type
  const backgroundClasses = {
    none: '',
    white: 'bg-white dark:bg-gray-900',
    light: 'bg-gray-50 dark:bg-gray-800',
    dark: 'bg-gray-900 dark:bg-black text-white',
    gradient: 'bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800',
  };
  
  // Default responsive vertical padding
  const defaultPaddingY = 'py-8 sm:py-12 md:py-16 lg:py-20';
  
  // Determine vertical padding class
  let paddingYClass = '';
  if (paddingY === true) {
    paddingYClass = defaultPaddingY;
  } else if (typeof paddingY === 'string') {
    paddingYClass = paddingY;
  }
  
  return (
    <section
      id={id}
      className={cn(
        backgroundClasses[background],
        paddingYClass,
        className
      )}
    >
      <Container
        maxWidth={containerSize}
        className={containerClassName}
      >
        {children}
      </Container>
    </section>
  );
}

export default Section; 