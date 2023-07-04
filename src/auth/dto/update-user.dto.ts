import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { Roles, Status, User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/swagger"; 


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(30)
    email?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(30)
    login?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    hash?: string;

    @ApiProperty()
    @IsOptional()
    verification_key?: string
    
    @ApiProperty()
    @IsOptional()
    verification_timestamp?: string
    
    @ApiProperty()
    @IsOptional()
    role?: Roles
    
    @ApiProperty()
    @IsOptional()
    status?: Status
    
    @ApiProperty()
    @IsOptional()
    isConfirmedChangePassword?: boolean
}