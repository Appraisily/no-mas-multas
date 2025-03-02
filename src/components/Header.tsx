'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-900 dark:to-blue-950 shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
            <p className="mt-1 text-blue-100">{t('subtitle')}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-1 bg-blue-800 hover:bg-blue-700 text-white py-2 px-3 rounded-md transition-colors"
              >
                <span>{language === 'en' ? t('languageEn') : t('languageEs')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={() => {
                          setLanguage('en');
                          setMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          language === 'en' 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {t('languageEn')}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setLanguage('es');
                          setMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          language === 'es'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {t('languageEs')}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 