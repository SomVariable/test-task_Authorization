import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateChannelDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(3, 15)
    name: string;
}
