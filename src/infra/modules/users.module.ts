import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ISUsersRepository } from '../../adapter/repositories/IUsersRepository'
import { UsersController } from '../controllers/users.controller'
import { PrismaUsersRepository } from '../../adapter/repositories/implementations/prisma-users-repository'
import { AuthUser } from '../auth.middleware'
import { ISMoviesRepository } from '../../adapter/repositories/IMoviesRepository'
import { TMDBRepository } from '../../adapter/repositories/implementations/tmdb-repository'

@Module({
  controllers: [UsersController],
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
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUser).forRoutes({
      path: 'users/profile',
      method: RequestMethod.GET,
    })
  }
}
