export interface FileData {
  file: File;
  preview?: string;
  isImage?: boolean;
}

export interface FineInfo {
  referenceNumber: string;
  date: string;
  amount: string;
  location: string;
  reason: string;
  vehicle: string;
  additionalInfo?: string;
}

export interface AppealOptions {
  appealType: 'procedural' | 'factual' | 'legal' | 'comprehensive';
  customDetails?: string;
  includeTemplateText: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}

export enum UploadStatus {
  INITIAL = 'initial',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  GENERATING = 'generating',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum UserPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  PROFESSIONAL = 'professional'
}

export interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  plan: UserPlan;
  appealsRemaining?: number;
  appealsGenerated?: number;
} 