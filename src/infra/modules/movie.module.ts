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

@Module({
  controllers: [MovieController],
  providers: [
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
    consumer.apply(AuthUser).forRoutes({
      path: 'movie/comment/:movieId',
      method: RequestMethod.POST,
    })
  }
}
