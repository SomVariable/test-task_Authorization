import { Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, UserProfile } from '@prisma/client';
import { FindUserProfileDto } from './dto/find-user-profile.dto';

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
      where: {userId}
    })

    return profile
  }

  async update(id: number, data: Prisma.UserProfileUpdateInput) {
    const newProfile = await this.prismaService.userProfile.update({
      where: {id},
      data
    })

    return newProfile
  }

}
