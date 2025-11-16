import { apiClient } from './client'
import type { LearnRequest, LearnResponse } from '@/types/api'

export const learnApi = {
  async explainConcept(query: string): Promise<LearnResponse> {
    return apiClient.post<LearnRequest, LearnResponse>(
      '/learn/explain',
      { query }
    )
  },
}
