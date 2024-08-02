import { Module } from '@nestjs/common'
import { ISUsersRepository } from '../../adapter/repositories/IUsersRepository'
import { PrismaUsersRepository } from '../../adapter/repositories/implementations/prisma-users-repository'
import { ISMoviesRepository } from '../../adapter/repositories/IMoviesRepository'
import { TMDBRepository } from '../../adapter/repositories/implementations/tmdb-repository'
import { MoviesController } from '../controllers/movies.controller'

@Module({
  controllers: [MoviesController],
  providers: [
    {
      provide: ISUsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: ISMoviesRepository,
      useClass: TMDBRepository,
    },
  ],
})
export class MoviesModule {}
