import axios from 'axios'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  AddMagazineFormValues,
  EditMagazineFormValues,
} from '../utils/validator'
import { EventItemResponse, EventResponse } from '../types'

const createMagazine = async ({
  token,
  payload,
}: {
  token: string
  payload: AddMagazineFormValues
}): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>(
      '/createEvent',
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
    throw new Error('Failed to create a new magazine.')
  }
}

export const useCreateMagazine = (token: string) => {
  return useMutation({
    mutationFn: (payload: AddMagazineFormValues) =>
      createMagazine({ token, payload }),
    onSuccess: () => {
      toast.success('Your new magazine has been created successfully.')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

const getMagazines = async (
  token: string,
  role: string
): Promise<EventResponse> => {
  try {
    const response = await apiClient.get<EventResponse>('/getEvent', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const magazines = response.data.result.filter((magazine) => {
      if (role === 'student') {
        return (
          magazine.status === 'OPEN' &&
          new Date(magazine.closure.entry_closure) > new Date()
        )
      }
      return true
    })

    return { message: response.data.message, result: magazines }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to fetch magazines.')
  }
}

export const useGetMagazines = (
  token: string,
  role: string,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['magazines', role],
    queryFn: () => getMagazines(token, role),
    enabled: enabled,
  })
}

const getMagazine = async (
  token: string,
  magazine_id: number
): Promise<EventItemResponse> => {
  try {
    const response = await apiClient.get<EventItemResponse>(
      `/getEvent?event_id=${magazine_id}`,
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
    throw new Error('Failed to fetch magazine.')
  }
}

export const useGetMagazine = (
  token: string,
  magazine_id: number,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['magazine', magazine_id],
    queryFn: () => getMagazine(token, magazine_id),
    enabled: enabled,
    refetchOnWindowFocus: false,
  })
}

const updateMagazine = async ({
  token,
  payload,
}: {
  token: string
  payload: EditMagazineFormValues
}): Promise<{ message: string }> => {
  try {
    const response = await apiClient.put<{ message: string }>(
      '/updateEvent',
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
    throw new Error('Failed to update the magazine.')
  }
}

export const useUpdateMagazine = (token: string) => {
  return useMutation({
    mutationFn: (payload: EditMagazineFormValues) =>
      updateMagazine({ token, payload }),
    onSuccess: () => {
      toast.success('Your magazine has been updated successfully.')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

const deleteMagazine = async ({
  token,
  event_id,
}: {
  token: string
  event_id: number
}): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>(
      '/deleteEvent',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { event_id },
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to delete the magazine.')
  }
}

export const useDeleteMagazine = (token: string) => {
  return useMutation({
    mutationFn: (event_id: number) => deleteMagazine({ token, event_id }),
    onSuccess: () => {
      toast.success('The magazine has been deleted successfully.')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
