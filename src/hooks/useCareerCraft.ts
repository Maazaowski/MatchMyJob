import { useState } from 'react';
import { CareerCraftAI } from '../services/CareerCraftAI';
import { ResumeData, JobDescription, MatchResult, Region } from '../types';

const ai = new CareerCraftAI(
  process.env.VITE_OPENAI_KEY || '',
  process.env.VITE_ANTHROPIC_KEY || '',
  process.env.VITE_GEMINI_KEY || ''
);

export function useCareerCraft() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processMatch = async (
    resume: ResumeData,
    job: JobDescription,
    region: Region
  ): Promise<MatchResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      const keywords = await ai.analyzeKeywords(job.content);
      const gaps = await ai.identifyGaps(resume.content, keywords);
      const tailoredResume = await ai.generateTailoredResume(
        resume.content,
        job.content,
        gaps
      );
      const coverLetter = await ai.generateCoverLetter(
        tailoredResume,
        job.content,
        job.company
      );
      const atsAnalysis = await ai.calculateATSScore(tailoredResume, job.content);

      return {
        tailoredResume,
        coverLetter,
        atsScore: atsAnalysis.score,
        feedback: atsAnalysis.feedback
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processMatch,
    isProcessing,
    error
  };
}