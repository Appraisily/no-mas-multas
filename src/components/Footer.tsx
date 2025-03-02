'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Fighting traffic and parking tickets with AI technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482 13.98 13.98 0 01-10.15-5.147 4.92 4.92 0 001.522 6.574 4.9 4.9 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.927 4.927 0 004.598 3.42 9.89 9.89 0 01-6.115 2.107c-.398 0-.79-.023-1.177-.068a13.945 13.945 0 007.548 2.212c9.057 0 14.009-7.503 14.009-14.01 0-.213-.005-.425-.014-.636a10.012 10.012 0 002.46-2.548l-.047-.02z"/>
                </svg>
              </a>
              <a href="#" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('home')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('howItWorks')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('pricing')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('faq')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('contact')}</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('legal')}</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('privacyPolicy')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('termsOfService')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('cookiePolicy')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('disclaimer')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} {t('title')}. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
} 