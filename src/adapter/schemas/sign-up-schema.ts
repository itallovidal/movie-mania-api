import { z } from 'zod'

export const signUpSchema = z
  .object({
    email: z.string().min(3, { message: `Mínimo de 3 caracteres.` }),
    username: z.string().min(3, { message: `Mínimo de 3 caracteres.` }),
    password: z.string().min(3, { message: `Mínimo de 3 caracteres.` }),
    favoriteGenre1: z.coerce.number().nonnegative(),
    favoriteGenre2: z.coerce.number().nonnegative(),
  })
  .refine(
    ({ favoriteGenre1, favoriteGenre2 }) => favoriteGenre1 !== favoriteGenre2,
    {
      message: 'Os gêneros devem ser diferentes.',
      path: ['favGenre1'],
    },
  )

export interface ISignUpSchema extends z.infer<typeof signUpSchema> {}
