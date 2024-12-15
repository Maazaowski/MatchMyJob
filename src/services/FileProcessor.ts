import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { ResumeData } from '../types';

// Import local worker
import '../lib/pdf.worker.js';
import { PDFLayout } from '../types/index';

// Configure worker
GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();
  
export class FileProcessor {
  static async extractText(file: File): Promise<string> {
    if (file.type === 'text/plain') {
      return await file.text();
    } 
    else if (file.type === 'application/pdf') {
      const { text } = await this.extractPDFInfo(file);
      return text;
    }
    throw new Error('Unsupported file type. Please upload a .txt or .pdf file.');
  }

  static async extractPDFInfo(file: File): Promise<{text: string, layout: PDFLayout}> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    const layout: PDFLayout = {
      fonts: [],
      styles: [],
      positions: []
    };
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      textContent.items.forEach((item: any) => {
        fullText += item.str + ' ';
        layout.fonts.push(item.fontName);
        layout.styles.push(item.transform);
        layout.positions.push({
          x: item.transform[4],
          y: item.transform[5]
        });
      });
    }
    return { text: fullText, layout };
  }
  
  static async validateFile(file: File): Promise<void> {
    const validTypes = ['text/plain', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a .txt or .pdf file.');
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }
  }

  static async processResume(file: File): Promise<ResumeData> {
    await this.validateFile(file);

    if (file.type === 'application/pdf') {
      const { text, layout } = await this.extractPDFInfo(file);
      return {
        content: text,
        file,
        layout
      };
    }

    const content = await this.extractText(file);
    return { content, file };
  }
}