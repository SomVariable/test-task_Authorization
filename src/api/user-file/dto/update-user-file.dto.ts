import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserFileDto } from './create-user-file.dto';

export class UpdateUserFileDto extends PickType(CreateUserFileDto, ['original_name']) {}
