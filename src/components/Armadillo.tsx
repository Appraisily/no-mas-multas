'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ArmadilloProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withShadow?: boolean;
  withBorder?: boolean;
  withBackground?: boolean;
  alt?: string;
}

export function Armadillo({
  size = 'md',
  className,
  withShadow = false,
  withBorder = false,
  withBackground = false,
  alt = 'NoMasMultas Armadillo Mascot'
}: ArmadilloProps) {
  // Define sizes
  const sizeMap = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 200, height: 200 },
    xl: { width: 300, height: 300 },
  };

  const dimensions = sizeMap[size];
  
  // Apply styling based on props
  const imageClasses = cn(
    'inline-block',
    withShadow && 'drop-shadow-lg',
    withBorder && 'border-2 border-slate-200 dark:border-slate-700',
    withBackground && 'p-2 bg-white dark:bg-slate-900 rounded-full',
    className
  );

  return (
    <div className={imageClasses}>
      <Image
        src="/armadillo.png" // This assumes you've moved the image to the public folder
        width={dimensions.width}
        height={dimensions.height}
        alt={alt}
        priority={size === 'lg' || size === 'xl'}
        className="transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}

export function ArmadilloWithMessage({
  message,
  size = 'md',
  className,
  ...props
}: ArmadilloProps & { message: string }) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <Armadillo size={size} {...props} />
      <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20 text-accent-foreground max-w-xs">
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

export function ArmadilloAnimation({ className, ...props }: ArmadilloProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden", 
        className
      )}
    >
      <div className="animate-bounce">
        <Armadillo size="lg" withShadow {...props} />
      </div>
    </div>
  );
} 