import { ISignUpSchema } from '../schemas/sign-up-schema'

export interface IDatabaseRepository {
  signUp: (data: ISignUpSchema) => Promise<IUser>
  getProfile: (id: number) => Promise<IUser>
  getUserByEmail: (email: string) => Promise<IUser>
  postComment: (movieId: number, id: number, text: string) => Promise<IComment>
  getAllMovieComments: (movieId: number) => Promise<IComment[]>
  postedCommentById: (id: number) => Promise<IComment>
}

export const ISDatabaseRepository = Symbol('IDatabaseRepository')
