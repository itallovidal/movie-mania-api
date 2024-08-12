import {
  BadRequestException,
  Body,
  Controller,
  Inject,
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
