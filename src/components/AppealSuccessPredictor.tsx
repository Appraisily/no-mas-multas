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
import { Check, AlertCircle, Gauge, ChevronRight, Loader2 } from 'lucide-react';

type ViolationFactor = {
  id: string;
  name: string;
  description: string;
  selected: boolean;
};

type JurisdictionFactor = {
  id: string;
  name: string;
  description: string;
  successRate: number;
  selected: boolean;
};

type EvidenceFactor = {
  id: string;
  name: string;
  description: string;
  weight: number;
  selected: boolean;
};

export function AppealSuccessPredictor() {
  // Violation-specific success factors
  const [violationFactors, setViolationFactors] = useState<ViolationFactor[]>([
    {
      id: 'equipment_error',
      name: 'Equipment Error',
      description: 'Radar/camera equipment potentially miscalibrated or improperly operated',
      selected: false,
    },
    {
      id: 'sign_visibility',
      name: 'Sign Visibility Issues',
      description: 'Required signage was obscured, missing, or inadequate',
      selected: false,
    },
    {
      id: 'officer_procedure',
      name: 'Officer Procedural Error',
      description: 'Officer failed to follow standard procedures for this violation',
      selected: false,
    },
    {
      id: 'identity_uncertainty',
      name: 'Identity Uncertainty',
      description: 'Uncertain vehicle/driver identification (similar vehicles, etc.)',
      selected: false,
    },
    {
      id: 'vague_statement',
      name: 'Vague Officer Statement',
      description: 'Officer statement contains subjective or imprecise language',
      selected: false,
    },
    {
      id: 'extenuating_circumstance',
      name: 'Extenuating Circumstances',
      description: 'Valid emergency or safety reason for committing violation',
      selected: false,
    }
  ]);

  // Jurisdiction-specific factors
  const [jurisdictionFactors, setJurisdictionFactors] = useState<JurisdictionFactor[]>([
    {
      id: 'high_dismissal',
      name: 'High Dismissal Rate Court',
      description: 'This court has a history of dismissing this type of violation',
      successRate: 68,
      selected: false,
    },
    {
      id: 'officer_absence',
      name: 'Officer Absence Likelihood',
      description: 'Officers in this jurisdiction frequently miss hearings',
      successRate: 55,
      selected: false,
    },
    {
      id: 'technicality_focus',
      name: 'Technicality-Focused Court',
      description: 'Court strictly adheres to procedural requirements',
      successRate: 42,
      selected: false,
    }
  ]);

  // Evidence-based factors
  const [evidenceFactors, setEvidenceFactors] = useState<EvidenceFactor[]>([
    {
      id: 'photo_evidence',
      name: 'Contradicting Photo Evidence',
      description: 'You have photos that contradict the ticket description',
      weight: 25,
      selected: false,
    },
    {
      id: 'witness',
      name: 'Witness Statement',
      description: 'You have witness(es) who can corroborate your account',
      weight: 20,
      selected: false,
    },
    {
      id: 'vehicle_data',
      name: 'Vehicle Data/Telemetry',
      description: 'You have data (GPS, dashcam, etc.) supporting your position',
      weight: 30,
      selected: false,
    },
    {
      id: 'prior_maintenance',
      name: 'Recent Maintenance Records',
      description: 'You have maintenance records relevant to the violation',
      weight: 15,
      selected: false,
    }
  ]);

  const [isCalculating, setIsCalculating] = useState(false);
  const [predictionScore, setPredictionScore] = useState<number | null>(null);
  const [appealStrengths, setAppealStrengths] = useState<string[]>([]);
  const [appealWeaknesses, setAppealWeaknesses] = useState<string[]>([]);

  // Toggle selection for violation factors
  const toggleViolationFactor = (id: string) => {
    setViolationFactors(
      violationFactors.map(factor => 
        factor.id === id ? { ...factor, selected: !factor.selected } : factor
      )
    );
  };

  // Toggle selection for jurisdiction factors
  const toggleJurisdictionFactor = (id: string) => {
    setJurisdictionFactors(
      jurisdictionFactors.map(factor => 
        factor.id === id ? { ...factor, selected: !factor.selected } : factor
      )
    );
  };

  // Toggle selection for evidence factors
  const toggleEvidenceFactor = (id: string) => {
    setEvidenceFactors(
      evidenceFactors.map(factor => 
        factor.id === id ? { ...factor, selected: !factor.selected } : factor
      )
    );
  };

  // Calculate appeal success probability
  const calculateSuccessProbability = () => {
    setIsCalculating(true);
    
    // Simulate API call/calculation time
    setTimeout(() => {
      // Base probability (everyone starts with some chance)
      let probability = 25;
      
      // Add points for each selected violation factor
      const selectedViolationFactors = violationFactors.filter(f => f.selected);
      probability += selectedViolationFactors.length * 8;
      
      // Add weighted points from jurisdiction factors
      const selectedJurisdictionFactors = jurisdictionFactors.filter(f => f.selected);
      for (const factor of selectedJurisdictionFactors) {
        probability += (factor.successRate / 10);
      }
      
      // Add weighted points from evidence factors
      const selectedEvidenceFactors = evidenceFactors.filter(f => f.selected);
      for (const factor of selectedEvidenceFactors) {
        probability += (factor.weight / 5);
      }
      
      // Cap at 95% (nothing is ever certain)
      probability = Math.min(95, Math.round(probability));
      setPredictionScore(probability);
      
      // Determine strengths and weaknesses
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      
      // Analyze strengths
      if (selectedEvidenceFactors.length >= 2) {
        strengths.push('Strong evidence portfolio with multiple documentation types');
      }
      
      if (selectedViolationFactors.some(f => ['equipment_error', 'officer_procedure'].includes(f.id))) {
        strengths.push('Technical/procedural issues that courts take seriously');
      }
      
      if (selectedJurisdictionFactors.some(f => f.id === 'high_dismissal')) {
        strengths.push('Favorable jurisdiction with high dismissal rates');
      }
      
      // Analyze weaknesses
      if (selectedEvidenceFactors.length === 0) {
        weaknesses.push('Lack of supporting evidence beyond your testimony');
      }
      
      if (!selectedViolationFactors.some(f => ['equipment_error', 'sign_visibility', 'officer_procedure'].includes(f.id))) {
        weaknesses.push('No clear procedural or equipment issues identified');
      }
      
      if (selectedViolationFactors.length <= 1 && probability < 50) {
        weaknesses.push('Limited grounds for contesting the violation');
      }
      
      setAppealStrengths(strengths);
      setAppealWeaknesses(weaknesses);
      setIsCalculating(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Moderate';
    return 'Low';
  };

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900 dark:text-slate-50 font-semibold flex items-center">
          <Gauge className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
          Appeal Success Predictor
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          Estimate your chances of successfully appealing your violation.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-6 pt-3 pb-2">
        <div className="space-y-6">
          {/* Violation Factors */}
          <div>
            <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-3">
              Violation-Specific Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {violationFactors.map((factor) => (
                <div 
                  key={factor.id}
                  className={`cursor-pointer rounded-md p-3 border transition-colors ${
                    factor.selected 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800' 
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-950 dark:border-slate-800 dark:hover:border-slate-700'
                  }`}
                  onClick={() => toggleViolationFactor(factor.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {factor.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {factor.description}
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      factor.selected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {factor.selected && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Jurisdiction Factors */}
          <div>
            <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-3">
              Jurisdiction Factors
            </h3>
            <div className="space-y-3">
              {jurisdictionFactors.map((factor) => (
                <div 
                  key={factor.id}
                  className={`cursor-pointer rounded-md p-3 border transition-colors ${
                    factor.selected 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800' 
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-950 dark:border-slate-800 dark:hover:border-slate-700'
                  }`}
                  onClick={() => toggleJurisdictionFactor(factor.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {factor.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {factor.description}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className="mr-3" variant="outline">
                        {factor.successRate}% Success
                      </Badge>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        factor.selected 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        {factor.selected && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Evidence Factors */}
          <div>
            <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-3">
              Evidence Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evidenceFactors.map((factor) => (
                <div 
                  key={factor.id}
                  className={`cursor-pointer rounded-md p-3 border transition-colors ${
                    factor.selected 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800' 
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-950 dark:border-slate-800 dark:hover:border-slate-700'
                  }`}
                  onClick={() => toggleEvidenceFactor(factor.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {factor.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {factor.description}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs font-semibold mr-3 text-blue-600 dark:text-blue-400">
                        +{factor.weight} pts
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        factor.selected 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        {factor.selected && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <Button 
            className="w-full"
            onClick={calculateSuccessProbability}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>Analyze Appeal Potential</>
            )}
          </Button>
          
          {/* Prediction Results */}
          {predictionScore !== null && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    Appeal Success Prediction
                  </h3>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(predictionScore)}`}>
                      {predictionScore}%
                    </div>
                    <Badge variant={predictionScore >= 70 ? "success" : predictionScore >= 40 ? "warning" : "destructive"}>
                      {getScoreDescription(predictionScore)} Chance
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {/* Strengths */}
                {appealStrengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                      Appeal Strengths
                    </h4>
                    <ul className="space-y-1">
                      {appealStrengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-baseline">
                          <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Weaknesses */}
                {appealWeaknesses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-rose-700 dark:text-rose-400 mb-2">
                      Appeal Challenges
                    </h4>
                    <ul className="space-y-1">
                      {appealWeaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm flex items-baseline">
                          <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/50 p-4">
                <Button 
                  variant="outline" 
                  className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 w-full justify-between"
                >
                  Create Appeal Strategy Based on Analysis
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 