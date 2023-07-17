import { ApiProperty } from "@nestjs/swagger"
import { ChannelRole } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator"

export class CreateChannelProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    channel_id: number
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    user_id: number  
}
