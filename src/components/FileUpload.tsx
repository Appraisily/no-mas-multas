'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileData } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  isImage, 
  formatFileSize,
  validateFile,
  isValidFileType,
  isValidFileSize
} from '@/lib/fileUtils';

interface FileUploadProps {
  onFileSelected: (fileData: FileData | null) => void;
}

export default function FileUpload({ onFileSelected }: FileUploadProps) {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Generate preview for image files
  useEffect(() => {
    if (selectedFile?.file && isImage(selectedFile.file)) {
      const objectUrl = URL.createObjectURL(selectedFile.file);
      setPreview(objectUrl);
      
      // Update the file data with preview
      onFileSelected({
        ...selectedFile,
        preview: objectUrl,
        isImage: true
      });
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile, onFileSelected]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Validate file type and size
    if (!isValidFileType(file)) {
      setError(t('invalidFile'));
      return;
    }
    
    if (!isValidFileSize(file)) {
      setError(t('fileTooLarge'));
      return;
    }
    
    // Set the selected file
    const fileData: FileData = {
      file,
      isImage: isImage(file)
    };
    
    setSelectedFile(fileData);
    onFileSelected(fileData);
  }, [onFileSelected, t]);

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onFileSelected(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': []
    },
    maxFiles: 1
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {!selectedFile ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <p className="text-lg font-medium text-gray-700 mb-1">{t('uploadPrompt')}</p>
            <p className="text-sm text-gray-500 mb-4">{t('uploadTip')}</p>
            
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
              {t('uploadButtonText')}
            </button>
            
            <p className="text-xs text-gray-400 mt-4">{t('uploadLimit')}</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex items-start">
            {/* Preview if it's an image */}
            {preview && (
              <div className="mr-4 flex-shrink-0">
                <img 
                  src={preview} 
                  alt="File preview" 
                  className="h-24 w-24 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
            
            {/* File info */}
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 break-all">
                    {selectedFile.file.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatFileSize(selectedFile.file.size)}
                  </p>
                </div>
                
                <button 
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title={t('removeFile')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-3 flex items-center text-sm text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('fileSelected')}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 