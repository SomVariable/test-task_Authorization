import { IsJWT, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateSessionDto  {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsString()
    @IsJWT()
    jwtToken?: string
    
    @IsOptional()
    @IsString()
    @IsJWT()
    refreshToken?: string

    @IsOptional()
    @IsString()
    verificationTimestamp?: string
    
    @IsOptional()
    @IsString()
    verificationKey?: string
}