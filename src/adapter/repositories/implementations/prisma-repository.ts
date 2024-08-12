import { PrismaClient } from '@prisma/client'
import { IDatabaseRepository } from '../IDatabaseRepository'
import { ISignUpSchema } from '../../schemas/sign-up-schema'
import { hash } from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { IListSchema } from '../../schemas/list-schema'

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

  async createCustomList(newList: IListSchema): Promise<IList> {
    return (await this.prisma.list.create({
      data: {
        name: newList.name,
      },
    })) as unknown as IList
  }

  async getCustomListById(id: number): Promise<IList> {
    return (await this.prisma.list.findUnique({
      where: {
        id,
      },
    })) as unknown as IList
  }

  async addMovieToCustomList(
    movieId: number,
    listId: number,
    userId: number,
  ): Promise<IUserList> {
    return (await this.prisma.userList.create({
      data: {
        movieId,
        listId,
        userId,
      },
      include: {
        list: true,
      },
    })) as unknown as IUserList
  }

  async removeMovieFromList(movieId: number, listId: number, userId: number) {
    const deleted = await this.prisma.userList.deleteMany({
      where: {
        movieId,
        listId,
        userId,
      },
    })

    return deleted as { count: number }
  }

  async getListsByUserId(userId: number): Promise<IListSummaryDTO[]> {
    const response = (await this.prisma.userList.findMany({
      select: {
        list: true,
      },
      where: {
        userId,
      },
    })) as { list: IListSummaryDTO }[]

    return response.map((list) => list.list)
  }

  async getAllMoviesFromUserList(
    listId: number,
  ): Promise<IGetAllMoviesFromUserListDTO[]> {
    const lists = await this.prisma.userList.findMany({
      where: {
        listId,
      },
      select: {
        movieId: true,
        list: true,
      },
    })

    return lists as IGetAllMoviesFromUserListDTO[]
  }

  async rateMovie(movieId: number, userId: number, rate: number) {
    const created = await this.prisma.rating.create({
      data: {
        movieId,
        rating: rate,
        userId,
      },
    })

    return created
  }
}
