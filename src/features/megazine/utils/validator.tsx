import * as z from 'zod'

export const addMagazineSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    openDate: z.date({
      required_error: 'Open date is required',
    }),
    closeDate: z.date({
      required_error: 'Close date is required',
    }),
    finalClosureDate: z.date({
      required_error: 'Final closure date is required',
    }),
  })
  .refine((data) => data.closeDate > data.openDate, {
    message: 'Close date must be after open date',
    path: ['closeDate'],
  })
  .refine((data) => data.finalClosureDate >= data.closeDate, {
    message: 'Final closure date must be on or after close date',
    path: ['finalClosureDate'],
  })

export const editMagazineSchema = z
  .object({
    id: z.number().default(0),
    title: z.string().min(1, 'Title is required'),
    openDate: z.date({
      required_error: 'Open date is required',
    }),
    closeDate: z.date({
      required_error: 'Close date is required',
    }),
    finalClosureDate: z.date({
      required_error: 'Final closure date is required',
    }),
  })
  .refine((data) => data.closeDate > data.openDate, {
    message: 'Close date must be after open date',
    path: ['closeDate'],
  })
  .refine((data) => data.finalClosureDate >= data.closeDate, {
    message: 'Final closure date must be on or after close date',
    path: ['finalClosureDate'],
  })

export type EditMagazineFormValues = z.infer<typeof editMagazineSchema>
export type AddMagazineFormValues = z.infer<typeof addMagazineSchema>
