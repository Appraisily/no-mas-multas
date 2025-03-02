'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useEffect, useState } from 'react';

interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  const { t } = useLanguage();
  const [animateStep, setAnimateStep] = useState(0);
  
  // Create animation effect when step changes
  useEffect(() => {
    if (currentStep > animateStep) {
      setAnimateStep(currentStep);
    } else if (currentStep < animateStep) {
      // Add a small delay when going backward
      const timer = setTimeout(() => {
        setAnimateStep(currentStep);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, animateStep]);
  
  return (
    <div className="w-full py-6 overflow-hidden">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center relative flex-1">
            {/* Line before */}
            {index > 0 && (
              <div 
                className={`h-0.5 transition-all duration-500 ${
                  index <= animateStep ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} 
                style={{ 
                  width: '100%',
                  transformOrigin: 'left center',
                  transform: index <= animateStep ? 'scaleX(1)' : 'scaleX(0)',
                }}
              ></div>
            )}
            
            {/* Step circle */}
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium relative transition-all duration-300 ${
                index < animateStep 
                  ? 'bg-blue-600 dark:bg-blue-500 text-white transform scale-110' 
                  : index === animateStep 
                    ? 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900 animate-pulse-custom transform scale-110' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {index < animateStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-fade-in-down" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className={index === animateStep ? 'animate-fade-in-down' : ''}>{index + 1}</span>
              )}
            </div>
            
            {/* Line after */}
            {index < steps.length - 1 && (
              <div 
                className={`h-0.5 transition-all duration-500 ${
                  index < animateStep ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} 
                style={{ 
                  width: '100%',
                  transformOrigin: 'left center',
                  transform: index < animateStep ? 'scaleX(1)' : 'scaleX(0)',
                }}
              ></div>
            )}
            
            {/* Step label */}
            <div 
              className={`absolute -bottom-8 transform -translate-x-1/4 text-xs font-medium transition-all duration-300 ${
                index <= animateStep 
                  ? 'text-blue-700 dark:text-blue-400 font-semibold' 
                  : 'text-gray-700 dark:text-gray-400'
              }`} 
              style={{ 
                width: '100px', 
                textAlign: 'center',
                opacity: index <= animateStep + 1 ? 1 : 0.5,
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 