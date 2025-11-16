import { apiClient } from './client'
import type { AssessmentRequest, AssessmentResponse } from '@/types/api'

export const assessmentApi = {
  async submitAssessment(answers: string[]): Promise<AssessmentResponse> {
    return apiClient.post<AssessmentRequest, AssessmentResponse>(
      '/assessment/profile',
      { answers }
    )
  },
}
