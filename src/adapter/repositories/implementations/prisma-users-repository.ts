import { PrismaClient } from '@prisma/client'
import { IUsersRepository } from '../IUsersRepository'
import { ISignUpSchema } from '../../schemas/sign-up-schema'
import { IUser } from '../../../domain/IUser'
import { hash } from 'bcrypt'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaUsersRepository
  extends PrismaClient
  implements IUsersRepository
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
}
