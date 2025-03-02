'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import FineDetails from '@/components/FineDetails';
import FineDetailsModal from '@/components/FineDetailsModal';
import AppealOptionsForm from '@/components/AppealOptionsForm';
import AppealText from '@/components/AppealText';
import LoadingSpinner from '@/components/LoadingSpinner';
import SkeletonLoader from '@/components/SkeletonLoader';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatsDashboard from '@/components/StatsDashboard';
import FeaturesSection from '@/components/FeaturesSection';
import ProgressStepper from '@/components/ProgressStepper';
import HelpAssistant from '@/components/HelpAssistant';
import Notification, { NotificationType } from '@/components/Notification';
import Confetti from '@/components/Confetti';
import GuidedTour from '@/components/GuidedTour';
import { isFirstVisit, markAsVisited } from '@/lib/cookieHelper';
import { AppealOptions, FineInfo, UploadStatus, FileData, UserPlan, UserProfile } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';

// Mock user profile for demo purposes
const mockUserProfile: UserProfile = {
  plan: UserPlan.FREE,
  appealsGenerated: 3,
  appealsRemaining: 5
};

export default function Home() {
  const { t } = useLanguage();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.INITIAL);
  const [fineInfo, setFineInfo] = useState<FineInfo | null>(null);
  const [appealOptions, setAppealOptions] = useState<AppealOptions>({
    appealType: 'comprehensive',
    includeTemplateText: true,
  });
  const [appealText, setAppealText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  
  // Add notification state
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });
  
  // Add confetti trigger state
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Add guided tour state
  const [showTour, setShowTour] = useState(false);
  
  // Initialize tour for first-time visitors
  useEffect(() => {
    // Check if this is the first visit
    if (isFirstVisit()) {
      // Delay the tour a bit to let the page load
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Handle tour completion
  const handleTourComplete = () => {
    setShowTour(false);
    markAsVisited();
    showNotification('info', t('tourCompleted') || 'Tour completed! You can now start using the app.');
  };
  
  // Handle tour skip
  const handleTourSkip = () => {
    setShowTour(false);
    markAsVisited();
  };
  
  // Calculate current step for the progress stepper
  const [currentStep, setCurrentStep] = useState(0);
  
  // Update the current step based on the state
  useEffect(() => {
    if (appealText) {
      setCurrentStep(3);
    } else if (fineInfo) {
      setCurrentStep(2);
    } else if (fileData) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [fileData, fineInfo, appealText]);
  
  // Function to show notifications
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({
      type,
      message,
      isVisible: true
    });
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };
  
  const handleFileSelected = (data: FileData | null) => {
    setFileData(data);
    // Reset states when a new file is selected
    setFineInfo(null);
    setAppealText('');
    setUploadStatus(UploadStatus.INITIAL);
    setErrorMessage('');
    
    if (data) {
      showNotification('info', 'File uploaded successfully. Click Analyze to process your document.');
    }
  };

  const handleAnalyzeDocument = async () => {
    if (!fileData) return;

    try {
      setUploadStatus(UploadStatus.UPLOADING);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', fileData.file);
      
      // Upload and process the document
      setUploadStatus(UploadStatus.PROCESSING);
      
      // Call the analyze API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze the document');
      }
      
      const data = await response.json();
      setFineInfo(data.fineInfo);
      setUploadStatus(UploadStatus.SUCCESS);
      
      // Update user profile (in a real app, this would be handled by the backend)
      setUserProfile(prev => ({
        ...prev,
        appealsGenerated: (prev.appealsGenerated || 0) + 1,
        appealsRemaining: prev.appealsRemaining ? prev.appealsRemaining - 1 : 0
      }));
      
      showNotification('success', 'Document analyzed successfully! Review the details below.');
    } catch (error) {
      console.error('Error analyzing document:', error);
      setUploadStatus(UploadStatus.ERROR);
      setErrorMessage(t('errorOccurred'));
      showNotification('error', 'Failed to analyze document. Please try again.');
    }
  };

  const handleOptionsChange = (options: AppealOptions) => {
    setAppealOptions(options);
  };

  const handleGenerateAppeal = async () => {
    if (!fineInfo) return;
    
    try {
      setUploadStatus(UploadStatus.GENERATING);
      
      // Call the generate-appeal API endpoint
      const response = await fetch('/api/generate-appeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fineInfo,
          appealOptions,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate appeal text');
      }
      
      const data = await response.json();
      setAppealText(data.appealText);
      setUploadStatus(UploadStatus.SUCCESS);
      showNotification('success', 'Appeal generated successfully! You can now review and customize it.');
      
      // Trigger confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Error generating appeal:', error);
      setUploadStatus(UploadStatus.ERROR);
      setErrorMessage(t('errorOccurred'));
      showNotification('error', 'Failed to generate appeal. Please try again.');
    }
  };
  
  const handleEditFineDetails = () => {
    setIsEditModalOpen(true);
  };
  
  const handleSaveFineDetails = (updatedFineInfo: FineInfo) => {
    setFineInfo(updatedFineInfo);
    setIsEditModalOpen(false);
    showNotification('success', 'Fine details updated successfully.');
    
    // If we already had generated an appeal, we should regenerate it
    if (appealText) {
      handleGenerateAppeal();
    }
  };

  // Determine if the user can proceed to generate an appeal
  const canGenerateAppeal = fineInfo !== null && uploadStatus !== UploadStatus.PROCESSING && uploadStatus !== UploadStatus.GENERATING;

  // Progress steps
  const steps = ['Upload Document', 'Analyze Details', 'Generate Appeal', 'Review'];

  // Add CSS classes to elements for the guided tour
  const fileUploadClasses = "file-upload-area";
  const analyzeButtonClasses = "analyze-button";
  const appealOptionsClasses = "appeal-options";
  const generateButtonClasses = "generate-button";
  const appealTextClasses = "appeal-text";

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Notification component */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={handleCloseNotification}
        autoClose={true}
        duration={5000}
      />
      
      {/* Confetti component */}
      <Confetti trigger={showConfetti} />
      
      {/* Guided Tour */}
      <GuidedTour 
        isActive={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
      
      {/* Help Assistant */}
      <HelpAssistant />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* User Dashboard */}
          <div className="mb-8">
            <StatsDashboard userProfile={userProfile} />
          </div>
          
          {/* Progress Stepper */}
          <div className="mb-8 px-4">
            <ProgressStepper currentStep={currentStep} steps={steps} />
          </div>
          
          <div className="space-y-8">
            {/* Step 1: Upload Document */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t('uploadTitle')}</h2>
              <div className={fileUploadClasses}>
                <FileUpload onFileSelected={handleFileSelected} />
              </div>
              
              {fileData && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleAnalyzeDocument}
                    disabled={uploadStatus === UploadStatus.UPLOADING || uploadStatus === UploadStatus.PROCESSING}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center ${analyzeButtonClasses}`}
                  >
                    {uploadStatus === UploadStatus.UPLOADING || uploadStatus === UploadStatus.PROCESSING ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('loading')}
                      </>
                    ) : t('analyze')}
                  </button>
                </div>
              )}
              
              {errorMessage && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-700 dark:text-red-400">{errorMessage}</p>
                  <p className="text-red-600 dark:text-red-300 text-sm mt-1">{t('tryAgain')}</p>
                </div>
              )}
            </section>
            
            {/* Step 2: Show Fine Details */}
            {uploadStatus === UploadStatus.PROCESSING && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <SkeletonLoader type="fineDetails" />
              </section>
            )}
            
            {fineInfo && (
              <section>
                <FineDetails 
                  fineInfo={fineInfo} 
                  onEdit={handleEditFineDetails}
                />
              </section>
            )}
            
            {/* Edit Fine Details Modal */}
            {fineInfo && (
              <FineDetailsModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                fineInfo={fineInfo}
                onSave={handleSaveFineDetails}
              />
            )}
            
            {/* Step 3: Configure Appeal Options */}
            {fineInfo && (
              <section className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${appealOptionsClasses}`}>
                <AppealOptionsForm 
                  onOptionsChange={handleOptionsChange} 
                  disabled={uploadStatus === UploadStatus.GENERATING}
                />
                
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleGenerateAppeal}
                    disabled={!canGenerateAppeal}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed ${generateButtonClasses}`}
                  >
                    {appealText ? t('regenerate') : t('generate')}
                  </button>
                </div>
              </section>
            )}
            
            {/* Step 4: Display Appeal Text */}
            {uploadStatus === UploadStatus.GENERATING && (
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <SkeletonLoader type="appeal" />
              </section>
            )}
            
            {appealText && (
              <section className={appealTextClasses}>
                <AppealText initialText={appealText} />
              </section>
            )}
            
            {/* Premium Upgrade Banner */}
            {userProfile.plan === UserPlan.FREE && fineInfo && (
              <section className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900 rounded-lg shadow-md p-6 text-white">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">{t('upgrade')}</h3>
                    <p className="mb-4 text-blue-100">{t('premiumFeatures')}:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-100 mb-4">
                      <li>Advanced legal arguments with relevant citations</li>
                      <li>Multiple appeal templates for different situations</li>
                      <li>Professional formatting and document export options</li>
                      <li>Priority customer support</li>
                    </ul>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button 
                      className="px-6 py-3 bg-white text-blue-700 rounded-md hover:bg-blue-50 transition-colors font-medium"
                      onClick={() => showNotification('info', 'Upgrade feature coming soon!')}
                    >
                      {t('upgrade')}
                    </button>
                  </div>
                </div>
              </section>
            )}
            
            {/* Features Section */}
            <FeaturesSection userPlan={userProfile.plan} />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
