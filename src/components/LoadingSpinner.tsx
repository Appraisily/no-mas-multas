'use client';

import { useLanguage } from '@/lib/LanguageContext';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ fullScreen = false, message }: LoadingSpinnerProps) {
  const { t } = useLanguage();
  const defaultMessage = t('loading');
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-transparent border-t-blue-600 border-b-blue-600 dark:border-t-blue-400 dark:border-b-blue-400 animate-spin"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-transparent border-l-blue-300 border-r-blue-300 dark:border-l-blue-200 dark:border-r-blue-200 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-200 font-medium">{message || defaultMessage}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-transparent border-t-blue-600 border-b-blue-600 dark:border-t-blue-400 dark:border-b-blue-400 animate-spin"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-transparent border-l-blue-300 border-r-blue-300 dark:border-l-blue-200 dark:border-r-blue-200 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
      </div>
      <p className="mt-4 text-gray-700 dark:text-gray-200">{message || defaultMessage}</p>
    </div>
  );
} 