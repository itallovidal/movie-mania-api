import { Module } from '@nestjs/common'
import { UsersModule } from './infra/modules/users.module'
import { MoviesModule } from './infra/modules/movies.module'

@Module({
  imports: [UsersModule, MoviesModule],
})
export class AppModule {}
