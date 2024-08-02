import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { verify, decode } from 'jsonwebtoken'
import { env } from '../../env'

@Injectable()
export class AuthUser implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization

    if (!auth) {
      throw new UnauthorizedException('Token necessário.')
    }

    const token = auth.split('Bearer ')[1]
    console.log('Token Extraído.')

    try {
      verify(token, env.ACCESS_TOKEN_SECRET)
      console.log('Token válido.')

      res.locals.user = decode(token)
      console.log('Usuário fornecido.')
      next()
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException('Token inválido.')
    }
  }
}
