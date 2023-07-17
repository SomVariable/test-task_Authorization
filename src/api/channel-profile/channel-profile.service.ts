import { PrismaService } from './../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateChannelProfileDto } from './dto/create-channel-profile.dto';
import { UpdateChannelProfileDto } from './dto/update-channel-profile.dto';

@Injectable()
export class ChannelProfileService {

  constructor(private readonly prismaService: PrismaService) {}


  async create(data: CreateChannelProfileDto) {
    return await this.prismaService.channelProfile.create({data});
  }

  async findOne(id: number) {
    return await this.prismaService.channelProfile.findFirst({
      where: {id}
    });
  }

  async update(id: number, data: UpdateChannelProfileDto) {
    console.log('updated ', data)
    return await this.prismaService.channelProfile.update({
      data,
      where: {id}
    });
  }

  async remove(id: number) {
    return await this.prismaService.channelProfile.delete({
      where: {id}
    });
  }
}
