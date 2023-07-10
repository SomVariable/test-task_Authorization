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

    async createSession(data: CreateSession): Promise<Session>{
        try {
            return await firstValueFrom(this.client.send<Session, CreateSession>('save-session', data)) 

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }

    async setJwtProps(data: SetJWTProps): Promise<Session>{
        try {
            return await firstValueFrom(this.client.send<Session, SetJWTProps>('update-session', data))

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }

    async setVerificationProps(data: SetVerificationProps): Promise<Session>{
        try {
            const session: Session = await firstValueFrom(this.client.send<Session, SetVerificationProps>('update-session', data)) as Session
            return session

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }

    async getSession(data: CreateSession): Promise<Session>{
        return await firstValueFrom(this.client.send('get-session', data)) as Session;
    }

    async blockSession(data: CreateSession){
        try {
            return await firstValueFrom(this.client.send<Session, CreateSession>('block-session', data))

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }

    async activeSession(data: CreateSession): Promise<Session>{
        try {
            return await firstValueFrom(this.client.send<Session, CreateSession>('active-session', data))

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }

    async deleteSession(data: CreateSession): Promise<Session>{
        try {
            return await firstValueFrom(this.client.send<Session, CreateSession>('remove-session', data))

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }
}
