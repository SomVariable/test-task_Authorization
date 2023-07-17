import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(30)
    login: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    birth_date?: string;
}
