import { PrismaClient } from '@prisma/client'
import { IDatabaseRepository } from '../IDatabaseRepository'
import { ISignUpSchema } from '../../schemas/sign-up-schema'
import { IUser } from '../../../domain/IUser'
import { hash } from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { IComment } from '../../../domain/IComment'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

@Injectable()
export class PrismaRepository
  extends PrismaClient
  implements IDatabaseRepository
{
  private prisma: PrismaClient

  constructor() {
    super()
    this.prisma = new PrismaClient()
  }

  async signUp(data: ISignUpSchema): Promise<IUser> {
    const { favoriteGenre1, favoriteGenre2, password } = data
    const encryptedPassword = await hash(password, 5)
    return (await this.prisma.user.create({
      data: {
        email: data.email,
        password: encryptedPassword,
        name: data.username,
        favoriteGenre1,
        favoriteGenre2,
      },
    })) as IUser
  }

  async getProfile(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new Error('Usuário não foi encontrado.')
    }

    return user as IUser
  }

  async getUserByEmail(email: string) {
    return (await this.prisma.user.findUnique({
      where: {
        email,
      },
    })) as IUser
  }

  async postComment(
    movieId: number,
    id: number,
    comment: string,
  ): Promise<IComment> {
    return (await this.prisma.comment.create({
      data: {
        comment,
        userID: id,
        movieID: movieId,
      },
    })) as unknown as IComment
  }

  async postedCommentById(id: number) {
    return (await this.prisma.comment.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    })) as unknown as IComment
  }

  async getAllMovieComments(movieId: number): Promise<IComment[]> {
    return (await this.prisma.comment.findMany({
      where: {
        movieID: movieId,
      },
      include: {
        user: true,
      },
    })) as unknown as IComment[]
  }
}
