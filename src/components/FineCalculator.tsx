'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Input, Select } from './AccessibleInput';
import { useToast } from './ToastNotification';

interface FineCategory {
  id: string;
  name: string;
  baseAmount: number;
  lateMultiplier: number;
  maxFee: number;
  appealSuccessRate: number;
}

const DEFAULT_CATEGORIES: FineCategory[] = [
  {
    id: 'parking',
    name: 'Parking Violation',
    baseAmount: 60,
    lateMultiplier: 1.5,
    maxFee: 120,
    appealSuccessRate: 0.65
  },
  {
    id: 'speeding',
    name: 'Speeding Ticket',
    baseAmount: 150,
    lateMultiplier: 1.75,
    maxFee: 350,
    appealSuccessRate: 0.40
  },
  {
    id: 'redLight',
    name: 'Red Light Camera',
    baseAmount: 100,
    lateMultiplier: 1.5,
    maxFee: 200,
    appealSuccessRate: 0.55
  },
  {
    id: 'noPermit',
    name: 'No Parking Permit',
    baseAmount: 45,
    lateMultiplier: 1.5,
    maxFee: 90,
    appealSuccessRate: 0.70
  },
  {
    id: 'handicapped',
    name: 'Handicapped Parking',
    baseAmount: 250,
    lateMultiplier: 1.5,
    maxFee: 500,
    appealSuccessRate: 0.20
  },
  {
    id: 'other',
    name: 'Other Violation',
    baseAmount: 100,
    lateMultiplier: 1.5,
    maxFee: 200,
    appealSuccessRate: 0.50
  }
];

