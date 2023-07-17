import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserPostDto } from './create-user-post.dto';

export class UpdateUserPostDto extends PickType(CreateUserPostDto, ["message", "files"]) {

}
