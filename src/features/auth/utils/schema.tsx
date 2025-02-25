import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(2, 'Minimum 2 characters required'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})
