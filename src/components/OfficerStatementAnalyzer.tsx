'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useToast } from '@/components/ToastNotification';

// Define types for common officer statement issues
interface IssueType {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  impactLevel: 'high' | 'medium' | 'low';
}

// Define common procedural and statement issues that could help with appeals
const COMMON_ISSUES: IssueType[] = [
  {
    id: 'vague_description',
    name: 'Vague Description',
    description: 'The officer uses subjective or imprecise language that can be contested.',
    keywords: ['appeared to be', 'seemed', 'estimate', 'approximately', 'around', 'about', 'looked like'],
    impactLevel: 'medium'
  },
  {
    id: 'equipment_calibration',
    name: 'Equipment Calibration Issues',
    description: 'No mention of equipment calibration or certification for speed/measurement devices.',
    keywords: ['radar', 'lidar', 'laser', 'speed', 'breathalyzer', 'camera', 'detector', 'mph', 'km/h'],
    impactLevel: 'high'
  },
  {
    id: 'missing_elements',
    name: 'Missing Required Elements',
    description: 'The statement is missing legally required elements for this violation type.',
    keywords: ['sign', 'marking', 'notice', 'warning', 'signal', 'posted', 'visible'],
    impactLevel: 'high'
  },
  {
    id: 'visibility_conditions',
    name: 'Poor Visibility Conditions',
    description: 'Weather or lighting conditions that could affect officer observation.',
    keywords: ['night', 'dark', 'rain', 'fog', 'snow', 'dusk', 'dawn', 'visibility', 'weather'],
    impactLevel: 'medium'
  },
  {
    id: 'officer_position',
    name: 'Officer Position',
    description: 'Mentions of the officer\'s position that might indicate limited visibility.',
    keywords: ['behind', 'distance', 'feet away', 'meters away', 'across', 'angle', 'view', 'blocked'],
    impactLevel: 'medium'
  },
  {
    id: 'inconsistent_times',
    name: 'Time Inconsistencies',
    description: 'Inconsistent or unlikely timing in the sequence of events.',
    keywords: ['time', 'minutes', 'seconds', 'hour', 'clock', 'watch', 'moment', 'immediately'],
    impactLevel: 'medium'
  },
  {
    id: 'identification_issues',
    name: 'Vehicle/Driver Identification Issues',
    description: 'Problems with how the vehicle or driver was identified.',
    keywords: ['identify', 'identification', 'license', 'plate', 'color', 'make', 'model', 'similar'],
    impactLevel: 'high'
  },
  {
    id: 'procedural_error',
    name: 'Procedural Errors',
    description: 'Mentions of procedures that suggest proper protocol may not have been followed.',
    keywords: ['procedure', 'protocol', 'stop', 'approach', 'inform', 'steps', 'follow', 'standard'],
    impactLevel: 'high'
  },
  {
    id: 'witness_absence',
    name: 'No Additional Witnesses',
    description: 'No mention of additional witnesses or corroborating evidence.',
    keywords: ['witness', 'evidence', 'colleague', 'partner', 'camera', 'recording', 'footage'],
    impactLevel: 'low'
  },
  {
    id: 'environmental_factors',
    name: 'Environmental Factors',
    description: 'Environmental circumstances that could affect the situation.',
    keywords: ['traffic', 'road', 'construction', 'congestion', 'conditions', 'flow', 'safety'],
    impactLevel: 'low'
  }
];

