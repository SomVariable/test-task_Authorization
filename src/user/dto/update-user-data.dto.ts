import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength, MaxLength, Matches, IsEnum,IsOptional } from "class-validator";

export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    login: string;
    
    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' },
    )
    password: string;
    
}
