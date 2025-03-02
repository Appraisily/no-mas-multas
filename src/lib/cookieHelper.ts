/**
 * Cookie helper functions for managing user preferences and state
 */

const FIRST_VISIT_COOKIE = 'no-mas-multas-first-visit';
const THEME_PREFERENCE_COOKIE = 'no-mas-multas-theme';
const LANGUAGE_PREFERENCE_COOKIE = 'no-mas-multas-language';

/**
 * Set a cookie with a given name, value, and expiration days
 */
export const setCookie = (name: string, value: string, days: number = 365): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

/**
 * Get a cookie by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

/**
 * Delete a cookie by name
 */
export const deleteCookie = (name: string): void => {
  setCookie(name, '', -1);
};

/**
 * Check if this is the user's first visit
 */
export function isFirstVisit(): boolean {
  if (typeof window === 'undefined') return false;
  return !document.cookie.includes(`${FIRST_VISIT_COOKIE}=false`);
}

/**
 * Mark the user as having visited before
 */
export function markAsVisited(): void {
  if (typeof window === 'undefined') return;
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `${FIRST_VISIT_COOKIE}=false; expires=${expiryDate.toUTCString()}; path=/`;
}

/**
 * Set a theme preference cookie
 */
export function setThemePreference(theme: string): void {
  if (typeof window === 'undefined') return;
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `${THEME_PREFERENCE_COOKIE}=${theme}; expires=${expiryDate.toUTCString()}; path=/`;
}

/**
 * Get the user's theme preference
 */
export function getThemePreference(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${THEME_PREFERENCE_COOKIE}=([^;]+)`));
  return match ? match[2] : null;
}

/**
 * Set a language preference cookie
 */
export function setLanguagePreference(language: string): void {
  if (typeof window === 'undefined') return;
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `${LANGUAGE_PREFERENCE_COOKIE}=${language}; expires=${expiryDate.toUTCString()}; path=/`;
}

/**
 * Get the user's language preference
 */
export function getLanguagePreference(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${LANGUAGE_PREFERENCE_COOKIE}=([^;]+)`));
  return match ? match[2] : null;
}

/**
 * Clear all app cookies
 */
export function clearAllCookies(): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${FIRST_VISIT_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${THEME_PREFERENCE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${LANGUAGE_PREFERENCE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
} 