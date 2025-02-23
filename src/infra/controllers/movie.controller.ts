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
import { ZodValidationPipe } from '../zod-validation-pipe'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  IPostCommentSchema,
  postCommentSchema,
} from '../../adapter/schemas/post-comment-schema'
import {
  IRateMovieSchema,
  rateMovieSchema,
} from '../../adapter/schemas/rating-schema'
import { FormatMovieService } from '../services/format-movie.service'

@Controller('/movie')
export class MovieController {
  constructor(
    @Inject(ISDatabaseRepository)
    private databaseRepository: IDatabaseRepository,
    @Inject(ISMoviesRepository) private moviesRepository: IMoviesRepository,
    @Inject(FormatMovieService) private formatMovieService: FormatMovieService,
  ) {}

  @Get('/genres')
  async getMovieGenres(): Promise<IGetGenreListResponse> {
    const { genres } = await this.moviesRepository.getAllGenres()

    return {
      genreList: genres,
    }
  }

  @Post('rating/:movieId')
  async postRating(
    @Param('movieId') movieId: string,
    @Response({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(rateMovieSchema)) payload: IRateMovieSchema,
  ): Promise<IRateMovieResponse> {
    if (!movieId || !Number(movieId)) {
      throw new BadRequestException('O id do filme deve ser informado.')
    }

    const user = res['locals'].user as IUserDTO

    if (!user) {
      throw new BadRequestException('Token inexistente ou inválido.')
    }

    const createdRegistry = await this.databaseRepository.rateMovie(
      Number(movieId),
      user.id,
      payload.rating,
    )

    return {
      created: createdRegistry,
    }
  }

  @Get('rating/:movieId')
  async getUserRating(
    @Param('movieId') movieId: string,
    @Response({ passthrough: true }) res: Response,
  ) {
    if (!movieId || !Number(movieId)) {
      throw new BadRequestException('O id do filme deve ser informado.')
    }

    const user = res['locals'].user as IUserDTO

    if (!user) {
      throw new BadRequestException('Token inexistente ou inválido.')
    }

    const rating = await this.databaseRepository.getMovieRating(
      Number(movieId),
      user.id,
    )

    return {
      rating,
    }
  }

  @Get('random/:id')
  async getRandomMoviesByGenre(
    @Param('id') id: string,
    @Response({ passthrough: true }) res: Response,
  ): Promise<IGetMoviesByGenreResponse> {
    if (!id || !Number(id)) {
      throw new BadRequestException('O id do gênero deve ser informado.')
    }

    const user = res['locals'].user as { id: number | null }

    const { genres } = await this.moviesRepository.getAllGenres()
    const genreId = Number(id)

    const isValid = genres.some((genre) => genre.id === genreId)

    if (!isValid) {
      throw new BadRequestException('O id do gênero fornecido não é válido.')
    }

    const unformattedMovies =
      await this.moviesRepository.getRandomMoviesByGenre(genreId)

    if (!user.id) {
      const randomMovies =
        await this.formatMovieService.formatMovieGenres(unformattedMovies)
      return {
        movies: randomMovies,
      }
    }

    const movies = await this.formatMovieService.formatMovieLists(
      unformattedMovies.results,
      user.id,
    )

    return {
      movies,
    }
  }

  @Get('search/:title')
  async searchMovieByTitle(
    @Response({ passthrough: true }) res: Response,
    @Param('title') title: string,
  ) {
    if (!title) {
      throw new BadRequestException('O título do filme deve ser informado.')
    }

    const user = res['locals'].user as { id: number | null }

    const unformattedMovies = await this.moviesRepository.searchMovie(title)

    if (!user.id) {
      const randomMovies =
        this.formatMovieService.formatMovieGenres(unformattedMovies)
      return {
        movies: randomMovies,
      }
    }

    const movies = await this.formatMovieService.formatMovieLists(
      unformattedMovies.results,
      user.id,
    )

    return {
      movies,
    }
  }

  @Post('comment/:movieId')
  @HttpCode(201)
  async postComment(
    @Body(new ZodValidationPipe(postCommentSchema)) payload: IPostCommentSchema,
    @Param('movieId')
    movieId: string,
    @Response({ passthrough: true }) res: Response,
  ): Promise<IPostCommentResponse> {
    const user = res['locals'].user as IUserDTO

    if (!user) {
      throw new BadRequestException('Token inexistente ou inválido.')
    }

    if (!movieId || !Number(movieId)) {
      throw new BadRequestException('O id do filme deve ser informado.')
    }

    const postedComment = await this.databaseRepository.postComment(
      Number(movieId),
      user.id,
      payload.text,
    )

    const postedCommentInfo = await this.databaseRepository.postedCommentById(
      postedComment.id,
    )

    const rating = await this.databaseRepository.getMovieRating(
      Number(movieId),
      postedCommentInfo.user.id,
    )

    const formattedComment = {
      id: postedCommentInfo.id,
      created_at: formatDistanceToNow(postedCommentInfo.createdAt, {
        locale: ptBR,
        addSuffix: true,
      }),
      comment: postedCommentInfo.comment,
      user: {
        rating: rating.rating,
        name: postedCommentInfo.user.name,
      },
    }

    return {
      commentCreated: formattedComment,
    }
  }

  @Get('comment/:movieId')
  @HttpCode(200)
  async getAllMovieComments(
    @Param('movieId')
    movieId: string,
  ): Promise<IGetMovieCommentsResponse> {
    if (!movieId || !Number(movieId)) {
      throw new BadRequestException('O id do filme deve ser informado.')
    }

    const comments = await this.databaseRepository.getAllMovieComments(
      Number(movieId),
    )

    const formattedComments: ICommentDTO[] = []

    for await (const comment of comments) {
      const rating = await this.databaseRepository.getMovieRating(
        Number(movieId),
        comment.user.id,
      )
      const formattedComment = {
        comment: comment.comment,
        id: comment.id,
        created_at: formatDistanceToNow(comment.createdAt, {
          locale: ptBR,
          addSuffix: true,
        }),
        user: {
          name: comment.user.name,
          rating: rating.rating,
        },
      }

      formattedComments.push(formattedComment)
    }

    return {
      comments: formattedComments,
    }
  }
}
