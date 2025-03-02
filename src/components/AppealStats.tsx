'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface AppealData {
  id: string;
  status: string;
  type: string;
  submittedDate: string;
  completedDate?: string;
  jurisdiction: string;
  fineInfo: {
    amount?: string;
  };
}

export interface AppealStatsProps {
  userAppeals?: AppealData[];
  className?: string;
}

const AppealStats: React.FC<AppealStatsProps> = ({ userAppeals, className = '' }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    rejected: 0,
    successRate: 0,
    avgResponseTime: 0,
    savedAmount: 0,
    byJurisdiction: {} as Record<string, { total: number, successful: number, rate: number }>,
    byType: {} as Record<string, { total: number, successful: number, rate: number }>,
    monthly: [] as { month: string, total: number, successful: number, rate: number }[]
  });

  useEffect(() => {
    const fetchAppeals = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from API
        // const response = await fetch('/api/user/appeals/stats');
        // const data = await response.json();
        
        // For demo, use provided appeals or generate mock data
        const appeals = userAppeals || generateMockAppeals();
        calculateStats(appeals);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppeals();
  }, [userAppeals]);

  const generateMockAppeals = (): AppealData[] => {
    const statuses = ['submitted', 'under_review', 'completed', 'rejected'];
    const types = ['parking', 'speeding', 'red_light', 'other'];
    const jurisdictions = ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'];
    
    return Array.from({ length: 50 }, (_, i) => {
      const submittedDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
      const isCompleted = Math.random() > 0.4;
      const completedDate = isCompleted 
        ? new Date(submittedDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) 
        : undefined;
      
      return {
        id: `appeal-${i}`,
        status: isCompleted 
          ? (Math.random() > 0.3 ? 'completed' : 'rejected')
          : statuses[Math.floor(Math.random() * 2)],
        type: types[Math.floor(Math.random() * types.length)],
        submittedDate: submittedDate.toISOString(),
        completedDate: completedDate?.toISOString(),
        jurisdiction: jurisdictions[Math.floor(Math.random() * jurisdictions.length)],
        fineInfo: {
          amount: `$${Math.floor(Math.random() * 300) + 50}`
        }
      };
    });
  };

  const calculateStats = (appeals: AppealData[]) => {
    if (!appeals || appeals.length === 0) {
      setStats({
        total: 0,
        pending: 0,
        completed: 0,
        rejected: 0,
        successRate: 0,
        avgResponseTime: 0,
        savedAmount: 0,
        byJurisdiction: {},
        byType: {},
        monthly: []
      });
      return;
    }

    const total = appeals.length;
    const pending = appeals.filter(a => a.status === 'submitted' || a.status === 'under_review' || a.status === 'received').length;
    const completed = appeals.filter(a => a.status === 'completed').length;
    const rejected = appeals.filter(a => a.status === 'rejected').length;
    const successRate = total > 0 ? (completed / (completed + rejected)) * 100 : 0;

    // Calculate average response time in days
    let totalDays = 0;
    let completedAppeals = 0;

    appeals.forEach(appeal => {
      if (appeal.completedDate && appeal.submittedDate) {
        const submitted = new Date(appeal.submittedDate);
        const completed = new Date(appeal.completedDate);
        const days = Math.ceil((completed.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
        totalDays += days;
        completedAppeals++;
      }
    });

    const avgResponseTime = completedAppeals > 0 ? totalDays / completedAppeals : 0;

    // Calculate estimated saved amount (assuming successful appeals save 100% of the fine)
    let savedAmount = 0;
    appeals.forEach(appeal => {
      if (appeal.status === 'completed' && appeal.fineInfo?.amount) {
        savedAmount += parseFloat(appeal.fineInfo.amount.replace(/[^0-9.]/g, ''));
      }
    });

    // Statistics by jurisdiction
    const byJurisdiction: Record<string, { total: number, successful: number, rate: number }> = {};
    appeals.forEach(appeal => {
      const jurisdiction = appeal.jurisdiction || 'Unknown';
      if (!byJurisdiction[jurisdiction]) {
        byJurisdiction[jurisdiction] = { total: 0, successful: 0, rate: 0 };
      }
      byJurisdiction[jurisdiction].total++;
      if (appeal.status === 'completed') {
        byJurisdiction[jurisdiction].successful++;
      }
    });

    // Calculate success rates by jurisdiction
    Object.keys(byJurisdiction).forEach(jurisdiction => {
      const { total, successful } = byJurisdiction[jurisdiction];
      byJurisdiction[jurisdiction].rate = total > 0 
        ? (successful / total) * 100 
        : 0;
    });

    // Statistics by appeal type
    const byType: Record<string, { total: number, successful: number, rate: number }> = {};
    appeals.forEach(appeal => {
      const type = appeal.type || 'other';
      if (!byType[type]) {
        byType[type] = { total: 0, successful: 0, rate: 0 };
      }
      byType[type].total++;
      if (appeal.status === 'completed') {
        byType[type].successful++;
      }
    });

    // Calculate success rates by type
    Object.keys(byType).forEach(type => {
      const { total, successful } = byType[type];
      byType[type].rate = total > 0 
        ? (successful / total) * 100 
        : 0;
    });

    // Monthly statistics for trends
    const monthlyData: Record<string, { total: number, successful: number }> = {};
    appeals.forEach(appeal => {
      const date = new Date(appeal.submittedDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, successful: 0 };
      }
      
      monthlyData[monthKey].total++;
      if (appeal.status === 'completed') {
        monthlyData[monthKey].successful++;
      }
    });

    // Convert monthly data to array and sort chronologically
    const monthly = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        total: data.total,
        successful: data.successful,
        rate: data.total > 0 ? (data.successful / data.total) * 100 : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    setStats({
      total,
      pending,
      completed,
      rejected,
      successRate,
      avgResponseTime,
      savedAmount,
      byJurisdiction,
      byType,
      monthly
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Function to generate bar chart based on data
  const renderBarChart = (data: Record<string, { total: number, successful: number, rate: number }>, valueKey: 'total' | 'successful' | 'rate') => {
    const entries = Object.entries(data);
    if (entries.length === 0) return null;
    
    // Find the max value for scaling
    const maxValue = Math.max(...entries.map(([_, values]) => values[valueKey]));
    
    return (
      <div className="mt-2 space-y-2">
        {entries.map(([key, values]) => (
          <div key={key} className="flex items-center">
            <div className="w-1/3 text-sm truncate pr-2">{t(key) || key.replace('_', ' ')}</div>
            <div className="w-2/3 flex items-center">
              <div 
                className="bg-blue-500 h-5 rounded"
                style={{ width: `${(values[valueKey] / maxValue) * 100}%` }}
              ></div>
              <span className="ml-2 text-sm">
                {valueKey === 'rate' ? formatPercentage(values[valueKey]) : values[valueKey]}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render line chart for monthly trends
  const renderLineChart = () => {
    if (stats.monthly.length === 0) return null;
    
    const months = stats.monthly.map(item => {
      const [year, month] = item.month.split('-');
      return `${month}/${year.slice(2)}`;
    });
    
    const successRates = stats.monthly.map(item => item.rate);
    const maxRate = Math.max(...successRates, 100);
    
    return (
      <div className="mt-4 h-40 flex items-end">
        <div className="w-10 h-full flex flex-col justify-between items-end pr-2">
          <span className="text-xs text-gray-500">100%</span>
          <span className="text-xs text-gray-500">75%</span>
          <span className="text-xs text-gray-500">50%</span>
          <span className="text-xs text-gray-500">25%</span>
          <span className="text-xs text-gray-500">0%</span>
        </div>
        <div className="flex-1 h-full flex relative">
          {/* Horizontal grid lines */}
          <div className="absolute w-full h-full flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-t border-gray-200 dark:border-gray-700 w-full h-0" />
            ))}
          </div>
          
          {/* Line chart */}
          <svg className="w-full h-full" viewBox={`0 0 ${stats.monthly.length * 50} 100`}>
            <polyline
              points={stats.monthly.map((item, i) => `${i * 50 + 25},${100 - (item.rate / maxRate) * 100}`).join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            {stats.monthly.map((item, i) => (
              <circle
                key={i}
                cx={i * 50 + 25}
                cy={100 - (item.rate / maxRate) * 100}
                r="3"
                fill="#3B82F6"
              />
            ))}
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 w-full flex justify-between">
            {months.map((month, i) => (
              <div key={i} className="text-xs transform -translate-x-1/2" style={{ left: `${(i / (months.length - 1)) * 100}%` }}>
                {month}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-8 mb-4"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {t('appealStatistics') || 'Appeal Statistics'}
      </h2>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
            {t('totalAppeals') || 'Total Appeals'}
          </h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats.total}</p>
          {stats.total > 0 && (
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">{stats.pending}</span> {t('pending') || 'pending'}
            </div>
          )}
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
            {t('successRate') || 'Success Rate'}
          </h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            {formatPercentage(stats.successRate)}
          </p>
          {stats.total > 0 && (
            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
              <span className="font-medium">{stats.completed}</span> {t('successful') || 'successful'}
            </div>
          )}
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">
            {t('avgResponseTime') || 'Avg. Response Time'}
          </h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            {stats.avgResponseTime.toFixed(1)} {t('days') || 'days'}
          </p>
          {stats.total > 0 && (
            <div className="mt-2 text-sm text-purple-700 dark:text-purple-300">
              {stats.pending} {t('stillWaiting') || 'still waiting'}
            </div>
          )}
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
            {t('estimatedSavings') || 'Estimated Savings'}
          </h3>
          <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
            {formatCurrency(stats.savedAmount)}
          </p>
          {stats.total > 0 && (
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              {t('fromSuccessfulAppeals') || 'from successful appeals'}
            </div>
          )}
        </div>
      </div>
      
      {/* Success trends over time */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          {t('successTrends') || 'Success Trends Over Time'}
        </h3>
        {stats.monthly.length > 0 ? (
          renderLineChart()
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('notEnoughData') || 'Not enough data to show trends'}
          </p>
        )}
      </div>
      
      {/* Statistics by jurisdiction and type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            {t('byJurisdiction') || 'By Jurisdiction'}
          </h3>
          {Object.keys(stats.byJurisdiction).length > 0 ? (
            renderBarChart(stats.byJurisdiction, 'rate')
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('noJurisdictionData') || 'No jurisdiction data available'}
            </p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            {t('byViolationType') || 'By Violation Type'}
          </h3>
          {Object.keys(stats.byType).length > 0 ? (
            renderBarChart(stats.byType, 'rate')
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('noTypeData') || 'No violation type data available'}
            </p>
          )}
        </div>
      </div>
      
      {/* Tips based on statistics */}
      {stats.total > 0 && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-md font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {t('statisticalInsights') || 'Statistical Insights'}
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
            {stats.successRate > 70 && (
              <li>{t('highSuccessRate') || 'You have a high success rate! Your appeals are well-crafted.'}</li>
            )}
            {stats.successRate < 30 && stats.total > 5 && (
              <li>{t('lowSuccessRate') || 'Consider revising your appeal strategy based on previous rejections.'}</li>
            )}
            {Object.entries(stats.byJurisdiction).length > 0 && (
              <li>
                {t('bestJurisdiction') || 'Best success in'}: {
                  Object.entries(stats.byJurisdiction)
                    .sort((a, b) => b[1].rate - a[1].rate)[0][0]
                } ({
                  formatPercentage(Object.entries(stats.byJurisdiction)
                    .sort((a, b) => b[1].rate - a[1].rate)[0][1].rate)
                })
              </li>
            )}
            {Object.entries(stats.byType).length > 0 && (
              <li>
                {t('bestViolationType') || 'Best success with'}: {
                  Object.entries(stats.byType)
                    .sort((a, b) => b[1].rate - a[1].rate)[0][0].replace('_', ' ')
                } ({
                  formatPercentage(Object.entries(stats.byType)
                    .sort((a, b) => b[1].rate - a[1].rate)[0][1].rate)
                })
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AppealStats; 