import { apiClient } from './client'
import type { InsightsRequest, InsightsResponse } from '@/types/api'

export const insightsApi = {
  async analyzeNews(text: string, ticker?: string): Promise<InsightsResponse> {
    return apiClient.post<InsightsRequest, InsightsResponse>(
      '/insights/news',
      { text, ticker }
    )
  },
}
