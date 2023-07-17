import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateUserPostDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(1000)
    message: string

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    files: Express.Multer.File[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    channel_id?: string
}


