'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import AppealStats from '@/components/AppealStats';
import Link from 'next/link';

export default function StatisticsPage() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [topViolations, setTopViolations] = useState<{ type: string; count: number }[]>([]);
  const [successByMonth, setSuccessByMonth] = useState<{ month: string; rate: number }[]>([]);
  const [cityStats, setCityStats] = useState<{ city: string; appeals: number; successRate: number }[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls
        // const response = await fetch('/api/stats/dashboard');
        // const data = await response.json();
        
        // For demo, simulate API response with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setTopViolations([
          { type: 'Parking', count: 135 },
          { type: 'Speeding', count: 98 },
          { type: 'Red Light', count: 67 },
          { type: 'No Registration', count: 42 },
          { type: 'HOV Lane', count: 28 }
        ]);
        
        setSuccessByMonth([
          { month: 'Jan', rate: 62 },
          { month: 'Feb', rate: 58 },
          { month: 'Mar', rate: 65 },
          { month: 'Apr', rate: 71 },
          { month: 'May', rate: 68 },
          { month: 'Jun', rate: 74 }
        ]);
        
        setCityStats([
          { city: 'Los Angeles', appeals: 243, successRate: 68 },
          { city: 'San Francisco', appeals: 187, successRate: 72 },
          { city: 'San Diego', appeals: 156, successRate: 65 },
          { city: 'Sacramento', appeals: 112, successRate: 59 }
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Function to render horizontal bar chart
  const renderHorizontalBarChart = (data: { type: string; count: number }[]) => {
    const maxCount = Math.max(...data.map(item => item.count));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="relative">
            <div className="flex items-center">
              <div className="w-1/3 text-sm text-gray-700 dark:text-gray-300 truncate pr-2">
                {item.type}
              </div>
              <div className="w-2/3 h-6 relative bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
                <div 
                  className="h-full bg-purple-500 dark:bg-purple-600 rounded-sm absolute left-0 top-0"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                ></div>
                <span className="absolute right-2 text-xs font-medium text-white z-10 leading-6">
                  {item.count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render city comparison chart
  const renderCityComparisonChart = (data: { city: string; appeals: number; successRate: number }[]) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase font-medium">
            <tr>
              <th scope="col" className="px-4 py-3 rounded-l-lg">
                {t('jurisdiction') || 'Jurisdiction'}
              </th>
              <th scope="col" className="px-4 py-3">
                {t('totalAppeals') || 'Total Appeals'}
              </th>
              <th scope="col" className="px-4 py-3 rounded-r-lg">
                {t('successRate') || 'Success Rate'}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
                <td className="px-4 py-3 font-medium">{item.city}</td>
                <td className="px-4 py-3">{item.appeals}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="mr-2">{item.successRate}%</span>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${item.successRate}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('statisticsDashboard') || 'Statistics Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('statisticsDashboardDescription') || 'Track your appeal success rates and insights over time'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link 
              href="/my-appeals"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {t('viewMyAppeals') || 'View My Appeals'}
            </Link>
          </div>
        </div>
        
        {/* Main Statistics */}
        <AppealStats className="mb-8" />
        
        {/* Secondary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('topViolationTypes') || 'Top Violation Types'}
            </h2>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-2/3 h-6 bg-gray-200 dark:bg-gray-700 rounded ml-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              renderHorizontalBarChart(topViolations)
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('cityComparison') || 'City Comparison'}
            </h2>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                ))}
              </div>
            ) : (
              renderCityComparisonChart(cityStats)
            )}
          </div>
        </div>
        
        {/* Tips and Insights Panel */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {t('statisticalInsights') || 'Statistical Insights'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {t('bestDayToSubmit') || 'Best Day to Submit'}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('bestDayInsight') || 'Appeals submitted on Tuesdays have a 15% higher success rate than other days.'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {t('mostImprovedCategory') || 'Most Improved'}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('mostImprovedInsight') || 'Your success rate for speed violations has improved by 23% in the last 3 months.'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {t('opportunityArea') || 'Opportunity Area'}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('opportunityAreaInsight') || 'Red light violations have the lowest success rate (42%). Consider using more legal arguments.'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Success Tips Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {t('tipsToImproveSuccessRate') || 'Tips to Improve Your Success Rate'}
            </h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('successTip1') || 'Include specific legal citations - appeals with legal references have a 28% higher success rate.'}
                </p>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('successTip2') || 'Attach supporting evidence like photos or videos - this increases success rates by up to 35%.'}
                </p>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('successTip3') || 'Keep appeals concise but thorough - the ideal length is between 250-400 words.'}
                </p>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('successTip4') || 'Use a professional tone - appeals written in a respectful, formal style have higher success rates.'}
                </p>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('successTip5') || 'Submit within 14 days of receiving the citation - early submissions have a 19% higher success rate.'}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 