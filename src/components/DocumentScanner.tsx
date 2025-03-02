'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useToast } from '@/components/ToastNotification';

export default function DocumentScanner() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Check if camera is available
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
      } catch (error) {
        console.error('Error checking for camera:', error);
        setHasCamera(false);
      }
    };
    
    checkCamera();
  }, []);
  
  // Clean up video stream when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        
        tracks.forEach(track => {
          track.stop();
        });
        
        videoRef.current.srcObject = null;
        setStreamActive(false);
      }
    };
  }, []);
  
  const startCamera = async () => {
    try {
      setIsCapturing(true);
      
      const constraints = {
        video: {
          facingMode: 'environment', // Use the rear camera if available
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      showToast(t('cameraAccessError') || 'Could not access the camera. Please check permissions.', 'error');
      setIsCapturing(false);
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
    
    setIsCapturing(false);
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      
      if (context) {
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
          // Convert the canvas to a data URL (base64 encoded image)
          const imageData = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImage(imageData);
          stopCamera();
          
          showToast(t('imageCaptured') || 'Image captured successfully!', 'success');
        } catch (error) {
          console.error('Error capturing image:', error);
          showToast(t('captureError') || 'Error capturing image. Please try again.', 'error');
        }
      }
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        showToast(t('fileTypeError') || 'Please upload an image file.', 'error');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast(t('fileSizeError') || 'File size exceeds 10MB. Please upload a smaller file.', 'error');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        showToast(t('imageUploaded') || 'Image uploaded successfully!', 'success');
      };
      
      reader.onerror = () => {
        showToast(t('fileReadError') || 'Error reading file. Please try again.', 'error');
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const retakeImage = () => {
    setCapturedImage(null);
    setIsProcessing(false);
    startCamera();
  };
  
  const resetScanner = () => {
    setCapturedImage(null);
    setIsProcessing(false);
    setIsCapturing(false);
  };
  
  const processImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate processing for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast(t('processingSuccess') || 'Document processed successfully!', 'success');
      
      // Here we would normally send the image to the backend for processing
      // and navigate to the next step with the extracted data
      
      // Reset for demo purposes
      setTimeout(() => {
        setIsProcessing(false);
        resetScanner();
      }, 1500);
    } catch (error) {
      console.error('Error processing image:', error);
      showToast(t('processingError') || 'Error processing document. Please try again.', 'error');
      setIsProcessing(false);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t('documentScanner') || 'Document Scanner'}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('documentScannerDescription') || 'Scan your traffic ticket using your camera or upload an image file.'}
        </p>
      </div>

      <div className="p-6">
        {!isCapturing && !capturedImage ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              {hasCamera && (
                <button
                  onClick={startCamera}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('useCamera') || 'Use Camera'}
                </button>
              )}
              
              <button
                onClick={triggerFileInput}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {t('uploadImage') || 'Upload Image'}
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
            
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {t('documentInstructions') || 'Capture a clear image of your traffic ticket. Make sure all text is visible and the image is not blurry.'}
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                {t('scanningTips') || 'Tips for Better Scanning'}
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                <li>{t('scanningTip1') || 'Ensure good lighting for clear images'}</li>
                <li>{t('scanningTip2') || 'Place the document on a dark, non-reflective surface'}</li>
                <li>{t('scanningTip3') || 'Hold the camera steady and parallel to the document'}</li>
                <li>{t('scanningTip4') || 'Make sure the entire document is within the frame'}</li>
              </ul>
            </div>
          </div>
        ) : capturedImage ? (
          <div className="space-y-6">
            <div className="relative">
              <img 
                src={capturedImage} 
                alt={t('capturedDocument') || 'Captured document'} 
                className="w-full rounded-lg shadow-md"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-white text-center">
                  <p className="font-medium">{t('capturedDocument') || 'Captured Document'}</p>
                  <p className="text-sm">{t('clickToEnlarge') || 'Click to enlarge'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={retakeImage}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                disabled={isProcessing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('retakeImage') || 'Retake Image'}
              </button>
              
              <button
                onClick={processImage}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('processing') || 'Processing...'}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('processDocument') || 'Process Document'}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {streamActive && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-white opacity-50 m-4 rounded"></div>
                  <div className="absolute top-0 left-0 right-0 p-2 flex justify-between bg-gradient-to-b from-black/70 to-transparent">
                    <span className="text-white text-sm font-medium">
                      {t('alignDocument') || 'Align document within frame'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={stopCamera}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t('cancel') || 'Cancel'}
              </button>
              
              <button
                onClick={captureImage}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('capturePhoto') || 'Capture Photo'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 