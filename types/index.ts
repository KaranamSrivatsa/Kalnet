// New types matching the updated prompt structure
export interface AIParsedResponse {
  inputQuality: "vague" | "partial" | "clear" | "complete";
  structuredOutput: StructuredOutput;
  missingElements: MissingElements;
  clarityScore: number; // AI calculates this directly
  actionableSteps: string[];
}

export interface StructuredOutput {
  goal: string | null;
  method: string | null;
  steps: string[] | null;
  timeline: string | null;
  simplifiedVersion: string;
}

export interface MissingElements {
  goalClarity: boolean;
  executionSteps: boolean;
  resources: boolean;
  timeline: boolean;
}

export interface AnalysisResult {
  id: string;
  originalInput: string;
  structuredOutput: StructuredOutput;
  missingElements: MissingElements;
  actionableSteps: string[];
  clarityScore: number;
  createdAt: string;
}

export interface AnalysisRequest {
  input: string;
}

export interface ClarityScoreBreakdown {
  goalDefinition: number;
  executionSteps: number;
  methodClarity: number;
  timeline: number;
  resources: number;
  total: number;
}

// Enhanced types for advanced analysis
export interface QualityIndicators {
  hasSpecificMetrics: boolean;
  hasDeadlines: boolean;
  hasResourceInventory: boolean;
  hasPhasedApproach: boolean;
  inputQualityLevel: 'low' | 'medium' | 'high';
}

export interface DetailedAnalysis extends AnalysisResult {
  qualityIndicators?: QualityIndicators;
  recommendedImprovements?: string[];
}
