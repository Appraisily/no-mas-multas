'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import ThemeSwitcher from './ThemeSwitcher';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AppealAI</h1>
              <span className="ml-2 text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 font-medium">Beta</span>
            </Link>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6 mr-4">
              <Link href="/tools" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                Tools
              </Link>
              <Link href="/my-appeals" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                My Appeals
              </Link>
              <Link href="/statistics" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                Statistics
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <ThemeSwitcher />

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <img 
                    src={language === 'en' ? '/flags/us.svg' : '/flags/es.svg'} 
                    alt={language === 'en' ? 'English' : 'Español'} 
                    className="w-6 h-6 object-cover"
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 z-50">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => {
                            setLanguage('en');
                            setMenuOpen(false);
                          }}
                          className={`flex items-center px-3 py-2 w-full text-left text-sm ${
                            language === 'en'
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <img src="/flags/us.svg" alt="English" className="w-4 h-4 mr-2" />
                          English
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setLanguage('es');
                            setMenuOpen(false);
                          }}
                          className={`flex items-center px-3 py-2 w-full text-left text-sm ${
                            language === 'es'
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <img src="/flags/es.svg" alt="Español" className="w-4 h-4 mr-2" />
                          Español
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" className="hidden md:flex">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 