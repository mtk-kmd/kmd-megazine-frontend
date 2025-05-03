import { useMutation } from '@tanstack/react-query'
import { AddContributionValues } from '../utils/validator'
import axios from 'axios'
import { apiClient } from '@/lib/api-client'
import { CreatedContributionResponse } from '../types'
import { toast } from 'sonner'

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
