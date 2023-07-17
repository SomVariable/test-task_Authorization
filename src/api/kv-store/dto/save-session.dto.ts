import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsJWT } from "class-validator"

export class SaveSessionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string

}
