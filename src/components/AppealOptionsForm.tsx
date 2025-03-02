'use client';

import { useState } from 'react';
import { AppealOptions } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';

interface AppealOptionsFormProps {
  onOptionsChange: (options: AppealOptions) => void;
  disabled?: boolean;
}

export default function AppealOptionsForm({ onOptionsChange, disabled = false }: AppealOptionsFormProps) {
  const { t } = useLanguage();
  const [options, setOptions] = useState<AppealOptions>({
    appealType: 'comprehensive',
    includeTemplateText: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setOptions(prev => {
        const newOptions = { ...prev, [name]: checked };
        onOptionsChange(newOptions);
        return newOptions;
      });
      return;
    }
    
    // Handle other inputs
    setOptions(prev => {
      const newOptions = { ...prev, [name]: value };
      onOptionsChange(newOptions);
      return newOptions;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('configureTitle')}</h2>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <label htmlFor="appealType" className="block text-sm font-medium text-gray-700 mb-2">
            {t('appealTypeLabel')}
          </label>
          <select
            id="appealType"
            name="appealType"
            value={options.appealType}
            onChange={handleChange}
            disabled={disabled}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
          >
            <option value="procedural">{t('procedural')}</option>
            <option value="factual">{t('factual')}</option>
            <option value="legal">{t('legal')}</option>
            <option value="comprehensive">{t('comprehensive')}</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            {t('appealTypePrompt')}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <label htmlFor="customDetails" className="block text-sm font-medium text-gray-700 mb-2">
            {t('detailsLabel')}
          </label>
          <textarea
            id="customDetails"
            name="customDetails"
            rows={4}
            placeholder={t('detailsPlaceholder')}
            onChange={handleChange}
            disabled={disabled}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
          />
          <p className="mt-2 text-sm text-gray-500">
            {t('detailsHelp')}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-center">
          <div className="flex items-center flex-1">
            <input
              type="checkbox"
              id="includeTemplateText"
              name="includeTemplateText"
              checked={options.includeTemplateText}
              onChange={handleChange}
              disabled={disabled}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
            />
            <label htmlFor="includeTemplateText" className="ml-3 block text-sm text-gray-700">
              {t('templateText')}
            </label>
          </div>
          <div className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 