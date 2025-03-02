'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface KeyboardShortcutsProps {
  onShortcutHelp: () => void;
  onUpload: () => void;
  onAnalyze: () => void;
  onGenerate: () => void;
  onExport: () => void;
  onPrint: () => void;
  onCopy: () => void;
}

export default function KeyboardShortcuts({
  onShortcutHelp,
  onUpload,
  onAnalyze,
  onGenerate,
  onExport,
  onPrint,
  onCopy
}: KeyboardShortcutsProps) {
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only if not in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      
      // Keyboard shortcuts
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowDialog(true);
        onShortcutHelp();
      } else if (e.key === '/' && e.ctrlKey) {
        e.preventDefault();
        // Focus search or open help
        onShortcutHelp();
      } else if (e.key === 'u' && e.altKey) {
        e.preventDefault();
        onUpload();
      } else if (e.key === 'a' && e.altKey) {
        e.preventDefault();
        onAnalyze();
      } else if (e.key === 'g' && e.altKey) {
        e.preventDefault();
        onGenerate();
      } else if (e.key === 'e' && e.altKey) {
        e.preventDefault();
        onExport();
      } else if (e.key === 'p' && e.altKey) {
        e.preventDefault();
        onPrint();
      } else if (e.key === 'c' && e.altKey) {
        e.preventDefault();
        onCopy();
      } else if (e.key === 'Escape') {
        // Close modal if open
        setShowDialog(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onShortcutHelp, onUpload, onAnalyze, onGenerate, onExport, onPrint, onCopy]);
  
  const shortcuts = [
    { key: 'Ctrl + ?', action: t('shortcutHelp') || 'Show Shortcuts' },
    { key: 'Alt + U', action: t('shortcutUpload') || 'Upload Document' },
    { key: 'Alt + A', action: t('shortcutAnalyze') || 'Analyze Document' },
    { key: 'Alt + G', action: t('shortcutGenerate') || 'Generate Appeal' },
    { key: 'Alt + E', action: t('shortcutExport') || 'Export Appeal' },
    { key: 'Alt + P', action: t('shortcutPrint') || 'Print Appeal' },
    { key: 'Alt + C', action: t('shortcutCopy') || 'Copy to Clipboard' },
    { key: 'Esc', action: t('shortcutClose') || 'Close Modal' },
  ];

  return (
    <>
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {t('keyboardShortcuts') || 'Keyboard Shortcuts'}
              </h2>
              <button 
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 dark:text-white">
                        {shortcut.action}
                      </span>
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-md">
                        {shortcut.key}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-sm text-gray-600 dark:text-gray-400 rounded-b-lg">
              {t('shortcutTip') || 'Tip: Press Ctrl+? anytime to show this dialog.'}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 