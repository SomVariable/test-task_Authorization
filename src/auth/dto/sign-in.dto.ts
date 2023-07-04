import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { StrongPassword } from '../decorators/strong-password.decorator';
export class SignInDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(30)
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @StrongPassword()
    password: string;
}
