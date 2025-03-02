import React from 'react';
import { cn } from "@/lib/utils";

type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface ResponsiveColumns {
  xs?: ColCount;
  sm?: ColCount;
  md?: ColCount;
  lg?: ColCount;
  xl?: ColCount;
  '2xl'?: ColCount;
}

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: ColCount | ResponsiveColumns;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
}

/**
 * A responsive grid component that adapts the number of columns to different screen sizes
 */
export function Grid({
  children,
  className,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap,
  rowGap,
  columnGap,
}: GridProps) {
  // Mapping of column count to grid template columns class
  const colsToClass: Record<ColCount, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  };
  
  // Generate responsive column classes
  let columnsClass = '';
  
  if (typeof cols === 'number') {
    // If cols is a number, apply the same column count to all screen sizes
    columnsClass = colsToClass[cols as ColCount];
  } else {
    // If cols is a responsive object, apply different column counts to different screen sizes
    const { xs, sm, md, lg, xl, '2xl': xxl } = cols as ResponsiveColumns;
    
    const responsiveClasses = [
      xs && colsToClass[xs],
      sm && `sm:${colsToClass[sm]}`,
      md && `md:${colsToClass[md]}`,
      lg && `lg:${colsToClass[lg]}`,
      xl && `xl:${colsToClass[xl]}`,
      xxl && `2xl:${colsToClass[xxl]}`,
    ].filter(Boolean);
    
    columnsClass = responsiveClasses.join(' ');
  }
  
  // Generate gap classes
  let gapClass = '';
  
  if (gap !== undefined) {
    gapClass = typeof gap === 'number' ? `gap-${gap}` : gap;
  }
  
  if (rowGap !== undefined) {
    gapClass += ` ${typeof rowGap === 'number' ? `row-gap-${rowGap}` : rowGap}`;
  }
  
  if (columnGap !== undefined) {
    gapClass += ` ${typeof columnGap === 'number' ? `col-gap-${columnGap}` : columnGap}`;
  }
  
  // If no gap is specified, apply a default responsive gap
  if (!gap && !rowGap && !columnGap) {
    gapClass = 'gap-4 sm:gap-6 lg:gap-8';
  }
  
  return (
    <div
      className={cn(
        'grid',
        columnsClass,
        gapClass,
        className
      )}
    >
      {children}
    </div>
  );
}

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number | { [key: string]: number };
  rowSpan?: number | { [key: string]: number };
}

/**
 * A grid item component that can span multiple columns or rows
 */
export function GridItem({
  children,
  className,
  colSpan,
  rowSpan,
}: GridItemProps) {
  // Generate column span classes
  let colSpanClass = '';
  
  if (colSpan !== undefined) {
    if (typeof colSpan === 'number') {
      colSpanClass = `col-span-${colSpan}`;
    } else {
      const spans = Object.entries(colSpan).map(([breakpoint, span]) => {
        return breakpoint === 'xs' 
          ? `col-span-${span}` 
          : `${breakpoint}:col-span-${span}`;
      });
      colSpanClass = spans.join(' ');
    }
  }
  
  // Generate row span classes
  let rowSpanClass = '';
  
  if (rowSpan !== undefined) {
    if (typeof rowSpan === 'number') {
      rowSpanClass = `row-span-${rowSpan}`;
    } else {
      const spans = Object.entries(rowSpan).map(([breakpoint, span]) => {
        return breakpoint === 'xs' 
          ? `row-span-${span}` 
          : `${breakpoint}:row-span-${span}`;
      });
      rowSpanClass = spans.join(' ');
    }
  }
  
  return (
    <div
      className={cn(
        colSpanClass,
        rowSpanClass,
        className
      )}
    >
      {children}
    </div>
  );
}

export default Grid; 