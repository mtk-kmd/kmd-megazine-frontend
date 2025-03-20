import axios from 'axios'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  GetUsersResponse,
  CreateUserPayload,
  CreateUserApiResponse,
  AssignStudentToFacultyResponse,
  GetUserApiResponse,
} from '../types'

const getUsers = async ({ token, role }: { token: string; role: string }) => {
  try {
    const response = await apiClient.get<GetUsersResponse>('/getUsers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const studentData = response.data.result.filter(
      (user) => user.role && user.role.role_name.toLowerCase() === role
    )

    return studentData
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to retrieve users information.')
  }
}

const getUser = async ({
  token,
  user_id,
}: {
  token: string
  user_id: number
}) => {
  try {
    const response = await apiClient.get<GetUserApiResponse>(
      `/getUsers?user_id=${user_id}`,
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
    throw new Error('Failed to retrieve user information.')
  }
}

const createUser = async ({
  token,
  payload,
}: {
  token: string
  payload: CreateUserPayload
}): Promise<CreateUserApiResponse> => {
  try {
    const response = await apiClient.post<CreateUserApiResponse>(
      '/createUser',
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
    throw new Error('Failed to create user')
  }
}

const assignStudentToFaculty = async ({
  token,
  payload,
}: {
  token: string
  payload: {
    faculty_id: number
    student_id: number
  }
}) => {
  try {
    const response = await apiClient.post<AssignStudentToFacultyResponse>(
      '/addStudentToFaculty',
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
    throw new Error('Failed to assign student to faculty.')
  }
}

export const useGetUsers = (
  token: string,
  role: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['users', 'role', role],
    queryFn: () => getUsers({ token, role }),
    enabled: enabled,
  })
}

export const useGetUser = (
  token: string,
  user_id: number,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['users', user_id],
    queryFn: () => getUser({ token, user_id }),
    enabled: enabled,
    refetchOnWindowFocus: false,
  })
}

export const useCreateUser = (token: string) => {
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser({ token, payload }),
    onSuccess() {
      toast.success('User created successfully', { position: 'top-right' })
    },
    onError(error) {
      toast.error(error.message, { position: 'top-right' })
    },
  })
}

export const useAssignStudentToFaculty = (token: string) => {
  return useMutation({
    mutationFn: (payload: { faculty_id: number; student_id: number }) =>
      assignStudentToFaculty({ token, payload }),
    onSuccess() {
      toast.success('Student assigned to faculty successfully', {
        position: 'top-right',
      })
    },
    onError(error) {
      toast.error(error.message, { position: 'top-right' })
    },
  })
}
