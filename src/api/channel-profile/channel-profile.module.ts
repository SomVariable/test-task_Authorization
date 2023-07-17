import { Module } from '@nestjs/common';
import { ChannelProfileService } from './channel-profile.service';
import { ChannelProfileController } from './channel-profile.controller';
import { DatabaseModule } from '../database/database.module';
import { JwtHelperModule } from '../jwt-helper/jwt-helper.module';

@Module({
  imports: [DatabaseModule, JwtHelperModule],
  controllers: [ChannelProfileController],
  providers: [ChannelProfileService],
  exports: [ChannelProfileService]
})
export class ChannelProfileModule {}
