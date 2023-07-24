import { JwtHelperService } from './../jwt-helper/jwt-helper.service';
import { 
  ParseIntPipe, 
  ForbiddenException, 
  BadRequestException, 
  Headers, 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  UseInterceptors } from '@nestjs/common';
import { ChannelProfileService } from './channel-profile.service';
import { CreateChannelProfileDto } from './dto/create-channel-profile.dto';
import { UpdateChannelProfileDto } from './dto/update-channel-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt.guard';
import { ChannelRole } from '@prisma/client';
import { FORBIDDEN_MESSAGE } from './constants/channel-profile.constants';
import { ChannelProfileInterceptor } from './interceptors/channel-profile.interceptor';
import { UserParam } from 'src/decorators/param-user.decorator';
import { jwtType } from '../jwt-helper/types/jwt-helper.types';

@ApiTags("channel-profile")
@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@UseInterceptors(ChannelProfileInterceptor)
@Controller('channel-profile')
export class ChannelProfileController {
  constructor(
    private readonly channelProfileService: ChannelProfileService,
    private readonly jwtHelperService: JwtHelperService) {}

  @Post()
  subscribe(@Body() createChannelProfileDto: CreateChannelProfileDto) {
    return this.channelProfileService.create(createChannelProfileDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelProfileService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelProfileDto: UpdateChannelProfileDto) {
    return this.channelProfileService.update(+id, updateChannelProfileDto);
  }

  @Patch('/permission/:id')
  async updatePermission(
    @UserParam() jwtBody: jwtType,
    @Body() body: UpdateChannelProfileDto,
    @Param('id', ParseIntPipe) id: number){
    const {sub} = jwtBody
    const userProfile = await this.channelProfileService.findById(id)
    const {channel_id} = userProfile
    const adminProfile = await this.channelProfileService.findBy({user_id: sub, channel_id: channel_id})
    const {role} = adminProfile

    if(role !== ChannelRole.ADMIN && role !== ChannelRole.CREATOR){
      throw new ForbiddenException(FORBIDDEN_MESSAGE)
    }

    if(body.role === ChannelRole.CREATOR){
      throw new BadRequestException()
    }

    return this.channelProfileService.update(id, body)
  }

  @Delete(':id')
  unsubscribe(@Param('id') id: string) {
    return this.channelProfileService.remove(+id);
  }
}
