'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

type AppealType = 'procedural' | 'factual' | 'legal' | 'comprehensive';

interface QualityMetrics {
  clarity: number;
  persuasiveness: number;
  professionalism: number;
  relevance: number;
  overall: number;
  suggestions: string[];
  strengths: string[];
}

interface AppealQualityAnalyzerProps {
  appealText: string;
  appealType: AppealType;
  autoAnalyze?: boolean;
}

export default function AppealQualityAnalyzer({ 
  appealText, 
  appealType, 
  autoAnalyze = false 
}: AppealQualityAnalyzerProps) {
  const { t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto analyze with debounce when text changes
  useEffect(() => {
    // Only auto analyze if the feature is enabled
    if (autoAnalyze && appealText) {
      // Don't analyze very short text or if it's the same as last analyzed
      if (appealText.length < 50 || appealText === lastAnalyzedText) {
        return;
      }
      
      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Set a new timer to analyze after user stops typing
      debounceTimerRef.current = setTimeout(() => {
        analyzeAppeal();
      }, 2000); // 2 second debounce
    }
    
    // Cleanup function to clear the timer if the component unmounts
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [appealText, autoAnalyze]);

  const analyzeAppeal = async () => {
    if (!appealText.trim() || analyzing) return;

    setAnalyzing(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate metrics based on appeal text
      const clarity = calculateClarity(appealText);
      const persuasiveness = calculatePersuasiveness(appealText, appealType);
      const professionalism = calculateProfessionalism(appealText);
      const relevance = calculateRelevance(appealText, appealType);
      
      // Calculate overall score (weighted average)
      const overall = Math.round(
        (clarity * 0.25 + persuasiveness * 0.3 + professionalism * 0.2 + relevance * 0.25) * 10
      ) / 10;
      
      // Generate suggestions and strengths
      const suggestions = generateSuggestions(
        appealText, 
        appealType, 
        { clarity, persuasiveness, professionalism, relevance }
      );
      const strengths = generateStrengths(
        appealText, 
        appealType, 
        { clarity, persuasiveness, professionalism, relevance }
      );
      
      setMetrics({ 
        clarity, 
        persuasiveness, 
        professionalism, 
        relevance, 
        overall,
        suggestions,
        strengths
      });
      
      // Set the analyzing flag to false after a delay for UX
      setTimeout(() => {
        setAnalyzing(false);
        setExpanded(true);
        setLastAnalyzedText(appealText);
      }, 500);
    } catch (error) {
      console.error('Error analyzing appeal:', error);
      setAnalyzing(false);
    }
  };
  
  const calculateClarity = (text: string): number => {
    // Simple heuristic - average sentence length (shorter is clearer, up to a point)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    
    const avgSentenceLength = text.length / sentences.length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Score based on sentence length (ideal: 15-25 words)
    let clarityScore = 0;
    if (avgSentenceLength < 10) clarityScore = 3.5;
    else if (avgSentenceLength < 15) clarityScore = 4;
    else if (avgSentenceLength < 25) clarityScore = 5;
    else if (avgSentenceLength < 35) clarityScore = 4;
    else if (avgSentenceLength < 45) clarityScore = 3;
    else clarityScore = 2;
    
    // Bonus for having multiple paragraphs (better structure)
    if (paragraphs.length > 1) clarityScore = Math.min(5, clarityScore + 0.5);
    if (paragraphs.length > 3) clarityScore = Math.min(5, clarityScore + 0.5);
    
    return clarityScore;
  };
  
  const calculatePersuasiveness = (text: string, type: AppealType): number => {
    const lowerText = text.toLowerCase();
    
    // Check for persuasive language patterns
    const persuasiveTerms = [
      'because', 'therefore', 'consequently', 'evidence', 'proof', 'demonstrates',
      'clearly', 'shows', 'indicates', 'proves', 'according to', 'law', 'regulation',
      'incorrect', 'error', 'mistake', 'request', 'appeal'
    ];
    
    let persuasiveCount = 0;
    persuasiveTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) persuasiveCount += matches.length;
    });
    
    // Calculate base score
    let persuasiveScore = Math.min(5, 2 + (persuasiveCount / 5));
    
    // Adjust for appeal type
    if (type === 'legal' && lowerText.includes('code') && lowerText.includes('section')) {
      persuasiveScore = Math.min(5, persuasiveScore + 0.5);
    }
    
    if (type === 'factual' && (lowerText.includes('evidence') || lowerText.includes('proof'))) {
      persuasiveScore = Math.min(5, persuasiveScore + 0.5);
    }
    
    return persuasiveScore;
  };
  
  const calculateProfessionalism = (text: string): number => {
    const lowerText = text.toLowerCase();
    
    // Check for professional tone and format
    const formalGreeting = /dear sir|madam|to whom it may concern|respect/i.test(text);
    const formalClosing = /sincerely|respectfully|thank you for your consideration/i.test(text);
    const noSlang = !/gonna|wanna|gotta|ya|u r|lol|omg/i.test(text);
    
    // Presence of date, reference numbers, etc.
    const hasDate = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},\s+\d{4}\b/i.test(text);
    
    let professionalismScore = 3; // Base score
    
    if (formalGreeting) professionalismScore += 0.5;
    if (formalClosing) professionalismScore += 0.5;
    if (noSlang) professionalismScore += 0.5;
    if (hasDate) professionalismScore += 0.5;
    
    // Penalty for all caps sections (shouting)
    if (/[A-Z]{10,}/.test(text)) {
      professionalismScore = Math.max(1, professionalismScore - 1);
    }
    
    // Penalty for excessive exclamation marks
    const exclamationCount = (text.match(/!/g) || []).length;
    if (exclamationCount > 3) {
      professionalismScore = Math.max(1, professionalismScore - 0.5);
    }
    
    return Math.min(5, professionalismScore);
  };
  
  const calculateRelevance = (text: string, type: AppealType): number => {
    const lowerText = text.toLowerCase();
    
    // Different relevance checks based on appeal type
    let relevanceScore = 3; // Base score
    
    if (type === 'procedural') {
      const proceduralTerms = ['procedure', 'process', 'notice', 'notification', 'issued', 'served', 'delivery', 'mail', 'email', 'dated', 'deadline', 'timeframe', 'period'];
      let termCount = 0;
      
      proceduralTerms.forEach(term => {
        if (lowerText.includes(term)) termCount++;
      });
      
      relevanceScore += Math.min(2, termCount / 3);
    }
    
    else if (type === 'factual') {
      const factualTerms = ['fact', 'evidence', 'actually', 'incorrect', 'inaccurate', 'wrong', 'error', 'location', 'time', 'date', 'place', 'vehicle', 'registration', 'photograph', 'witness'];
      let termCount = 0;
      
      factualTerms.forEach(term => {
        if (lowerText.includes(term)) termCount++;
      });
      
      relevanceScore += Math.min(2, termCount / 3);
    }
    
    else if (type === 'legal') {
      const legalTerms = ['law', 'regulation', 'code', 'section', 'statute', 'ordinance', 'legal', 'legislation', 'jurisdiction', 'authority', 'court', 'precedent', 'rights'];
      let termCount = 0;
      
      legalTerms.forEach(term => {
        if (lowerText.includes(term)) termCount++;
      });
      
      relevanceScore += Math.min(2, termCount / 3);
    }
    
    else if (type === 'comprehensive') {
      // Check for a mix of all types
      const allTerms = [
        'procedure', 'process', 'notice', 'evidence', 'fact', 'law', 'regulation', 'code',
        'incorrect', 'inaccurate', 'section', 'statute', 'rights', 'deadline', 'location'
      ];
      
      const categoryCount = {
        procedural: 0,
        factual: 0,
        legal: 0
      };
      
      if (lowerText.includes('procedure') || lowerText.includes('process') || lowerText.includes('notice')) categoryCount.procedural++;
      if (lowerText.includes('fact') || lowerText.includes('evidence') || lowerText.includes('incorrect')) categoryCount.factual++;
      if (lowerText.includes('law') || lowerText.includes('regulation') || lowerText.includes('code')) categoryCount.legal++;
      
      // More comprehensive is better
      const categoriesUsed = Object.values(categoryCount).filter(count => count > 0).length;
      relevanceScore += Math.min(2, categoriesUsed);
    }
    
    return Math.min(5, relevanceScore);
  };
  
  const generateSuggestions = (
    text: string, 
    type: AppealType, 
    scores: { clarity: number; persuasiveness: number; professionalism: number; relevance: number }
  ): string[] => {
    const suggestions: string[] = [];
    
    // General suggestions based on scores
    if (scores.clarity < 3.5) {
      suggestions.push(t('suggestFormatting'));
    }
    
    if (scores.persuasiveness < 3.5) {
      suggestions.push(t('suggestPersuasive'));
    }
    
    if (scores.professionalism < 3.5) {
      suggestions.push(t('suggestFormal'));
      
      if (!text.includes('Sincerely') && !text.includes('Respectfully')) {
        suggestions.push(t('suggestClosing'));
      }
    }
    
    // Specific suggestions based on appeal type
    if (type === 'procedural' && scores.relevance < 4) {
      suggestions.push(t('suggestProcedural'));
    } else if (type === 'factual' && scores.relevance < 4) {
      suggestions.push(t('suggestFactual'));
      suggestions.push(t('suggestEvidence'));
    } else if (type === 'legal' && scores.relevance < 4) {
      suggestions.push(t('suggestLegal'));
    } else if (type === 'comprehensive' && scores.relevance < 4) {
      suggestions.push(t('suggestComprehensive'));
    }
    
    // Word count based suggestions
    if (text.length < 200) {
      suggestions.push(t('suggestMoreDetail'));
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  };
  
  const generateStrengths = (
    text: string, 
    type: AppealType, 
    scores: { clarity: number; persuasiveness: number; professionalism: number; relevance: number }
  ): string[] => {
    const strengths: string[] = [];
    
    // Add strengths based on high scores
    if (scores.clarity >= 4) {
      strengths.push(t('strengthClarity'));
    }
    
    if (scores.persuasiveness >= 4) {
      strengths.push(t('strengthPersuasive'));
    }
    
    if (scores.professionalism >= 4) {
      strengths.push(t('strengthProfessional'));
    }
    
    // Type-specific strengths
    if (type === 'procedural' && scores.relevance >= 4) {
      strengths.push(t('strengthProcedural'));
    } else if (type === 'factual' && scores.relevance >= 4) {
      strengths.push(t('strengthFactual'));
    } else if (type === 'legal' && scores.relevance >= 4) {
      strengths.push(t('strengthLegal'));
    } else if (type === 'comprehensive' && scores.relevance >= 4) {
      strengths.push(t('strengthComprehensive'));
    }
    
    return strengths.slice(0, 3); // Limit to 3 strengths
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 4.5) return t('scoreExcellent');
    if (score >= 4.0) return t('scoreVeryGood');
    if (score >= 3.5) return t('scoreGood');
    if (score >= 3.0) return t('scoreFair');
    if (score >= 2.0) return t('scoreNeedsWork');
    return t('scorePoor');
  };
  
  const getScoreColor = (score: number): string => {
    if (score >= 4.5) return 'text-green-600 dark:text-green-400';
    if (score >= 4.0) return 'text-green-500 dark:text-green-400';
    if (score >= 3.5) return 'text-blue-500 dark:text-blue-400';
    if (score >= 3.0) return 'text-yellow-500 dark:text-yellow-400';
    if (score >= 2.0) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {t('appealQuality')}
        </h3>
        
        {!metrics && !analyzing && (
          <button
            onClick={analyzeAppeal}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('analyze')}
          </button>
        )}
        
        {analyzing && (
          <div className="flex items-center">
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('analyzing')}
          </div>
        )}
        
        {metrics && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            {expanded ? t('collapse') : t('expand')}
          </button>
        )}
      </div>
      
      {metrics && (
        <div className={`mt-4 transition-all ${expanded ? 'block' : 'hidden'}`}>
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('overallScore')}
            </h4>
            <div className="flex items-center">
              <div className={`text-2xl font-bold ${getScoreColor(metrics.overall)}`}>
                {metrics.overall.toFixed(1)}/5.0
              </div>
              <div className={`ml-2 ${getScoreColor(metrics.overall)}`}>
                ({getScoreLabel(metrics.overall)})
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('clarity')}
              </h4>
              <div className="flex items-center">
                <div className={`text-xl font-bold ${getScoreColor(metrics.clarity)}`}>
                  {metrics.clarity.toFixed(1)}
                </div>
                <div className="ml-2 text-gray-500 dark:text-gray-400">
                  /5.0
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('persuasiveness')}
              </h4>
              <div className="flex items-center">
                <div className={`text-xl font-bold ${getScoreColor(metrics.persuasiveness)}`}>
                  {metrics.persuasiveness.toFixed(1)}
                </div>
                <div className="ml-2 text-gray-500 dark:text-gray-400">
                  /5.0
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('professionalism')}
              </h4>
              <div className="flex items-center">
                <div className={`text-xl font-bold ${getScoreColor(metrics.professionalism)}`}>
                  {metrics.professionalism.toFixed(1)}
                </div>
                <div className="ml-2 text-gray-500 dark:text-gray-400">
                  /5.0
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('relevance')}
              </h4>
              <div className="flex items-center">
                <div className={`text-xl font-bold ${getScoreColor(metrics.relevance)}`}>
                  {metrics.relevance.toFixed(1)}
                </div>
                <div className="ml-2 text-gray-500 dark:text-gray-400">
                  /5.0
                </div>
              </div>
            </div>
          </div>
          
          {metrics.suggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('suggestions')}
              </h4>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                {metrics.suggestions.map((suggestion, index) => (
                  <li key={index} className="mb-1">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          {metrics.strengths.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('strengths')}
              </h4>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                {metrics.strengths.map((strength, index) => (
                  <li key={index} className="mb-1">{strength}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 