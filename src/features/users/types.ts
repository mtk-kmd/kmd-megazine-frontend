import { Role } from '@/types'

export type Student = {
  user_id: number
  user_name: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: Role | null
  auth_id: number
  status: boolean
  createdAt: string
  updatedAt: string
}

export type StudentApiResponseType = {
  message: string
  result: Student[]
}
