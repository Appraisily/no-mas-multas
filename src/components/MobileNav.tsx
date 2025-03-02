'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { useBreakpointMatch } from '@/lib/responsive';
import ThemeSwitcher from './ThemeSwitcher';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export default function MobileNav() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isDesktop = useBreakpointMatch('lg');
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  // Close menu when window resizes to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsMenuOpen(false);
    }
  }, [isDesktop]);

  // Navigation items
  const navItems: NavItem[] = [
    {
      label: t('home'),
      path: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: t('myAppeals'),
      path: '/my-appeals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: t('tools'),
      path: '/tools',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15 5.414 17.586 8 15 10.586l-1.293 1.293a1 1 0 01-1.414-1.414L13 9.586 11.414 8 13 6.414l-.293-.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: t('stats'),
      path: '/statistics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      label: t('deadlines'),
      path: '/deadlines',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  // Only show on mobile and tablet
  if (isDesktop) {
    return null;
  }

  return (
    <>
      {/* Mobile Navigation Bar - Fixed to Bottom */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                pathname === item.path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          ))}
          <button
            className="flex flex-col items-center justify-center w-full h-full text-gray-600 dark:text-gray-400"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">{t('more')}</span>
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-bold">{t('menu')}</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    aria-label="Close menu"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Menu Content */}
                <div className="overflow-y-auto flex-grow p-4">
                  <ul className="space-y-4">
                    <li className="border-b border-gray-200 dark:border-gray-800 pb-4">
                      <ThemeSwitcher />
                    </li>
                    
                    {/* User Section */}
                    <li className="border-b border-gray-200 dark:border-gray-800 pb-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold">{t('profile')}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{t('editAccount')}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                          {t('signIn')}
                        </button>
                        <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                          {t('signUp')}
                        </button>
                      </div>
                    </li>
                    
                    {/* Additional links section */}
                    <li className="border-b border-gray-200 dark:border-gray-800 pb-4">
                      <h3 className="font-semibold mb-2">{t('helpAndSupport')}</h3>
                      <ul className="space-y-2">
                        <li>
                          <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                            {t('faq')}
                          </a>
                        </li>
                        <li>
                          <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                            {t('contactSupport')}
                          </a>
                        </li>
                      </ul>
                    </li>
                    
                    {/* Legal section */}
                    <li>
                      <h3 className="font-semibold mb-2">{t('legal')}</h3>
                      <ul className="space-y-2">
                        <li>
                          <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                            {t('termsOfService')}
                          </a>
                        </li>
                        <li>
                          <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                            {t('privacyPolicy')}
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                
                {/* Footer with app version */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
                  {t('appName')} v1.0.0
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom padding to account for the fixed navbar */}
      <div className="pb-16 lg:pb-0"></div>
    </>
  );
} 