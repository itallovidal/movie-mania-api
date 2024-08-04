import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Response,
} from '@nestjs/common'
import {
  ISDatabaseRepository,
  IDatabaseRepository,
} from '../../adapter/repositories/IDatabaseRepository'

import {
  IMoviesRepository,
  ISMoviesRepository,
} from '../../adapter/repositories/IMoviesRepository'
import { formatMovies } from '../../utils/formatMovies'
import { IUserDTO } from '../../domain/userDTO'
import { ZodValidationPipe } from '../zod-validation-pipe'
import { IPostCommentSchema, postCommentSchema } from '../validations'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

@Controller('/movies')
export class MoviesController {
  constructor(
    @Inject(ISDatabaseRepository) private usersRepository: IDatabaseRepository,
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
      throw new BadRequestException('O id do gênero deve ser informado.')
    }
    const { genres } = await this.moviesRepository.getAllGenres()
    const movieId = Number(id)

    const isValid = genres.some((genre) => genre.id === movieId)

    if (!isValid) {
      throw new BadRequestException('O id do gênero fornecido não é válido.')
    }

    const movies = await this.moviesRepository.getRandomMoviesByGenre(movieId)
    return formatMovies(genres, movies)
  }

  @Get('search/:title')
  async searchMovieByTitle(@Param('title') title: string) {
    if (!title) {
      throw new BadRequestException('O título do filme deve ser informado.')
    }
    const { genres } = await this.moviesRepository.getAllGenres()

    const movies = await this.moviesRepository.searchMovie(title)
    return formatMovies(genres, movies)
  }

  @Post('comment/:movieId')
  @HttpCode(201)
  async postComment(
    @Body(new ZodValidationPipe(postCommentSchema)) payload: IPostCommentSchema,
    @Param('movieId')
    movieId: string,
    @Response({ passthrough: true }) res: Response,
  ) {
    const user = res['locals'].user as IUserDTO

    if (!user) {
      throw new BadRequestException('Token inexistente ou inválido.')
    }

    if (!movieId || !Number(movieId)) {
      throw new BadRequestException('O id do filme deve ser informado.')
    }

    const postedComment = await this.usersRepository.postComment(
      Number(movieId),
      user.id,
      payload.text,
    )

    const postedCommentInfo = await this.usersRepository.postedCommentById(
      postedComment.id,
    )

    const formattedComment = {
      comment: postedCommentInfo.comment,
      id: postedCommentInfo.id,
      createdAt: formatDistanceToNow(postedCommentInfo.createdAt, {
        locale: ptBR,
        addSuffix: true,
      }),
      user: {
        name: postedCommentInfo.user.name,
        rating: null,
      },
    }

    return formattedComment
  }

  @Get('comment/:movieId')
  @HttpCode(200)
  async getAllMovieComments(
    @Param('movieId')
    movieId: string,
  ) {
    if (!movieId || !Number(movieId)) {
      throw new BadRequestException('O id do filme deve ser informado.')
    }

    const comments = await this.usersRepository.getAllMovieComments(
      Number(movieId),
    )

    const formattedComments = comments.map((comment) => {
      return {
        comment: comment.comment,
        id: comment.id,
        createdAt: formatDistanceToNow(comment.createdAt, {
          locale: ptBR,
          addSuffix: true,
        }),
        user: {
          name: comment.user.name,
          rating: null,
        },
      }
    })

    return formattedComments
  }
}
