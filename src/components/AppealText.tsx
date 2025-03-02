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
  readOnly?: boolean;
  appealId?: string;
}

const AppealText: React.FC<AppealTextProps> = ({ 
  initialText, 
  appealType = 'comprehensive',
  fineInfo,
  onTextChange,
  onAnalyze,
  readOnly = false,
  appealId
}) => {
  const { t } = useLanguage();
  const [text, setText] = useState(initialText);
  const [showLegalArguments, setShowLegalArguments] = useState(false);
  const [showRegulations, setShowRegulations] = useState(false);
  const [violationType, setViolationType] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [originalText, setOriginalText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText);
    setOriginalText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (fineInfo) {
      let vType = '';
      if (fineInfo.reason) {
        const reason = fineInfo.reason.toLowerCase();
        if (reason.includes('parking')) vType = 'parking';
        else if (reason.includes('speed')) vType = 'speeding';
        else if (reason.includes('red light')) vType = 'red_light';
        else if (reason.includes('stop sign')) vType = 'stop_sign';
        else vType = 'other';
      }
      setViolationType(vType);
      
      if (fineInfo.location) {
        const locationParts = fineInfo.location.split(',');
        if (locationParts.length > 1) {
          setJurisdiction(locationParts[locationParts.length - 1].trim());
        }
      }
    }
  }, [fineInfo]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (onTextChange) onTextChange(newText);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'appeal_letter.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadDocx = () => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
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
              ${text.replace(/\n/g, '<br>')}
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
    
    const selectedText = text.substring(start, end);
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
    
    const newValue = text.substring(0, start) + newText + text.substring(end);
    setText(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newText.length);
    }, 0);
  };

  const handleCompare = () => {
    setIsComparing(true);
  };

  const handleCloseComparison = () => {
    setIsComparing(false);
  };

  const handleRevertChanges = () => {
    setText(originalText);
    setIsComparing(false);
  };

  const handleExport = () => {
    // This will be triggered by keyboard shortcuts
  };

  const handleApplyTemplate = (templateContent: string) => {
    setText(templateContent);
    if (onTextChange) {
      onTextChange(templateContent);
    }
  };

  const handleApplyLegalArgument = (argumentText: string) => {
    if (readOnly) return;
    
    const newText = text + '\n\n' + argumentText;
    setText(newText);
    if (onTextChange) onTextChange(newText);
    setShowLegalArguments(false);
  };

  const handleApplyRegulation = (regulation: any) => {
    if (readOnly) return;
    
    const citationText = `\n\nAccording to ${regulation.code} (${regulation.title}): "${regulation.description}"\n`;
    const newText = text + citationText;
    setText(newText);
    if (onTextChange) onTextChange(newText);
    setShowRegulations(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative border rounded-lg dark:border-gray-700 overflow-hidden">
        {!readOnly && (
          <div className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 p-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              title={t('boldText') || "Bold"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0v8h8a4 4 0 100-8H6z" />
              </svg>
            </button>
            
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              title={t('italicText') || "Italic"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            
            <button
              type="button"
              onClick={() => formatText('underline')}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              title={t('underlineText') || "Underline"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-10 4h10" />
              </svg>
            </button>

            <span className="border-l dark:border-gray-700 mx-1"></span>
            
            <button
              type="button"
              onClick={() => formatText('uppercase')}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              title={t('uppercaseText') || "Uppercase"}
            >
              <span className="font-bold px-1">A↑</span>
            </button>
            
            <button
              type="button"
              onClick={() => formatText('lowercase')}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              title={t('lowercaseText') || "Lowercase"}
            >
              <span className="font-bold px-1">a↓</span>
            </button>

            <span className="border-l dark:border-gray-700 mx-1"></span>
            
            <button
              type="button"
              onClick={() => setShowLegalArguments(!showLegalArguments)}
              className={`px-2 py-1 rounded text-sm ${
                showLegalArguments ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={t('addLegalArgument') || "Add Legal Argument"}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('legalArguments') || "Legal Arguments"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowRegulations(!showRegulations)}
              className={`px-2 py-1 rounded text-sm ${
                showRegulations ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={t('findRegulations') || "Find Regulations"}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('regulations') || "Regulations"}
              </span>
            </button>

            <div className="ml-auto">
              <button
                type="button"
                onClick={handleCompare}
                className="px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {t('compareChanges') || "Compare"}
                </span>
              </button>
            </div>
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          className="w-full p-4 min-h-[300px] focus:outline-none dark:bg-gray-800 dark:text-white"
          placeholder={t('startWritingAppeal') || "Start writing your appeal here..."}
          readOnly={readOnly}
        ></textarea>
        
        {!readOnly && (
          <div className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 p-2 flex flex-wrap justify-between">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {t('copy') || "Copy"}
                </span>
              </button>
              
              <div className="group relative">
                <button
                  type="button"
                  className="px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L19 9.707a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t('download') || "Download"}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="block w-full text-left px-4 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {t('textFile') || "Text (.txt)"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadDocx}
                    className="block w-full text-left px-4 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {t('wordFile') || "Word (.docx)"}
                  </button>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  {t('print') || "Print"}
                </span>
              </button>
              
              {/* Add PDF Export button */}
              {fineInfo && (
                <PDFExport
                  appealText={text}
                  appealType={appealType}
                  fineInfo={fineInfo}
                  appealTitle={`${t('appealFor') || 'Appeal for'} ${fineInfo.reason || t('trafficViolation') || 'Traffic Violation'}`}
                />
              )}
            </div>
            
            {onAnalyze && (
              <button
                type="button"
                onClick={onAnalyze}
                className="px-3 py-1 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t('analyzeAppeal') || "Analyze Appeal"}
                </span>
              </button>
            )}
          </div>
        )}
        
        {/* Add PDF Export button for read-only mode */}
        {readOnly && fineInfo && (
          <div className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 p-2 flex justify-end">
            <PDFExport
              appealText={text}
              appealType={appealType}
              fineInfo={fineInfo} 
              appealTitle={`${t('appealFor') || 'Appeal for'} ${fineInfo.reason || t('trafficViolation') || 'Traffic Violation'}`}
            />
          </div>
        )}
      </div>
      
      {/* Regulation Finder */}
      {showRegulations && (
        <div className="border rounded-lg dark:border-gray-700 overflow-hidden mb-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 dark:text-white">
              {t('findApplicableRegulations') || "Find Applicable Regulations"}
            </h3>
            <button
              type="button"
              onClick={() => setShowRegulations(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            <RegulationFinder
              jurisdiction={jurisdiction}
              violationType={violationType}
              onSelectRegulation={handleApplyRegulation}
              initialQuery={fineInfo?.reason || ""}
            />
          </div>
        </div>
      )}
      
      {/* Legal Arguments */}
      {showLegalArguments && (
        <div className="border rounded-lg dark:border-gray-700 overflow-hidden mb-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 dark:text-white">
              {t('suggestedLegalArguments') || "Suggested Legal Arguments"}
            </h3>
            <button
              type="button"
              onClick={() => setShowLegalArguments(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            <LegalArgumentGenerator
              violationType={violationType}
              jurisdiction={jurisdiction}
              onSelectArgument={handleApplyLegalArgument}
            />
          </div>
        </div>
      )}
      
      {/* Comparison View */}
      {isComparing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {t('compareChanges') || "Compare Changes"}
              </h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleRevertChanges}
                  className="px-3 py-1 rounded text-sm bg-red-600 hover:bg-red-700 text-white"
                >
                  {t('revertToOriginal') || "Revert to Original"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseComparison}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-4rem)] grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {t('originalText') || "Original Text"}
                </h4>
                <div className="border rounded p-3 h-full whitespace-pre-wrap overflow-y-auto dark:border-gray-700 dark:bg-gray-750 dark:text-white">
                  {originalText}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {t('currentText') || "Current Text"}
                </h4>
                <div className="border rounded p-3 h-full whitespace-pre-wrap overflow-y-auto dark:border-gray-700 dark:bg-gray-750 dark:text-white">
                  {text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppealText; 