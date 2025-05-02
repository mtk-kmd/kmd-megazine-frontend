import * as z from 'zod'

export const addMagazineSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    createdBy: z.number().int().positive(),
    entry_closure: z.date({
      required_error: 'Entry closure date is required',
      invalid_type_error: 'Invalid entry closure date',
    }),
    final_closure: z.date({
      required_error: 'Final closure date is required',
      invalid_type_error: 'Invalid final closure date',
    }),
  })
  .refine((data) => data.final_closure >= data.entry_closure, {
    message: 'Final closure date must be on or after entry closure date',
    path: ['final_closure'],
  })

export const editMagazineSchema = z
  .object({
    event_id: z.number().default(0),
    title: z.string().min(1, 'Title is required'),
    description: z.string().default(''),
    createdBy: z.number().int().positive().default(0),
    entry_closure: z.date({
      required_error: 'Entry closure date is required',
      invalid_type_error: 'Invalid entry closure date',
    }),
    final_closure: z.date({
      required_error: 'Final closure date is required',
      invalid_type_error: 'Invalid final closure date',
    }),
  })
  .refine((data) => data.final_closure > data.entry_closure, {
    message: 'Final closure date must be after entry closure date',
    path: ['final_closure'],
  })

export type EditMagazineFormValues = z.infer<typeof editMagazineSchema>
export type AddMagazineFormValues = z.infer<typeof addMagazineSchema>
