'use client';

import { useState } from 'react';
import { AppealOptions } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';
import { Select, Textarea, Checkbox } from './AccessibleInput';

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{t('configureTitle')}</h2>
      
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
          <Select
            id="appealType"
            name="appealType"
            label={t('appealTypeLabel')}
            helperText={t('appealTypePrompt')}
            value={options.appealType}
            onChange={handleChange}
            disabled={disabled}
            options={[
              { value: 'procedural', label: t('procedural') },
              { value: 'factual', label: t('factual') },
              { value: 'legal', label: t('legal') },
              { value: 'comprehensive', label: t('comprehensive') }
            ]}
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
          <Textarea
            id="customDetails"
            name="customDetails"
            label={t('detailsLabel')}
            helperText={t('detailsHelp')}
            rows={4}
            placeholder={t('detailsPlaceholder')}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <Checkbox
              id="includeTemplateText"
              name="includeTemplateText"
              label={t('templateText')}
              checked={options.includeTemplateText}
              onChange={handleChange}
              disabled={disabled}
            />
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 