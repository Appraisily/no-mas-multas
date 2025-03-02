'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'right' | 'bottom' | 'left';
}

interface GuidedTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function GuidedTour({ isActive, onComplete, onSkip }: GuidedTourProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  // Define the tour steps
  const tourSteps: TourStep[] = [
    {
      target: '.file-upload-area',
      title: t('tourUploadTitle') || 'Upload Your Document',
      content: t('tourUploadContent') || 'Start by uploading your fine document here. We support PDF, JPG, and PNG formats.',
      placement: 'bottom',
    },
    {
      target: '.analyze-button',
      title: t('tourAnalyzeTitle') || 'Analyze Your Document',
      content: t('tourAnalyzeContent') || 'Once uploaded, click this button to analyze your document and extract fine details.',
      placement: 'top',
    },
    {
      target: '.appeal-options',
      title: t('tourOptionsTitle') || 'Configure Appeal Options',
      content: t('tourOptionsContent') || 'Choose the type of appeal and customize any additional details you want to include.',
      placement: 'right',
    },
    {
      target: '.generate-button',
      title: t('tourGenerateTitle') || 'Generate Your Appeal',
      content: t('tourGenerateContent') || 'Click here to generate your appeal based on the fine details and your selected options.',
      placement: 'top',
    },
    {
      target: '.appeal-text',
      title: t('tourAppealTitle') || 'Review and Edit',
      content: t('tourAppealContent') || 'Review the generated appeal and make any necessary edits before exporting or printing.',
      placement: 'left',
    },
  ];
  
  // Find the target element and calculate position
  useEffect(() => {
    if (!isActive) return;
    
    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      setTargetElement(element);
      updatePosition(element, step.placement);
    }
    
    // Add a resize listener to recalculate position
    const handleResize = () => {
      if (element) {
        updatePosition(element, step.placement);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive, currentStep, tourSteps]);
  
  // Calculate position for the tooltip
  const updatePosition = (element: Element, placement: 'top' | 'right' | 'bottom' | 'left') => {
    const rect = element.getBoundingClientRect();
    const OFFSET = 20; // Distance from the target element
    
    let top = 0;
    let left = 0;
    
    switch (placement) {
      case 'top':
        top = rect.top - OFFSET;
        left = rect.left + rect.width / 2;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + OFFSET;
        break;
      case 'bottom':
        top = rect.bottom + OFFSET;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - OFFSET;
        break;
    }
    
    setPosition({ top, left });
  };
  
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  if (!isActive) return null;
  
  const step = tourSteps[currentStep];
  
  // Calculate classes for different placements
  const getTooltipClasses = () => {
    const base = "fixed z-50 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 w-72 transition-all duration-300";
    
    switch (step.placement) {
      case 'top':
        return `${base} transform -translate-x-1/2 -translate-y-full`;
      case 'right':
        return `${base} transform translate-y-[-50%]`;
      case 'bottom':
        return `${base} transform -translate-x-1/2`;
      case 'left':
        return `${base} transform -translate-x-full translate-y-[-50%]`;
      default:
        return base;
    }
  };
  
  // Create an arrow element based on placement
  const getArrowElement = () => {
    const baseArrow = "absolute w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45";
    
    switch (step.placement) {
      case 'top':
        return <div className={`${baseArrow} -bottom-2 left-1/2 -translate-x-1/2`}></div>;
      case 'right':
        return <div className={`${baseArrow} -left-2 top-1/2 -translate-y-1/2`}></div>;
      case 'bottom':
        return <div className={`${baseArrow} -top-2 left-1/2 -translate-x-1/2`}></div>;
      case 'left':
        return <div className={`${baseArrow} -right-2 top-1/2 -translate-y-1/2`}></div>;
      default:
        return null;
    }
  };
  
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onSkip}></div>
      
      {/* Tooltip */}
      <div 
        className={getTooltipClasses()} 
        style={{ 
          top: `${position.top}px`, 
          left: `${position.left}px` 
        }}
      >
        {getArrowElement()}
        
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-800 dark:text-white">{step.title}</h3>
          <button 
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{step.content}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentStep + 1} / {tourSteps.length}
            </span>
          </div>
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t('previous') || 'Previous'}
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {currentStep < tourSteps.length - 1 ? (t('next') || 'Next') : (t('finish') || 'Finish')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Highlight around target element */}
      {targetElement && (
        <div
          className="fixed z-40 border-4 border-blue-500 rounded-lg pointer-events-none"
          style={{
            top: targetElement.getBoundingClientRect().top - 4,
            left: targetElement.getBoundingClientRect().left - 4,
            width: targetElement.getBoundingClientRect().width + 8,
            height: targetElement.getBoundingClientRect().height + 8,
            transition: 'all 0.3s ease-in-out',
          }}
        />
      )}
    </>
  );
} 