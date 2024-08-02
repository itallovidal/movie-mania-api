import { z } from 'zod'
import 'dotenv/config'
import * as process from 'process'

const envSchema = z.object({
  DATABASE_URL: z.string({
    required_error: 'O banco precisa ser fornecido para rodar.',
  }),
  ACCESS_TOKEN_SECRET: z.string().min(10),
})

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_TOKEN_SECRET: process.env.DATABASE_URL,
})
