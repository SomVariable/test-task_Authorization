import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString} from "class-validator";

export class FindUserProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;
}