export default function FineCalculator() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [fineCategory, setFineCategory] = useState<string>(DEFAULT_CATEGORIES[0].id);
  const [fineAmount, setFineAmount] = useState<string>('');
  const [daysLate, setDaysLate] = useState<string>('0');
  const [customSuccessRate, setCustomSuccessRate] = useState<string>('');
  const [calculationResult, setCalculationResult] = useState<{
    originalAmount: number;
    lateAmount: number;
    totalAmount: number;
    potentialSaving: number;
    successProbability: number;
    expectedValue: number;
  } | null>(null);

  const calculateFine = () => {
    // Find selected category
    const category = DEFAULT_CATEGORIES.find(cat => cat.id === fineCategory) || DEFAULT_CATEGORIES[0];
    
    // Get base amount (either custom or from category)
    const baseAmount = fineAmount ? parseFloat(fineAmount) : category.baseAmount;
    
    if (isNaN(baseAmount) || baseAmount <= 0) {
      showToast(t('invalidFineAmount') || 'Please enter a valid fine amount', 'error');
      return;
    }
    
    // Calculate late fees if applicable
    const daysPastDue = parseInt(daysLate) || 0;
    let lateAmount = 0;
    
    if (daysPastDue > 0) {
      // Basic calculation: 5% per 30 days late, capped at maxFee
      const latePeriods = Math.ceil(daysPastDue / 30);
      const lateFactor = Math.min(1 + (latePeriods * 0.05), category.lateMultiplier);
      lateAmount = baseAmount * (lateFactor - 1);
    }
    
    const totalAmount = Math.min(baseAmount + lateAmount, category.maxFee);
    
    // Get success probability (either custom or from category)
    const successRate = customSuccessRate ? 
      (parseFloat(customSuccessRate) / 100) : category.appealSuccessRate;
    
    // Calculate potential saving and expected value
    const potentialSaving = totalAmount;
    const expectedValue = potentialSaving * successRate;
    
    setCalculationResult({
      originalAmount: baseAmount,
      lateAmount,
      totalAmount,
      potentialSaving,
      successProbability: successRate * 100,
      expectedValue
    });
    
    showToast(t('calculationComplete') || 'Calculation complete!', 'success');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFineCategory(e.target.value);
    // Reset custom success rate when category changes
    setCustomSuccessRate('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('fineCalculator') || 'Fine Calculator'}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('fineCalculatorDescription') || 'Estimate potential fines and calculate your possible savings from a successful appeal.'}
        </p>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-750">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            id="fineCategory"
            label={t('violationType') || 'Violation Type'}
            value={fineCategory}
            onChange={handleCategoryChange}
            options={DEFAULT_CATEGORIES.map(cat => ({ value: cat.id, label: t(cat.id) || cat.name }))}
            helperText={t('selectViolationType') || 'Select the type of violation'}
          />

          <Input
            id="fineAmount"
            label={t('fineAmount') || 'Fine Amount'}
            type="number"
            min="0"
            step="0.01"
            value={fineAmount}
            onChange={(e) => setFineAmount(e.target.value)}
            placeholder={fineCategory ? 
              `${t('defaultAmount') || 'Default'}: ${formatCurrency(DEFAULT_CATEGORIES.find(cat => cat.id === fineCategory)?.baseAmount || 0)}` : 
              t('enterAmount') || 'Enter amount'}
            helperText={t('leaveBlankForDefault') || 'Leave blank to use the default amount for this violation type'}
          />

          <Input
            id="daysLate"
            label={t('daysPastDue') || 'Days Past Due'}
            type="number"
            min="0"
            step="1"
            value={daysLate}
            onChange={(e) => setDaysLate(e.target.value)}
            helperText={t('daysLateHelp') || 'Days since the payment deadline (0 if not late)'}
          />

          <Input
            id="customSuccessRate"
            label={t('customSuccessRate') || 'Custom Success Rate (%)'}
            type="number"
            min="0"
            max="100"
            step="1"
            value={customSuccessRate}
            onChange={(e) => setCustomSuccessRate(e.target.value)}
            placeholder={fineCategory ? 
              `${t('defaultRate') || 'Default'}: ${Math.round((DEFAULT_CATEGORIES.find(cat => cat.id === fineCategory)?.appealSuccessRate || 0) * 100)}%` : 
              t('enterRate') || 'Enter rate'}
            helperText={t('leaveBlankForDefaultRate') || 'Leave blank to use the average success rate for this violation type'}
          />
        </div>

        <div className="mt-6">
          <button 
            onClick={calculateFine}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {t('calculateButton') || 'Calculate Potential Savings'}
          </button>
        </div>
      </div>

      {calculationResult && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t('calculationResults') || 'Calculation Results'}
          </h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('originalFine') || 'Original Fine'}
              </h4>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(calculationResult.originalAmount)}
              </p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('lateFees') || 'Late Fees'}
              </h4>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(calculationResult.lateAmount)}
              </p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('totalAmount') || 'Total Amount Due'}
              </h4>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(calculationResult.totalAmount)}
              </p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('successProbability') || 'Success Probability'}
              </h4>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {calculationResult.successProbability.toFixed(1)}%
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg col-span-1 md:col-span-2">
              <h4 className="text-sm font-medium text-blue-500 dark:text-blue-400">
                {t('potentialSavings') || 'Potential Savings'}
              </h4>
              <p className="text-xl font-semibold text-blue-600 dark:text-blue-300">
                {formatCurrency(calculationResult.potentialSaving)}
              </p>
              <p className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-1">
                {t('expectedValueExplanation') || 'Expected value of appeal:'} 
                <span className="font-semibold"> {formatCurrency(calculationResult.expectedValue)}</span>
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h4 className="flex items-center text-green-700 dark:text-green-400 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('recommendation') || 'Recommendation'}
            </h4>
            <p className="mt-2 text-green-600 dark:text-green-300">
              {calculationResult.expectedValue > 50 
                ? (t('appealRecommended') || 'Filing an appeal is recommended based on the potential savings and success probability.')
                : (t('appealMarginal') || 'The expected value of your appeal is marginal. Consider the time investment before proceeding.')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 