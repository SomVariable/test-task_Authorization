import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateChannelProfileDto } from './create-channel-profile.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ChannelRole } from '@prisma/client';

export class UpdateChannelProfileDto extends PickType(CreateChannelProfileDto, []) {
    @ApiProperty()
    @IsEnum(ChannelRole)
    @IsNotEmpty()
    role: ChannelRole
    
}
