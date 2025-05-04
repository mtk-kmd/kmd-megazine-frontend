import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AddContributionValues } from '../utils/validator'
import axios from 'axios'
import { apiClient } from '@/lib/api-client'
import {
  CreatedContributionResponse,
  GetContributionResponse,
  GetContributionsResponse,
} from '../types'

const createContribution = async ({
  token,
  payload,
}: {
  token: string
  payload: AddContributionValues
}): Promise<CreatedContributionResponse> => {
  try {
    const formData = new FormData()
    formData.append('event_id', payload.event_id.toString())
    formData.append('user_id', payload.user_id.toString())
    formData.append('title', payload.title)
    formData.append('content', payload.content)
    formData.append('agreed_to_terms', payload.agreed_to_terms.toString())

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((image) => {
        formData.append('images', image)
      })
    }

    if (payload.articleFile) {
      formData.append('articleFile', payload.articleFile)
    }

    const response = await apiClient.post<CreatedContributionResponse>(
      '/createStudentContribution',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to create contribution.')
  }
}

export const useCreateContribution = (token: string) => {
  return useMutation({
    mutationFn: (payload: AddContributionValues) =>
      createContribution({ token, payload }),
    onSuccess: () => {
      toast('Your contribution has been successfully created.')
    },
    onError: () => {
      toast('Unable to create your contribution. Please try again.')
    },
  })
}

const getContributions = async ({
  token,
  role,
  user_id,
  faculty_id,
}: {
  token: string
  role: string
  user_id?: number
  faculty_id?: number
}): Promise<GetContributionsResponse> => {
  try {
    const response = await apiClient.get<GetContributionsResponse>(
      '/getStudentContribution',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const contributions = response.data.result.filter((item) => {
      if (role === 'student') {
        return item.student_id === user_id
      } else if (role === 'guest' || role === 'coordinator') {
        return item.student.StudentFaculty?.faculty_id === faculty_id
      }
      return true
    })

    return {
      message: response.data.message,
      result: contributions,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to fetch contributions.')
  }
}

export const useGetContributions = (
  token: string,
  role: string,
  user_id?: number,
  faculty_id?: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['contributions', role, user_id, faculty_id],
    queryFn: () => getContributions({ token, role, user_id, faculty_id }),
    enabled,
  })
}

const getContribution = async ({
  token,
  submission_id,
}: {
  token: string
  submission_id: number
}): Promise<GetContributionResponse> => {
  try {
    const response = await apiClient.get<GetContributionResponse>(
      `/getStudentContribution?submission_id=${submission_id}`,
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
    throw new Error('Failed to fetch contribution.')
  }
}

export const useGetContribution = (
  token: string,
  submission_id: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['contribution', submission_id],
    queryFn: () => getContribution({ token, submission_id }),
    enabled,
  })
}
