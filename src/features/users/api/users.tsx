import axios from 'axios'
import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { StudentApiResponseType } from '../types'

const getUsers = async ({ token, role }: { token: string; role: string }) => {
  try {
    const response = await apiClient.get<StudentApiResponseType>('/getUsers', {
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
