import { IsString, IsNotEmpty, IsJWT } from "class-validator"

export class SaveTokenDto {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    @IsString()
    @IsJWT()
    jwtToken: string
    
    @IsNotEmpty()
    @IsString()
    @IsJWT()
    refreshToken: string
}
