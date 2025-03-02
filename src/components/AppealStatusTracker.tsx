'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface Appeal {
  id: string;
  title: string;
  referenceNumber: string;
  submittedDate: string;
  currentStatus: 'submitted' | 'received' | 'under_review' | 'decision_pending' | 'completed' | 'rejected';
  estimatedResponseDate: string;
  lastUpdated: string;
  authority: string;
  notes?: string[];
  trackingNumber?: string;
}

interface TimelineEvent {
  status: Appeal['currentStatus'];
  date: string;
  description: string;
  isCompleted: boolean;
}

interface AppealStatusTrackerProps {
  appealId: string;
  referenceNumber?: string;
}

export default function AppealStatusTracker({ appealId, referenceNumber }: AppealStatusTrackerProps) {
  const { t } = useLanguage();
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<number>(60000); // 1 minute default
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  useEffect(() => {
    fetchAppealStatus();
    
    // Set up automatic refresh
    const intervalId = setInterval(() => {
      fetchAppealStatus();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [appealId, refreshInterval]);

  const fetchAppealStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/appeals/${appealId}/status`);
      
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data based on appealId
      const mockAppeal: Appeal = {
        id: appealId,
        title: "Parking Violation Appeal",
        referenceNumber: referenceNumber || `REF-${appealId.substring(0, 8)}`,
        submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        currentStatus: "under_review",
        estimatedResponseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        authority: "Municipal Traffic Department",
        notes: [
          "Appeal received by traffic authority",
          "Documentation verified",
          "Assigned to review officer"
        ],
        trackingNumber: "TRK-2023-45678"
      };
      
      setAppeal(mockAppeal);
      generateTimeline(mockAppeal);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Error fetching appeal status:", err);
      setError(t('errorFetchingStatus') || "Failed to fetch appeal status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = (appeal: Appeal) => {
    const statusOrder: Appeal['currentStatus'][] = [
      'submitted', 'received', 'under_review', 'decision_pending', 'completed', 'rejected'
    ];
    
    // Find the index of the current status
    const currentStatusIndex = statusOrder.indexOf(appeal.currentStatus);
    
    // Generate the timeline events
    const events: TimelineEvent[] = statusOrder.map((status, index) => {
      let date = '';
      let isCompleted = index <= currentStatusIndex;
      
      // Assign dates logically based on status
      if (status === 'submitted') {
        date = appeal.submittedDate;
      } else if (status === 'completed' || status === 'rejected') {
        date = isCompleted ? appeal.lastUpdated : '';
      } else if (status === 'decision_pending' && isCompleted) {
        date = new Date(new Date(appeal.lastUpdated).getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
      } else if (isCompleted) {
        // For other completed statuses, set a date between submission and last update
        const submissionDate = new Date(appeal.submittedDate).getTime();
        const lastUpdateDate = new Date(appeal.lastUpdated).getTime();
        const interval = (lastUpdateDate - submissionDate) / (currentStatusIndex);
        date = new Date(submissionDate + interval * index).toISOString();
      }
      
      return {
        status,
        date,
        description: getStatusDescription(status),
        isCompleted
      };
    });
    
    setTimeline(events);
  };

  const getStatusDescription = (status: Appeal['currentStatus']): string => {
    switch (status) {
      case 'submitted':
        return t('appealSubmitted') || "Appeal submitted successfully";
      case 'received':
        return t('appealReceived') || "Appeal received by authorities";
      case 'under_review':
        return t('appealUnderReview') || "Appeal is being reviewed";
      case 'decision_pending':
        return t('decisionPending') || "Decision is being finalized";
      case 'completed':
        return t('appealCompleted') || "Appeal process completed";
      case 'rejected':
        return t('appealRejected') || "Appeal was rejected";
      default:
        return "";
    }
  };

  const getStatusColor = (status: Appeal['currentStatus']): string => {
    switch (status) {
      case 'submitted':
      case 'received':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'under_review':
      case 'decision_pending':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'completed':
        return 'bg-green-500 dark:bg-green-600';
      case 'rejected':
        return 'bg-red-500 dark:bg-red-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? (t('day') || 'day') : (t('days') || 'days')} ${t('ago') || 'ago'}`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? (t('hour') || 'hour') : (t('hours') || 'hours')} ${t('ago') || 'ago'}`;
    } else {
      return `${diffMinutes} ${diffMinutes === 1 ? (t('minute') || 'minute') : (t('minutes') || 'minutes')} ${t('ago') || 'ago'}`;
    }
  };

  const handleManualRefresh = () => {
    fetchAppealStatus();
  };

  if (loading && !appeal) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-red-500 dark:text-red-400 text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">{t('errorOccurred') || 'An error occurred'}</h3>
          <p>{error}</p>
          <button 
            onClick={handleManualRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('tryAgain') || 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  if (!appeal) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t('appealStatus') || 'Appeal Status'}
        </h2>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
            {t('lastUpdated') || 'Last updated'}: {getTimeAgo(lastRefreshed.toISOString())}
          </span>
          <button 
            onClick={handleManualRefresh}
            className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            aria-label={t('refresh') || 'Refresh'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('referenceNumber') || 'Reference Number'}
            </h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {appeal.referenceNumber}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('currentStatus') || 'Current Status'}
            </h3>
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(appeal.currentStatus)}`}></span>
              <p className="text-base font-medium text-gray-800 dark:text-white">
                {t(appeal.currentStatus) || appeal.currentStatus.replace('_', ' ')}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('estimatedResponse') || 'Estimated Response'}
            </h3>
            <p className="text-base text-gray-800 dark:text-white">
              {formatDate(appeal.estimatedResponseDate)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('authority') || 'Authority'}
            </h3>
            <p className="text-base text-gray-800 dark:text-white">
              {appeal.authority}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('latestNotes') || 'Latest Notes'}
          </h3>
          {appeal.notes && appeal.notes.length > 0 ? (
            <ul className="space-y-2">
              {appeal.notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {t('noNotesAvailable') || 'No notes available at this time'}
            </p>
          )}
          
          {appeal.trackingNumber && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('trackingNumber') || 'Tracking Number'}
              </h3>
              <div className="flex items-center">
                <span className="text-base font-mono text-gray-800 dark:text-white">
                  {appeal.trackingNumber}
                </span>
                <button 
                  onClick={() => navigator.clipboard.writeText(appeal.trackingNumber || '')}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  title={t('copyToClipboard') || 'Copy to clipboard'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-10">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          {t('appealProgress') || 'Appeal Progress'}
        </h3>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Timeline events */}
          <div className="space-y-8">
            {timeline.map((event, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${!event.date ? 'opacity-40' : ''}`}>
                <div className="md:w-1/2 md:text-right order-2 md:order-1">
                  {event.date && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                      {formatDate(event.date)}
                    </span>
                  )}
                  {index < timeline.length - 1 && event.isCompleted && !timeline[index + 1].isCompleted && (
                    <span className="inline-flex items-center text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                      {t('currentStep') || 'Current Step'}
                    </span>
                  )}
                </div>
                
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    event.isCompleted 
                      ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500' 
                      : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                  } z-10`}>
                    {event.isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="md:w-1/2 pl-10 md:pl-8 order-1 md:order-2">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white">
                    {t(event.status) || event.status.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start border border-blue-200 dark:border-blue-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
            {t('whatNext') || 'What happens next?'}
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            {appeal.currentStatus === 'submitted' && (t('afterSubmissionInfo') || 'Your appeal has been submitted and is awaiting receipt confirmation. This typically takes 1-2 business days.')}
            {appeal.currentStatus === 'received' && (t('afterReceiptInfo') || 'Your appeal has been received and is in the queue for review. The review process typically begins within 3-5 business days.')}
            {appeal.currentStatus === 'under_review' && (t('duringReviewInfo') || 'Your appeal is currently being reviewed by an officer. This process typically takes 5-10 business days to complete.')}
            {appeal.currentStatus === 'decision_pending' && (t('pendingDecisionInfo') || 'Your appeal has been reviewed and a decision is being finalized. You should receive the final decision within 3-5 business days.')}
            {appeal.currentStatus === 'completed' && (t('afterCompletionInfo') || 'Your appeal process has been completed. You should have received the final decision. If you disagree with the outcome, you may have options for further appeal.')}
            {appeal.currentStatus === 'rejected' && (t('afterRejectionInfo') || 'Your appeal has been rejected. You should have received details about the rejection reason. You may have options for a secondary appeal depending on your jurisdiction.')}
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <select
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2"
        >
          <option value={30000}>{t('refreshEvery30Seconds') || 'Refresh every 30 seconds'}</option>
          <option value={60000}>{t('refreshEveryMinute') || 'Refresh every minute'}</option>
          <option value={300000}>{t('refreshEvery5Minutes') || 'Refresh every 5 minutes'}</option>
          <option value={600000}>{t('refreshEvery10Minutes') || 'Refresh every 10 minutes'}</option>
        </select>
      </div>
    </div>
  );
} 