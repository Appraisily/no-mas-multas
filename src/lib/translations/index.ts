import enTranslations from './en';
// When Spanish translations are added:
// import esTranslations from './es';

import { Translations, Language } from './types';

export const translations: Record<Language, Translations> = {
  en: enTranslations,
  // When Spanish translations are added:
  // es: esTranslations,
  es: {} as Translations, // Placeholder until Spanish translations are added
};

export default translations; 