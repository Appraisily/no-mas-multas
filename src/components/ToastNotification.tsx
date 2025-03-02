'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  };

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} hideToast={hideToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, hideToast }: { toasts: ToastProps[]; hideToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} hideToast={hideToast} />
      ))}
    </div>
  );
}

function Toast({ toast, hideToast }: { toast: ToastProps; hideToast: (id: string) => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      hideToast(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getToastClassName = () => {
    const baseClass = 'flex items-center p-4 rounded-lg shadow-lg animate-slideIn max-w-md';
    
    switch (toast.type) {
      case 'success':
        return `${baseClass} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-l-4 border-green-500`;
      case 'error':
        return `${baseClass} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-l-4 border-red-500`;
      case 'warning':
        return `${baseClass} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border-l-4 border-yellow-500`;
      default:
        return `${baseClass} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-l-4 border-blue-500`;
    }
  };

  return (
    <div 
      className={getToastClassName()}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0 mr-3">{getIcon()}</div>
      <div className="flex-1">{toast.message}</div>
      <button
        type="button"
        className="ml-4 inline-flex text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md"
        onClick={() => hideToast(toast.id)}
        aria-label={t('close') || 'Close'}
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
} 