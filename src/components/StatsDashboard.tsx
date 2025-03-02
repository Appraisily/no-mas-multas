'use client';

import { useState } from 'react';
import { UserProfile } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';

interface StatsDashboardProps {
  userProfile: UserProfile;
}

export default function StatsDashboard({ userProfile }: StatsDashboardProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate percentage of appeals used
  const appealsUsed = userProfile.appealsGenerated || 0;
  const appealsTotal = (userProfile.appealsRemaining || 0) + appealsUsed;
  const appealsPercentage = appealsTotal ? Math.min(100, Math.round((appealsUsed / appealsTotal) * 100)) : 0;
  
  return (
    <div className={`bg-white rounded-lg shadow-md transition-all duration-300 ${isExpanded ? 'p-6' : 'p-4'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Usage Dashboard</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-600">Appeals Used</span>
          <span className="text-sm font-medium text-gray-800">{appealsUsed} / {appealsTotal}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${appealsPercentage}%` }}
          ></div>
        </div>
        {userProfile.appealsRemaining !== undefined && (
          <p className="text-xs text-gray-500 mt-1">
            You have {userProfile.appealsRemaining} appeals remaining this month
          </p>
        )}
      </div>
      
      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <h3 className="text-sm font-medium text-blue-700">Current Plan</h3>
              <p className="text-xl font-bold mt-1 text-blue-800">
                {userProfile.plan.charAt(0).toUpperCase() + userProfile.plan.slice(1)}
              </p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-md border border-green-100">
              <h3 className="text-sm font-medium text-green-700">Successful Appeals</h3>
              <p className="text-xl font-bold mt-1 text-green-800">
                {Math.floor(appealsUsed * 0.7)} {/* Just a placeholder calculation */}
              </p>
            </div>
          </div>
          
          {userProfile.plan !== 'professional' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition-colors">
                Upgrade Your Plan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 