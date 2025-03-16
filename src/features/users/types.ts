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

export type UserWithOptionalFaculty = User & {
  StudentFaculty?: StudentFaculty
  Faculty?: Faculty
}

export type GetUsersResponse = {
  message: string
  result: UserWithOptionalFaculty[]
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

export type UserEditPayload = User & { user_id: number; status: string }

export type UserAuth = {
  auth_id: number
  auth_code: number
  is_verified: boolean
  createdAt: string
  updatedAt: string
}

export type Faculty = {
  faculty_id: number
  name: string
  coordinator_id: number
  createdAt: string
  updatedAt: string
}

export type StudentFaculty = {
  student_faculty_id: number
  student_id: number
  faculty_id: number
  faculty: Faculty
}

export type GetUserApiResponse = {
  message: string
  result: User & { StudentFaculty: StudentFaculty }
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
