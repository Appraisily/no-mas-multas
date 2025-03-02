'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface FineInfo {
  id: string;
  amount: string | number;
  currency: string;
  reason: string;
  date: string;
  location: string;
  officerId?: string;
  badgeNumber?: string;
  vehicleInfo?: {
    plate: string;
    make: string;
    model: string;
    year: string;
    color: string;
  };
}

interface PDFExportProps {
  appealText: string;
  appealTitle?: string;
  appealType?: string;
  fineInfo?: FineInfo;
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
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportToPDF = () => {
    setIsGenerating(true);
    
    try {
      // Create a new window for the PDF content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert(t('errorOpeningPrintWindow'));
        setIsGenerating(false);
        return;
      }
      
      // Format the date
      const today = new Date();
      const formattedDate = today.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Create the HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="${language === 'es' ? 'es' : 'en'}">
        <head>
          <meta charset="UTF-8">
          <title>${appealTitle || t('appealLetter')}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.5;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .date {
              text-align: right;
              margin-bottom: 20px;
            }
            .recipient {
              margin-bottom: 30px;
            }
            .subject {
              font-weight: bold;
              margin-bottom: 20px;
            }
            .body {
              margin-bottom: 30px;
              text-align: justify;
            }
            .signature {
              margin-top: 50px;
            }
            .footer {
              margin-top: 50px;
              font-size: 0.8em;
              text-align: center;
              color: #777;
            }
            .fine-details {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #ddd;
              background-color: #f9f9f9;
            }
            .fine-details p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          ${includeHeader ? `
            <div class="header">
              <h1>${appealTitle || t('appealLetter')}</h1>
            </div>
          ` : ''}
          
          <div class="date">
            ${formattedDate}
          </div>
          
          <div class="recipient">
            <p>${t('trafficDepartment')}</p>
            <p>${fineInfo?.location || t('localAuthority')}</p>
          </div>
          
          ${fineInfo ? `
            <div class="fine-details">
              <h3>${t('fineDetails')}</h3>
              <p><strong>${t('referenceNumber')}:</strong> ${fineInfo.id || '-'}</p>
              <p><strong>${t('date')}:</strong> ${fineInfo.date || '-'}</p>
              <p><strong>${t('amount')}:</strong> ${fineInfo.amount || '-'} ${fineInfo.currency || ''}</p>
              <p><strong>${t('reason')}:</strong> ${fineInfo.reason || '-'}</p>
              <p><strong>${t('location')}:</strong> ${fineInfo.location || '-'}</p>
              ${fineInfo.officerId ? `<p><strong>${t('officerName')}:</strong> ${fineInfo.officerId}</p>` : ''}
              ${fineInfo.badgeNumber ? `<p><strong>${t('badgeNumber')}:</strong> ${fineInfo.badgeNumber}</p>` : ''}
              ${fineInfo.vehicleInfo ? `
                <p><strong>${t('vehicle')}:</strong> ${fineInfo.vehicleInfo.year} ${fineInfo.vehicleInfo.make} ${fineInfo.vehicleInfo.model}, ${fineInfo.vehicleInfo.color}</p>
                <p><strong>${t('licensePlate')}:</strong> ${fineInfo.vehicleInfo.plate}</p>
              ` : ''}
            </div>
          ` : ''}
          
          <div class="subject">
            <p>${t('subject')}: ${appealType ? t(appealType + 'AppealTitle') : t('appealAgainstTrafficFine')}</p>
          </div>
          
          <div class="body">
            ${appealText.replace(/\n/g, '<br>')}
          </div>
          
          <div class="signature">
            <p>${t('sincerely')},</p>
            <p>${t('appellant')}</p>
          </div>
          
          ${includeFooter ? `
            <div class="footer">
              <p>${t('generatedBy')} No Más Multas - ${formattedDate}</p>
            </div>
          ` : ''}
        </body>
        </html>
      `;
      
      // Write the HTML content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Trigger the print dialog
      setTimeout(() => {
        printWindow.print();
        setIsGenerating(false);
      }, 500);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t('errorGeneratingPDF'));
      setIsGenerating(false);
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