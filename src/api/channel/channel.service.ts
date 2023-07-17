import { PrismaService } from './../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prismaService: PrismaService
    ) { }

  async create(data: CreateChannelDto) {
    return this.prismaService.channel.create({ data });
  }

  async getChannel(id: number) {
    return await this.prismaService.channel.findFirst({
      where: { id }
    });
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    return await this.prismaService.channel.update({
      data: updateChannelDto,
      where: { id }
    });
  }

  async remove(id: number) {
    return this.prismaService.channel.delete({
      where: {id}
    });
  }
}
