import axios from 'axios'
import { apiClient } from '@/lib/api-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CreatedFacultyResponse,
  CreateFacultyPayload,
  FacultyApiResponseType,
  FacultyResponseItem,
} from '../types'

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

const createFaculty = async ({
  token,
  payload,
}: {
  token: string
  payload: CreateFacultyPayload
}): Promise<CreatedFacultyResponse> => {
  try {
    const response = await apiClient.post<CreatedFacultyResponse>(
      '/createFaculty',
      payload,
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
    throw new Error('Failed to create faculty.')
  }
}

export const useCreateFaculty = (token: string) => {
  return useMutation({
    mutationFn: (payload: CreateFacultyPayload) =>
      createFaculty({ token, payload }),
  })
}
