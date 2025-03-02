'use client';

import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isPremium?: boolean;
}

export default function FeatureCard({ title, description, icon, isPremium = false }: FeatureCardProps) {
  return (
    <div className={`rounded-lg p-5 ${isPremium ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${isPremium ? 'text-blue-100' : 'text-blue-600'}`}>
          {icon}
        </div>
        
        <div className="ml-4">
          <div className="flex items-center">
            <h3 className={`text-lg font-medium ${isPremium ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h3>
            
            {isPremium && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-white text-blue-700 rounded-full">
                Premium
              </span>
            )}
          </div>
          
          <p className={`mt-1 text-sm ${isPremium ? 'text-blue-100' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
} 