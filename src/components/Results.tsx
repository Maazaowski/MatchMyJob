import React from 'react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { MatchResult } from '../types';
import ReactMarkdown from 'react-markdown';

interface ResultsProps {
  results: MatchResult;
}

export function Results({ results }: ResultsProps) {
  const { tailoredResume, coverLetter, atsScore, feedback } = results;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Tailored Resume</h2>
        </div>
        <div className="prose max-w-none">
          <ReactMarkdown>{tailoredResume}</ReactMarkdown>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-semibold">Cover Letter</h2>
        </div>
        <div className="prose max-w-none">
          <ReactMarkdown>{coverLetter}</ReactMarkdown>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">ATS Score</h2>
          </div>
          <span className="text-2xl font-bold text-blue-500">{atsScore}%</span>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Feedback</h3>
          <ul className="space-y-2">
            {feedback.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}