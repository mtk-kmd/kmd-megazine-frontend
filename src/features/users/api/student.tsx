import axios from 'axios'
import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { StudentApiResponseType } from '../types'

const getStudents = async ({ token }: { token: string }) => {
  try {
    const response = await apiClient.get<StudentApiResponseType>('/getUsers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const studentData = response.data.result.filter(
      (user) => user.role && user.role.role_name.toLowerCase() === 'student'
    )

    return studentData
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error('Failed to retrieve students information.')
  }
}

export const useGetStudents = (token: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => getStudents({ token }),
    enabled: enabled,
  })
}
