import { z } from 'zod'
import 'dotenv/config'
import * as process from 'process'

const envSchema = z.object({
  DATABASE_URL: z.string({
    required_error: 'O banco precisa ser fornecido para rodar.',
  }),
})

export const envParsed = envSchema.safeParse(process.env.DATABASE_URL)

if (!envParsed.success) {
  throw new Error(envParsed.error.message)
}
