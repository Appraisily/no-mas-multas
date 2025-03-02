export interface FineData {
  fineNumber?: string;
  date?: string;
  amount?: string;
  location?: string;
  reason?: string;
  licensePlate?: string;
  vehicleType?: string;
  authority?: string;
  dueDate?: string;
  additionalInfo?: string;
}

export interface AnalysisResult {
  fineData: FineData;
  appealText: string;
  success: boolean;
  error?: string;
}

export interface AppealOptions {
  appealType: 'procedural' | 'factual' | 'legal' | 'comprehensive';
  customDetails?: string;
  includeTemplateText: boolean;
} 