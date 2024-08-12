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
import { AuthUser } from '../auth.middleware'
import { ListController } from '../controllers/list.controller'

@Module({
  controllers: [ListController],
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
export class ListModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUser).forRoutes({
      path: 'list/*',
      method: RequestMethod.ALL,
    })
  }
}
