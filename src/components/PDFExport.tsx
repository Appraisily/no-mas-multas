'use client';

import { useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface PDFExportProps {
  appealText: string;
  fineInfo: {
    referenceNumber: string;
    date: string;
  };
}

export default function PDFExport({ appealText, fineInfo }: PDFExportProps) {
  const { t } = useLanguage();
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  
  const generatePDF = async () => {
    // We'll use dynamic import to avoid loading the library on initial page load
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Set up PDF metadata
      doc.setProperties({
        title: `${t('appealLetter')} - ${fineInfo.referenceNumber}`,
        subject: `${t('appealLetter')} - ${fineInfo.date}`,
        creator: 'No Más Multas',
        author: 'No Más Multas User',
      });
      
      // Add header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(t('appealLetter'), 20, 20);
      
      // Add reference and date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`${t('fineReference')}: ${fineInfo.referenceNumber}`, 20, 30);
      doc.text(`${t('fineDate')}: ${fineInfo.date}`, 20, 36);
      
      // Add divider
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 40, 190, 40);
      
      // Process appeal text for PDF
      const lines = appealText.split('\n');
      
      // Start Y position for appeal text
      let yPos = 50;
      
      // Add appeal text with proper line breaks
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      lines.forEach(line => {
        // Check if we need to add a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20; // Reset Y position for new page
        }
        
        // Format special markers
        if (line.includes('**')) {
          // Bold text
          const parts = line.split('**');
          let textX = 20;
          
          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
              // Regular text
              doc.setFont('helvetica', 'normal');
              doc.text(parts[i], textX, yPos);
              textX += doc.getTextWidth(parts[i]);
            } else {
              // Bold text
              doc.setFont('helvetica', 'bold');
              doc.text(parts[i], textX, yPos);
              textX += doc.getTextWidth(parts[i]);
              doc.setFont('helvetica', 'normal');
            }
          }
        } else if (line.includes('_')) {
          // Italic text
          const parts = line.split('_');
          let textX = 20;
          
          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
              // Regular text
              doc.setFont('helvetica', 'normal');
              doc.text(parts[i], textX, yPos);
              textX += doc.getTextWidth(parts[i]);
            } else {
              // Italic text
              doc.setFont('helvetica', 'italic');
              doc.text(parts[i], textX, yPos);
              textX += doc.getTextWidth(parts[i]);
              doc.setFont('helvetica', 'normal');
            }
          }
        } else {
          // Regular text
          doc.text(line, 20, yPos);
        }
        
        yPos += 6; // Move to next line
      });
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `${t('generatedBy')} No Más Multas - ${t('page')} ${i} ${t('of')} ${pageCount}`,
          105,
          285,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`appeal_letter_${fineInfo.referenceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  return (
    <button
      onClick={generatePDF}
      className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
      aria-label={t('downloadPdf')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v8m-3-4h6" />
      </svg>
      {t('downloadPdf') || 'Download as PDF'}
    </button>
  );
} 