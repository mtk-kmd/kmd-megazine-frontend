import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import {
  BrowserUsageData,
  BrowserUsageResponse,
  DashboardStatistics,
} from '../types'
import axios from 'axios'

const getAnalytic = async ({
  token,
}: {
  token: string
}): Promise<DashboardStatistics> => {
  try {
    const response = await apiClient.get<DashboardStatistics>(
      '/dashboard-stats',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to retrieve dashboard statistics.')
  }
}

export const useGetAnalytic = (token: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getAnalytic({ token }),
    enabled: enabled,
  })
}

const getBrowserUsages = async ({
  token,
}: {
  token: string
}): Promise<BrowserUsageData> => {
  try {
    const response = await apiClient.get<BrowserUsageResponse>(
      '/getBrowserUsages',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return {
      browserUsages: [
        ...response.data.browserUsages,
        ...response.data.browserUsagesWithPercentage,
        ...response.data.browserUsageByUser,
        ...response.data.browserUsageByUserWithPercentage,
      ],
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to retrieve browser usage statistics.')
  }
}

export const useGetBrowserUsages = (token: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['browser-usages'],
    queryFn: () => getBrowserUsages({ token }),
    enabled: enabled,
  })
}
