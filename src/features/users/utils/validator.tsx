import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'

export const addStudentSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(1, 'Username is required'),
  first_name: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required'),
  last_name: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required'),
  role: z.number().default(4),
  phone: z.string({ required_error: 'Phone number is required' }).default(''),
  email: z
    .string({ required_error: 'Email address is required.' })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
  faculty_id: z
    .string({ required_error: 'Falculty is required' })
    .min(1, 'Faculty ID is required'),
})

export const editStudentSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(1, 'Username is required'),
  first_name: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required'),
  last_name: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required'),
  role: z.number().default(4),
  phone: z.string({ required_error: 'Phone number is required' }).default(''),
  email: z
    .string({ required_error: 'Email address is required.' })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
  faculty_id: z
    .string({ required_error: 'Falculty is required' })
    .min(1, 'Faculty ID is required'),
})
