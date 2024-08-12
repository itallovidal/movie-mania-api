import { z } from 'zod'
import { listSchema } from './list-schema'

export const handleMovieInListSchema = z.object({
  list: listSchema,
  movieId: z.number(),
})

export interface IHandleMovieInListSchema
  extends z.infer<typeof handleMovieInListSchema> {}
