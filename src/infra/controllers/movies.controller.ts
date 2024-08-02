import { Controller, Get, Inject } from '@nestjs/common'
import {
  ISUsersRepository,
  IUsersRepository,
} from '../../adapter/repositories/IUsersRepository'

import {
  IMoviesRepository,
  ISMoviesRepository,
} from '../../adapter/repositories/IMoviesRepository'

@Controller('/movies')
export class MoviesController {
  constructor(
    @Inject(ISUsersRepository) private usersRepository: IUsersRepository,
    @Inject(ISMoviesRepository) private moviesRepository: IMoviesRepository,
  ) {}

  @Get('/discover')
  async getRandomMovies() {
    const movies = await this.moviesRepository.getRandomMovies()
    const { genres } = await this.moviesRepository.getAllGenres()

    const formattedMovies = movies.results.map((movie) => {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars, camelcase */
        genre_ids,
        vote_count,
        popularity,
        video,
        original_title,
        adult,
        original_language,
        release_date,
        ...rest
      } = movie
      /* eslint-enable @typescript-eslint/no-unused-vars, camelcase */

      return {
        ...rest,
        release_date: release_date.split('-').reverse().join('/'),
        genres: genres.filter((gen) => movie.genre_ids.includes(gen.id)),
      }
    })

    return formattedMovies
  }
}
