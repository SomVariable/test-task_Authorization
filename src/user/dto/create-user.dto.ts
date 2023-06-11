import { ApiProperty } from "@nestjs/swagger";
import { Roles } from "@prisma/client";
import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsEnum } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    login: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' },
    )
    password: string;
    
    @ApiProperty()
    @IsEnum(Roles)
    role: Roles;
}
