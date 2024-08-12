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

@Controller('/movie')
export class MovieController {
  constructor(
    @Inject(ISDatabaseRepository)
    private databaseRepository: IDatabaseRepository,
    @Inject(ISMoviesRepository) private moviesRepository: IMoviesRepository,
  ) {}

  @Get('/discover')
  async getRandomMovies(): Promise<IGetMoviesByGenreResponse> {
    const movies = await this.moviesRepository.getRandomMovies()
    const { genres } = await this.moviesRepository.getAllGenres()
    const randomMovies = formatMovies(genres, movies)

    return {
      movies: randomMovies,
    }
  }

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

    console.log('usuário:')
    console.log(user)

    const { genres } = await this.moviesRepository.getAllGenres()
    const genreId = Number(id)

    const isValid = genres.some((genre) => genre.id === genreId)

    if (!isValid) {
      throw new BadRequestException('O id do gênero fornecido não é válido.')
    }

    const unformattedMovies =
      await this.moviesRepository.getRandomMoviesByGenre(genreId)

    if (!user.id) {
      const randomMovies = formatMovies(genres, unformattedMovies)
      return {
        movies: randomMovies,
      }
    }

    const movies: IMovieDTO[] = []
    for await (const movie of unformattedMovies.results) {
      const listMovieAppears = await this.databaseRepository.getListByMovieId(
        movie.id,
        user.id,
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

    return {
      movies,
    }
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

    const formattedComment = {
      id: postedCommentInfo.id,
      created_at: formatDistanceToNow(postedCommentInfo.createdAt, {
        locale: ptBR,
        addSuffix: true,
      }),
      comment: postedCommentInfo.comment,
      user: {
        rating: null,
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

    const formattedComments = comments.map((comment) => {
      return {
        comment: comment.comment,
        id: comment.id,
        created_at: formatDistanceToNow(comment.createdAt, {
          locale: ptBR,
          addSuffix: true,
        }),
        user: {
          name: comment.user.name,
          rating: null,
        },
      }
    })

    return {
      comments: formattedComments,
    }
  }
}
