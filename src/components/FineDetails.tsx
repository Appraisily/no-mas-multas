'use client';

import { FineInfo } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';

interface FineDetailsProps {
  fineInfo: FineInfo;
  onEdit?: () => void;
}

export default function FineDetails({ fineInfo, onEdit }: FineDetailsProps) {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('detailsTitle')}</h2>
        
        {onEdit && (
          <button 
            onClick={onEdit}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {t('editDetails')}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 p-4">
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('fineReference')}</label>
              <div className="mt-1 text-gray-900 dark:text-gray-200 font-medium">{fineInfo.referenceNumber || '—'}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('fineDate')}</label>
              <div className="mt-1 text-gray-900 dark:text-gray-200 font-medium">{fineInfo.date || '—'}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('fineAmount')}</label>
              <div className="mt-1 text-gray-900 dark:text-gray-200 font-medium">{fineInfo.amount || '—'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 p-4">
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('fineLocation')}</label>
              <div className="mt-1 text-gray-900 dark:text-gray-200 font-medium">{fineInfo.location || '—'}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('fineReason')}</label>
              <div className="mt-1 text-gray-900 dark:text-gray-200 font-medium">{fineInfo.reason || '—'}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('fineVehicle')}</label>
              <div className="mt-1 text-gray-900 dark:text-gray-200 font-medium">{fineInfo.vehicle || '—'}</div>
            </div>
          </div>
        </div>
      </div>
      
      {fineInfo.additionalInfo && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 p-4">
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Additional Information</label>
          <div className="text-gray-700 dark:text-gray-300">{fineInfo.additionalInfo}</div>
        </div>
      )}
    </div>
  );
} 