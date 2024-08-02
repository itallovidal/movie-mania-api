import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ISDatabaseRepository } from '../../adapter/repositories/IDatabaseRepository'
import { UsersController } from '../controllers/users.controller'
import { PrismaRepository } from '../../adapter/repositories/implementations/prisma-repository'
import { AuthUser } from '../auth.middleware'
import { ISMoviesRepository } from '../../adapter/repositories/IMoviesRepository'
import { TMDBRepository } from '../../adapter/repositories/implementations/tmdb-repository'

@Module({
  controllers: [UsersController],
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
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUser).forRoutes({
      path: 'users/profile',
      method: RequestMethod.GET,
    })
  }
}
