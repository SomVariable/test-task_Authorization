import { 
  Controller, 
  Post, 
  Patch, 
  Delete, 
  Get, 
  Param,
  Body } from '@nestjs/common';
import { KvStoreService } from './kv-store.service';

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
