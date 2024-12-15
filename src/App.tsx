import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { JobForm } from './components/JobForm';
import { Results } from './components/Results';
import { RegionSelector } from './components/RegionSelector';
import { Briefcase, Sparkles } from 'lucide-react';
import { useCareerCraft } from './hooks/useCareerCraft';
import type { ResumeData, JobDescription, Region, MatchResult } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PDFLayout } from './types/index.js';


function App() {
  const [resume, setResume] = useState<ResumeData>({ content: '', file: null });
  const [jobDetails, setJobDetails] = useState<JobDescription>({ content: '', company: '', position: '' });
  const [region, setRegion] = useState<Region>('US');
  const { processMatch, isProcessing, error } = useCareerCraft();
  const [results, setResults] = useState<MatchResult | null>(null);

  const handleResumeUpload = async (file: File, extractedText: string, layout?: PDFLayout) => {
    setResume({ content: extractedText, file, layout });
  };  
  
  const handleJobSubmit = async (company: string, position: string, description: string) => {
    setJobDetails({ content: description, company, position });
    try {
      const matchResults = await processMatch(
        resume,
        { content: description, company, position },
        region
      );
      setResults(matchResults);
    } catch (err) {
      console.error('Error processing match:', err);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">MatchMyJob</h1>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Powered by CareerCraft AI</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
                <FileUpload
                  onFileUpload={handleResumeUpload}
                  accept={{ 'text/plain': ['.txt'], 'application/pdf': ['.pdf'] }}
                  label="Drop your resume here or click to browse"
                />
                {resume.file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Uploaded: {resume.file.name}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <RegionSelector
                  selectedRegion={region}
                  onRegionChange={setRegion}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <JobForm onSubmit={handleJobSubmit} />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div>
              {isProcessing ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                    <span className="text-gray-600">CareerCraft AI is analyzing your profile...</span>
                  </div>
                </div>
              ) : results && (
                <Results 
                  results={results} 
                  originalLayout={resume.layout}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;