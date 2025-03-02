'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

type AppealType = 'procedural' | 'factual' | 'legal' | 'comprehensive';

interface QualityMetrics {
  clarity: number;
  persuasiveness: number;
  professionalism: number;
  relevance: number;
  confidence: number;
  overall: number;
  suggestions: string[];
  strengths: string[];
  issueHighlights?: IssueHighlight[];
}

interface IssueHighlight {
  type: 'warning' | 'error' | 'suggestion';
  text: string;
  reason: string;
  replacement?: string;
}

interface AppealQualityAnalyzerProps {
  appealText: string;
  appealType: AppealType;
  autoAnalyze?: boolean;
  onApplySuggestion?: (originalText: string, replacementText: string) => void;
}

export default function AppealQualityAnalyzer({ 
  appealText, 
  appealType, 
  autoAnalyze = false,
  onApplySuggestion
}: AppealQualityAnalyzerProps) {
  const { t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [showTextAnalysis, setShowTextAnalysis] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoAnalyze && appealText) {
      if (appealText.length < 50 || appealText === lastAnalyzedText) {
        return;
      }
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        analyzeAppeal();
      }, 2000);
    }
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [appealText, autoAnalyze]);

  const analyzeAppeal = async () => {
    if (!appealText.trim() || analyzing) return;

    setAnalyzing(true);
    setProgressPercentage(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgressPercentage(prev => {
          const newValue = prev + Math.random() * 15;
          return newValue >= 90 ? 90 : newValue;
        });
      }, 200);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const clarity = calculateClarity(appealText);
      const persuasiveness = calculatePersuasiveness(appealText, appealType);
      const professionalism = calculateProfessionalism(appealText);
      const relevance = calculateRelevance(appealText, appealType);
      const confidence = calculateConfidence(appealText);
      
      const overall = Math.round(
        (clarity * 0.2 + persuasiveness * 0.25 + professionalism * 0.15 + relevance * 0.2 + confidence * 0.2) * 10
      ) / 10;
      
      const suggestions = generateSuggestions(
        appealText, 
        appealType, 
        { clarity, persuasiveness, professionalism, relevance, confidence, overall: 0, suggestions: [], strengths: [] }
      );
      const strengths = generateStrengths(
        appealText, 
        appealType, 
        { clarity, persuasiveness, professionalism, relevance, confidence, overall: 0, suggestions: [], strengths: [] }
      );
      
      const issueHighlights = identifyTextIssues(appealText, appealType);
      
      clearInterval(progressInterval);
      setProgressPercentage(100);
      
      setMetrics({ 
        clarity, 
        persuasiveness, 
        professionalism, 
        relevance,
        confidence,
        overall,
        suggestions,
        strengths,
        issueHighlights
      });
      
      setTimeout(() => {
        setAnalyzing(false);
        setExpanded(true);
        setLastAnalyzedText(appealText);
      }, 500);
    } catch (error) {
      console.error('Error analyzing appeal:', error);
      setAnalyzing(false);
      setProgressPercentage(0);
    }
  };
  
  const calculateConfidence = (text: string): number => {
    const lowerText = text.toLowerCase();
    
    const confidenceTerms = [
      'certainly', 'definitely', 'clearly', 'undoubtedly', 'without a doubt',
      'confident', 'firmly', 'strongly', 'assert', 'maintain', 'emphasize'
    ];
    
    const uncertaintyTerms = [
      'maybe', 'perhaps', 'possibly', 'might', 'could be', 'sort of',
      'kind of', 'i think', 'i believe', 'in my opinion', 'not sure'
    ];
    
    let confidenceCount = 0;
    let uncertaintyCount = 0;
    
    confidenceTerms.forEach(term => {
      if (lowerText.includes(term)) confidenceCount++;
    });
    
    uncertaintyTerms.forEach(term => {
      if (lowerText.includes(term)) uncertaintyCount++;
    });
    
    const passiveVoiceIndicators = [
      'was done', 'were made', 'have been', 'has been', 'was given',
      'is being', 'was being', 'been', 'be made', 'be given'
    ];
    
    let passiveCount = 0;
    passiveVoiceIndicators.forEach(term => {
      if (lowerText.includes(term)) passiveCount++;
    });
    
    let confidenceScore = 3;
    confidenceScore += confidenceCount * 0.3;
    confidenceScore -= uncertaintyCount * 0.4;
    confidenceScore -= passiveCount * 0.3;
    
    return Math.max(1, Math.min(5, confidenceScore));
  };
  
  const calculateClarity = (text: string): number => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    
    const avgSentenceLength = text.length / sentences.length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    let clarityScore = 0;
    if (avgSentenceLength < 10) clarityScore = 3.5;
    else if (avgSentenceLength < 15) clarityScore = 4;
    else if (avgSentenceLength < 25) clarityScore = 5;
    else if (avgSentenceLength < 35) clarityScore = 4;
    else if (avgSentenceLength < 45) clarityScore = 3;
    else clarityScore = 2;
    
    if (paragraphs.length > 1) clarityScore = Math.min(5, clarityScore + 0.5);
    if (paragraphs.length > 3) clarityScore = Math.min(5, clarityScore + 0.5);
    
    return clarityScore;
  };
  
  const calculatePersuasiveness = (text: string, type: AppealType): number => {
    const lowerText = text.toLowerCase();
    
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
    
    let persuasiveScore = Math.min(5, 2 + (persuasiveCount / 5));
    
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
    
    const formalGreeting = /dear sir|madam|to whom it may concern|respect/i.test(text);
    const formalClosing = /sincerely|respectfully|thank you for your consideration/i.test(text);
    const noSlang = !/gonna|wanna|gotta|ya|u r|lol|omg/i.test(text);
    
    const hasDate = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},\s+\d{4}\b/i.test(text);
    
    let professionalismScore = 3;
    
    if (formalGreeting) professionalismScore += 0.5;
    if (formalClosing) professionalismScore += 0.5;
    if (noSlang) professionalismScore += 0.5;
    if (hasDate) professionalismScore += 0.5;
    
    if (/[A-Z]{10,}/.test(text)) {
      professionalismScore = Math.max(1, professionalismScore - 1);
    }
    
    const exclamationCount = (text.match(/!/g) || []).length;
    if (exclamationCount > 3) {
      professionalismScore = Math.max(1, professionalismScore - 0.5);
    }
    
    return Math.min(5, professionalismScore);
  };
  
  const calculateRelevance = (text: string, type: AppealType): number => {
    const lowerText = text.toLowerCase();
    
    let relevanceScore = 3;
    
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
      
      const categoriesUsed = Object.values(categoryCount).filter(count => count > 0).length;
      relevanceScore += Math.min(2, categoriesUsed);
    }
    
    return Math.min(5, relevanceScore);
  };
  
  const identifyTextIssues = (text: string, type: AppealType): IssueHighlight[] => {
    const issues: IssueHighlight[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach(sentence => {
      if (sentence.length > 200) {
        issues.push({
          type: 'warning',
          text: sentence.trim(),
          reason: t('longSentenceWarning'),
          replacement: 'Consider breaking this into multiple shorter sentences for clarity.'
        });
      }
    });
    
    const passivePatterns = [
      'was done', 'were made', 'have been', 'has been', 'was given',
      'is being', 'was being', 'been', 'be made', 'be given'
    ];
    
    passivePatterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const startOfSentence = text.lastIndexOf('.', match.index) + 1;
        const endOfSentence = text.indexOf('.', match.index + pattern.length);
        const sentenceText = text.substring(
          startOfSentence >= 0 ? startOfSentence : 0,
          endOfSentence >= 0 ? endOfSentence + 1 : text.length
        ).trim();
        
        issues.push({
          type: 'suggestion',
          text: sentenceText,
          reason: t('passiveVoiceSuggestion'),
          replacement: 'Consider using active voice for more impact and clarity.'
        });
      }
    });
    
    const weakPhrases = [
      'kind of', 'sort of', 'pretty much', 'basically', 'for the most part',
      'more or less', 'probably', 'definitely', 'maybe', 'perhaps'
    ];
    
    weakPhrases.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const start = Math.max(0, match.index - 30);
        const end = Math.min(text.length, match.index + phrase.length + 30);
        const context = text.substring(start, end);
        
        issues.push({
          type: 'suggestion',
          text: context,
          reason: t('weakPhraseSuggestion'),
          replacement: `Replace "${phrase}" with more definitive language.`
        });
      }
    });
    
    if (type === 'legal' && !text.toLowerCase().includes('section') && !text.toLowerCase().includes('code')) {
      issues.push({
        type: 'error',
        text: '',
        reason: t('missingLegalReferences'),
        replacement: 'Include specific legal references (sections, codes) to strengthen your legal argument.'
      });
    }
    
    if (type === 'factual' && !text.toLowerCase().includes('evidence') && !text.toLowerCase().includes('proof')) {
      issues.push({
        type: 'error',
        text: '',
        reason: t('missingEvidenceReference'),
        replacement: 'Mention specific evidence or proof to support your factual claims.'
      });
    }
    
    return issues;
  };
  
  const generateSuggestions = (
    text: string, 
    type: AppealType, 
    scores: { clarity: number; persuasiveness: number; professionalism: number; relevance: number; confidence: number; overall: number; suggestions: string[]; strengths: string[] }
  ): string[] => {
    const suggestions: string[] = [];
    
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
    
    if (scores.confidence < 3.5) {
      suggestions.push(t('suggestConfidence') || 'Use more assertive language and active voice to sound more confident.');
    }
    
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
    
    if (text.length < 200) {
      suggestions.push(t('suggestMoreDetail'));
    }
    
    return suggestions.slice(0, 3);
  };
  
  const generateStrengths = (
    text: string, 
    type: AppealType, 
    scores: { clarity: number; persuasiveness: number; professionalism: number; relevance: number; confidence: number; overall: number; suggestions: string[]; strengths: string[] }
  ): string[] => {
    const strengths: string[] = [];
    
    if (scores.clarity >= 4) {
      strengths.push(t('strengthClarity'));
    }
    
    if (scores.persuasiveness >= 4) {
      strengths.push(t('strengthPersuasive'));
    }
    
    if (scores.professionalism >= 4) {
      strengths.push(t('strengthProfessional'));
    }
    
    if (scores.confidence >= 4) {
      strengths.push(t('strengthConfidence') || 'Your appeal sounds confident and authoritative.');
    }
    
    if (type === 'procedural' && scores.relevance >= 4) {
      strengths.push(t('strengthProcedural'));
    } else if (type === 'factual' && scores.relevance >= 4) {
      strengths.push(t('strengthFactual'));
    } else if (type === 'legal' && scores.relevance >= 4) {
      strengths.push(t('strengthLegal'));
    } else if (type === 'comprehensive' && scores.relevance >= 4) {
      strengths.push(t('strengthComprehensive'));
    }
    
    return strengths.slice(0, 3);
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
  
  const handleApplySuggestion = (originalText: string, replacementText: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(originalText, replacementText);
    }
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
          <div className="flex flex-col items-end">
            <div className="flex items-center mb-1">
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
            <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {metrics && (
          <div className="flex space-x-3">
            {metrics.issueHighlights && metrics.issueHighlights.length > 0 && (
              <button
                onClick={() => setShowTextAnalysis(!showTextAnalysis)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {showTextAnalysis ? t('hideTextAnalysis') || "Hide Issues" : t('showTextAnalysis') || "Show Issues"}
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              {expanded ? t('collapse') : t('expand')}
            </button>
          </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
            
            <div>
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('confidence') || "Confidence"}
              </h4>
              <div className="flex items-center">
                <div className={`text-xl font-bold ${getScoreColor(metrics.confidence)}`}>
                  {metrics.confidence.toFixed(1)}
                </div>
                <div className="ml-2 text-gray-500 dark:text-gray-400">
                  /5.0
                </div>
              </div>
            </div>
          </div>
          
          {showTextAnalysis && metrics.issueHighlights && metrics.issueHighlights.length > 0 && (
            <div className="mb-6 border rounded-lg p-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {t('textIssues') || "Text Issues"}
              </h4>
              <div className="space-y-3">
                {metrics.issueHighlights.map((issue, index) => (
                  <div key={index} className="border-l-4 pl-3 py-1 mb-2 dark:border-gray-700 bg-white dark:bg-gray-750 rounded shadow-sm"
                    style={{ borderLeftColor: issue.type === 'error' ? '#ef4444' : issue.type === 'warning' ? '#f59e0b' : '#3b82f6' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium mb-1">
                          {issue.text ? (
                            <span className="bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100 px-1 py-0.5 rounded">
                              {issue.text.length > 100 ? issue.text.substring(0, 100) + '...' : issue.text}
                            </span>
                          ) : (
                            <span className="italic text-gray-500 dark:text-gray-400">{t('generalIssue') || "General Issue"}</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{issue.reason}</div>
                        {issue.replacement && (
                          <div className="mt-1 text-sm text-blue-600 dark:text-blue-400 italic">{issue.replacement}</div>
                        )}
                      </div>
                      {issue.text && issue.replacement && onApplySuggestion && (
                        <button
                          onClick={() => handleApplySuggestion(issue.text || '', issue.replacement || '')}
                          className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 px-2 py-1 rounded"
                        >
                          {t('applySuggestion') || "Apply"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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