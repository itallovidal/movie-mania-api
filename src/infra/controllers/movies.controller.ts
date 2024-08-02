import { Controller, Get, Inject } from '@nestjs/common'
import {
  ISUsersRepository,
  IUsersRepository,
} from '../../adapter/repositories/IUsersRepository'

import {
  IMoviesRepository,
  ISMoviesRepository,
} from '../../adapter/repositories/IMoviesRepository'
import { formatMovies } from '../../utils/formatMovies'

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
    return formatMovies(genres, movies)
  }

  @Get('random/:id')
  async getRandomMoviesByGenre() {}
}
