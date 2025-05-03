import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_ARTICLE_TYPES,
} from '@/utils/constants'

import { z } from 'zod'

export const addContributionSchema = z
  .object({
    event_id: z.number().default(0),
    user_id: z.number().default(0),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    images: z.array(z.instanceof(File)).optional().nullable(),
    articleFile: z.instanceof(File).optional().nullable(),
    agreed_to_terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .superRefine((data, ctx) => {
    if (!(data.images && data.images.length > 0) && !data.articleFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either images or an article file must be provided',
        path: ['images'],
      })


      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either images or an article file must be provided',
        path: ["articleFile"],
      })
    }

    if (data.images) {
      data.images.forEach((file, index) => {
        if (file.size > MAX_FILE_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Max file size is 5MB',
            path: [`images.${index}`],
          })
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Only .jpg, .jpeg, and .png files are accepted',
            path: [`images.${index}`],
          })
        }
      })
    }

    if (data.articleFile) {
      if (data.articleFile.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max file size is 5MB',
          path: ['articleFile'],
        })
      }
      if (!ACCEPTED_ARTICLE_TYPES.includes(data.articleFile.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Only .docx files are accepted',
          path: ['articleFile'],
        })
      }
    }
  })

export type AddContributionValues = z.infer<typeof addContributionSchema>
