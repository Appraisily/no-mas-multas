'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import AppealStats from './AppealStats';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OfficerStatementAnalyzer } from '@/components/OfficerStatementAnalyzer';
import { AppealSuccessPredictor } from '@/components/AppealSuccessPredictor';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { ArmadilloWithMessage } from '@/components/Armadillo';
import { BookOpen, FileText, PenTool, ChevronRight, BarChart, Zap, ThumbsUp } from 'lucide-react';

interface AppealSummary {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'completed' | 'rejected';
  type: string;
  referenceNumber: string;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'appeals' | 'templates' | 'stats'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [recentAppeals, setRecentAppeals] = useState<AppealSummary[]>([]);
  const [firstName, setFirstName] = useState('User');
  const [appealsCount, setAppealsCount] = useState({ total: 0, pending: 0, completed: 0, rejected: 0 });
  const [activeAppeals, setActiveAppeals] = useState<AppealSummary[]>([]);
  const [completedAppeals, setCompletedAppeals] = useState<AppealSummary[]>([]);
  const [motivationalMessages] = useState([
    "Fight your ticket with confidence!",
    "We've got your back against traffic violations.",
    "Justice shouldn't come with a price tag.",
    "Turn that ticket into a victory!",
    "Your legal defender against unfair tickets."
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  
  // Mock data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      setFirstName('Alex');
      
      // Mock appeals count
      setAppealsCount({
        total: 24,
        pending: 8,
        completed: 14,
        rejected: 2
      });
      
      // Mock recent appeals
      setRecentAppeals([
        {
          id: 'a1',
          title: 'Parking Violation Appeal',
          date: '2023-12-15',
          status: 'completed',
          type: 'parking',
          referenceNumber: 'PK-2023-12345'
        },
        {
          id: 'a2',
          title: 'Speed Camera Appeal',
          date: '2024-01-03',
          status: 'pending',
          type: 'speed',
          referenceNumber: 'SP-2024-00123'
        },
        {
          id: 'a3',
          title: 'Red Light Camera Appeal',
          date: '2024-01-10',
          status: 'pending',
          type: 'redlight',
          referenceNumber: 'RL-2024-00456'
        },
        {
          id: 'a4',
          title: 'No Parking Sign Violation',
          date: '2023-11-28',
          status: 'rejected',
          type: 'parking',
          referenceNumber: 'PK-2023-10789'
        },
        {
          id: 'a5',
          title: 'Procedural Appeal for Ticket',
          date: '2023-12-05',
          status: 'completed',
          type: 'procedural',
          referenceNumber: 'PR-2023-11234'
        }
      ]);
      
      // Randomly select a motivational message on load
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      setCurrentMessage(motivationalMessages[randomIndex]);
      
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, [motivationalMessages]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('statusCompleted') || 'Completed';
      case 'pending':
        return t('statusPending') || 'Pending';
      case 'rejected':
        return t('statusRejected') || 'Rejected';
      default:
        return status;
    }
  };
  
  const getTypeText = (type: string) => {
    switch (type) {
      case 'parking':
        return t('categoryParking') || 'Parking';
      case 'speed':
        return t('categorySpeed') || 'Speed';
      case 'redlight':
        return t('categoryRedLight') || 'Red Light';
      case 'procedural':
        return t('categoryProcedural') || 'Procedural';
      default:
        return t('categoryOther') || 'Other';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-slate-950 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-primary dark:text-white">NoMasMultas</h1>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">BETA</Badge>
          </div>
          <ThemeSwitch />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section with Armadillo */}
        <div className="mb-10 flex flex-col lg:flex-row items-center justify-between gap-6 bg-gradient-to-br from-accent/5 to-secondary/5 rounded-xl p-6 border border-accent/10">
          <div className="lg:max-w-xl">
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-3">
              Welcome to NoMasMultas
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Your AI-powered assistant for fighting traffic tickets and violations. 
              Our tools help analyze officer statements, predict appeal success, and 
              generate strong legal arguments.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-accent hover:bg-secondary text-white">
                Start New Appeal
              </Button>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                View Tutorial
              </Button>
            </div>
          </div>
          <div className="lg:max-w-sm">
            <ArmadilloWithMessage
              message={currentMessage}
              size="lg"
              withShadow
            />
          </div>
        </div>

        {/* Tools Grid */}
        <h2 className="text-xl font-semibold text-primary dark:text-white mb-4">Your Appeal Tools</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Appeal Predictor Card */}
          <div className="lg:row-span-2">
            <AppealSuccessPredictor />
          </div>
          
          {/* Officer Statement Card */}
          <div className="lg:row-span-2">
            <OfficerStatementAnalyzer />
          </div>
        </div>

        {/* Additional Resources */}
        <h2 className="text-xl font-semibold text-primary dark:text-white mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Legal Reference Library */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Legal Reference Library</CardTitle>
                  <CardDescription>Access legal templates and precedents</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mt-2 justify-between">
                Browse Library <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Evidence Collection */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Evidence Collection</CardTitle>
                  <CardDescription>Tools for gathering and organizing evidence</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <BarChart className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mt-2 justify-between">
                Collect Evidence <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Appeal Letter Generator */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Appeal Letter Generator</CardTitle>
                  <CardDescription>Generate professional appeal documents</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <PenTool className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mt-2 justify-between">
                Create Letter <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-lg mb-2">Advanced AI Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Our AI can spot legal weaknesses in officer statements that humans might miss.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-lg mb-2">Legal Document Templates</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Professional templates customized to your specific situation and jurisdiction.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
              <ThumbsUp className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-lg mb-2">Success-Oriented Approach</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Our tools are designed to maximize your chances of a successful appeal.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} NoMasMultas. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-accent hover:text-secondary">Terms</a>
            <a href="#" className="text-accent hover:text-secondary">Privacy</a>
            <a href="#" className="text-accent hover:text-secondary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 