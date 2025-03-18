import { z } from 'zod'

export const createFacultySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  coordinator_id: z.number().int().nullable().default(null),
})
