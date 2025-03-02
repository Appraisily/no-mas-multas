'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface Appeal {
  id: string;
  title: string;
  referenceNumber: string;
  type: string;
  submittedDate: string;
  status: 'submitted' | 'received' | 'under_review' | 'decision_pending' | 'completed' | 'rejected';
  fineInfo: {
    reason?: string;
    amount?: string;
    date?: string;
  };
}

export default function MyAppealsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchAppeals = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // await fetch('/api/appeals');
        
        // For demo purposes, we'll simulate an API response with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock appeal data
        const mockAppeals: Appeal[] = [
          {
            id: "appeal-1",
            title: "Parking Violation Appeal",
            referenceNumber: "REF-12345678",
            type: "parking",
            submittedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            status: "completed",
            fineInfo: {
              reason: "Parking in a restricted zone",
              amount: "$75.00",
              date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          },
          {
            id: "appeal-2",
            title: "Speeding Ticket Appeal",
            referenceNumber: "REF-23456789",
            type: "speeding",
            submittedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: "under_review",
            fineInfo: {
              reason: "Exceeding speed limit by 15mph",
              amount: "$150.00",
              date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
            }
          },
          {
            id: "appeal-3",
            title: "Red Light Violation Appeal",
            referenceNumber: "REF-34567890",
            type: "red_light",
            submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: "received",
            fineInfo: {
              reason: "Running a red light",
              amount: "$125.00",
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          },
          {
            id: "appeal-4",
            title: "Illegal Parking Appeal",
            referenceNumber: "REF-45678901",
            type: "parking",
            submittedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: "rejected",
            fineInfo: {
              reason: "Parking in a fire lane",
              amount: "$200.00",
              date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
            }
          },
          {
            id: "appeal-5",
            title: "Stop Sign Violation Appeal",
            referenceNumber: "REF-56789012",
            type: "stop_sign",
            submittedDate: new Date().toISOString(),
            status: "submitted",
            fineInfo: {
              reason: "Failure to stop at stop sign",
              amount: "$100.00",
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        ];
        
        setAppeals(mockAppeals);
      } catch (err) {
        console.error("Error fetching appeals:", err);
        setError(t('errorFetchingAppeals') || "Failed to fetch appeals");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppeals();
  }, [t]);

  const filteredAppeals = appeals.filter(appeal => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['submitted', 'received', 'under_review', 'decision_pending'].includes(appeal.status);
    if (filter === 'completed') return appeal.status === 'completed';
    if (filter === 'rejected') return appeal.status === 'rejected';
    return true;
  });

  const sortedAppeals = [...filteredAppeals].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.submittedDate).getTime();
      const dateB = new Date(b.submittedDate).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === 'status') {
      const statusOrder = {
        submitted: 1,
        received: 2,
        under_review: 3,
        decision_pending: 4,
        completed: 5,
        rejected: 6
      };
      
      const orderA = statusOrder[a.status] || 0;
      const orderB = statusOrder[b.status] || 0;
      
      return sortDirection === 'asc' ? orderA - orderB : orderB - orderA;
    }
    if (sortBy === 'type') {
      return sortDirection === 'asc' 
        ? a.type.localeCompare(b.type) 
        : b.type.localeCompare(a.type);
    }
    return 0;
  });

  const getStatusColor = (status: Appeal['status']): string => {
    switch (status) {
      case 'submitted':
      case 'received':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'under_review':
      case 'decision_pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-red-500 dark:text-red-400 text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">{t('errorOccurred') || 'An error occurred'}</h3>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('tryAgain') || 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            {t('myAppeals') || 'My Appeals'}
          </h1>
          
          <button 
            onClick={() => router.push('/create-appeal')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('createNewAppeal') || 'Create New Appeal'}
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('allAppeals') || 'All Appeals'}
              </button>
              <button 
                onClick={() => setFilter('active')} 
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'active' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('activeAppeals') || 'Active Appeals'}
              </button>
              <button 
                onClick={() => setFilter('completed')} 
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'completed' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('completedAppeals') || 'Completed'}
              </button>
              <button 
                onClick={() => setFilter('rejected')} 
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'rejected' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('rejectedAppeals') || 'Rejected'}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-sm text-gray-600 dark:text-gray-400">
                {t('sortBy') || 'Sort by:'}
              </label>
              <select 
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1"
              >
                <option value="date">{t('submissionDate') || 'Submission Date'}</option>
                <option value="status">{t('status') || 'Status'}</option>
                <option value="type">{t('appealType') || 'Appeal Type'}</option>
              </select>
              <button 
                onClick={toggleSortDirection}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={sortDirection === 'asc' ? t('sortDescending') || 'Sort descending' : t('sortAscending') || 'Sort ascending'}
              >
                {sortDirection === 'asc' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {sortedAppeals.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                {t('noAppealsFound') || 'No appeals found'}
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {t('createAppealToGetStarted') || 'Create an appeal to get started'}
              </p>
              <button 
                onClick={() => router.push('/create-appeal')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('createNewAppeal') || 'Create New Appeal'}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedAppeals.map((appeal) => (
                <Link
                  key={appeal.id}
                  href={`/my-appeals/${appeal.id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="p-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {appeal.title}
                        </h3>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mt-1 gap-x-4">
                          <span>{appeal.referenceNumber}</span>
                          <span>{formatDate(appeal.submittedDate)}</span>
                          <span className="capitalize">{appeal.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appeal.status)}`}>
                          {t(appeal.status) || appeal.status.replace('_', ' ')}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <span className="font-medium">{t('violationReason') || 'Violation'}:</span> {appeal.fineInfo.reason}
                      </p>
                      <p>
                        <span className="font-medium">{t('fineAmount') || 'Fine'}:</span> {appeal.fineInfo.amount}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 