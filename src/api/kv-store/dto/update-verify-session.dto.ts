import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsJWT, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateVerifyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    verificationTimestamp?: string
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    verificationKey?: string
}