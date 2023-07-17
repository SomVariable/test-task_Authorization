import { JwtHelperModule } from './../jwt-helper/jwt-helper.module';
import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { DatabaseModule } from '../database/database.module';
import { ChannelProfileModule } from '../channel-profile/channel-profile.module';
import { UserPostModule } from '../user-post/user-post.module';

@Module({
  imports: [DatabaseModule, JwtHelperModule, ChannelProfileModule, UserPostModule],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService]
})
export class ChannelModule {}
