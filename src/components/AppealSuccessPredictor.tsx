'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useToast } from '@/components/ToastNotification';
import { Input, Select } from './AccessibleInput';

// Types of violations and their base success rates
interface ViolationType {
  id: string;
  name: string;
  baseSuccessRate: number;
  keyFactors: {
    id: string;
    name: string;
    impact: number; // -0.2 to 0.3 (negative reduces chances, positive improves)
  }[];
}

const VIOLATION_TYPES: ViolationType[] = [
  {
    id: 'parking',
    name: 'Parking Violation',
    baseSuccessRate: 0.65,
    keyFactors: [
      { id: 'signage', name: 'Unclear or Missing Signage', impact: 0.25 },
      { id: 'emergency', name: 'Medical or Emergency Situation', impact: 0.2 },
      { id: 'expired', name: 'Meter/Permit Recently Expired (<15 min)', impact: 0.15 },
      { id: 'malfunction', name: 'Meter Malfunction', impact: 0.2 },
      { id: 'photos', name: 'Have Photographic Evidence', impact: 0.15 },
      { id: 'prior', name: 'Prior Similar Violations', impact: -0.15 },
      { id: 'handicap', name: 'In Handicapped Space Without Permit', impact: -0.2 }
    ]
  },
  {
    id: 'speeding',
    name: 'Speeding Ticket',
    baseSuccessRate: 0.40,
    keyFactors: [
      { id: 'radar', name: 'Radar Calibration Not Documented', impact: 0.25 },
      { id: 'weather', name: 'Poor Weather Conditions', impact: 0.15 },
      { id: 'emergency', name: 'Medical or Emergency Situation', impact: 0.2 },
      { id: 'excessive', name: 'Excessively Over Speed Limit (>20mph)', impact: -0.2 },
      { id: 'school', name: 'In School or Construction Zone', impact: -0.15 },
      { id: 'traffic', name: 'Flowing with Traffic', impact: 0.1 },
      { id: 'prior', name: 'Prior Speeding Violations', impact: -0.1 }
    ]
  },
  {
    id: 'redLight',
    name: 'Red Light Camera Ticket',
    baseSuccessRate: 0.55,
    keyFactors: [
      { id: 'yellow', name: 'Yellow Light Too Short', impact: 0.3 },
      { id: 'camera', name: 'Camera Maintenance Records Unavailable', impact: 0.25 },
      { id: 'emergency', name: 'Medical or Emergency Situation', impact: 0.2 },
      { id: 'visibility', name: 'Poor Visibility/Weather Conditions', impact: 0.15 },
      { id: 'plates', name: 'License Plate Not Clearly Visible', impact: 0.2 },
      { id: 'driver', name: 'Not the Vehicle Owner Driving', impact: 0.15 },
      { id: 'blatant', name: 'Blatant Disregard for Signal', impact: -0.2 }
    ]
  },
  {
    id: 'noPermit',
    name: 'No Parking Permit',
    baseSuccessRate: 0.7,
    keyFactors: [
      { id: 'applied', name: 'Permit Applied For But Not Received', impact: 0.25 },
      { id: 'visitor', name: 'Visitor Not Aware of Requirements', impact: 0.1 },
      { id: 'signage', name: 'Inadequate Zone Signage', impact: 0.2 },
      { id: 'temporary', name: 'Temporary Loading/Unloading', impact: 0.15 },
      { id: 'resident', name: 'Resident With Permit Just Not Displayed', impact: 0.2 },
      { id: 'repeated', name: 'Repeated Violations', impact: -0.15 }
    ]
  },
  {
    id: 'stopSign',
    name: 'Stop Sign Violation',
    baseSuccessRate: 0.5,
    keyFactors: [
      { id: 'visibility', name: 'Sign Obscured or Not Visible', impact: 0.3 },
      { id: 'rolling', name: 'Rolling Stop vs. Complete Miss', impact: 0.15 },
      { id: 'emergency', name: 'Medical or Emergency Situation', impact: 0.2 },
      { id: 'weather', name: 'Poor Weather Conditions', impact: 0.1 },
      { id: 'nocrossTraffic', name: 'No Cross Traffic Present', impact: 0.1 },
      { id: 'priorViolations', name: 'Prior Similar Violations', impact: -0.1 }
    ]
  },
  {
    id: 'other',
    name: 'Other Traffic Violation',
    baseSuccessRate: 0.5,
    keyFactors: [
      { id: 'firstOffense', name: 'First Offense', impact: 0.15 },
      { id: 'emergency', name: 'Medical or Emergency Situation', impact: 0.2 },
      { id: 'evidence', name: 'Have Photographic/Video Evidence', impact: 0.2 },
      { id: 'technicality', name: 'Procedural/Technical Error on Ticket', impact: 0.25 },
      { id: 'priorViolations', name: 'Multiple Prior Violations', impact: -0.15 }
    ]
  }
];

