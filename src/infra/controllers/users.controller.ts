import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Response,
} from '@nestjs/common'
import {
  ISUsersRepository,
  IUsersRepository,
} from '../../adapter/repositories/IUsersRepository'
import { ZodValidationPipe } from '../zod-validation-pipe'
import {
  ISignUpSchema,
  signUpSchema,
} from '../../adapter/schemas/sign-up-schema'
import { ILoginSchema, loginSchema } from '../../adapter/schemas/login-schema'
import { compare } from 'bcrypt'
import { env } from '../../../env'
import { sign } from 'jsonwebtoken'
import { Request } from 'express'
import { IUserDTO } from '../../domain/userDTO'
import {
  IMoviesRepository,
  ISMoviesRepository,
} from '../../adapter/repositories/IMoviesRepository'

@Controller('/users')
export class UsersController {
  constructor(
    @Inject(ISUsersRepository) private usersRepository: IUsersRepository,
    @Inject(ISMoviesRepository) private moviesRepository: IMoviesRepository,
  ) {}

  @Get('/profile')
  async getProfile(@Response({ passthrough: true }) res: Request) {
    const user = res['locals'].user as IUserDTO

    if (!user) {
      throw new BadRequestException('Token inexistente ou inválido.')
    }

    const profile = await this.usersRepository.getProfile(user.id)
    const { genres } = await this.moviesRepository.getAllGenres()

    const userGenres = genres.filter(
      (genre) =>
        genre.id === profile.favoriteGenre1 ||
        genre.id === profile.favoriteGenre2,
    )

    return {
      name: profile.name,
      genres: userGenres,
    }
  }

  @Post('/sign-up')
  @HttpCode(201)
  async signUp(
    @Body(new ZodValidationPipe(signUpSchema)) payload: ISignUpSchema,
  ) {
    try {
      return await this.usersRepository.signUp(payload)
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException(
        'Não foi possível criar o usuário.',
      )
    }
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body(new ZodValidationPipe(loginSchema)) payload: ILoginSchema) {
    const user = await this.usersRepository.getUserByEmail(payload.email)

    if (!user) {
      throw new NotFoundException({
        message: 'Email não encontrado no banco de dados.',
        field: 'email',
        status: 404,
        error: 'Not Found',
      })
    }

    const result = await compare(payload.password, user.password)

    if (!result) {
      throw new ForbiddenException({
        message: 'Senha incorreta, tente novamente.',
        field: 'password',
        status: 403,
        error: 'forbidden',
      })
    }

    if (env.ACCESS_TOKEN_SECRET) {
      return {
        token: sign(
          {
            email: user.email,
            id: user.id,
          },
          env.ACCESS_TOKEN_SECRET,
        ),
      }
    }

    throw new InternalServerErrorException()
  }
}
