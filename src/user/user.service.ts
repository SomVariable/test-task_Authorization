import { BadRequestException, HttpException, HttpStatus, Injectable, UsePipes } from '@nestjs/common';
import { Prisma, Status, User, Roles } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../database/prisma.service';
import { generateResponseMessage } from '../helpers/create-res-object';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { redisConfig } from 'src/config/redis.config';
import { SaveTokenDto } from './dto/save-token.dto';
import { CreateSession, CloseSession, SetJWTProps, SetVerificationProps } from 'kv-types';



@Injectable()
export class UserService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {

    const newUser: User = await this.prismaService.user.create({
        data
      })

    return newUser

  }

  async findAll(): Promise<User[]> {
    const user: User[] = await this.prismaService.user.findMany({})

    return user
  }

  async findBy(params: UpdateUserDto): Promise<User> {
    const user: User = await this.prismaService.user.findFirst({ where: params })

    return user
  }
  
  
  async findById(id: number): Promise<User> {
    const user: User = await this.prismaService.user.findFirst({ where: {id} })

    return user
  }

  async updateProperty(id: number, data: UpdateUserDto): Promise<User> {
    const updatedUser: User  = await this.prismaService.user.update({
        where: { id },
        data
      })

    return updatedUser

  }

  async remove(id: number): Promise<User> {
    const deletedUser: User = await this.prismaService.user.delete({
        where: { id }
      })

    return deletedUser
  }

  async saveVerificationKey(id: number, verificationKey: string, timestamp: string): Promise<User> {
    const updateUser: User = await this.prismaService.user.update({
        where: { id },
        data: {
          verification_key: verificationKey,
          verification_timestamp: timestamp
        }
      })

    return updateUser
  }

}
