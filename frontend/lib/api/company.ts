import { apiClient } from './client'
import type { CompanyResponse } from '@/types/api'

export const companyApi = {
  async getCompanyData(ticker: string): Promise<CompanyResponse> {
    return apiClient.get<CompanyResponse>(`/company/${ticker.toUpperCase()}`)
  },
}
