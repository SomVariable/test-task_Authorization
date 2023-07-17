
import { Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { FindUserProfileDto } from './dto/find-user-profile.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserProfileService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }
  

  async create(data: CreateUserProfileDto) {
    const newProfile = await this.prismaService.userProfile.create({
      data
    })
    
    return newProfile
  }

  async findOne(userId: number) {
    const profile = await this.prismaService.userProfile.findFirst({
      where: {user_id: userId}
    })

    return profile
  }

  async findMany(userIds: number[]) {
    const profiles = await this.prismaService.userProfile.findMany({
      where: {user_id: {
        in: userIds
      }}
    })

    return profiles
  }

  async update(id: number, data: Prisma.UserProfileUpdateInput) {
    const newProfile = await this.prismaService.userProfile.update({
      where: {id},
      data
    })

    return newProfile
  }

}
