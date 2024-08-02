import { z } from 'zod'

export const postCommentSchema = z.object({
  text: z.string().min(5),
})

export interface IPostCommentSchema extends z.infer<typeof postCommentSchema> {}
