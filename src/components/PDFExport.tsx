'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface PDFExportProps {
  appealText: string;
  appealTitle?: string;
  appealType?: string;
  fineInfo?: {
    referenceNumber?: string;
    date?: string;
    amount?: string;
    reason?: string;
    location?: string;
    officerName?: string;
    department?: string;
  };
  includeHeader?: boolean;
  includeFooter?: boolean;
}

const PDFExport: React.FC<PDFExportProps> = ({
  appealText,
  appealTitle = '',
  appealType = '',
  fineInfo,
  includeHeader = true,
  includeFooter = true
}) => {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportToPDF = async () => {
    try {
      setIsGenerating(true);
      
      // In a production environment, you'd use a proper PDF library
      // For this demo, we'll create a printable HTML that looks like a PDF
      
      const today = new Date().toLocaleDateString();
      const title = appealTitle || t('appealLetter') || 'Appeal Letter';
      
      // Create a styled HTML document that will be converted to PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 8.5in;
              margin: 0 auto;
              padding: 0.5in;
              border: 1px solid #eaeaea;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              background: white;
            }
            .header {
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
            }
            .sender {
              margin-bottom: 20px;
            }
            .recipient {
              margin-bottom: 30px;
            }
            .date {
              margin-bottom: 30px;
            }
            .subject {
              font-weight: bold;
              margin-bottom: 20px;
            }
            .body {
              margin-bottom: 30px;
              text-align: justify;
              white-space: pre-wrap;
            }
            .signature {
              margin-top: 50px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 0.8em;
              color: #666;
            }
            .fine-details {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #eaeaea;
              background-color: #f9f9f9;
            }
            .fine-details h2 {
              margin-top: 0;
              font-size: 1.2em;
              color: #333;
            }
            .fine-details p {
              margin: 5px 0;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #1a56db;
            }
            @media print {
              body {
                background: white;
              }
              .container {
                border: none;
                box-shadow: none;
                padding: 0;
              }
              .page-break {
                page-break-before: always;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${includeHeader ? `
            <div class="header">
              <div class="logo">No Más Multas</div>
              <div style="text-align: right;">
                <div>${today}</div>
                ${fineInfo?.referenceNumber ? `<div>Ref: ${fineInfo.referenceNumber}</div>` : ''}
              </div>
            </div>
            ` : ''}

            ${fineInfo && Object.keys(fineInfo).length > 0 ? `
            <div class="fine-details">
              <h2>${t('fineDetails') || 'Fine Details'}</h2>
              ${fineInfo.referenceNumber ? `<p><strong>${t('referenceNumber') || 'Reference Number'}:</strong> ${fineInfo.referenceNumber}</p>` : ''}
              ${fineInfo.date ? `<p><strong>${t('date') || 'Date'}:</strong> ${fineInfo.date}</p>` : ''}
              ${fineInfo.amount ? `<p><strong>${t('amount') || 'Amount'}:</strong> ${fineInfo.amount}</p>` : ''}
              ${fineInfo.reason ? `<p><strong>${t('reason') || 'Reason'}:</strong> ${fineInfo.reason}</p>` : ''}
              ${fineInfo.location ? `<p><strong>${t('location') || 'Location'}:</strong> ${fineInfo.location}</p>` : ''}
              ${fineInfo.officerName ? `<p><strong>${t('officerName') || 'Officer Name'}:</strong> ${fineInfo.officerName}</p>` : ''}
              ${fineInfo.department ? `<p><strong>${t('department') || 'Department'}:</strong> ${fineInfo.department}</p>` : ''}
            </div>
            ` : ''}

            <div class="recipient">
              <div>${t('toWhomItMayConcern') || 'To Whom It May Concern'}:</div>
            </div>

            <div class="subject">
              <strong>${appealTitle || `${t('appealFor') || 'Appeal for'} ${fineInfo?.reason || t('trafficViolation') || 'Traffic Violation'}`}</strong>
              ${appealType ? ` (${appealType})` : ''}
            </div>

            <div class="body">
              ${appealText.replace(/\n/g, '<br>')}
            </div>

            <div class="signature">
              <p>${t('sincerely') || 'Sincerely'},</p>
              <p style="margin-top: 40px;">______________________</p>
            </div>
            
            ${includeFooter ? `
            <div class="footer">
              <p>${t('generatedBy') || 'Generated by'} No Más Multas | ${today}</p>
              <p>${t('confidentialDocument') || 'This document is confidential and intended for the addressee only.'}</p>
            </div>
            ` : ''}
          </div>
        </body>
        </html>
      `;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert(t('popupBlocked') || 'Please allow popups to export PDF');
        setIsGenerating(false);
        return;
      }
      
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for resources to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsGenerating(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      alert(t('pdfGenerationError') || 'Error generating PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExportToPDF}
      disabled={isGenerating}
      className="px-3 py-1 rounded text-sm bg-red-600 hover:bg-red-700 text-white flex items-center"
      title={t('exportPDF') || "Export as PDF"}
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('generating') || "Generating..."}
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {t('exportPDF') || "Export PDF"}
        </>
      )}
    </button>
  );
};

export default PDFExport; 