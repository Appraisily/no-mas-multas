import { ReactNode } from 'react';

// Define the language types
export type Language = 'en' | 'es';

// Define the structure for the language context
export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Define the props for the language provider
export interface LanguageProviderProps {
  children: ReactNode;
}

// Define the structure for translations
export type Translations = {
  [key: string]: {
    [key: string]: string;
  };
}; 