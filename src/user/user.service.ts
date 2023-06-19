import { BadRequestException, HttpException, HttpStatus, Injectable, UsePipes } from '@nestjs/common';
import { Prisma, Status, User, Roles } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../database/prisma.service';
import { generateResponseMessage } from '../helpers/createResObject';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    this.prismaService.onModuleInit()
    try {
      const newUser: User = await this.prismaService.user.create({
        data
      })

      return newUser;
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        const targets : string[] = Array.isArray(error.meta?.target)? error.meta?.target : []
        
        throw new BadRequestException(generateResponseMessage({
          message: `user with such data has already exist`,
          additionalInfo: { duplicateProperty: targets }
        }))
      }
      
      console.log(error)

      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }
  }

  async findAll(): Promise<User[]> {
    this.prismaService.onModuleInit()
    try {
      const allUsers: User[] = await this.prismaService.user.findMany({})
      
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
      const user: User | null = await this.prismaService.user.findFirst({ where: { id } })
      
      if(!user){
        throw new BadRequestException(generateResponseMessage({message: `there is no user with id: ${id}`}))
      }

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

  async findBy(params: Partial<Prisma.UserCreateInput>): Promise<User> {
    this.prismaService.onModuleInit()
    try {
      const user: User | null = await this.prismaService.user.findFirst({ where: params })

      if(!user){
        throw new BadRequestException(generateResponseMessage({message: `there is no user with data: ${params}`}))
      }

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


  async updateProperty(id: number, data: Partial<User>): Promise<User> {
    this.prismaService.onModuleInit()

    try {
      const updatedUser: User | null = await this.prismaService.user.update({
        where: { id },
        data
      })

      if(!updatedUser){
        throw new BadRequestException(generateResponseMessage({message: `there is no user with id: ${id}`}))
      }

      return updatedUser
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }

  }

  async remove(id: number): Promise<User> {
    this.prismaService.onModuleInit()
    try {
      const deletedUser = await this.prismaService.user.delete({
        where: { id }
      })

      if(!deletedUser){
        throw new BadRequestException(generateResponseMessage({message: `there is no user with id: ${id}`}))
      }

      return deletedUser

    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Failed to delete the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }
  }

  async saveVerificationKey(id: number, verificationKey: string, timestamp: string): Promise<User> {
    this.prismaService.onModuleInit()
    try {
      const updateUser: User = await this.prismaService.user.update({
        where: { id },
        data: {
          verification_key: verificationKey,
          verification_timestamp: timestamp
        }
      })

      if(!updateUser) {
        throw new BadRequestException(generateResponseMessage({message: `there is no user with id: ${id}`}))
      }

      return updateUser

    } catch (error) {
      throw new HttpException(
        'Failed to update the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.prismaService.onModuleDestroy()
    }
  }


}
