import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID} from "class-validator";

export class FindUserProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    userId: number;
}
