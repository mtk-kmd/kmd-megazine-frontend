import axios from 'axios'
import { apiClient } from '@/lib/api-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CreatedFacultyResponse,
  CreateFacultyPayload,
  FacultyApiResponseType,
  FacultyResponseItem,
  GetFacultyResponse,
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

const getFaculty = async ({
  token,
  faculty_id,
}: {
  token: string
  faculty_id: number
}): Promise<GetFacultyResponse> => {
  try {
    const response = await apiClient.get<GetFacultyResponse>(
      `/getFaculty?faculty_id=${faculty_id}`,
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
    throw new Error('Failed to retrieve falculty detail.')
  }
}

export const useGetFaculty = (
  token: string,
  faculty_id: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['faculty', faculty_id],
    queryFn: () => getFaculty({ token, faculty_id }),
    enabled: enabled,
  })
}

export const useGetFalculties = (token: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: () => getFalculties({ token }),
    enabled: enabled,
    refetchOnWindowFocus: false,
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
