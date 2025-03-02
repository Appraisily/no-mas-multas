'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
import { useTheme } from '@/lib/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Armadillo } from '@/components/Armadillo';

// Mock user profile for demo purposes
const mockUserProfile: UserProfile = {
  plan: UserPlan.FREE,
  appealsGenerated: 3,
  appealsRemaining: 5
};

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const { theme } = useTheme();
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

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const statItems = [
    { value: '85%', label: 'Success Rate' },
    { value: '30+', label: 'Cities Covered' },
    { value: '10k+', label: 'Appeals Generated' },
    { value: '$2.2M', label: 'Saved in Fines' },
  ];

  const handleGetStarted = () => {
    setShowConfetti(true);
    setTimeout(() => {
      router.push('/tools');
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
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
      <Confetti duration={2000} trigger={showConfetti} />
      
      {/* Guided Tour */}
      <GuidedTour 
        isActive={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
      
      {/* Help Assistant */}
      <HelpAssistant />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={heroVariants}
            >
              <motion.div variants={childVariants} className="mb-6">
                <Armadillo className="inline-block h-24 w-24 mb-4" />
              </motion.div>
              
              <motion.h1 
                variants={childVariants}
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
              >
                {t('title') || 'No Más Multas'}
              </motion.h1>
              
              <motion.p 
                variants={childVariants}
                className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8"
              >
                {t('subtitle') || 'Appeal traffic and parking tickets with AI'}
              </motion.p>
              
              <motion.div variants={childVariants} className="space-x-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                  onClick={handleGetStarted}
                >
                  {t('getStarted') || 'Get Started'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full border-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  onClick={() => router.push('/demo')}
                >
                  {t('watchDemo') || 'Watch Demo'}
                </Button>
              </motion.div>
              
              <motion.div 
                variants={childVariants}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
              >
                {statItems.map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              {t('howItWorks') || 'How It Works'}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Upload Your Ticket',
                  description: 'Upload your traffic ticket or enter the details manually.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  )
                },
                {
                  title: 'AI Analysis',
                  description: 'Our advanced AI analyzes your ticket for potential weaknesses and legal arguments.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  )
                },
                {
                  title: 'Generate Appeal',
                  description: 'Receive a professionally written appeal letter customized to your situation.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  )
                }
              ].map((step, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    {step.icon}
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Tools Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
              {t('availableTools') || 'Available Tools'}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              {t('toolsRationale') || 'Our tools can help increase your chances of success with traffic ticket appeals by providing evidence-based guidance, organization, and professional formatting.'}
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Appeal Success Predictor',
                  description: 'Analyze your ticket details to predict the likelihood of a successful appeal based on historical data.',
                  image: '/predictor.png'
                },
                {
                  title: 'Legal Deadline Tracker',
                  description: 'Keep track of important dates and deadlines for your traffic ticket appeals.',
                  image: '/deadlines.png'
                },
                {
                  title: 'Officer Statement Analyzer',
                  description: 'Analyze police officer statements to identify potential weaknesses that could help your appeal.',
                  image: '/analyzer.png'
                },
                {
                  title: 'Document Scanner',
                  description: 'Scan your traffic ticket using your camera or upload an image file.',
                  image: '/scanner.png'
                },
                {
                  title: 'Fine Calculator',
                  description: 'Calculate potential fines, fees, and penalties for various traffic violations.',
                  image: '/calculator.png'
                },
                {
                  title: 'Appeal Templates',
                  description: 'Access a library of pre-written appeal templates customized for different violation types.',
                  image: '/templates.png'
                }
              ].map((tool, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all group">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
                  <CardContent className="p-6">
                    <div className="mb-4 h-40 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      {tool.image ? (
                        <img src={tool.image} alt={tool.title} className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tool.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md hover:shadow-lg"
                onClick={() => router.push('/tools')}
              >
                {t('exploreTools') || 'Explore All Tools'}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              {t('successStories') || 'Success Stories'}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I was skeptical at first, but NoMasMultas helped me appeal a $350 parking ticket successfully. The AI found a loophole in the signage regulations!",
                  author: "María G.",
                  location: "San Diego, CA"
                },
                {
                  quote: "The Officer Statement Analyzer identified 3 inconsistencies in my speeding ticket that I would have never noticed. Case dismissed!",
                  author: "James T.",
                  location: "Boston, MA"
                },
                {
                  quote: "The timeline tracker ensured I never missed a deadline. The templates were professional and saved me hours of research. Worth every penny!",
                  author: "Sofia R.",
                  location: "Miami, FL"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold mr-3">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{testimonial.author}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('readyToStart') || 'Ready to Fight Your Traffic Ticket?'}
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100">
              {t('ctaDescription') || 'Join thousands of drivers who have successfully appealed their tickets using our AI-powered tools.'}
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={handleGetStarted}
            >
              {t('startForFree') || 'Start For Free'}
            </Button>
            <p className="mt-4 text-blue-200">
              {t('noCardRequired') || 'No credit card required to get started'}
            </p>
          </div>
        </section>
      </main>
      
      <FeaturesSection />
      <Footer />
      
      {/* Help Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <HelpAssistant />
      </div>
      
      {/* Confetti effect when clicking Get Started */}
      {showConfetti && <Confetti duration={2000} trigger={showConfetti} />}
    </div>
  );
}

// Add a CSS class for the grid pattern
const styles = `
  .bg-grid-pattern {
    background-image: 
      linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  @media (prefers-color-scheme: dark) {
    .bg-grid-pattern {
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    }
  }
`;
