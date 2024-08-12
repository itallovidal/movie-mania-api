import { Module } from '@nestjs/common'
import { UserModule } from './infra/modules/user.module'
import { MovieModule } from './infra/modules/movie.module'
import { ListModule } from './infra/modules/list.module'

@Module({
  imports: [UserModule, MovieModule, ListModule],
})
export class AppModule {}
