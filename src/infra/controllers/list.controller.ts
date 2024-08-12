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
  addMovieToListSchema,
  IAddMovieToListSchema,
} from '../../adapter/schemas/add-movie-to-list-schema'

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
    @Body(new ZodValidationPipe(addMovieToListSchema))
    payload: IAddMovieToListSchema,
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
}
