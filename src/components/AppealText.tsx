'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import AppealComparison from './AppealComparison';
import PDFExport from './PDFExport';
import AppealQualityAnalyzer from './AppealQualityAnalyzer';
import AppealTemplates from './AppealTemplates';
import LegalArgumentGenerator from './LegalArgumentGenerator';
import RegulationFinder from './RegulationFinder';

interface FineInfo {
  referenceNumber: string;
  date: string;
  amount?: string;
  location?: string;
  reason?: string;
  vehicle?: string;
  fineNumber?: string;
  officerName?: string;
  department?: string;
}

interface AppealTextProps {
  initialText: string;
  appealType?: 'procedural' | 'factual' | 'legal' | 'comprehensive';
  fineInfo?: FineInfo;
  onTextChange?: (text: string) => void;
  onAnalyze?: () => void;
}

const AppealText: React.FC<AppealTextProps> = ({ 
  initialText, 
  appealType = 'comprehensive',
  fineInfo,
  onTextChange,
  onAnalyze 
}) => {
  const { t } = useLanguage();
  const [editableText, setEditableText] = useState(initialText);
  const [originalText, setOriginalText] = useState(initialText);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showDetailsPane, setShowDetailsPane] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLegalArguments, setShowLegalArguments] = useState(false);
  const [showRegulations, setShowRegulations] = useState(false);
  const [violationType, setViolationType] = useState('general');
  const [jurisdiction, setJurisdiction] = useState<string>('');
  
  useEffect(() => {
    setEditableText(initialText);
    setOriginalText(initialText);
  }, [initialText]);
  
  useEffect(() => {
    setHasChanges(editableText !== originalText);
    if (onTextChange) {
      onTextChange(editableText);
    }
  }, [editableText, originalText, onTextChange]);
  
  useEffect(() => {
    setCharCount(editableText.length);
    setWordCount(editableText.trim() === '' ? 0 : editableText.trim().split(/\s+/).length);
  }, [editableText]);
  
  useEffect(() => {
    if (fineInfo?.reason) {
      const reasonMap: {[key: string]: string} = {
        'parking': 'parking',
        'speeding': 'speed',
        'red light': 'redlight',
        'stop sign': 'general',
      };
      setViolationType(reasonMap[fineInfo.reason.toLowerCase()] || 'general');
    } else if (appealType) {
      const typeMap: {[key: string]: string} = {
        'factual': 'general',
        'legal': 'general',
        'procedural': 'general',
        'comprehensive': 'general'
      };
      setViolationType(typeMap[appealType] || 'general');
    }
  }, [appealType, fineInfo]);
  
  useEffect(() => {
    if (fineInfo?.location) {
      const location = fineInfo.location.toLowerCase();
      if (location.includes('california')) {
        setJurisdiction('california');
      } else if (location.includes('new york')) {
        setJurisdiction('new_york');
      } else if (location.includes('texas')) {
        setJurisdiction('texas');
      } else if (location.includes('florida')) {
        setJurisdiction('florida');
      }
    }
  }, [fineInfo]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableText(e.target.value);
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableText);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([editableText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'appeal_letter.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleDownloadDocx = () => {
    const element = document.createElement('a');
    const file = new Blob([editableText], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
    element.href = URL.createObjectURL(file);
    element.download = 'appeal_letter.docx';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${t('appealLetter')}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 2cm;
              }
              @media print {
                body {
                  font-size: 12pt;
                }
              }
            </style>
          </head>
          <body>
            <div>
              ${editableText.replace(/\n/g, '<br>')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };
  
  const formatText = (format: 'bold' | 'italic' | 'underline' | 'uppercase' | 'lowercase') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) return;
    
    const selectedText = editableText.substring(start, end);
    let newText = '';
    
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `_${selectedText}_`;
        break;
      case 'underline':
        newText = `<u>${selectedText}</u>`;
        break;
      case 'uppercase':
        newText = selectedText.toUpperCase();
        break;
      case 'lowercase':
        newText = selectedText.toLowerCase();
        break;
    }
    
    const newValue = editableText.substring(0, start) + newText + editableText.substring(end);
    setEditableText(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newText.length);
    }, 0);
  };
  
  const handleCompare = () => {
    setShowComparison(true);
  };
  
  const handleCloseComparison = () => {
    setShowComparison(false);
  };
  
  const handleRevertChanges = () => {
    setEditableText(originalText);
    setShowComparison(false);
  };
  
  const handleExport = () => {
    // This will be triggered by keyboard shortcuts
  };
  
  const handleApplyTemplate = (templateContent: string) => {
    setEditableText(templateContent);
    if (onTextChange) {
      onTextChange(templateContent);
    }
  };
  
  const handleApplyLegalArgument = (argumentText: string) => {
    const newText = editableText ? `${editableText}\n\n${argumentText}` : argumentText;
    setEditableText(newText);
    if (onTextChange) {
      onTextChange(newText);
    }
  };
  
  const handleApplyRegulation = (regulation: any) => {
    const citationText = `\n\nLEGAL REFERENCE:\n${regulation.code} - ${regulation.title}\n"${regulation.description}"\nSource: ${regulation.source}`;
    
    const newText = editableText ? `${editableText}${citationText}` : citationText;
    setEditableText(newText);
    if (onTextChange) {
      onTextChange(newText);
    }
    
    setShowRegulations(false);
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('appealResult')}</h2>
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <button
                  onClick={handleCompare}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center text-sm"
                >
                  {t('compareVersions') || 'Compare Versions'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                    <path d="M11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setShowDetailsPane(!showDetailsPane)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center text-sm ml-4"
              >
                {showDetailsPane ? t('hideDetails') : t('showDetails')}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 transform transition-transform ${showDetailsPane ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('editableText')}</p>
          
          {hasChanges && (
            <div className="mt-2 flex items-center">
              <span className="text-xs text-yellow-600 dark:text-yellow-400 mr-2">
                {t('unsavedChanges') || 'You have unsaved changes'}
              </span>
              <button
                onClick={handleRevertChanges}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
              >
                {t('revertChanges') || 'Revert to original'}
              </button>
            </div>
          )}
        </div>
        
        {/* Formatting toolbar */}
        <div className="mb-2 flex flex-wrap gap-1 p-1 bg-gray-50 dark:bg-gray-700 rounded-t-md border border-gray-200 dark:border-gray-600">
          <button 
            onClick={() => formatText('bold')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
            title={t('formatBold')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.5 10a2.5 2.5 0 01-2.5 2.5H7V7h4a2.5 2.5 0 012.5 2.5v.5zm-2.5-5H7v15h4a5 5 0 005-5v-5a5 5 0 00-5-5z" />
            </svg>
          </button>
          <button 
            onClick={() => formatText('italic')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
            title={t('formatItalic')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 5h8v2H6zM5 13h8v2H5z" />
              <path d="M11 5h4l-4 10h-4l4-10z" />
            </svg>
          </button>
          <button 
            onClick={() => formatText('underline')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
            title={t('formatUnderline')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 5V2a1 1 0 00-1-1H3a1 1 0 00-1 1v3h5zM18 5V2a1 1 0 00-1-1h-3a1 1 0 00-1 1v3h5zM5 9a5 5 0 0110 0v6a1 1 0 001 1h1a1 1 0 001-1V9A8 8 0 003 9v6a1 1 0 001 1h1a1 1 0 001-1V9z" />
              <path d="M3 16h14v2H3z" />
            </svg>
          </button>
          <div className="h-6 border-l border-gray-300 dark:border-gray-500 mx-1"></div>
          <button 
            onClick={() => formatText('uppercase')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
            title={t('formatUppercase')}
          >
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">AA</span>
          </button>
          <button 
            onClick={() => formatText('lowercase')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
            title={t('formatLowercase')}
          >
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">aa</span>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className={`flex-1 transition-all ${showDetailsPane ? 'md:w-3/4' : 'w-full'}`}>
            <div className="w-full border border-gray-200 dark:border-gray-700 rounded-b-md">
              <textarea
                ref={textareaRef}
                value={editableText}
                onChange={handleTextChange}
                className="w-full min-h-[350px] p-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                spellCheck="true"
              />
            </div>
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
              <span>{charCount} {t('characters')}</span>
              <span>{wordCount} {t('words')}</span>
            </div>
          </div>
          
          {/* Details pane */}
          {showDetailsPane && (
            <div className="w-full md:w-1/4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 animate-slide-in-right">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">{t('tips')}</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                <li>{t('tipClear')}</li>
                <li>{t('tipRespectful')}</li>
                <li>{t('tipFacts')}</li>
                <li>{t('tipSpecific')}</li>
                <li>{t('tipProofread')}</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? t('copied') : t('copy')}
          </button>
          
          <div className="relative group">
            <button
              className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('export')}
            </button>
            
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 invisible group-hover:visible">
              <ul className="py-1">
                <li>
                  <button
                    onClick={handleDownloadTxt}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('downloadTxt')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleDownloadDocx}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('downloadDocx')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {t('print')}
          </button>
          
          {/* Add PDF Export button */}
          {fineInfo && (
            <PDFExport 
              appealText={editableText} 
              fineInfo={{
                referenceNumber: fineInfo.referenceNumber,
                date: fineInfo.date
              }}
            />
          )}
          
          {/* Templates button */}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            title={t('templatesLibrary')}
            aria-label={t('templatesLibrary')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            {t('templatesLibrary')}
          </button>
          
          {/* Legal Arguments button */}
          <button
            onClick={() => setShowLegalArguments(!showLegalArguments)}
            className="flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
            title={t('legalArgumentsTitle')}
            aria-label={t('legalArgumentsTitle')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            {t('legalArgumentsTitle')}
          </button>
          
          {/* Find Regulations button */}
          <button
            onClick={() => setShowRegulations(!showRegulations)}
            className="flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
            title={t('showRegulations')}
            aria-label={t('showRegulations')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('showRegulations')}
          </button>
          
          {/* Keyboard shortcuts help button */}
          <button
            onClick={() => {}} // Will be handled by KeyboardShortcuts component
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ml-auto"
            title={t('keyboardShortcuts')}
            aria-label={t('keyboardShortcuts')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
        </div>
        
        {/* Comparison Modal */}
        {showComparison && (
          <AppealComparison
            originalText={originalText}
            modifiedText={editableText}
            onClose={handleCloseComparison}
          />
        )}

        {/* Appeal Quality Analyzer */}
        <div className={`mt-4 ${showDetailsPane ? 'block' : 'hidden'}`}>
          <AppealQualityAnalyzer 
            appealText={editableText}
            appealType="comprehensive"
            autoAnalyze={true}
          />
        </div>
        
        {/* Appeal Templates */}
        {showTemplates && (
          <div className="mt-4">
            <AppealTemplates 
              onApplyTemplate={handleApplyTemplate}
              currentAppealText={editableText}
              appealType={appealType}
            />
          </div>
        )}

        {/* Legal Argument Generator */}
        {showLegalArguments && (
          <div className="mt-4">
            <LegalArgumentGenerator 
              violationType={violationType}
              jurisdiction={jurisdiction}
              onSelectArgument={handleApplyLegalArgument}
            />
          </div>
        )}

        {/* Find Regulations */}
        {showRegulations && (
          <div className="mt-4">
            <RegulationFinder
              violationType={violationType}
              jurisdiction={jurisdiction}
              onSelectRegulation={handleApplyRegulation}
            />
          </div>
        )}
      </div>
    </div>
  );
} 