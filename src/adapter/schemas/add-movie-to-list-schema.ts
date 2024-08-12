import { z } from 'zod'
import { listSchema } from './list-schema'

export const addMovieToListSchema = z.object({
  list: listSchema,
  movieId: z.number(),
})

export interface IAddMovieToListSchema
  extends z.infer<typeof addMovieToListSchema> {}
