'use client';

import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ChevronRight, Loader2 } from 'lucide-react';

type ViolationType = 'speeding' | 'redLight' | 'stopSign' | 'parking' | 'other';

type IssueFound = {
  id: string;
  text: string;
  excerpt: string;
  issueType: 'vague' | 'procedural' | 'contradiction' | 'omission';
  strength: 'high' | 'medium' | 'low';
  explanation: string;
};

export function OfficerStatementAnalyzer() {
  const [statement, setStatement] = useState('');
  const [violationType, setViolationType] = useState<ViolationType>('speeding');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    issues: IssueFound[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleAnalyze = async () => {
    if (!statement.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call to analyze the statement
    setTimeout(() => {
      // Mock response data
      const mockResult = {
        score: 78,
        issues: [
          {
            id: '1',
            text: 'High rate of speed',
            excerpt: 'I observed the vehicle traveling at a high rate of speed.',
            issueType: 'vague' as const,
            strength: 'high' as const,
            explanation: 'The officer used vague language ("high rate of speed") without specifying an actual speed. This subjective assessment has lower evidentiary value than a specific measurement.'
          },
          {
            id: '2',
            text: 'Visual estimation',
            excerpt: 'I visually estimated the speed before confirming with radar.',
            issueType: 'procedural' as const,
            strength: 'medium' as const,
            explanation: 'Visual estimation has been challenged in court as less reliable than direct measurement. Some jurisdictions require specific training for officers to use visual estimation.'
          },
          {
            id: '3',
            text: 'Calibration records',
            excerpt: 'I used department radar unit #347 to measure the speed.',
            issueType: 'omission' as const,
            strength: 'high' as const,
            explanation: 'No mention of when the radar unit was last calibrated or tested. Many jurisdictions require regular calibration and documentation.'
          }
        ]
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      setActiveTab('results');
    }, 2000);
  };

  const getIssueColor = (type: IssueFound['issueType']) => {
    switch (type) {
      case 'vague': return 'bg-amber-500/15 border-l-amber-500 text-amber-800 dark:text-amber-300';
      case 'procedural': return 'bg-blue-500/15 border-l-blue-500 text-blue-800 dark:text-blue-300';
      case 'contradiction': return 'bg-rose-500/15 border-l-rose-500 text-rose-800 dark:text-rose-300';
      case 'omission': return 'bg-purple-500/15 border-l-purple-500 text-purple-800 dark:text-purple-300';
      default: return 'bg-slate-100 border-l-slate-500';
    }
  };

  const getIssueTypeLabel = (type: IssueFound['issueType']) => {
    switch (type) {
      case 'vague': return 'Vague Language';
      case 'procedural': return 'Procedural Issue';
      case 'contradiction': return 'Contradiction';
      case 'omission': return 'Critical Omission';
      default: return 'Issue';
    }
  };

  const getStrengthBadge = (strength: IssueFound['strength']) => {
    switch (strength) {
      case 'high':
        return <Badge variant="success">Strong Appeal Point</Badge>;
      case 'medium':
        return <Badge variant="warning">Moderate Appeal Point</Badge>;
      case 'low':
        return <Badge variant="secondary">Weak Appeal Point</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900 dark:text-slate-50 font-semibold">
          Officer Statement Analyzer
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          Analyze police officer statements for procedural issues, vague language, and other weaknesses.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-0 pb-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="input">Statement Input</TabsTrigger>
            <TabsTrigger 
              value="results"
              disabled={!analysisResult}
            >
              Analysis Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="mt-0 space-y-4">
            <div className="space-y-2">
              <label 
                htmlFor="violation-type" 
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Violation Type
              </label>
              <Select
                value={violationType}
                onValueChange={(value) => setViolationType(value as ViolationType)}
              >
                <SelectTrigger id="violation-type" className="w-full">
                  <SelectValue placeholder="Select violation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speeding">Speeding</SelectItem>
                  <SelectItem value="redLight">Red Light</SelectItem>
                  <SelectItem value="stopSign">Stop Sign</SelectItem>
                  <SelectItem value="parking">Parking</SelectItem>
                  <SelectItem value="other">Other Violation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="officer-statement" 
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Officer's Statement
              </label>
              <Textarea
                id="officer-statement"
                placeholder="Paste the officer's statement from your citation here..."
                className="min-h-[200px] font-mono text-sm leading-relaxed resize-none border-slate-200 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                For best results, include the complete statement without modifications.
              </p>
            </div>
            
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !statement.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Analyze Statement</>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="results" className="mt-0 space-y-6">
            {analysisResult && (
              <>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">
                      Appeal Potential
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Based on {analysisResult.issues.length} issues found
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {analysisResult.score}%
                    </div>
                    <Badge variant={analysisResult.score > 70 ? "success" : analysisResult.score > 40 ? "warning" : "secondary"}>
                      {analysisResult.score > 70 ? "Strong" : analysisResult.score > 40 ? "Moderate" : "Limited"}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-3">
                    Issues Found
                  </h3>
                  
                  <div className="space-y-4">
                    {analysisResult.issues.map((issue) => (
                      <div 
                        key={issue.id} 
                        className={`p-4 rounded-md border-l-4 ${getIssueColor(issue.issueType)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-900 dark:text-slate-50">
                            {issue.text}
                          </h4>
                          {getStrengthBadge(issue.strength)}
                        </div>
                        
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md mb-3 font-mono text-sm">
                          "{issue.excerpt}"
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <span className="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-1 rounded-md mt-1">
                            {getIssueTypeLabel(issue.issueType)}
                          </span>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {issue.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-md">
                  <h3 className="flex items-center text-blue-800 dark:text-blue-300 font-medium mb-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    How to Use This in Your Appeal
                  </h3>
                  <p className="text-sm text-blue-800/90 dark:text-blue-300/90 mb-3">
                    Include these issues in your appeal letter, focusing on the strongest points first. 
                    Be respectful and factual rather than accusatory.
                  </p>
                  <Button 
                    variant="outline" 
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 w-full justify-between"
                  >
                    Generate Appeal Arguments Based on Analysis
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 