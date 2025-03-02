'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Select } from '@/components/AccessibleInput';
import DocumentScanner from '@/components/DocumentScanner';
import FineCalculator from '@/components/FineCalculator';
import AppealSuccessPredictor from '@/components/AppealSuccessPredictor';
import DeadlineTracker from '@/components/DeadlineTracker';
import OfficerStatementAnalyzer from '@/components/OfficerStatementAnalyzer';

type ToolType = 'scanner' | 'calculator' | 'predictor' | 'deadlines' | 'statementAnalyzer';

export default function ToolsPage() {
  const { t } = useLanguage();
  const [selectedTool, setSelectedTool] = useState<ToolType>('calculator');
  
  const tools = [
    { id: 'calculator', name: t('fineCalculator') || 'Fine Calculator', description: t('fineCalculatorDescription') || 'Estimate potential fines and calculate possible savings' },
    { id: 'predictor', name: t('appealSuccessPredictor') || 'Appeal Success Predictor', description: t('appealPredictorDescription') || 'Predict your chances of winning an appeal' },
    { id: 'scanner', name: t('documentScanner') || 'Document Scanner', description: t('documentScannerDescription') || 'Scan and process your traffic tickets' },
    { id: 'deadlines', name: t('deadlineTracker') || 'Legal Deadline Tracker', description: t('deadlinesPageDescription') || 'Track important appeal deadlines' },
    { id: 'statementAnalyzer', name: t('officerStatementAnalyzer') || 'Officer Statement Analyzer', description: t('officerStatementDescription') || 'Analyze officer statements for potential weaknesses' }
  ];

  const renderSelectedTool = () => {
    switch (selectedTool) {
      case 'scanner':
        return <DocumentScanner />;
      case 'calculator':
        return <FineCalculator />;
      case 'predictor':
        return <AppealSuccessPredictor />;
      case 'deadlines':
        return <DeadlineTracker />;
      case 'statementAnalyzer':
        return <OfficerStatementAnalyzer />;
      default:
        return <FineCalculator />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('usefulTools') || 'Useful Tools'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl">
          {t('toolsPageDescription') || 
           'Access a suite of specialized tools designed to help you manage traffic tickets and appeals more effectively. Our tools provide calculations, guidance, and organization to improve your chances of success.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Tool Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('availableTools') || 'Available Tools'}
            </h2>
            
            <div className="mb-4 block lg:hidden">
              <Select
                id="toolSelect"
                label={t('selectTool') || 'Select a tool'}
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value as ToolType)}
                options={tools.map(tool => ({ value: tool.id, label: tool.name }))}
              />
            </div>
            
            <div className="hidden lg:block">
              <nav className="space-y-1">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id as ToolType)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      selectedTool === tool.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750'
                    } transition-colors`}
                  >
                    {/* Tool-specific icons */}
                    {tool.id === 'calculator' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {tool.id === 'predictor' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {tool.id === 'scanner' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {tool.id === 'deadlines' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {tool.id === 'statementAnalyzer' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                    <span>{tool.name}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                  {t('whyUseTools') || 'Why Use These Tools?'}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {t('toolsRationale') || 'Our tools can help increase your chances of success with traffic ticket appeals by providing evidence-based guidance, organization, and professional formatting.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Selected Tool */}
        <div className="lg:col-span-3">
          {renderSelectedTool()}
        </div>
      </div>
    </div>
  );
} 