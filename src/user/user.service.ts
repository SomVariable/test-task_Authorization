import { HttpException, HttpStatus, Injectable, UsePipes } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create( data: Prisma.UserCreateInput): Promise<User> {
    this.prismaService.onModuleInit()
    try {

      const newUser: User = await this.prismaService.user.create({
        data
      })
      return newUser;

    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }

  }

  async findAll() : Promise<User[]> {
    this.prismaService.onModuleInit()
    try {
      const allUsers = this.prismaService.user.findMany({})

      return allUsers

    } catch (error) {
      throw new HttpException(
        'Failed to get users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }
  }

  async findById(id: number): Promise<User> {
    this.prismaService.onModuleInit()
    try {
      const user = this.prismaService.user.findFirst({where: { id }})

      return user

    } catch (error) {
      throw new HttpException(
        'Failed to get user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }
  }
  
  async findByEmail(email: string): Promise<User> {
    this.prismaService.onModuleInit()
    try {
      const user = this.prismaService.user.findFirst({where: { email }})

      return user

    } catch (error) {
      throw new HttpException(
        'Failed to get user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }
  }

  async changePassword(id: number, hash:  string): Promise<string> {
    this.prismaService.onModuleInit()

    try {
      const updateUser = await this.prismaService.user.update({
        where: { id },
        data: {hash}
      })

      return `user ${updateUser.login} was updated`

    } catch (error) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }

  }

  async remove(id: number) : Promise<string>{
    this.prismaService.onModuleInit()
    try {
      await this.prismaService.user.delete({
        where: { id }
      })
      return `user was deleted`

    } catch (error) {
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }
  }
}
