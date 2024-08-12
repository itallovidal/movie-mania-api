import {
  IGetGenresResponse,
  IGetMoviesResponse,
} from '../../domain/tmdb-responses'

export interface IMoviesRepository {
  getAllGenres: () => Promise<IGetGenresResponse>
  getRandomMovies: () => Promise<IGetMoviesResponse>
  getRandomMoviesByGenre: (id: number) => Promise<IGetMoviesResponse>
  searchMovie: (title: string) => Promise<IGetMoviesResponse>
  getMovieByMovieId: (movieId: number) => Promise<any>
}

export const ISMoviesRepository = Symbol('IMoviesRepository')
