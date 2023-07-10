import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { redisConfig } from 'src/config/redis.config';
import { CreateSession, SetJWTProps, SetVerificationProps, Session } from 'kv-types';
import { firstValueFrom } from 'rxjs';
import { generateResponseMessage } from 'src/helpers/create-res-object';

@Injectable()
export class KvStoreService {
    private client: ClientProxy;


    constructor() { 
        this.client = ClientProxyFactory.create(redisConfig);
    }

    async createSession(data: CreateSession){
        try {
            return await firstValueFrom(this.client.send<string, CreateSession>('save-session', data))

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }

    async setJwtProps(data: SetJWTProps){
        try {
            return await firstValueFrom(this.client.send<string, SetJWTProps>('update-session', data))

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }

    async setVerificationProps(data: SetVerificationProps){
        console.log('we are in setVerProps ', data)
        try {
            return await firstValueFrom(this.client.send<string, SetVerificationProps>('update-session', data))

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }

    async getSession(data: CreateSession): Promise<Session>{
        return await firstValueFrom(this.client.send('get-session', data)) as Session;
    }

    async deleteSession(data: CreateSession){
        try {
            return await firstValueFrom(this.client.send<string, CreateSession>('remove-session', data))

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }
}
