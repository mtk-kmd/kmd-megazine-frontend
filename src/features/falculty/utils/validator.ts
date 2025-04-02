import { z } from 'zod'

export const createFacultySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  coordinator_id: z.number().int().nullable().default(null),
})

export const createNewFacultySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  coordinator_id: z
    .string({ required_error: 'Coordinator is required' })
    .min(1, 'Coordinator is required'),
})

export const editFacultySchema = z.object({
  faculty_id: z
    .string({ required_error: 'Faculty is required' })
    .min(1, 'Faculty is required'),
  name: z.string().min(1, 'Name is required'),
  coordinator_id: z
    .string({ required_error: 'Coordinator is required' })
    .min(1, 'Coordinator is required'),
})

export type EditFacultyValues = z.infer<typeof editFacultySchema>
