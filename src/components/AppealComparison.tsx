'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface AppealComparisonProps {
  originalText: string;
  modifiedText: string;
  onClose: () => void;
}

export default function AppealComparison({
  originalText,
  modifiedText,
  onClose
}: AppealComparisonProps) {
  const { t } = useLanguage();
  const [diffs, setDiffs] = useState<Array<{ text: string; added?: boolean; removed?: boolean }>>([]);
  
  // Simple diffing algorithm
  useEffect(() => {
    const findDifferences = () => {
      // Split the texts into words for comparison
      const originalWords = originalText.split(/\s+/);
      const modifiedWords = modifiedText.split(/\s+/);
      
      let i = 0;
      let j = 0;
      const result: Array<{ text: string; added?: boolean; removed?: boolean }> = [];
      
      while (i < originalWords.length || j < modifiedWords.length) {
        if (i >= originalWords.length) {
          // Remaining modified words are additions
          const added = modifiedWords.slice(j).join(' ');
          result.push({ text: added, added: true });
          break;
        } else if (j >= modifiedWords.length) {
          // Remaining original words are removals
          const removed = originalWords.slice(i).join(' ');
          result.push({ text: removed, removed: true });
          break;
        } else if (originalWords[i] === modifiedWords[j]) {
          // Words match, add as unchanged
          result.push({ text: originalWords[i] });
          i++;
          j++;
        } else {
          // Words don't match, check if it's an addition or removal
          const nextMatchInOriginal = originalWords.slice(i + 1).findIndex(word => word === modifiedWords[j]);
          const nextMatchInModified = modifiedWords.slice(j + 1).findIndex(word => word === originalWords[i]);
          
          if (nextMatchInOriginal !== -1 && (nextMatchInModified === -1 || nextMatchInOriginal <= nextMatchInModified)) {
            // It's a removal
            result.push({ text: originalWords[i], removed: true });
            i++;
          } else {
            // It's an addition
            result.push({ text: modifiedWords[j], added: true });
            j++;
          }
        }
      }
      
      // Combine adjacent diffs of the same type
      const combinedResult: Array<{ text: string; added?: boolean; removed?: boolean }> = [];
      let currentDiff: { text: string; added?: boolean; removed?: boolean } | null = null;
      
      for (const diff of result) {
        if (!currentDiff) {
          currentDiff = { ...diff };
        } else if (
          (currentDiff.added && diff.added) ||
          (currentDiff.removed && diff.removed) ||
          (!currentDiff.added && !currentDiff.removed && !diff.added && !diff.removed)
        ) {
          currentDiff.text += ' ' + diff.text;
        } else {
          combinedResult.push(currentDiff);
          currentDiff = { ...diff };
        }
      }
      
      if (currentDiff) {
        combinedResult.push(currentDiff);
      }
      
      setDiffs(combinedResult);
    };
    
    findDifferences();
  }, [originalText, modifiedText]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('compareVersions')}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 flex-grow overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('originalVersion')}</h3>
              <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                {originalText}
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('modifiedVersion')}</h3>
              <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                {modifiedText}
              </div>
            </div>
          </div>
          
          <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('differences')}</h3>
            <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {diffs.map((diff, index) => (
                <span 
                  key={index}
                  className={`
                    ${diff.added ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : ''}
                    ${diff.removed ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through' : ''}
                  `}
                >
                  {diff.text}{' '}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
} 