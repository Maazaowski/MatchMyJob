import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { ResumeData } from '../types';

// Import local worker
import '../lib/pdf.worker.js';

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
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    }
    throw new Error('Unsupported file type. Please upload a .txt or .pdf file.');
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
    const content = await this.extractText(file);
    return {
      content,
      file
    };
  }
}