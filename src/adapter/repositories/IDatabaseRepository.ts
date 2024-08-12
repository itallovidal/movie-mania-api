import { ISignUpSchema } from '../schemas/sign-up-schema'
import { IListSchema } from '../schemas/list-schema'

export interface IDatabaseRepository {
  signUp: (data: ISignUpSchema) => Promise<IUser>
  getProfile: (id: number) => Promise<IUser>
  getUserByEmail: (email: string) => Promise<IUser>
  postComment: (movieId: number, id: number, text: string) => Promise<IComment>
  getAllMovieComments: (movieId: number) => Promise<IComment[]>
  postedCommentById: (id: number) => Promise<IComment>
  createCustomList: (newList: IListSchema) => Promise<IList>
  getCustomListById: (id: number) => Promise<IList>
  addMovieToCustomList: (
    movieId: number,
    listId: number,
    userId: number,
  ) => Promise<IUserList>
}

export const ISDatabaseRepository = Symbol('IDatabaseRepository')
