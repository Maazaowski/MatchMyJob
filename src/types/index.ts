export interface ResumeData {
  content: string;
  file: File | null;
}

export interface JobDescription {
  content: string;
  company: string;
  position: string;
}

export interface MatchResult {
  tailoredResume: string;
  coverLetter: string;
  atsScore: number;
  feedback: string[];
}

export type Region = 'US' | 'EU' | 'UAE' | 'Africa' | 'Other';
export type AIProvider = 'openai' | 'anthropic' | 'gemini';

export interface ProcessingStatus {
  isProcessing: boolean;
  error: string | null;
}