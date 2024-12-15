import { jsPDF } from 'jspdf';
import { PDFLayout } from '../types';

export const generatePDF = (content: string, layout: PDFLayout) => {
    const doc = new jsPDF();
  
    const margin = 10; // 10mm margin
    const pageHeight = 297; // A4 page height in mm
    const lineHeight = 10; // 10mm spacing between lines

    // Map content to layout positions
    const contentLines = content.split('\n');
    let yPosition = margin; // Start at top margin

    contentLines.forEach((line, index) => {
        if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage(); // Add new page if text exceeds current page
        yPosition = margin; // Reset to top margin
        }

        // Render text
        doc.setFont('helvetica');
        doc.setFontSize(12);
        doc.text(line, margin, yPosition);
        yPosition += lineHeight; // Increment y for next line
      });

    return doc;
};