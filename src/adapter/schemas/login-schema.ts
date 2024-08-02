import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(3, { message: `Mínimo de 3 caracteres.` }),
  password: z.string().min(3, { message: `Mínimo de 3 caracteres.` }),
})

export interface ILoginSchema extends z.infer<typeof loginSchema> {}
