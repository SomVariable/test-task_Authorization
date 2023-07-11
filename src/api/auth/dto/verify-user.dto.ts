import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class VerifyUser  {
    @ApiProperty()
    @IsString()
    verifyCode: string;
    
    @ApiProperty()
    @IsString()
    @IsEmail()
    @MinLength(4)
    @MaxLength(30)
    email: string;
}