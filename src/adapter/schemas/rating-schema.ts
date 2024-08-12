import { z } from 'zod'

export const rateMovieSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
})

export interface IRateMovieSchema extends z.infer<typeof rateMovieSchema> {}
