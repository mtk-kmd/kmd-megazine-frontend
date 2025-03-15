import axios from 'axios'
import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { FacultyApiResponseType, FacultyResponseItem } from '../types'

const getFalculties = async ({
  token,
}: {
  token: string
}): Promise<FacultyResponseItem[]> => {
  try {
    const response = await apiClient.get<FacultyApiResponseType>(
      '/getFaculty',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data.result
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to retrieve falculty information.')
  }
}

export const useGetFalculties = (token: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['falculties'],
    queryFn: () => getFalculties({ token }),
    enabled: enabled,
  })
}
