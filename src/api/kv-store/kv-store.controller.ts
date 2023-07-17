import { 
  Controller, 
  Post, 
  Patch, 
  Delete, 
  Get, 
  Param,
  Body, 
  UseInterceptors} from '@nestjs/common';
import { KvStoreService } from './kv-store.service';
import { KVStoreInterceptor } from './interceptors/auth.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { SaveSessionDto } from './dto/save-session.dto';
import { SetVerificationProps } from './kv-types/kv-store.type';
import { UpdateVerifyDto } from './dto/update-verify-session.dto';

@ApiTags("kv-store")
@UseInterceptors(KVStoreInterceptor)
@Controller('kv-store')
export class KvStoreController {
  constructor(private readonly kvStoreService: KvStoreService) {}
  
  @Post('session')
  async createSession(@Body() data: SaveSessionDto){
    return await this.kvStoreService.createSession(data)
  }
  @Get('session/:id')
  async getSession(@Param() data: SaveSessionDto){
    return await this.kvStoreService.getSession(data)
  }

  @Patch('session/verification')
  async setVerificationProps(@Body() data: UpdateVerifyDto){
    return await this.kvStoreService.setVerificationProps(data)
  }
  
  @Patch('session/block')
  async blockSession(@Body() data: SaveSessionDto){
    return await this.kvStoreService.blockSession(data)
  }

  @Patch('session/active')
  async activeSession(@Body() data: SaveSessionDto){
    return await this.kvStoreService.activeSession(data)
  }

  @Delete('session/:id')
  async deleteSession(@Param() data: SaveSessionDto){
    return await this.kvStoreService.deleteSession(data)
  }

}
