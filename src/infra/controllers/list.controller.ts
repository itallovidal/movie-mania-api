import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import {
  handleMovieInListSchema,
  IHandleMovieInListSchema,
} from '../../adapter/schemas/handle-movie-in-list-schema'

@Controller('/list')
export class ListController {
  constructor(
    @Inject(ISDatabaseRepository)
    private databaseRepository: IDatabaseRepository,
    @Inject(ISMoviesRepository) private moviesRepository: IMoviesRepository,
  ) {}

  @Get('/me/:listId')
  async getAllMoviesFromUserList(
    @Param('listId') listId: string,
  ): Promise<IGetCustomMovieListResponse> {
    if (!listId || !Number(listId)) {
      throw new BadRequestException('O id da lista deve ser informado.')
    }

    const query = await this.databaseRepository.getAllMoviesFromUserList(
      Number(listId),
    )

    const movies: IMovieDTO[] = []

    for await (const registry of query) {
      const details = await this.moviesRepository.getMovieByMovieId(
        registry.movieId,
      )

      console.log('detalhes do filme:')
      console.log(details)

      const {
        /* eslint-disable @typescript-eslint/no-unused-vars, camelcase */
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
      } = details

      const formattedDetails = {
        ...rest,
        lists: [],
        backdrop_path: backdrop_path || '',
        rating: {
          average: vote_average,
          ratingsCount: vote_count,
        },
        release_date: release_date.split('-').reverse().join('/'),
      } as IMovieDTO

      movies.push(formattedDetails)
    }

    return {
      movies,
      name: query[0].list.name,
      id: query[0].list.id,
    }
  }

  @Get('/')
  async getUserMovieLists(
    @Response({ passthrough: true }) res: Response,
  ): Promise<IGetUserMovieListsResponse> {
    const user = res['locals'].user as IUserDTO

    if (!user) {
      throw new BadRequestException('Token inexistente ou inválido.')
    }

    const lists = await this.databaseRepository.getListsByUserId(user.id)

    return {
      userLists: lists,
    }
  }

  @Post('/movie/add')
  async addMovieToList(
    @Response({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(handleMovieInListSchema))
    payload: IHandleMovieInListSchema,
  ): Promise<IAddMovieToListResponse> {
    const user = res['locals'].user as IUserDTO

    if (!user) {
      throw new BadRequestException('Token inexistente ou inválido.')
    }

    let listToAddMovie

    if (payload.list.id === null) {
      listToAddMovie = await this.databaseRepository.createCustomList(
        payload.list,
      )
    } else {
      listToAddMovie = await this.databaseRepository.getCustomListById(
        payload.list.id,
      )
    }

    const listAdded = await this.databaseRepository.addMovieToCustomList(
      payload.movieId,
      listToAddMovie.id,
      user.id,
    )

    return {
      listAdded: {
        id: listAdded.list.id,
        name: listAdded.list.name,
      },
      movieAdded: payload.movieId,
    }
  }

  @Post('/movie/remove')
  async removeMovieFromList(
    @Response({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(handleMovieInListSchema))
    payload: IHandleMovieInListSchema,
  ): Promise<IRemoveMovieFromListResponse> {
    const user = res['locals'].user as IUserDTO

    if (!user) {
      throw new BadRequestException('Token inexistente ou inválido.')
    }

    if (!payload.list.id) {
      throw new BadRequestException('Id da lista inválido.')
    }

    const deletedRegistryCount =
      await this.databaseRepository.removeMovieFromList(
        payload.movieId,
        payload.list.id,
        user.id,
      )

    console.log(deletedRegistryCount)

    return {
      selectedList: {
        id: payload.list.id,
        name: payload.list.name,
      },
      movieRemoved: payload.movieId,
    }
  }
}
