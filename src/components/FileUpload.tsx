import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { FileProcessor } from '../services/FileProcessor';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept: Record<string, string[]>;
  label: string;
}

export function FileUpload({ onFileUpload, accept, label }: FileUploadProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setError(null);
      setIsProcessing(true);

      try {
        await FileProcessor.validateFile(file);
        const extractedText = await FileProcessor.extractText(file);
        onFileUpload(file, extractedText);  // Update parent with extracted text
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error processing file');
      } finally {
        setIsProcessing(false);
      }
    }
  }, [onFileUpload]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        <div className="flex flex-col items-center gap-2">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              <p className="text-sm text-gray-600">Processing file...</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-xs text-gray-500">Supported formats: .txt, .pdf (max 5MB)</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}