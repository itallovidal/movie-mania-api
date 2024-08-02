import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
} from '@nestjs/common'
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
  async getRandomMoviesByGenre(@Param('id') id: string) {
    if (!id || !Number(id)) {
      return new BadRequestException('O id do gênero deve ser informado.')
    }
    const { genres } = await this.moviesRepository.getAllGenres()
    const movieId = Number(id)

    const isValid = genres.some((genre) => genre.id === movieId)

    if (!isValid) {
      return new BadRequestException('O id do gênero fornecido não é válido.')
    }

    const movies = await this.moviesRepository.getRandomMoviesByGenre(movieId)
    return formatMovies(genres, movies)
  }
}
