import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ISDatabaseRepository } from '../../adapter/repositories/IDatabaseRepository'
import { PrismaRepository } from '../../adapter/repositories/implementations/prisma-repository'
import { ISMoviesRepository } from '../../adapter/repositories/IMoviesRepository'
import { TMDBRepository } from '../../adapter/repositories/implementations/tmdb-repository'
import { MovieController } from '../controllers/movie.controller'
import { AuthUser } from '../auth.middleware'
import { OptionalAuthMiddleware } from '../optionalAuth.middleware'
import { FormatMovieService } from '../services/format-movie.service'

@Module({
  controllers: [MovieController],
  providers: [
    FormatMovieService,
    {
      provide: ISDatabaseRepository,
      useClass: PrismaRepository,
    },
    {
      provide: ISMoviesRepository,
      useClass: TMDBRepository,
    },
  ],
})
export class MovieModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUser).forRoutes(
      {
        path: 'movie/comment/:movieId',
        method: RequestMethod.POST,
      },
      {
        path: 'movie/rating/:movieId',
        method: RequestMethod.ALL,
      },
    )
    consumer.apply(OptionalAuthMiddleware).forRoutes(
      {
        path: 'movie/random/:id',
        method: RequestMethod.GET,
      },
      {
        path: 'movie/search/:title',
        method: RequestMethod.GET,
      },
    )
  }
}
