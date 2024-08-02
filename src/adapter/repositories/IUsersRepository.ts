import { ISignUpSchema } from '../schemas/sign-up-schema'
import { IUser } from '../../domain/IUser'

export interface IUsersRepository {
  signUp: (data: ISignUpSchema) => Promise<IUser>
  getProfile: (id: number) => Promise<IUser>
  getUserByEmail: (email: string) => Promise<IUser>
}

export const ISUsersRepository = Symbol('IUsersRepository')
