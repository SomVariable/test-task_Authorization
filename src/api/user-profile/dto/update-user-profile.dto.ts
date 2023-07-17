import { UserProfile } from '@prisma/client';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserProfileDto } from './create-user-profile.dto';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserProfileDto extends PickType(CreateUserProfileDto, ["login", "birth_date", "city", "country"]) {
    
}
