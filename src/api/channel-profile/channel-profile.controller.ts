import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelProfileService } from './channel-profile.service';
import { CreateChannelProfileDto } from './dto/create-channel-profile.dto';
import { UpdateChannelProfileDto } from './dto/update-channel-profile.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("channel-profile")
@Controller('channel-profile')
export class ChannelProfileController {
  constructor(private readonly channelProfileService: ChannelProfileService) {}

  @Post()
  create(@Body() createChannelProfileDto: CreateChannelProfileDto) {
    return this.channelProfileService.create(createChannelProfileDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelProfileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelProfileDto: UpdateChannelProfileDto) {
    return this.channelProfileService.update(+id, updateChannelProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelProfileService.remove(+id);
  }
}
