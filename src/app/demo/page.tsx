'use client';

import React, { useState } from 'react';
import AppealText from '@/components/AppealText';
import { useLanguage } from '@/lib/LanguageContext';

export default function DemoPage() {
  const { t } = useLanguage();
  const [appealText, setAppealText] = useState('');
  
  // Sample fine information for the demo
  const sampleFineInfo = {
    id: 'TKT-12345-XYZ',
    amount: 120,
    currency: 'USD',
    reason: 'Parking in a No Parking Zone',
    date: '2023-06-15',
    location: 'Main Street, Los Angeles, CA',
    vehicleInfo: {
      plate: 'ABC123',
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      color: 'Blue'
    }
  };

  const handleTextChange = (newText: string) => {
    setAppealText(newText);
  };

  const handleAnalyze = () => {
    console.log('Appeal analysis triggered');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('appealWritingAssistant') || 'Appeal Writing Assistant'}
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {t('appealEditor') || 'Appeal Editor'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('demoExplanation') || 'Write your appeal below and get real-time quality analysis and suggestions. The analyzer will automatically evaluate your text and provide actionable feedback.'}
        </p>
        
        <div className="mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  {t('demoTip') || 'Try writing a sample appeal then click "Analyze" in the toolbar to see real-time quality analysis. Apply suggested changes and see your score improve!'}
                </p>
              </div>
            </div>
          </div>
          
          <AppealText 
            initialText={appealText} 
            onTextChange={handleTextChange}
            appealType="factual"
            fineInfo={sampleFineInfo}
            onAnalyze={handleAnalyze}
          />
        </div>
        
        <div className="mt-8 mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            {t('howToUse') || 'How to Use the Appeal Quality Analyzer'}
          </h3>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
            <li className="mb-2">{t('tipBullet1') || 'Click "Analyze" in the toolbar to analyze your appeal'}</li>
            <li className="mb-2">{t('tipBullet2') || 'Review the overall score and individual metrics like clarity, persuasiveness, etc.'}</li>
            <li className="mb-2">{t('tipBullet3') || 'Click "Show Issues" to see specific text problems with suggested corrections'}</li>
            <li className="mb-2">{t('tipBullet4') || 'Click "Apply" on any suggestion to automatically apply the correction'}</li>
            <li className="mb-2">{t('tipBullet5') || 'Implement the suggestions to improve your appeal quality'}</li>
            <li className="mb-2">{t('tipBullet6') || 'Analyze again to see your improved score'}</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                {t('demoNote') || 'This is a demo of the appeal quality analyzer. In a real application, this component would be integrated throughout the appeal writing process to provide continuous feedback.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 