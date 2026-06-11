export interface PageData {
  url: string;
  domain: string;
  title: string;
  metaDescription: string;
  headings: string[];
  bodyTextSample: string;
  externalLinks: string[];
  formCount: number;
  formFields: string[];
  hasNewsletterForm: boolean;
  hasCookieBanner: boolean;
  cookieBannerText: string;
  hasPaywall: boolean;
  popupCount: number;
  countdownTimers: number;
  adElements: number;
  socialProofElements: number;
  scripts: string[];
  trackers: string[];
  pageLoadTime: number;
  hasAMP: boolean;
  language: string;
  publishDate: string;
}

export interface AnalysisResult {
  success: boolean;
  domain: string;
  analyzedAt: string;
  trustScore: number;
  trustLabel: TrustLabel;
  primaryIntent: string;
  intents: Intent[];
  darkPatterns: DarkPatternResult;
  dataCollection: DataCollectionResult;
  aiContent: AIContentResult;
  manipulationLevel: ManipulationLevel;
  summary: string;
  cached: boolean;
  cacheExpiry: string;
}

export type TrustLabel =
  | 'Highly Trustworthy'
  | 'Generally Trustworthy'
  | 'Use With Caution'
  | 'Potentially Manipulative'
  | 'High Risk';

export type ManipulationLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface Intent {
  rank: number;
  intent: string;
  confidence: number;
  evidence: string[];
}

export interface DetectedDarkPattern {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DarkPatternResult {
  count: number;
  detected: DetectedDarkPattern[];
}

export interface DataCollectionResult {
  percentage: number;
  trackers: string[];
  dataTypes: string[];
}

export interface AIContentResult {
  percentage: number;
  confidence: number;
}

export type UserTier = 'free' | 'pro';

export interface CacheEntry {
  data: AnalysisResult;
  timestamp: number;
  ttl: number;
}
