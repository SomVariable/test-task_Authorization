import { Controller, UseFilters, ValidationPipe } from '@nestjs/common';
import { RedisService } from './redis.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { RpcValidationFilter } from './exceptions/rpc-validation.filter';
import { SaveSessionDto } from './dto/save-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from 'kv-types';


@UseFilters(new RpcValidationFilter())
@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @MessagePattern('save-session')
  async saveSession(@Payload(new ValidationPipe({ whitelist: true })) {id}: SaveSessionDto) : Promise<Session> {
    console.log('save-session ', id)
    return this.redisService.saveSession(id); 
  }
  
  @MessagePattern('get-session')
  async getSession(@Payload(new ValidationPipe({ whitelist: true })) {id}: SaveSessionDto) : Promise<Session>{
    console.log('get-session ', id)
    return this.redisService.getSession(id); 
  }
  
  @MessagePattern('remove-session')
  async removeSession(@Payload(new ValidationPipe({ whitelist: true })) {id}: SaveSessionDto) : Promise<boolean> {
    console.log('remove-session ', id)
    return this.redisService.removeSession(id); 
  }


  @MessagePattern('update-session')
  async updateSession(@Payload(new ValidationPipe({ whitelist: true })) data: UpdateSessionDto) : Promise<Session> {
    console.log('updateSession ', data)

    return this.redisService.updateSession(data); 
  }

  @MessagePattern('block-session')
  async blockSession(@Payload(new ValidationPipe({ whitelist: true })) data: SaveSessionDto) : Promise<Session> {
    console.log('block-session ', data)

    return this.redisService.blockSession(data); 
  }

  @MessagePattern('active-session')
  async activeSession(@Payload(new ValidationPipe({ whitelist: true })) data: SaveSessionDto) : Promise<Session> {
    console.log('activeSession ', data)

    return this.redisService.activeSession(data); 
  }

}
