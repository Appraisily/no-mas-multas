'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type ShortcutAction = 'navigate' | 'toggle' | 'trigger' | 'custom';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: ShortcutAction;
  target?: string;
  handler?: () => void;
  description: string;
  scope?: 'global' | 'editor' | 'dashboard';
  disabled?: boolean;
}

export const DEFAULT_SHORTCUTS: ShortcutConfig[] = [
  {
    key: 'h',
    ctrlKey: true,
    action: 'navigate',
    target: '/',
    description: 'Go to Home page',
    scope: 'global',
  },
  {
    key: 'd',
    ctrlKey: true,
    action: 'navigate',
    target: '/dashboard',
    description: 'Go to Dashboard',
    scope: 'global',
  },
  {
    key: 'a',
    ctrlKey: true,
    action: 'navigate',
    target: '/create-appeal',
    description: 'Create a new appeal',
    scope: 'global',
  },
  {
    key: 'm',
    ctrlKey: true,
    action: 'navigate',
    target: '/my-appeals',
    description: 'View my appeals',
    scope: 'global',
  },
  {
    key: 'k',
    ctrlKey: true,
    action: 'trigger',
    description: 'Show keyboard shortcuts help',
    scope: 'global',
  },
  {
    key: '/',
    action: 'custom',
    description: 'Focus search',
    scope: 'global',
  },
  {
    key: 'Escape',
    action: 'custom',
    description: 'Close dialogs or panels',
    scope: 'global',
  },
  {
    key: 'l',
    ctrlKey: true,
    altKey: true,
    action: 'toggle',
    description: 'Toggle language',
    scope: 'global',
  },
  {
    key: 't',
    ctrlKey: true,
    altKey: true,
    action: 'toggle',
    description: 'Toggle theme (dark/light)',
    scope: 'global',
  },
];

interface UseKeyboardShortcutsProps {
  shortcuts?: ShortcutConfig[];
  toggleTheme?: () => void;
  toggleLanguage?: () => void;
  onShowShortcutsHelp?: () => void;
  onSearchFocus?: () => void;
  onEscape?: () => void;
  scope?: string;
}

export function useKeyboardShortcuts({
  shortcuts = DEFAULT_SHORTCUTS,
  toggleTheme,
  toggleLanguage,
  onShowShortcutsHelp,
  onSearchFocus,
  onEscape,
  scope = 'global',
}: UseKeyboardShortcutsProps = {}) {
  const router = useRouter();
  const handledRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input, textarea, or contentEditable elements
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      // Find matching shortcut
      const shortcut = shortcuts.find(
        (s) =>
          !s.disabled &&
          (s.scope === 'global' || s.scope === scope) &&
          s.key.toLowerCase() === e.key.toLowerCase() &&
          !!s.ctrlKey === e.ctrlKey &&
          !!s.altKey === e.altKey &&
          !!s.shiftKey === e.shiftKey
      );

      if (shortcut) {
        // Prevent the same keydown from triggering twice
        if (handledRef.current) {
          return;
        }
        handledRef.current = true;

        // Prevent default browser behavior for these shortcuts
        e.preventDefault();

        // Execute the action based on the shortcut type
        switch (shortcut.action) {
          case 'navigate':
            if (shortcut.target) {
              router.push(shortcut.target);
            }
            break;
          case 'toggle':
            if (shortcut.description.includes('theme') && toggleTheme) {
              toggleTheme();
            } else if (shortcut.description.includes('language') && toggleLanguage) {
              toggleLanguage();
            }
            break;
          case 'trigger':
            if (shortcut.description.includes('keyboard shortcuts') && onShowShortcutsHelp) {
              onShowShortcutsHelp();
            }
            break;
          case 'custom':
            if (shortcut.key === '/' && onSearchFocus) {
              onSearchFocus();
            } else if (shortcut.key === 'Escape' && onEscape) {
              onEscape();
            } else if (shortcut.handler) {
              shortcut.handler();
            }
            break;
        }
      }
    };

    const handleKeyUp = () => {
      handledRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    shortcuts,
    router,
    toggleTheme,
    toggleLanguage,
    onShowShortcutsHelp,
    onSearchFocus,
    onEscape,
    scope,
  ]);

  return {
    shortcuts: shortcuts.filter((s) => !s.disabled && (s.scope === 'global' || s.scope === scope)),
  };
} 