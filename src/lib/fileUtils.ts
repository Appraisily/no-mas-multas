import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import sharp from 'sharp';

/**
 * Utility functions for file operations
 */

/**
 * Convert a file to base64 string
 * @param file File to convert
 * @returns Promise resolving to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Extract text content from a PDF file
 * @param file PDF file to extract text from
 * @returns Promise resolving to extracted text
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);
    const pdfContent = await pdfParse(pdfData);
    return pdfContent.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

/**
 * Process an image file (resize and optimize for AI processing)
 * @param file Image file to process
 * @returns Promise resolving to base64 string of processed image
 */
export const processImage = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Resize and optimize the image for better AI processing
    const processedImageBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    // Convert to base64
    return Buffer.from(processedImageBuffer).toString('base64');
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

/**
 * Get MIME type from file
 * @param file File to get MIME type from
 * @returns MIME type string
 */
export const getMimeType = (file: File): string => {
  return file.type || 'application/octet-stream';
};

/**
 * Check if a file is an image
 * @param file File to check
 * @returns boolean indicating if the file is an image
 */
export const isImage = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Check if a file is a PDF
 * @param file File to check
 * @returns boolean indicating if the file is a PDF
 */
export const isPDF = (file: File): boolean => {
  return file.type === 'application/pdf';
};

/**
 * Validate if a file is an acceptable type (PDF, JPG, PNG)
 * @param file File to validate
 * @returns boolean indicating if the file is valid
 */
export const isValidFileType = (file: File): boolean => {
  const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  return acceptedTypes.includes(file.type);
};

/**
 * Validate if a file size is under the maximum allowed size
 * @param file File to validate
 * @param maxSizeInMB Maximum size in MB
 * @returns boolean indicating if the file size is valid
 */
export const isValidFileSize = (file: File, maxSizeInMB: number = 10): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Validate file type and size
 * @param file File to validate
 * @returns Object with validation result and error message if any
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!isValidFileType(file)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload a PDF, JPG, or PNG file.' 
    };
  }
  
  // Check file size (max 10MB)
  if (!isValidFileSize(file)) {
    return { 
      valid: false, 
      error: 'File is too large. Maximum size is 10MB.' 
    };
  }
  
  return { valid: true };
};

/**
 * Convert file size in bytes to human-readable format
 * @param bytes Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Create a URL for a file preview
 * @param file File to create preview for
 * @returns URL for the file preview
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a file preview URL to free up memory
 * @param url URL to revoke
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
}; 