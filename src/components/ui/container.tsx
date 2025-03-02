import React from 'react';
import { cn } from "@/lib/utils";
import { responsiveSpacing } from '@/lib/responsive';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  paddingX?: boolean | string;
  paddingY?: boolean | string;
  spacingY?: boolean | string;
  as?: React.ElementType;
}

/**
 * A responsive container component that adapts to different screen sizes
 * 
 * @param children - The content inside the container
 * @param className - Additional classes to apply
 * @param maxWidth - Maximum width of the container
 * @param paddingX - Horizontal padding (true for responsive padding, string for custom)
 * @param paddingY - Vertical padding (true for responsive padding, string for custom)
 * @param spacingY - Vertical spacing between children (true for responsive spacing, string for custom)
 * @param as - The HTML element to render (defaults to div)
 */
export function Container({
  children,
  className,
  maxWidth = 'xl',
  paddingX = true,
  paddingY = false,
  spacingY = false,
  as: Component = 'div',
}: ContainerProps) {
  
  // Maximum width classes
  const maxWidthClasses = {
    none: '',
    full: 'w-full',
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };
  
  // Default responsive padding
  const defaultPaddingX = 'px-4 sm:px-6 lg:px-8';
  
  // Default responsive vertical padding
  const defaultPaddingY = 'py-4 sm:py-6 lg:py-8';
  
  // Default responsive vertical spacing
  const defaultSpacingY = 'space-y-4 sm:space-y-6 lg:space-y-8';
  
  // Determine horizontal padding class
  let paddingXClass = '';
  if (paddingX === true) {
    paddingXClass = defaultPaddingX;
  } else if (typeof paddingX === 'string') {
    paddingXClass = paddingX;
  }
  
  // Determine vertical padding class
  let paddingYClass = '';
  if (paddingY === true) {
    paddingYClass = defaultPaddingY;
  } else if (typeof paddingY === 'string') {
    paddingYClass = paddingY;
  }
  
  // Determine vertical spacing class
  let spacingYClass = '';
  if (spacingY === true) {
    spacingYClass = defaultSpacingY;
  } else if (typeof spacingY === 'string') {
    spacingYClass = spacingY;
  }
  
  return (
    <Component
      className={cn(
        'mx-auto', // Center the container
        maxWidthClasses[maxWidth],
        paddingXClass,
        paddingYClass,
        spacingYClass,
        className
      )}
    >
      {children}
    </Component>
  );
}

export default Container; 