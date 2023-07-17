import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserFileDto } from './create-user-file.dto';

export class FindUserFileDto extends PickType(CreateUserFileDto, ['user_post_id', "profile_id"]) {}
