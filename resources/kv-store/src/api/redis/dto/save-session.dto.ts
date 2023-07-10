import { IsString, IsNotEmpty, IsJWT } from "class-validator"

export class SaveSessionDto {
    @IsString()
    @IsNotEmpty()
    id: string

}
