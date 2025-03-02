import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

interface SearchProps {
  onSearch: (searchParams: SearchParams) => void;
}

export interface SearchParams {
  query: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string[];
  types?: string[];
  amountMin?: string;
  amountMax?: string;
}

const AppealSearch: React.FC<SearchProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    status: [],
    types: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setSearchParams(prev => {
      const currentArray = prev[name as 'status' | 'types'] as string[] || [];
      return {
        ...prev,
        [name]: checked 
          ? [...currentArray, value] 
          : currentArray.filter(item => item !== value)
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const clearSearch = () => {
    setSearchParams({
      query: '',
      status: [],
      types: [],
    });
    onSearch({ query: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                name="query"
                value={searchParams.query}
                onChange={handleInputChange}
                placeholder={t('searchAppeals') || "Search appeals..."}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchParams.query && (
                <button
                  type="button"
                  onClick={() => setSearchParams(prev => ({ ...prev, query: '' }))}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                {t('filters') || "Filters"}
              </span>
            </button>
            <button
              type="button"
              onClick={clearSearch}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                {t('reset') || "Reset"}
              </span>
            </button>
          </div>
        </div>

        {/* Advanced Search Options */}
        {isAdvancedOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
            {/* Date Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dateRange') || "Date Range"}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="dateFrom" className="sr-only">{t('from') || "From"}</label>
                  <input
                    type="date"
                    id="dateFrom"
                    name="dateFrom"
                    value={searchParams.dateFrom || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="dateTo" className="sr-only">{t('to') || "To"}</label>
                  <input
                    type="date"
                    id="dateTo"
                    name="dateTo"
                    value={searchParams.dateTo || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('status') || "Status"}
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    value="submitted"
                    checked={searchParams.status?.includes('submitted') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('submitted') || "Submitted"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    value="received"
                    checked={searchParams.status?.includes('received') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('received') || "Received"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    value="under_review"
                    checked={searchParams.status?.includes('under_review') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('under_review') || "Under Review"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    value="completed"
                    checked={searchParams.status?.includes('completed') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('completed') || "Completed"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    value="rejected"
                    checked={searchParams.status?.includes('rejected') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('rejected') || "Rejected"}
                  </span>
                </label>
              </div>
            </div>

            {/* Violation Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('violationType') || "Violation Type"}
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="types"
                    value="parking"
                    checked={searchParams.types?.includes('parking') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('violationTypeParking') || "Parking"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="types"
                    value="speeding"
                    checked={searchParams.types?.includes('speeding') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('violationTypeSpeed') || "Speeding"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="types"
                    value="red_light"
                    checked={searchParams.types?.includes('red_light') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('violationTypeRedLight') || "Red Light"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="types"
                    value="stop_sign"
                    checked={searchParams.types?.includes('stop_sign') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('violationTypeStopSign') || "Stop Sign"}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="types"
                    value="other"
                    checked={searchParams.types?.includes('other') || false}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('violationTypeOther') || "Other"}
                  </span>
                </label>
              </div>
            </div>
            
            {/* Fine Amount Range */}
            <div className="md:col-span-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('fineAmountRange') || "Fine Amount Range"}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="amountMin" className="sr-only">{t('minAmount') || "Min Amount"}</label>
                  <input
                    type="number"
                    id="amountMin"
                    name="amountMin"
                    placeholder={t('minAmount') || "Min Amount"}
                    value={searchParams.amountMin || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="amountMax" className="sr-only">{t('maxAmount') || "Max Amount"}</label>
                  <input
                    type="number"
                    id="amountMax"
                    name="amountMax"
                    placeholder={t('maxAmount') || "Max Amount"}
                    value={searchParams.amountMax || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AppealSearch; 