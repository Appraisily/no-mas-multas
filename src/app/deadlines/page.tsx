'use client';

import { useLanguage } from '@/lib/LanguageContext';
import DeadlineTracker from '@/components/DeadlineTracker';
import { useToast } from '@/components/ToastNotification';
import { useEffect } from 'react';

export default function DeadlinesPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  
  useEffect(() => {
    // Show a welcome message when the user first visits the deadlines page
    const hasVisitedDeadlines = localStorage.getItem('hasVisitedDeadlines');
    if (!hasVisitedDeadlines) {
      showToast(
        t('deadlinesWelcomeMessage') || 'Welcome to the Legal Deadline Tracker! Add your important deadlines to stay organized.',
        'info',
        6000 // longer duration for welcome message
      );
      localStorage.setItem('hasVisitedDeadlines', 'true');
    }
  }, [showToast, t]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('deadlineTracker') || 'Legal Deadline Tracker'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          {t('deadlinesPageDescription') || 
            'Missing a legal deadline can be costly. Use this tool to track important dates related to your traffic ticket appeals, ensuring you never miss a crucial deadline.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <DeadlineTracker />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('tipsForDeadlines') || 'Tips for Managing Legal Deadlines'}
          </h2>
          
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('deadlineTip1') || 'Add deadlines as soon as you receive documentation - don\'t delay.'}</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('deadlineTip2') || 'Set deadlines a few days earlier than the actual due date to give yourself buffer time.'}</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('deadlineTip3') || 'Use the priority feature to help you focus on the most critical deadlines first.'}</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('deadlineTip4') || 'Check your local court\'s rules for calculating deadlines - some exclude weekends and holidays.'}</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{t('deadlineTip5') || 'Keep all related documents organized and easily accessible as deadlines approach.'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 