import { z } from 'zod'

export const listSchema = z.object({
  name: z.string().min(3),
  id: z.number().or(z.null()).default(null),
})

export interface IListSchema extends z.infer<typeof listSchema> {}
