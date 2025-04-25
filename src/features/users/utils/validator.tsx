import { z } from 'zod'

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
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
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

export const addCoordinatorSchema = z.object({
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
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  email: z
    .string({ required_error: 'Email address is required.' })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
})

export const editStudentSchema = z.object({
  user_id: z.number().default(0),
  user_name: z
    .string({ required_error: 'Username is required' })
    .min(1, 'Username is required'),
  first_name: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required'),
  last_name: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required'),
  role: z.number().default(4),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  email: z
    .string({ required_error: 'Email address is required.' })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  faculty_id: z
    .string({ required_error: 'Falculty is required' })
    .min(1, 'Faculty ID is required'),
  status: z.boolean().default(true),
})

export const editCoordinatorSchema = z.object({
  user_id: z.number().default(0),
  user_name: z
    .string({ required_error: 'Username is required' })
    .min(1, 'Username is required'),
  first_name: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required'),
  last_name: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required'),
  role: z.number().default(4),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  email: z
    .string({ required_error: 'Email address is required.' })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  faculty_id: z
    .string({ required_error: 'Falculty is required' })
    .min(1, 'Faculty ID is required'),
  status: z.boolean().default(true),
})

export const addManagerSchema = z.object({
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
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  email: z
    .string({ required_error: 'Email address is required.' })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
})

export const editManagerSchema = z.object({
  user_id: z.number().default(0),
  user_name: z
    .string({ required_error: 'Username is required' })
    .min(1, 'Username is required'),
  first_name: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required'),
  last_name: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required'),
  role: z.number().default(4),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
  email: z
    .string({ required_error: 'Email address is required.' })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  status: z.boolean().default(true),
})
