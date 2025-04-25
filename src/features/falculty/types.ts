import { Role } from '@/types'

export type Faculty = {
  id: number
  facultyName: string
  coordinatorId: string
  coordinatorName: string
  studentCount: number
  totalContributions: number
}

export type Student = {
  student_faculty_id: number
  student_id: number
  faculty_id: number
  student: {
    user_id: number
    user_name: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    role_id: number
    auth_id: number
    status: boolean
    createdAt: string
    updatedAt: string
    faculty_id: number | null
    student_faculty_id: number | null
  }
}

export type FacultyResponseItem = {
  faculty_id: number
  name: string
  coordinator_id: number | null
  createdAt: string
  updatedAt: string
  coordinator: Coordinator | null
  students: Student[]
}

export type Coordinator = {
  user_id: number
  user_name: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role_id: number
  auth_id: number
  status: boolean
  createdAt: string
  updatedAt: string
  role: Role
}

export type FacultyApiResponseType = {
  message: string
  result: FacultyResponseItem[]
}

export type CreateFacultyPayload = {
  name: string
  coordinator_id: null | number
}

export type CreatedFacultyResponse = {
  message: string
  result: {
    faculty_id: number
    name: string
    coordinator_id: number | null
    createdAt: string
    updatedAt: string
  }
}

export type GetFacultyResponse = {
  message: string
  result: FacultyResponseItem
}
