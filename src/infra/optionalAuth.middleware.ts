import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { verify, decode } from 'jsonwebtoken'
import { env } from '../../env'

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization

    if (!auth) {
      res.locals.user = {
        id: null,
      }

      next()
      return
    }
    const token = auth.split('Bearer ')[1]
    try {
      verify(token, env.ACCESS_TOKEN_SECRET)
      res.locals.user = decode(token)
      next()
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException('Token inválido.')
    }
  }
}
