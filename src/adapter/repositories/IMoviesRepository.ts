import {
  IGetGenresResponse,
  IGetRandomMoviesResponse,
} from '../../domain/tmdb-responses'

export interface IMoviesRepository {
  getAllGenres: () => Promise<IGetGenresResponse>
  getRandomMovies: () => Promise<IGetRandomMoviesResponse>
  getRandomMoviesByGenre: (id: number) => Promise<IGetRandomMoviesResponse>
}

export const ISMoviesRepository = Symbol('IMoviesRepository')
