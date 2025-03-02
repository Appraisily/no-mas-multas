'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { useKeyboardShortcuts } from '@/lib/useKeyboardShortcuts';
import ThemeSwitcher from './ThemeSwitcher';
import KeyboardShortcutsDialog from './KeyboardShortcutsDialog';
import { HomeIcon, ChartBarIcon, DocumentPlusIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Demo purposes, normally would be auth state
  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false);
  
  // Track window size for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Track scroll position for styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  };
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    toggleTheme,
    toggleLanguage,
    onShowShortcutsHelp: () => setIsShortcutsDialogOpen(true),
    onEscape: () => {
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
    }
  });

  // Close menus when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest('#user-menu-container')) {
        setIsUserMenuOpen(false);
      }
      if (isMenuOpen && !target.closest('#mobile-menu') && !target.closest('#mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isMenuOpen]);
  
  // Check if a route is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };
  
  // Define main navigation links
  const mainNavLinks = [
    { href: '/', label: 'home', icon: <HomeIcon className="h-5 w-5" /> },
    { href: '/dashboard', label: 'dashboard', icon: <ChartBarIcon className="h-5 w-5" /> },
    { href: '/appeals/new', label: 'newAppeal', icon: <DocumentPlusIcon className="h-5 w-5" /> },
    { href: '/appeals', label: 'myAppeals', icon: <DocumentTextIcon className="h-5 w-5" /> },
    { href: '/deadlines', label: 'deadlineTracker', icon: <CalendarIcon className="h-5 w-5" /> },
  ];
  
  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center" onClick={closeMenu}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-blue-600 dark:text-blue-400" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  {t('appName') || 'No Más Multas'}
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Language Toggle */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="rounded-full p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors"
                aria-label={t('switchLanguage') || 'Switch language'}
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  {language === 'en' ? '🇺🇸' : '🇪🇸'}
                </span>
              </button>
              
              {/* Theme Switcher */}
              <div className="hidden sm:block">
                <ThemeSwitcher />
              </div>
              
              {/* User Menu (Desktop) */}
              {isLoggedIn && (
                <div className="hidden md:block relative ml-3" id="user-menu-container">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      id="user-menu"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="true"
                      onClick={toggleUserMenu}
                    >
                      <span className="sr-only">{t('openUserMenu') || 'Open user menu'}</span>
                      <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center">
                        <span className="font-medium">JD</span>
                      </div>
                    </button>
                  </div>
                  
                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t('profileSettings') || 'Profile Settings'}
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t('dashboard') || 'Dashboard'}
                      </Link>
                      <button
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                        role="menuitem"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          // Would handle logout here
                        }}
                      >
                        {t('signOut') || 'Sign out'}
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Login/Register (Desktop) */}
              {!isLoggedIn && (
                <div className="hidden md:flex space-x-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {t('login') || 'Log in'}
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {t('register') || 'Register'}
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button*/}
              <div className="md:hidden flex items-center">
                <button
                  id="mobile-menu-button"
                  type="button"
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  onClick={toggleMenu}
                >
                  <span className="sr-only">
                    {isMenuOpen ? (t('closeMenu') || 'Close menu') : (t('openMenu') || 'Open menu')}
                  </span>
                  {isMenuOpen ? (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Theme Switcher (Mobile) */}
          <div className="py-2">
            <div className="px-3 py-2 rounded-md">
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('changeTheme') || 'Change theme'}
                </span>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
          
          {/* Login/Register (Mobile) */}
          {!isLoggedIn && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={closeMenu}
                >
                  {t('login') || 'Log in'}
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  onClick={closeMenu}
                >
                  {t('register') || 'Register'}
                </Link>
              </div>
            </div>
          )}
          
          {/* User Menu (Mobile) */}
          {isLoggedIn && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center">
                    <span className="font-medium">JD</span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">John Doe</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">john.doe@example.com</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={closeMenu}
                >
                  {t('profileSettings') || 'Profile Settings'}
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={closeMenu}
                >
                  {t('dashboard') || 'Dashboard'}
                </Link>
                <button
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    closeMenu();
                    // Would handle logout here
                  }}
                >
                  {t('signOut') || 'Sign out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard shortcuts help dialog */}
      <KeyboardShortcutsDialog 
        isOpen={isShortcutsDialogOpen} 
        onClose={() => setIsShortcutsDialogOpen(false)} 
      />

      {/* Keyboard shortcut indicator */}
      <button
        onClick={() => setIsShortcutsDialogOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors z-40"
        aria-label={t('keyboardShortcuts') || 'Keyboard Shortcuts'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </button>
    </>
  );
} 