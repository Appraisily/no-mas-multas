import React from 'react';
import { cn } from "@/lib/utils";
import { typography } from '@/lib/responsive';

interface ResponsiveHeaderProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right';
  color?: 'default' | 'muted' | 'primary' | 'gradient';
  animate?: boolean;
}

/**
 * A responsive header component that adapts its size to different screen sizes
 * 
 * @param children - The content of the header
 * @param className - Additional classes to apply to the header
 * @param as - The HTML element to render
 * @param size - The size of the header
 * @param weight - The font weight of the header
 * @param align - The text alignment of the header
 * @param color - The color of the header
 * @param animate - Whether to animate the header when it enters the viewport
 */
export function ResponsiveHeader({
  children,
  className,
  as: Component = 'h2',
  size = 'xl',
  weight = 'bold',
  align = 'left',
  color = 'default',
  animate = false,
}: ResponsiveHeaderProps) {
  // Size classes with responsive breakpoints
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl md:text-2xl',
    xl: 'text-xl sm:text-2xl md:text-3xl',
    '2xl': 'text-2xl sm:text-3xl md:text-4xl',
    '3xl': 'text-3xl sm:text-4xl md:text-5xl',
    '4xl': 'text-4xl sm:text-5xl md:text-6xl',
    '5xl': 'text-5xl sm:text-6xl md:text-7xl',
  };
  
  // Font weight classes
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };
  
  // Text alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  // Color classes
  const colorClasses = {
    default: 'text-gray-900 dark:text-white',
    muted: 'text-gray-600 dark:text-gray-400',
    primary: 'text-blue-600 dark:text-blue-400',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400',
  };
  
  // Animation classes
  const animateClasses = animate
    ? 'animate-fade-in-up opacity-0'
    : '';
  
  return (
    <Component
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        alignClasses[align],
        colorClasses[color],
        animateClasses,
        'transition-colors duration-200',
        className
      )}
    >
      {children}
    </Component>
  );
}

export default ResponsiveHeader; 