import { Role } from '@/types'

export type User = {
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

export type Student = {
    user_id: number
    user_name: string
    email: string
    createdAt: string
}

export type GetUsersResponse = {
  message: string
  result: User[]
}

export type CreateUserPayload = {
  username: string
  password: string
  role: number
  email: string
  phone: string | null
  first_name: string
  last_name: string
}

export type CreatedUser = {
  user_id: number
  user_name: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role_id: number
  auth_id: number | null
  status: boolean
  createdAt: string
  updatedAt: string
}

export type UserAuth = {
  auth_id: number
  auth_code: number
  is_verified: boolean
  createdAt: string
  updatedAt: string
}

export type GetUserApiResponse = {
  message: string
  result: User
}

export type CreateUserApiResponse = {
  message: string
  result: {
    user: User
    auth: UserAuth
  }
}

export type AssignStudentToFacultyResponse = {
  message: string
}
