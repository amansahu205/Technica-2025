// API Response Types

// Assessment API
export interface AssessmentRequest {
  answers: string[]
}

export interface AssessmentResponse {
  profile: 'beginner' | 'intermediate' | 'advanced'
  score: number
}

// Learn API
export interface LearnRequest {
  query: string
}

export interface LearnExplanation {
  eli5: string
  medium: string
  example: string
}

export interface LearnResponse {
  query: string
  explanation: LearnExplanation
}

// Insights API
export interface InsightsRequest {
  text: string
  ticker?: string
  symbol?: string
}

export interface InsightsChunk {
  metadata: Record<string, any>
  snippet: string
}

export interface InsightsResponse {
  input: string
  ticker: string
  used_chunks: InsightsChunk[]
  explanation: string
}

// Company API
export interface CompanyResponse {
  summary: string
  data: Record<string, any>
}

// Generic API Error
export interface ApiError {
  error: string
}