export default function OfficerStatementAnalyzer() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  
  const [statementText, setStatementText] = useState('');
  const [violationType, setViolationType] = useState('');
  const [foundIssues, setFoundIssues] = useState<{
    issue: IssueType;
    matches: string[];
    confidence: number;
  }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  
  // List of common violation types
  const violationTypes = [
    { id: 'speeding', name: t('violationTypeSpeeding') || 'Speeding' },
    { id: 'redLight', name: t('violationTypeRedLight') || 'Red Light' },
    { id: 'stopSign', name: t('violationTypeStopSign') || 'Stop Sign' },
    { id: 'parking', name: t('violationTypeParking') || 'Parking' },
    { id: 'noTurn', name: t('violationTypeNoTurn') || 'Illegal Turn' },
    { id: 'cellPhone', name: t('violationTypeCellPhone') || 'Cell Phone Use' },
    { id: 'registration', name: t('violationTypeRegistration') || 'Registration/Documentation' },
    { id: 'other', name: t('violationTypeOther') || 'Other' }
  ];
  
  // Clear results when input changes
  useEffect(() => {
    setFoundIssues([]);
    setOverallScore(null);
  }, [statementText, violationType]);
  
  // Main analysis function
  const analyzeStatement = () => {
    if (!statementText.trim()) {
      showToast(t('emptyStatementError') || 'Please enter the officer statement text.', 'error');
      return;
    }
    
    if (!violationType) {
      showToast(t('selectViolationTypeError') || 'Please select a violation type.', 'error');
      return;
    }
    
    setIsAnalyzing(true);
    setFoundIssues([]);
    
    // Simulate a short delay to represent processing time
    setTimeout(() => {
      try {
        const issues = findIssuesInStatement(statementText);
        setFoundIssues(issues);
        
        // Calculate overall score based on issues found
        const score = calculateAppealPotentialScore(issues);
        setOverallScore(score);
        
        if (issues.length === 0) {
          showToast(
            t('noIssuesFound') || 'No potential issues were found in the statement.',
            'info'
          );
        } else {
          showToast(
            t('issuesFound') || `Found ${issues.length} potential issues to explore.`,
            'success'
          );
        }
      } catch (error) {
        console.error('Error analyzing statement:', error);
        showToast(
          t('analysisError') || 'An error occurred during analysis. Please try again.',
          'error'
        );
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };
  
  // Function to find issues in the statement
  const findIssuesInStatement = (text: string) => {
    const lowercaseText = text.toLowerCase();
    const results = [];
    
    for (const issue of COMMON_ISSUES) {
      const matches: string[] = [];
      let matchCount = 0;
      
      // Look for keyword matches
      issue.keywords.forEach(keyword => {
        // Using regex to find whole word matches
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const keywordMatches = text.match(regex);
        
        if (keywordMatches) {
          matchCount += keywordMatches.length;
          
          // Extract small context around the match (up to 50 chars)
          keywordMatches.forEach(match => {
            const keywordIndex = lowercaseText.indexOf(match.toLowerCase());
            if (keywordIndex >= 0) {
              const start = Math.max(0, keywordIndex - 25);
              const end = Math.min(text.length, keywordIndex + match.length + 25);
              const context = text.substring(start, end);
              
              // Highlight the match with bold formatting
              const highlightedContext = context.replace(
                new RegExp(`(${match})`, 'gi'), 
                '**$1**'
              );
              
              matches.push(`...${highlightedContext}...`);
            }
          });
        }
      });
      
      // Only include issues with matches
      if (matches.length > 0) {
        // Calculate confidence based on number of matches and impact level
        const impactFactor = issue.impactLevel === 'high' ? 1.5 : 
                             issue.impactLevel === 'medium' ? 1.0 : 0.5;
        
        const confidence = Math.min(100, Math.round((matchCount * impactFactor * 20)));
        
        results.push({
          issue,
          matches: matches.slice(0, 3), // Limit to 3 examples
          confidence
        });
      }
    }
    
    // Sort by confidence (highest first)
    return results.sort((a, b) => b.confidence - a.confidence);
  };
  
  // Calculate overall score for appeal potential
  const calculateAppealPotentialScore = (issues: typeof foundIssues) => {
    if (issues.length === 0) return 0;
    
    // Base chance for any appeal
    let baseChance = 25;
    
    // Add weighted values based on issues found
    let totalImpact = 0;
    
    issues.forEach(({ issue, confidence }) => {
      const impactValue = issue.impactLevel === 'high' ? 15 : 
                          issue.impactLevel === 'medium' ? 10 : 5;
      
      // Scale by confidence
      totalImpact += (impactValue * (confidence / 100));
    });
    
    // Calculate final score (cap at 95% - nothing is guaranteed)
    return Math.min(95, Math.round(baseChance + totalImpact));
  };
  
  // Get color class based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  // Get impact level badge color
  const getImpactBadgeClass = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {t('officerStatementAnalyzer') || 'Officer Statement Analyzer'}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('officerStatementDescription') || 'Analyze police officer statements to identify potential weaknesses that could help your appeal.'}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Input Form */}
        <div className="space-y-4">
          {/* Violation Type Selection */}
          <div>
            <label htmlFor="violationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('violationType') || 'Violation Type'}
            </label>
            <select
              id="violationType"
              value={violationType}
              onChange={(e) => setViolationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">{t('selectViolationType') || 'Select violation type...'}</option>
              {violationTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Statement Text Input */}
          <div>
            <label htmlFor="statementText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('officerStatementText') || 'Officer Statement Text'}
            </label>
            <textarea
              id="statementText"
              value={statementText}
              onChange={(e) => setStatementText(e.target.value)}
              rows={8}
              placeholder={t('pasteOfficerStatement') || 'Paste the officer statement or ticket description here...'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('statementInputTip') || 'Include as much detail as possible from the ticket and any officer statements.'}
            </p>
          </div>
          
          {/* Analysis Button */}
          <div>
            <button
              onClick={analyzeStatement}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('analyzingStatement') || 'Analyzing Statement...'}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  {t('analyzeStatement') || 'Analyze Statement'}
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Analysis Results */}
        {foundIssues.length > 0 && (
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('analysisResults') || 'Analysis Results'}
            </h3>
            
            {/* Overall Score Card */}
            {overallScore !== null && (
              <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 flex items-center">
                <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow">
                  <span className={`text-3xl font-bold ${getScoreColorClass(overallScore)}`}>
                    {overallScore}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t('appealPotential') || 'Potential'}
                  </span>
                </div>
                
                <div className="ml-4 flex-1">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    {overallScore >= 70 ? (t('highAppealPotential') || 'High Appeal Potential') :
                     overallScore >= 40 ? (t('moderateAppealPotential') || 'Moderate Appeal Potential') :
                     (t('lowAppealPotential') || 'Low Appeal Potential')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {overallScore >= 70 ? 
                      (t('highAppealAdvice') || 'Several strong issues were identified that may help your appeal.') :
                     overallScore >= 40 ? 
                      (t('moderateAppealAdvice') || 'Some issues were found that could support your appeal, but the case has moderate strength.') :
                      (t('lowAppealAdvice') || 'Few significant issues were found. This may be a challenging appeal, but you can still try.')}
                  </p>
                </div>
              </div>
            )}
            
            {/* Found Issues */}
            <div className="space-y-4">
              {foundIssues.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-750 shadow overflow-hidden rounded-md"
                >
                  <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                        {item.issue.name}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactBadgeClass(item.issue.impactLevel)}`}>
                          {item.issue.impactLevel === 'high' ? (t('highImpact') || 'High Impact') :
                           item.issue.impactLevel === 'medium' ? (t('mediumImpact') || 'Medium Impact') :
                           (t('lowImpact') || 'Low Impact')}
                        </span>
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {item.issue.description}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <div className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {item.confidence}% {t('confidence') || 'Confidence'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Evidence */}
                  <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-800">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('evidenceFound') || 'Evidence Found:'}
                    </h5>
                    <ul className="space-y-1">
                      {item.matches.map((match, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-white dark:bg-gray-700 rounded">
                          {match.split('**').map((part, i) => (
                            i % 2 === 0 ? 
                              part : 
                              <span key={i} className="font-bold text-blue-600 dark:text-blue-400">{part}</span>
                          ))}
                        </li>
                      ))}
                    </ul>
                    
                    {/* How to Use This */}
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        {t('howToUseThis') || 'How to use this in your appeal:'}
                      </p>
                      {item.issue.id === 'vague_description' && (
                        <p>{t('vague_description_advice') || 'Emphasize that subjective observations are not reliable evidence and don\'t meet the "beyond reasonable doubt" standard.'}</p>
                      )}
                      {item.issue.id === 'equipment_calibration' && (
                        <p>{t('equipment_calibration_advice') || 'Request evidence of recent equipment calibration and certification records, which are required for accurate measurements.'}</p>
                      )}
                      {item.issue.id === 'missing_elements' && (
                        <p>{t('missing_elements_advice') || 'Highlight that all required elements of the violation must be clearly documented, and absence of these details creates reasonable doubt.'}</p>
                      )}
                      {item.issue.id === 'visibility_conditions' && (
                        <p>{t('visibility_conditions_advice') || 'Question the reliability of observations made under poor visibility conditions, which can significantly impact accuracy.'}</p>
                      )}
                      {item.issue.id === 'officer_position' && (
                        <p>{t('officer_position_advice') || 'Challenge the officer\'s ability to make accurate observations from their described position or distance.'}</p>
                      )}
                      {item.issue.id === 'inconsistent_times' && (
                        <p>{t('inconsistent_times_advice') || 'Point out any timing inconsistencies that make the sequence of events implausible or questionable.'}</p>
                      )}
                      {item.issue.id === 'identification_issues' && (
                        <p>{t('identification_issues_advice') || 'Question how the officer could definitively identify your specific vehicle or you as the driver with the level of detail provided.'}</p>
                      )}
                      {item.issue.id === 'procedural_error' && (
                        <p>{t('procedural_error_advice') || 'Argue that proper procedures must be followed for evidence to be admissible, and any procedural errors can invalidate the citation.'}</p>
                      )}
                      {item.issue.id === 'witness_absence' && (
                        <p>{t('witness_absence_advice') || 'Note that the officer\'s testimony is uncorroborated by other witnesses or evidence, which weakens the case against you.'}</p>
                      )}
                      {item.issue.id === 'environmental_factors' && (
                        <p>{t('environmental_factors_advice') || 'Explain how the mentioned environmental factors could have necessitated your actions or affected the situation.'}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Appeal Strategy Tips */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                {t('appealStrategyTips') || 'Appeal Strategy Tips'}
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                <li>{t('appealTip1') || 'Focus on factual and procedural issues rather than excuses'}</li>
                <li>{t('appealTip2') || 'Be respectful and professional in all communications'}</li>
                <li>{t('appealTip3') || 'Request all evidence the officer has against you'}</li>
                <li>{t('appealTip4') || 'Consider using multiple arguments from the analysis in your appeal'}</li>
                <li>{t('appealTip5') || 'Document everything with photos, diagrams, or additional evidence'}</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* No Issues Found Message */}
        {overallScore === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-md p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  {t('noIssuesFoundTitle') || 'No Clear Issues Detected'}
                </h3>
                <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                  {t('noIssuesFoundDescription') || 'Our analysis did not identify common issues in the officer statement. This doesn\'t mean you can\'t appeal - there may be other factors not covered by this analysis. Consider trying our Appeal Success Predictor or consulting with a legal professional.'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty State (Before Analysis) */}
        {!isAnalyzing && foundIssues.length === 0 && overallScore === null && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t('officerStatementInstructions') || 'Enter the officer\'s statement from your ticket to analyze it for potential weaknesses that could help your appeal. The more complete the statement, the better the analysis.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 