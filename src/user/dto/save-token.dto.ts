import { IsString, IsNotEmpty, Length } from "class-validator"

export class SaveTokenDto {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    @IsString()
    jwtToken: string
    
    @IsNotEmpty()
    @IsString()
    refreshToken: string
}
