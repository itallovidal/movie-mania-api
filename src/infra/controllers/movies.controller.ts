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
      const { genre_ids, ...rest } = movie

      return {
        ...rest,
        genres: genres.filter((gen) => movie.genre_ids.includes(gen.id)),
      }
    })

    return formattedMovies
  }
}
