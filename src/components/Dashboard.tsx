'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import AppealStats from './AppealStats';

interface AppealSummary {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'completed' | 'rejected';
  type: string;
  referenceNumber: string;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'appeals' | 'templates' | 'stats'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [recentAppeals, setRecentAppeals] = useState<AppealSummary[]>([]);
  const [firstName, setFirstName] = useState('User');
  const [appealsCount, setAppealsCount] = useState({ total: 0, pending: 0, completed: 0, rejected: 0 });
  
  // Mock data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      setFirstName('Alex');
      
      // Mock appeals count
      setAppealsCount({
        total: 24,
        pending: 8,
        completed: 14,
        rejected: 2
      });
      
      // Mock recent appeals
      setRecentAppeals([
        {
          id: 'a1',
          title: 'Parking Violation Appeal',
          date: '2023-12-15',
          status: 'completed',
          type: 'parking',
          referenceNumber: 'PK-2023-12345'
        },
        {
          id: 'a2',
          title: 'Speed Camera Appeal',
          date: '2024-01-03',
          status: 'pending',
          type: 'speed',
          referenceNumber: 'SP-2024-00123'
        },
        {
          id: 'a3',
          title: 'Red Light Camera Appeal',
          date: '2024-01-10',
          status: 'pending',
          type: 'redlight',
          referenceNumber: 'RL-2024-00456'
        },
        {
          id: 'a4',
          title: 'No Parking Sign Violation',
          date: '2023-11-28',
          status: 'rejected',
          type: 'parking',
          referenceNumber: 'PK-2023-10789'
        },
        {
          id: 'a5',
          title: 'Procedural Appeal for Ticket',
          date: '2023-12-05',
          status: 'completed',
          type: 'procedural',
          referenceNumber: 'PR-2023-11234'
        }
      ]);
      
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, []);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('statusCompleted') || 'Completed';
      case 'pending':
        return t('statusPending') || 'Pending';
      case 'rejected':
        return t('statusRejected') || 'Rejected';
      default:
        return status;
    }
  };
  
  const getTypeText = (type: string) => {
    switch (type) {
      case 'parking':
        return t('categoryParking') || 'Parking';
      case 'speed':
        return t('categorySpeed') || 'Speed';
      case 'redlight':
        return t('categoryRedLight') || 'Red Light';
      case 'procedural':
        return t('categoryProcedural') || 'Procedural';
      default:
        return t('categoryOther') || 'Other';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t('dashboardTitle')}
        </h2>
        
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.href = '/appeal/new'}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {t('createNewAppeal')}
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('overview')}
          </button>
          <button
            onClick={() => setActiveTab('appeals')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'appeals'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('myAppeals')}
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('templatesLibrary')}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('appealStatsTitle')}
          </button>
        </div>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t('welcomeBack')}, {firstName}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-750 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('totalAppeals')}
                  </h4>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {appealsCount.total}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-750 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('pendingAppeals')}
                  </h4>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {appealsCount.pending}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-750 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('completedAppeals')}
                  </h4>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {appealsCount.completed}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t('recentAppeals')}
            </h3>
            <Link
              href="/appeals"
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              {t('viewAll')}
            </Link>
          </div>
          
          {recentAppeals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('appealTitle')}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('referenceNumber')}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('type')}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('date')}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentAppeals.map((appeal) => (
                    <tr key={appeal.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-gray-100">
                        <Link href={`/appeal/${appeal.id}`} className="text-purple-600 dark:text-purple-400 hover:underline">
                          {appeal.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {appeal.referenceNumber}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {getTypeText(appeal.type)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(appeal.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appeal.status)}`}>
                          {getStatusText(appeal.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('noRecentActivity')}
            </div>
          )}
        </div>
      )}
      
      {/* Appeals Tab */}
      {activeTab === 'appeals' && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t('myAppeals')}
          </h3>
          
          <div className="mb-6 flex space-x-2">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              {t('allAppeals')}
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600">
              {t('pendingAppeals')}
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600">
              {t('completedAppeals')}
            </button>
          </div>
          
          {recentAppeals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('appealTitle')}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('referenceNumber')}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('type')}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('date')}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('status')}
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentAppeals.map((appeal) => (
                    <tr key={appeal.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-gray-100">
                        <Link href={`/appeal/${appeal.id}`} className="text-purple-600 dark:text-purple-400 hover:underline">
                          {appeal.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {appeal.referenceNumber}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {getTypeText(appeal.type)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(appeal.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appeal.status)}`}>
                          {getStatusText(appeal.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3">
                          {t('edit')}
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                          {t('delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No appeals</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new appeal
              </p>
              <div className="mt-6">
                <button 
                  onClick={() => window.location.href = '/appeal/new'}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  {t('createNewAppeal')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t('templatesLibrary')}
          </h3>
          
          <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('templatesLibrary')}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('templatesIntro')}
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                {t('browseTemplates')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="animate-fade-in">
          <AppealStats />
        </div>
      )}
    </div>
  );
} 