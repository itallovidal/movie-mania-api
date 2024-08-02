import { IGetGenresResponse } from '../../domain/tmdb-responses'

export interface IMoviesRepository {
  getAllGenres: () => Promise<IGetGenresResponse>
}

export const ISMoviesRepository = Symbol('IMoviesRepository')
