import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsEnum } from "class-validator";
import { StrongPassword } from "../decorators/strong-password.decorator";

export class CreateUserDto{
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(30)
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(30)
    login: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    @StrongPassword()
    password: string;

    
}
