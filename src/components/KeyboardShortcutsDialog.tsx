'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { DEFAULT_SHORTCUTS } from '@/lib/useKeyboardShortcuts';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    dialog.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      dialog.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Group shortcuts by scope
  const groupedShortcuts = DEFAULT_SHORTCUTS.reduce((acc, shortcut) => {
    const scope = shortcut.scope || 'global';
    if (!acc[scope]) {
      acc[scope] = [];
    }
    acc[scope].push(shortcut);
    return acc;
  }, {} as Record<string, typeof DEFAULT_SHORTCUTS>);

  // Helper to format key combinations for display
  const formatShortcut = (shortcut: typeof DEFAULT_SHORTCUTS[0]) => {
    const keys = [];
    if (shortcut.ctrlKey) keys.push('Ctrl');
    if (shortcut.altKey) keys.push('Alt');
    if (shortcut.shiftKey) keys.push('Shift');
    keys.push(shortcut.key.toUpperCase());
    return keys.join(' + ');
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        ref={dialogRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 
            id="shortcuts-title" 
            className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {t('keyboardShortcuts') || 'Keyboard Shortcuts'}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            onClick={onClose}
            aria-label={t('close') || 'Close'}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
          {Object.entries(groupedShortcuts).map(([scope, shortcuts]) => (
            <div key={scope} className="mb-6 last:mb-0">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 capitalize">
                {t(scope + 'Shortcuts') || `${scope.charAt(0).toUpperCase() + scope.slice(1)} Shortcuts`}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {shortcuts.map((shortcut, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="text-gray-700 dark:text-gray-300">
                        {t(shortcut.description) || shortcut.description}
                      </div>
                      <div className="flex space-x-2">
                        {formatShortcut(shortcut).split(' + ').map((key, idx) => (
                          <kbd 
                            key={idx}
                            className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-md border border-gray-300 dark:text-white dark:bg-gray-600 dark:border-gray-500"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
            onClick={onClose}
          >
            {t('gotIt') || 'Got it!'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
} 