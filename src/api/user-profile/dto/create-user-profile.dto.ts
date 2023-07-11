import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateUserProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(30)
    login: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    userId: number;
}
