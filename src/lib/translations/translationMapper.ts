/**
 * This utility helps to transition from the old flat translations structure
 * to the new modular structure with organized translation files.
 * 
 * It provides a map of old keys to new keys, which can be used during the migration
 * phase to ensure backward compatibility.
 */

// Define the mapping from old keys to new keys
export const translationKeyMap: Record<string, string> = {
  // Core translations
  appName: 'appName',
  appTagline: 'appTagline',
  welcomeHeader: 'welcomeHeader',
  signIn: 'signIn',
  signUp: 'signUp',
  
  // UI translations
  toggleTheme: 'toggleTheme',
  lightMode: 'lightMode',
  darkMode: 'darkMode',
  searchPlaceholder: 'searchPlaceholder',
  
  // Appeal translations
  appealQuality: 'appealQuality',
  appealStatsTitle: 'appealStatsTitle',
  templateLibrary: 'templatesLibrary',
  
  // Tools translations
  deadlineTracker: 'deadlineTracker',
  documentScanner: 'documentScanner',
  legalArgumentGenerator: 'legalArgumentGenerator',
  
  // Account translations
  profile: 'profile',
  dashboard: 'dashboard',
  settings: 'settings',
  
  // Legal translations
  termsOfService: 'termsOfService',
  privacyPolicy: 'privacyPolicy',
  
  // Add more mappings as needed
};

/**
 * Translates a key using the mapping if it exists
 * @param key The original translation key
 * @returns The mapped key if it exists, otherwise the original key
 */
export function mapTranslationKey(key: string): string {
  return translationKeyMap[key] || key;
}

export default mapTranslationKey; 