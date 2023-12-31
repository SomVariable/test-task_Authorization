import { UserPostService } from './../user-post/user-post.service';
import { JwtHelperService } from './../jwt-helper/jwt-helper.service';
import { ChannelProfileService } from './../channel-profile/channel-profile.service';
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Headers, 
  ParseIntPipe, 
  UseGuards, 
  UseInterceptors } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt.guard';
import { ChannelInterceptor } from './interceptors/channel.interceptor';
import { UserParam } from 'src/decorators/param-user.decorator';
import { jwtType } from '../jwt-helper/types/jwt-helper.types';


@ApiTags("channel")
@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@UseInterceptors(ChannelInterceptor)
@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly channelProfileService: ChannelProfileService,
    private readonly jwtHelperService: JwtHelperService,
    private readonly userPostService: UserPostService) { }

  @Post()
  async create(
    @Body() createChannelDto: CreateChannelDto,
    @UserParam() jwtBody: jwtType,
    ) {
    const {sub} = jwtBody
    const channel = await  this.channelService.create(createChannelDto)
    
    const profile = await this.channelProfileService.create({
      channel_id: channel.id,
      user_id: sub
    })

    await this.channelProfileService.update(profile.id, {role: ChannelRole.CREATOR})

    return channel;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateChannelDto: UpdateChannelDto,) {

    return await this.channelService.update(id, updateChannelDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,) {
    return await this.channelService.remove(id);
  }
}

