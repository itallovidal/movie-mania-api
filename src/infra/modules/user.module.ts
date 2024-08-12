import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ISDatabaseRepository } from '../../adapter/repositories/IDatabaseRepository'
import { UserController } from '../controllers/user.controller'
import { PrismaRepository } from '../../adapter/repositories/implementations/prisma-repository'
import { AuthUser } from '../auth.middleware'
import { ISMoviesRepository } from '../../adapter/repositories/IMoviesRepository'
import { TMDBRepository } from '../../adapter/repositories/implementations/tmdb-repository'

@Module({
  controllers: [UserController],
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
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUser).forRoutes({
      path: 'user/profile',
      method: RequestMethod.GET,
    })
  }
}
