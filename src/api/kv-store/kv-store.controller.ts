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

@ApiTags("kv-store")
@UseInterceptors(KVStoreInterceptor)
@Controller('kv-store')
export class KvStoreController {
  constructor(private readonly kvStoreService: KvStoreService) {}
  
  @Post('session')
  async createSession(@Body() data){
    return this.kvStoreService.createSession(data)
  }
  @Get('session/:id')
  async getSession(@Param() data){
    return this.kvStoreService.getSession(data)
  }

  @Patch('session/verification')
  async setVerificationProps(@Body() data){
    return this.kvStoreService.setVerificationProps(data)
  }
  @Delete('session/:id')
  async deleteSession(@Param() data){
    return this.kvStoreService.deleteSession(data)
  }

}
