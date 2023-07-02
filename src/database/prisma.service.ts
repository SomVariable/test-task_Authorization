import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { generateResponseMessage } from 'src/helpers/createResObject';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async runUserQuery(callback): Promise<User | User[]> {
        this.onModuleInit()
          try {
            const data: User | User[] = await callback()

            if(!data) throw new BadRequestException()

            return data;
          } catch (error) {
            if(error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
              const targets : string[] = Array.isArray(error.meta?.target)? error.meta?.target : []
              
              throw new BadRequestException(generateResponseMessage({
                message: `user with such data has already exist`,
                additionalInfo: { duplicateProperty: targets }
              }))
            }
            
            if(error?.status === 400){
              throw error
            }
      
            throw new HttpException(
              'Server error',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          } finally {
            this.onModuleDestroy()
          }
      }


    async processUser(callback): Promise<User> { 
        const data: User | User[] = await this.runUserQuery(callback)
        
        if(Array.isArray(data)){
            throw new HttpException(
                'Server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
        }

        return data
    }

    async processUsers(callback): Promise<User[]> { 
        const data: User | User[] = await this.runUserQuery(callback)
        
        if(!Array.isArray(data)){
            throw new HttpException(
                'Server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
        }

        return data
    }

    async enableShutdownHooks(app: INestApplication){
        this.$on('beforeExit', async () => {
            await app.close();
          });
    }
}
