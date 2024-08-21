import { Inject, Injectable } from '@nestjs/common'
import {
  IDatabaseRepository,
  ISDatabaseRepository,
} from '../../adapter/repositories/IDatabaseRepository'
import {
  IMoviesRepository,
  ISMoviesRepository,
} from '../../adapter/repositories/IMoviesRepository'
import { IGetMoviesResponse, IMovieResponse } from '../../domain/tmdb-responses'

@Injectable()
export class FormatMovieService {
  constructor(
    @Inject(ISDatabaseRepository)
    private databaseRepository: IDatabaseRepository,
    @Inject(ISMoviesRepository) private moviesRepository: IMoviesRepository,
  ) {}

  async formatMovieLists(
    unformattedMovies: IMovieResponse[],
    userId: number,
  ): Promise<IGetMoviesByGenreResponse['movies']> {
    const movies: IMovieDTO[] = []
    const { genres } = await this.moviesRepository.getAllGenres()

    for await (const movie of unformattedMovies) {
      const listMovieAppears = await this.databaseRepository.getListByMovieId(
        movie.id,
        userId,
      )

      const {
        /* eslint-disable @typescript-eslint/no-unused-vars, camelcase */
        genre_ids,
        vote_count,
        vote_average,
        popularity,
        video,
        original_title,
        adult,
        original_language,
        release_date,
        backdrop_path,
        ...rest
      } = movie

      const formattedMovie = {
        lists: listMovieAppears,
        backdrop_path: backdrop_path || '',
        rating: {
          average: vote_average,
          ratingsCount: vote_count,
        },
        ...rest,
        release_date: release_date.split('-').reverse().join('/'),
        genres: genres.filter((gen) => movie.genre_ids.includes(gen.id)),
      }

      movies.push(formattedMovie)
    }

    return movies
  }

  async formatMovieGenres(movies: IGetMoviesResponse): Promise<IMovieDTO[]> {
    const { genres } = await this.moviesRepository.getAllGenres()

    const formattedMovies = movies.results.map((movie) => {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars, camelcase */
        genre_ids,
        vote_count,
        vote_average,
        popularity,
        video,
        original_title,
        adult,
        original_language,
        release_date,
        backdrop_path,
        ...rest
      } = movie

      return {
        lists: [],
        backdrop_path: backdrop_path || '',
        rating: {
          average: vote_average,
          ratingsCount: vote_count,
        },
        ...rest,
        release_date: release_date.split('-').reverse().join('/'),
        genres: genres.filter((gen) => movie.genre_ids.includes(gen.id)),
      }
    })

    return formattedMovies
  }
}
