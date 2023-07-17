import { PartialType, PickType } from '@nestjs/swagger';
import { CreateChannelDto } from './create-channel.dto';

export class UpdateChannelDto extends PickType(CreateChannelDto, ["name"]) {}
