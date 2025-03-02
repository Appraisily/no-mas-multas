'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from './translations';
import { LanguageContextType, LanguageProviderProps, Language } from './translations/types';
import mapTranslationKey from './translations/translationMapper';

// Create the language context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

// Create a provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  // Get initial language from localStorage or use default 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      return savedLanguage || 'en';
    }
    return 'en';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  // Function to set language
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  // Translation function that uses the new structure with fallback
  const t = (key: string): string => {
    // Map the key if it's using the old format
    const mappedKey = mapTranslationKey(key);
    
    // Get the translations for the current language
    const langTranslations = translations[language];
    
    // Return the translation if it exists, otherwise return the key
    return langTranslations[mappedKey] || mappedKey;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;