// Appeal strength factors
const APPEAL_FACTORS = [
  { id: 'evidence', name: 'Strength of Evidence', options: [
    { value: 'none', label: 'No Supporting Evidence', impact: -0.1 },
    { value: 'weak', label: 'Weak Evidence', impact: 0 },
    { value: 'moderate', label: 'Moderate Evidence', impact: 0.1 },
    { value: 'strong', label: 'Strong Evidence', impact: 0.2 }
  ]},
  { id: 'record', name: 'Driving Record', options: [
    { value: 'bad', label: 'Multiple Recent Violations', impact: -0.1 },
    { value: 'fair', label: 'Few Recent Violations', impact: 0 },
    { value: 'good', label: 'Clean Recent Record', impact: 0.1 },
    { value: 'perfect', label: 'Perfect Driving Record', impact: 0.15 }
  ]},
  { id: 'officer', name: 'Officer Appearance', options: [
    { value: 'certain', label: 'Likely to Appear', impact: -0.05 },
    { value: 'unknown', label: 'Unknown', impact: 0 },
    { value: 'unlikely', label: 'Unlikely to Appear', impact: 0.15 }
  ]},
  { id: 'representation', name: 'Legal Representation', options: [
    { value: 'none', label: 'Self-Represented', impact: 0 },
    { value: 'help', label: 'Used Online Resources/Help', impact: 0.05 },
    { value: 'attorney', label: 'Attorney Representation', impact: 0.15 }
  ]}
];

