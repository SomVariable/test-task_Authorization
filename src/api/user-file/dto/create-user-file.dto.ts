import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserFileDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    user_id: number;
    
    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    user_post_id?: number;
    
    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    profile_id?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    original_name: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    size: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    mimetype: string
}
