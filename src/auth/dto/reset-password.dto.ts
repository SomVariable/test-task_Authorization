import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { StrongPassword } from "../decorators/strong-password.decorator";

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @StrongPassword()
    password: string;
  }