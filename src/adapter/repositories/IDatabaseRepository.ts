import { ISignUpSchema } from '../schemas/sign-up-schema'
import { IUser } from '../../domain/IUser'

export interface IDatabaseRepository {
  signUp: (data: ISignUpSchema) => Promise<IUser>
  getProfile: (id: number) => Promise<IUser>
  getUserByEmail: (email: string) => Promise<IUser>
  postComment: (movieId: number, id: number, text: string) => Promise<void>
}

export const ISDatabaseRepository = Symbol('IDatabaseRepository')