export default function AppealSuccessPredictor() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  
  const [violationType, setViolationType] = useState<string>(VIOLATION_TYPES[0].id);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [appealFactors, setAppealFactors] = useState<{[key: string]: string}>({
    evidence: 'weak',
    record: 'fair',
    officer: 'unknown',
    representation: 'none'
  });
  
  const [result, setResult] = useState<{
    successProbability: number;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  } | null>(null);
  
  // Handle toggle of key violation-specific factors
  const handleFactorToggle = (factorId: string) => {
    setSelectedFactors(prev => {
      if (prev.includes(factorId)) {
        return prev.filter(id => id !== factorId);
      } else {
        return [...prev, factorId];
      }
    });
  };
  
  // Handle changes to appeal strength factors
  const handleAppealFactorChange = (id: string, value: string) => {
    setAppealFactors(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Calculate the success probability
  const calculateSuccessProbability = () => {
    // Get the selected violation type
    const violation = VIOLATION_TYPES.find(v => v.id === violationType);
    if (!violation) return;
    
    // Start with the base success rate
    let probability = violation.baseSuccessRate;
    
    // Add impact from selected key factors
    selectedFactors.forEach(factorId => {
      const factor = violation.keyFactors.find(f => f.id === factorId);
      if (factor) {
        probability += factor.impact;
      }
    });
    
    // Add impact from appeal factors
    Object.entries(appealFactors).forEach(([factorId, selectedValue]) => {
      const factor = APPEAL_FACTORS.find(f => f.id === factorId);
      if (factor) {
        const option = factor.options.find(o => o.value === selectedValue);
        if (option) {
          probability += option.impact;
        }
      }
    });
    
    // Clamp probability between 0.05 and 0.95 (never 0% or 100%)
    probability = Math.max(0.05, Math.min(0.95, probability));
    
    // Identify strengths
    const strengths: string[] = [];
    
    // Add selected factors with positive impact as strengths
    selectedFactors.forEach(factorId => {
      const factor = violation.keyFactors.find(f => f.id === factorId);
      if (factor && factor.impact > 0) {
        strengths.push(factor.name);
      }
    });
    
    // Add appeal factors with positive impact
    Object.entries(appealFactors).forEach(([factorId, selectedValue]) => {
      const factor = APPEAL_FACTORS.find(f => f.id === factorId);
      if (factor) {
        const option = factor.options.find(o => o.value === selectedValue);
        if (option && option.impact > 0) {
          strengths.push(`${factor.name}: ${option.label}`);
        }
      }
    });
    
    // Identify weaknesses
    const weaknesses: string[] = [];
    
    // Add selected factors with negative impact as weaknesses
    selectedFactors.forEach(factorId => {
      const factor = violation.keyFactors.find(f => f.id === factorId);
      if (factor && factor.impact < 0) {
        weaknesses.push(factor.name);
      }
    });
    
    // Add unselected factors with positive impact as missed opportunities
    violation.keyFactors.forEach(factor => {
      if (factor.impact > 0 && !selectedFactors.includes(factor.id)) {
        weaknesses.push(`Missing: ${factor.name}`);
      }
    });
    
    // Add appeal factors with negative impact
    Object.entries(appealFactors).forEach(([factorId, selectedValue]) => {
      const factor = APPEAL_FACTORS.find(f => f.id === factorId);
      if (factor) {
        const option = factor.options.find(o => o.value === selectedValue);
        if (option && option.impact < 0) {
          weaknesses.push(`${factor.name}: ${option.label}`);
        }
      }
    });
    
    // Generate recommendation
    let recommendation = '';
    if (probability >= 0.7) {
      recommendation = t('highChanceRecommendation') || 
        'Your appeal has a high chance of success. We recommend proceeding with an appeal using the strengths identified.';
    } else if (probability >= 0.4) {
      recommendation = t('moderateChanceRecommendation') || 
        'Your appeal has a moderate chance of success. Consider addressing the weaknesses identified before proceeding.';
    } else {
      recommendation = t('lowChanceRecommendation') || 
        'Your appeal has a relatively low chance of success. You might want to consider paying the fine unless the principles or financial implications are significant.';
    }
    
    // Set the result
    setResult({
      successProbability: probability,
      strengths: strengths.slice(0, 5), // Limit to top 5 strengths
      weaknesses: weaknesses.slice(0, 5), // Limit to top 5 weaknesses
      recommendation
    });
    
    showToast(t('predictionComplete') || 'Success prediction complete!', 'success');
  };
  
  // Get current violation type and its factors
  const currentViolation = VIOLATION_TYPES.find(v => v.id === violationType) || VIOLATION_TYPES[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {t('appealSuccessPredictor') || 'Appeal Success Predictor'}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('appealPredictorDescription') || 'Analyze your ticket details to predict the likelihood of a successful appeal based on historical data.'}
        </p>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-750">
        <div className="space-y-6">
          {/* Violation Type Selection */}
          <div>
            <Select
              id="violationType"
              label={t('violationType') || 'Violation Type'}
              value={violationType}
              onChange={(e) => {
                setViolationType(e.target.value);
                setSelectedFactors([]);
              }}
              options={VIOLATION_TYPES.map(type => ({ 
                value: type.id, 
                label: t(`violationType${type.id.charAt(0).toUpperCase() + type.id.slice(1)}`) || type.name 
              }))}
            />
          </div>
          
          {/* Key Factors */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
              {t('keyFactors') || 'Key Factors for this Violation'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('selectApplicableFactors') || 'Select all factors that apply to your situation:'}
            </p>
            
            <div className="space-y-2">
              {currentViolation.keyFactors.map(factor => (
                <div key={factor.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`factor-${factor.id}`}
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedFactors.includes(factor.id)}
                      onChange={() => handleFactorToggle(factor.id)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`factor-${factor.id}`} className={`font-medium ${factor.impact > 0 ? 'text-green-700 dark:text-green-400' : factor.impact < 0 ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {t(`factor${factor.id.charAt(0).toUpperCase() + factor.id.slice(1)}`) || factor.name}
                      {factor.impact > 0 && ' (+)'}
                      {factor.impact < 0 && ' (-)'}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Appeal Strength Factors */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
              {t('appealStrengthFactors') || 'Appeal Strength Factors'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('rateYourAppealStrength') || 'Rate the strength of your appeal based on these factors:'}
            </p>
            
            <div className="space-y-4">
              {APPEAL_FACTORS.map(factor => (
                <div key={factor.id}>
                  <Select
                    id={`appeal-${factor.id}`}
                    label={t(`appealFactor${factor.id.charAt(0).toUpperCase() + factor.id.slice(1)}`) || factor.name}
                    value={appealFactors[factor.id]}
                    onChange={(e) => handleAppealFactorChange(factor.id, e.target.value)}
                    options={factor.options.map(option => ({ 
                      value: option.value, 
                      label: `${t(`option${option.value.charAt(0).toUpperCase() + option.value.slice(1)}`) || option.label} ${option.impact > 0 ? '(+)' : option.impact < 0 ? '(-)' : ''}`
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Calculate Button */}
          <div>
            <button
              onClick={calculateSuccessProbability}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {t('predictSuccess') || 'Predict Success Probability'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Results */}
      {result && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t('predictionResults') || 'Prediction Results'}
          </h3>
          
          <div className="mb-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                    {t('successProbability') || 'Success Probability'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                    {Math.round(result.successProbability * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900">
                <div 
                  style={{ width: `${Math.round(result.successProbability * 100)}%` }} 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    result.successProbability >= 0.7 ? 'bg-green-500' : 
                    result.successProbability >= 0.4 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Strengths */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">
                {t('appealStrengths') || 'Appeal Strengths'}
              </h4>
              {result.strengths.length > 0 ? (
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                  {result.strengths.map((strength, index) => (
                    <li key={index}>{t(`strength${strength.replace(/\s+/g, '')}`) || strength}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('noStrengthsIdentified') || 'No significant strengths identified.'}
                </p>
              )}
            </div>
            
            {/* Weaknesses */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                {t('appealWeaknesses') || 'Appeal Weaknesses'}
              </h4>
              {result.weaknesses.length > 0 ? (
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index}>{t(`weakness${weakness.replace(/\s+/g, '')}`) || weakness}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-red-700 dark:text-red-300">
                  {t('noWeaknessesIdentified') || 'No significant weaknesses identified.'}
                </p>
              )}
            </div>
          </div>
          
          {/* Recommendation */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="flex items-center text-blue-700 dark:text-blue-400 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('recommendation') || 'Recommendation'}
            </h4>
            <p className="mt-2 text-blue-700 dark:text-blue-300">
              {result.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 