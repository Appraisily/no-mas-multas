'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppealStatusTracker from '@/components/AppealStatusTracker';
import { useLanguage } from '@/lib/LanguageContext';
import AppealText from '@/components/AppealText';
import PDFExport from '@/components/PDFExport';
import Link from 'next/link';

interface Appeal {
  id: string;
  title: string;
  referenceNumber: string;
  type: string;
  submittedDate: string;
  status: 'submitted' | 'received' | 'under_review' | 'decision_pending' | 'completed' | 'rejected';
  content: string;
  fineInfo: {
    fineNumber?: string;
    date?: string;
    amount?: string;
    reason?: string;
    location?: string;
    officerName?: string;
    department?: string;
  };
}

export default function AppealDetailsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const appealId = params.id as string;

  useEffect(() => {
    const fetchAppealDetails = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // await fetch(`/api/appeals/${appealId}`);
        
        // For demo purposes, we'll simulate an API response with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock appeal data based on the ID
        const mockAppeal: Appeal = {
          id: appealId,
          title: "Parking Violation Appeal",
          referenceNumber: `REF-${appealId.substring(0, 8)}`,
          type: "parking",
          submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "under_review",
          content: "To Whom It May Concern,\n\nI am writing to appeal the parking citation I received on May 15, 2023. I believe this citation was issued in error due to the following reasons:\n\n1. The signage in the area was unclear and contradictory.\n2. I had a valid parking permit displayed on my dashboard.\n3. There were extenuating circumstances that prevented me from moving my vehicle in time.\n\nI have attached photographs of the signage and my parking permit as evidence. I respectfully request that this citation be dismissed.\n\nThank you for your consideration.\n\nSincerely,\nJohn Doe",
          fineInfo: {
            fineNumber: "PKG-2023-45678",
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            amount: "$75.00",
            reason: "Parking in a restricted zone",
            location: "123 Main St, California",
            officerName: "Officer J. Smith",
            department: "Municipal Traffic Department"
          }
        };
        
        setAppeal(mockAppeal);
      } catch (err) {
        console.error("Error fetching appeal details:", err);
        setError(t('errorFetchingAppealDetails') || "Failed to fetch appeal details");
      } finally {
        setLoading(false);
      }
    };
    
    if (appealId) {
      fetchAppealDetails();
    }
  }, [appealId, t]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !appeal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-red-500 dark:text-red-400 text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">{t('errorOccurred') || 'An error occurred'}</h3>
              <p>{error || t('appealNotFound') || 'Appeal not found'}</p>
              <button 
                onClick={() => router.push('/my-appeals')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('backToAppeals') || 'Back to My Appeals'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link 
              href="/my-appeals"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backToAppeals') || 'Back to My Appeals'}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {appeal.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t('submittedOn') || 'Submitted on'}: {formatDate(appeal.submittedDate)}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              appeal.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
              appeal.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {t(appeal.status) || appeal.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('fineDetails') || 'Fine Details'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appeal.fineInfo.fineNumber && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    {t('fineNumber') || 'Fine Number'}
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    {appeal.fineInfo.fineNumber}
                  </span>
                </div>
              )}
              
              {appeal.fineInfo.date && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    {t('fineDate') || 'Date of Fine'}
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    {formatDate(appeal.fineInfo.date)}
                  </span>
                </div>
              )}
              
              {appeal.fineInfo.amount && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    {t('fineAmount') || 'Amount'}
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    {appeal.fineInfo.amount}
                  </span>
                </div>
              )}
              
              {appeal.fineInfo.reason && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    {t('fineReason') || 'Reason'}
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    {appeal.fineInfo.reason}
                  </span>
                </div>
              )}
              
              {appeal.fineInfo.location && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    {t('fineLocation') || 'Location'}
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    {appeal.fineInfo.location}
                  </span>
                </div>
              )}
              
              {appeal.fineInfo.officerName && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    {t('officerName') || 'Officer Name'}
                  </span>
                  <span className="text-gray-800 dark:text-white">
                    {appeal.fineInfo.officerName}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('appealContent') || 'Appeal Content'}
            </h2>
            
            <AppealText
              initialText={appeal.content}
              appealType={appeal.type as any}
              fineInfo={appeal.fineInfo as any}
              appealId={appeal.id}
              readOnly={true}
            />
          </div>
        </div>
        
        {/* Appeal Status Tracker */}
        <div className="mb-8">
          <AppealStatusTracker 
            appealId={appeal.id} 
            referenceNumber={appeal.referenceNumber}
          />
        </div>
        
        {/* Actions Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {t('actions') || 'Actions'}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            {(appeal.status !== 'completed' && appeal.status !== 'rejected') && (
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                onClick={() => router.push(`/edit-appeal/${appeal.id}`)}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('editAppeal') || 'Edit Appeal'}
                </span>
              </button>
            )}
            
            <button 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors"
              onClick={() => window.print()}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {t('printAppeal') || 'Print Appeal'}
              </span>
            </button>
            
            <PDFExport
              appealText={appeal.content}
              appealType={appeal.type}
              fineInfo={appeal.fineInfo as any}
              appealTitle={`${t('appealFor') || 'Appeal for'} ${appeal.fineInfo.reason || t('trafficViolation') || 'Traffic Violation'}`}
              includeHeader={true}
              includeFooter={true}
            />
            
            {appeal.status === 'rejected' && (
              <button 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                onClick={() => router.push(`/create-appeal?reappeal=${appeal.id}`)}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('fileReappeal') || 'File a Re-Appeal'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 