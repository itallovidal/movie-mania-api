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
  removeMovieFromList: (
    movieId: number,
    listId: number,
    userId: number,
  ) => Promise<{ count: number }>
  getListsByUserId: (userId: number) => Promise<IListSummaryDTO[]>
  getAllMoviesFromUserList: (
    listId: number,
  ) => Promise<IGetAllMoviesFromUserListDTO[]>

  rateMovie: (
    movieId: number,
    userId: number,
    rate: number,
  ) => Promise<IRatingDTO>

  getMovieRating: (movieId: number, userId: number) => Promise<IRatingDTO>
  getListByMovieId: (movieId: number, userId: number) => Promise<any>
}

export const ISDatabaseRepository = Symbol('IDatabaseRepository')
