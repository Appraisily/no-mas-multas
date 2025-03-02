'use client';

import React from 'react';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Grid, GridItem } from '@/components/ui/grid';
import { ResponsiveHeader } from '@/components/ui/responsive-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBreakpoint, useBreakpointMatch } from '@/lib/responsive';

export default function StyleGuidePage() {
  const currentBreakpoint = useBreakpoint();
  const isDesktop = useBreakpointMatch('lg');
  
  return (
    <div>
      {/* Page Header */}
      <Section background="gradient" paddingY="py-16 md:py-24">
        <ResponsiveHeader 
          as="h1" 
          size="3xl" 
          align="center" 
          color="gradient"
          className="mb-6"
        >
          Responsive Design Style Guide
        </ResponsiveHeader>
        <p className="text-center text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          A comprehensive guide to responsive components and utilities in the NoMasMultas application
        </p>
      </Section>
      
      {/* Current Breakpoint Display */}
      <Section background="white">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-8 text-center">
          <p className="text-lg font-medium">
            Current Breakpoint: <span className="font-bold text-blue-600 dark:text-blue-400">{currentBreakpoint}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Resize your browser window to see this change
          </p>
        </div>
        
        <ResponsiveHeader>Responsive Components</ResponsiveHeader>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          These components automatically adapt to different screen sizes
        </p>
        
        {/* Responsive Grid */}
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Responsive Grid</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            The grid automatically adjusts the number of columns based on screen size
          </p>
          
          <Grid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} className="mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div 
                key={item} 
                className="bg-blue-100 dark:bg-blue-900/40 p-6 rounded-lg text-center"
              >
                Grid Item {item}
              </div>
            ))}
          </Grid>
          
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Grid with spanning items
          </p>
          
          <Grid cols={{ xs: 1, sm: 2, md: 4 }} className="mb-8">
            <GridItem colSpan={{ xs: 1, md: 2 }} className="bg-green-100 dark:bg-green-900/40 p-6 rounded-lg text-center">
              Span 2 columns on medium+
            </GridItem>
            <div className="bg-blue-100 dark:bg-blue-900/40 p-6 rounded-lg text-center">Regular item</div>
            <div className="bg-blue-100 dark:bg-blue-900/40 p-6 rounded-lg text-center">Regular item</div>
            <GridItem colSpan={{ xs: 1, sm: 2 }} className="bg-purple-100 dark:bg-purple-900/40 p-6 rounded-lg text-center">
              Span 2 columns on small+
            </GridItem>
            <div className="bg-blue-100 dark:bg-blue-900/40 p-6 rounded-lg text-center">Regular item</div>
          </Grid>
        </div>
        
        {/* Responsive Headers */}
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Responsive Headers</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Headers adjust their size based on screen size
          </p>
          
          <div className="space-y-6">
            <ResponsiveHeader as="h1" size="4xl">Header Size 4XL</ResponsiveHeader>
            <ResponsiveHeader as="h2" size="3xl">Header Size 3XL</ResponsiveHeader>
            <ResponsiveHeader as="h3" size="2xl">Header Size 2XL</ResponsiveHeader>
            <ResponsiveHeader as="h4" size="xl">Header Size XL</ResponsiveHeader>
            <ResponsiveHeader as="h5" size="lg">Header Size LG</ResponsiveHeader>
            <ResponsiveHeader as="h6" size="md">Header Size MD</ResponsiveHeader>
          </div>
        </div>
        
        {/* Responsive Section */}
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Responsive Sections</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Sections with different background styles and responsive padding
          </p>
          
          <div className="space-y-4">
            <Section background="light" paddingY="py-6" className="rounded-lg">
              <p className="text-center">Light Background Section</p>
            </Section>
            
            <Section background="dark" paddingY="py-6" className="rounded-lg">
              <p className="text-center">Dark Background Section</p>
            </Section>
            
            <Section background="gradient" paddingY="py-6" className="rounded-lg">
              <p className="text-center">Gradient Background Section</p>
            </Section>
          </div>
        </div>
        
        {/* Responsive Container */}
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Responsive Containers</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Containers with different max-widths
          </p>
          
          <div className="space-y-4">
            <Container maxWidth="sm" className="bg-yellow-100 dark:bg-yellow-900/40 p-4 rounded-lg">
              <p className="text-center">Small Container</p>
            </Container>
            
            <Container maxWidth="md" className="bg-yellow-100 dark:bg-yellow-900/40 p-4 rounded-lg">
              <p className="text-center">Medium Container</p>
            </Container>
            
            <Container maxWidth="lg" className="bg-yellow-100 dark:bg-yellow-900/40 p-4 rounded-lg">
              <p className="text-center">Large Container</p>
            </Container>
          </div>
        </div>
      </Section>
      
      {/* Utility Classes */}
      <Section background="light">
        <ResponsiveHeader className="mb-8">Responsive Utility Classes</ResponsiveHeader>
        
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Visibility Classes</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Control visibility based on screen size
          </p>
          
          <div className="space-y-4">
            <div className="hide-on-mobile bg-pink-100 dark:bg-pink-900/40 p-4 rounded-lg text-center">
              <p>This is only visible on tablet and above (sm+)</p>
            </div>
            
            <div className="hide-on-desktop bg-pink-100 dark:bg-pink-900/40 p-4 rounded-lg text-center">
              <p>This is only visible on mobile (xs)</p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Text Size Classes</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Text that adjusts size based on screen size
          </p>
          
          <div className="space-y-4">
            <p className="mobile-text-xs">Extra Small Text (xs → sm)</p>
            <p className="mobile-text-sm">Small Text (sm → base)</p>
            <p className="mobile-text-base">Base Text (base → lg)</p>
            <p className="mobile-text-lg">Large Text (lg → xl)</p>
            <p className="mobile-text-xl">Extra Large Text (xl → 2xl)</p>
          </div>
        </div>
        
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Spacing Classes</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Responsive padding and margins
          </p>
          
          <div className="space-y-6">
            <div className="pad-responsive bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
              <p className="text-center">Responsive Padding (X and Y)</p>
            </div>
            
            <div className="pad-x-responsive bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
              <p className="text-center">Responsive Horizontal Padding</p>
            </div>
            
            <div className="pad-y-responsive bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
              <p className="text-center">Responsive Vertical Padding</p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Flex Direction Classes</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Change flex direction based on screen size
          </p>
          
          <div className="space-y-6">
            <div className="flex-col-to-row gap-4">
              <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg text-center">
                <p>Column on mobile, row on tablets+</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg text-center">
                <p>Column on mobile, row on tablets+</p>
              </div>
            </div>
            
            <div className="flex-row-to-col gap-4">
              <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg text-center">
                <p>Row on mobile, column on tablets+</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg text-center">
                <p>Row on mobile, column on tablets+</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Mobile Optimizations */}
      <Section background="white">
        <ResponsiveHeader className="mb-8">Mobile-Specific Optimizations</ResponsiveHeader>
        
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Touch-Friendly Targets</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Larger touch targets for mobile devices
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="touch-target bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
              Touch-Friendly Button
            </button>
            
            <button className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded">
              Small Button
            </button>
          </div>
        </div>
        
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Safe Area Insets</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Respect safe areas on modern mobile devices
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <div className="bg-purple-100 dark:bg-purple-900/40 p-4 safe-bottom rounded-lg">
              <p>Safe Bottom Padding</p>
            </div>
            
            <div className="bg-purple-100 dark:bg-purple-900/40 p-4 safe-top rounded-lg">
              <p>Safe Top Padding</p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <ResponsiveHeader as="h3" size="lg" className="mb-4">Responsive Images</ResponsiveHeader>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Images that scale appropriately
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2">Responsive image with max-width: 100%</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                <img 
                  src="https://via.placeholder.com/800x400" 
                  alt="Placeholder" 
                  className="rounded"
                />
              </div>
            </div>
            
            <div>
              <p className="mb-2">Fixed width image that may overflow on small screens</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg overflow-auto">
                <img 
                  src="https://via.placeholder.com/800x400" 
                  alt="Placeholder" 
                  className="rounded"
                  style={{ width: '800px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Device Testing */}
      <Section background="light">
        <ResponsiveHeader className="mb-8">Device Testing</ResponsiveHeader>
        
        <div className="mb-6">
          <p>You are currently viewing this on a {isDesktop ? 'desktop' : 'mobile'} device.</p>
          <p className="mt-2">Current breakpoint: <span className="font-bold">{currentBreakpoint}</span></p>
        </div>
        
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg mb-6">
          <p className="font-medium">Test this page on different devices and screen sizes to see how the responsive components and utilities adapt.</p>
        </div>
        
        <Grid cols={{ xs: 1, md: 2 }} gap={6}>
          <Card className="bg-white dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Testing on Mobile</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Use your browser's developer tools to simulate different mobile devices
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                <li>Chrome: Press F12, then click the mobile icon</li>
                <li>Firefox: Press F12, then click the responsive design mode icon</li>
                <li>Safari: Open Developer menu, select "Enter Responsive Design Mode"</li>
              </ul>
            </div>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Common Breakpoints</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Standard breakpoints used in our responsive design:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                <li><strong>xs:</strong> 320px (small phones)</li>
                <li><strong>sm:</strong> 640px (large phones, small tablets)</li>
                <li><strong>md:</strong> 768px (tablets)</li>
                <li><strong>lg:</strong> 1024px (laptops/desktops)</li>
                <li><strong>xl:</strong> 1280px (large desktops)</li>
                <li><strong>2xl:</strong> 1536px (extra large desktops)</li>
              </ul>
            </div>
          </Card>
        </Grid>
      </Section>
    </div>
  );
} 