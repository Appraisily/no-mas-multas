'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface AppealStats {
  total: number;
  successful: number;
  pending: number;
  rejected: number;
  byType: {
    procedural: { total: number; successful: number; successRate: number };
    factual: { total: number; successful: number; successRate: number };
    legal: { total: number; successful: number; successRate: number };
    comprehensive: { total: number; successful: number; successRate: number };
  };
  byReason: {
    [key: string]: { total: number; successful: number; successRate: number };
  };
  avgResponseTime: number; // in days
  mostSuccessfulArgs: string[];
}

export default function AppealStats() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<AppealStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'types' | 'reasons'>('overview');

  // Mock function to fetch stats - in a real app, this would be an API call
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockStats: AppealStats = {
        total: 124,
        successful: 82,
        pending: 28,
        rejected: 14,
        byType: {
          procedural: { total: 43, successful: 32, successRate: 74.4 },
          factual: { total: 38, successful: 24, successRate: 63.2 },
          legal: { total: 22, successful: 12, successRate: 54.5 },
          comprehensive: { total: 21, successful: 14, successRate: 66.7 }
        },
        byReason: {
          'parking': { total: 52, successful: 38, successRate: 73.1 },
          'speed': { total: 42, successful: 24, successRate: 57.1 },
          'redLight': { total: 18, successful: 12, successRate: 66.7 },
          'noSign': { total: 8, successful: 6, successRate: 75.0 },
          'other': { total: 4, successful: 2, successRate: 50.0 }
        },
        avgResponseTime: 18.5,
        mostSuccessfulArgs: [
          'Incorrect signage',
          'Technical error in measurement',
          'Procedural timeline violation',
          'Emergency situation',
          'Vehicle identification error'
        ]
      };
      
      setStats(mockStats);
      setIsLoading(false);
    };
    
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all">
        <div className="animate-pulse flex flex-col">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No statistics available
        </div>
      </div>
    );
  }

  const successRate = (stats.successful / stats.total * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {t('appealStatsTitle')}
      </h3>
      
      {/* Navigation buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setSelectedView('overview')}
          className={`px-4 py-2 rounded-md transition-colors ${selectedView === 'overview' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          {t('statsOverview')}
        </button>
        <button
          onClick={() => setSelectedView('types')}
          className={`px-4 py-2 rounded-md transition-colors ${selectedView === 'types' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          {t('statsByType')}
        </button>
        <button
          onClick={() => setSelectedView('reasons')}
          className={`px-4 py-2 rounded-md transition-colors ${selectedView === 'reasons' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          {t('statsByReason')}
        </button>
      </div>
      
      {/* Overview view */}
      {selectedView === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('statsTotal')}
              </div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                {stats.total}
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('statsSuccessful')}
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.successful} ({successRate}%)
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('statsAvgResponse')}
              </div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                {stats.avgResponseTime} {t('statsDays')}
              </div>
            </div>
          </div>
          
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t('statsMostSuccessful')}
          </h4>
          
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
            {stats.mostSuccessfulArgs.map((arg, index) => (
              <li key={index} className="mb-1">{arg}</li>
            ))}
          </ul>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('statsStatus')}
              </div>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200 dark:bg-green-900 dark:text-green-300">
                    {t('statsSuccessful')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600 dark:text-green-400">
                    {(stats.successful / stats.total * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200 dark:bg-green-900/40">
                <div 
                  style={{ width: `${(stats.successful / stats.total * 100).toFixed(1)}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 dark:bg-green-400"
                ></div>
              </div>
              
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                    {t('statsPending')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                    {(stats.pending / stats.total * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900/40">
                <div 
                  style={{ width: `${(stats.pending / stats.total * 100).toFixed(1)}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-400"
                ></div>
              </div>
              
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200 dark:bg-red-900 dark:text-red-300">
                    {t('statsRejected')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-red-600 dark:text-red-400">
                    {(stats.rejected / stats.total * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200 dark:bg-red-900/40">
                <div 
                  style={{ width: `${(stats.rejected / stats.total * 100).toFixed(1)}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 dark:bg-red-400"
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* By type view */}
      {selectedView === 'types' && (
        <div>
          <div className="space-y-4">
            {Object.entries(stats.byType).map(([type, data]) => (
              <div key={type} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {t(`appealType${type.charAt(0).toUpperCase() + type.slice(1)}`)}
                  </h4>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    data.successRate >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    data.successRate >= 50 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  }`}>
                    {data.successRate.toFixed(1)}% {t('statsSuccess')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t('statsTotal')}
                    </div>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {data.total}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t('statsSuccessful')}
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {data.successful}
                    </div>
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                    <div 
                      style={{ width: `${data.successRate}%` }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        data.successRate >= 70 ? 'bg-green-500 dark:bg-green-400' :
                        data.successRate >= 50 ? 'bg-blue-500 dark:bg-blue-400' :
                        'bg-amber-500 dark:bg-amber-400'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* By reason view */}
      {selectedView === 'reasons' && (
        <div>
          <div className="space-y-4">
            {Object.entries(stats.byReason).map(([reason, data]) => (
              <div key={reason} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {t(`category${reason.charAt(0).toUpperCase() + reason.slice(1)}`)}
                  </h4>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    data.successRate >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    data.successRate >= 50 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  }`}>
                    {data.successRate.toFixed(1)}% {t('statsSuccess')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t('statsTotal')}
                    </div>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {data.total}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t('statsSuccessful')}
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {data.successful}
                    </div>
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                    <div 
                      style={{ width: `${data.successRate}%` }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        data.successRate >= 70 ? 'bg-green-500 dark:bg-green-400' :
                        data.successRate >= 50 ? 'bg-blue-500 dark:bg-blue-400' :
                        'bg-amber-500 dark:bg-amber-400'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 