import { HttpException, Inject, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { redisConfig } from 'src/config/redis.config';
import { CreateSession, SetVerificationProps, Session } from './kv-types/kv-store.type';
import { firstValueFrom } from 'rxjs';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateVerifyDto } from './dto/update-verify-session.dto';
import { MISSING_SESSION_MESSAGE } from './consts/kv-store.consts';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class KvStoreService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async createSession({id}: CreateSession): Promise<Session>{
        try {
        
            const session: Session = {
                id,
                verificationKey: null,
                verificationTimestamp: null,
                status: 'ACTIVE'
            }
            
            await this.cacheManager.set(id, JSON.stringify(session));
            const sessionJSON: string = await this.cacheManager.get(id)
            const newSession: Session = await JSON.parse(sessionJSON)
            return newSession
        } catch (error) {
            console.log(error)
        }
        
    }

    async setVerificationProps(data: UpdateVerifyDto): Promise<Session>{
        try {
            const session: Session = await this.updateSession(data)
            
            return session

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }


    async updateSession({id, ...data}: UpdateSessionDto): Promise<Session | null>{
        const session: Session = await JSON.parse(await this.cacheManager.get(id));
        console.log('session ', session)
        if(!session){
            return null
        }

        const updateObject = JSON.stringify({...session, ...data})
        
        await this.cacheManager.set(id, updateObject)
        
        const isUpdated = await this.cacheManager.get(id)

        if(isUpdated) {
            const updatedSession: Session = await JSON.parse(await this.cacheManager.get(id))
            
            return updatedSession
        }

        return null
    }

    async getSession({id}: CreateSession){
        const sessionJson: string = await this.cacheManager.get(id)
        const session: Session = JSON.parse(sessionJson)
        console.log(session)
        return session
    }


    async blockSession({id}: CreateSession){
        const session: Session = await JSON.parse(await this.cacheManager.get(id));

        if(!session || session.status === "BLOCKED"){
            return null
        }

        const updateObject = JSON.stringify({...session, status: "BLOCKED"})
        await this.cacheManager.set(id, updateObject)

        const updatedSession = await JSON.parse(await this.cacheManager.get(id))

        if(updatedSession.status === "BLOCKED") {
            const updatedSession: Session = await JSON.parse(await this.cacheManager.get(id))
            
            return updatedSession
        }

        return null
    }

    async activeSession({id}: CreateSession): Promise<Session>{
        try {
            const session: Session = await JSON.parse(await this.cacheManager.get(id));

        if(!session || session.status === "ACTIVE"){
            return null
        }

        const updateObject = JSON.stringify({...session, status: "ACTIVE"})
        await this.cacheManager.set(id, updateObject)
        const updatedSession:Session = await JSON.parse(await this.cacheManager.get(id))


        if(updatedSession.status !== 'ACTIVE') {
            throw new Error()
        }

        return updatedSession

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }

    async deleteSession({id}: CreateSession): Promise<Session>{
        try {
            const session = await JSON.parse(await this.cacheManager.get(id))

            if(!session) {
                throw new BadRequestException(MISSING_SESSION_MESSAGE(id))
            }

            await this.cacheManager.del(id);


            return session

        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException(generateResponseMessage({message: `server error. statusCode: ${error.status}`}))
        }
    }
}





//     async updateSession({id, ...data}: UpdateSessionDto): Promise<Session | null>{
//         const session: Session = await JSON.parse(await this.cacheManager.get(id));
//         console.log('session ', session)
//         if(!session){
//             return null
//         }

//         const updateObject = JSON.stringify({...session, ...data})
//         const isUpdated: string = await this.cacheManager.set(id, updateObject)

//         if(isUpdated === 'OK') {
//             const updatedSession: Session = await JSON.parse(await this.cacheManager.get(id))
            
//             return updatedSession
//         }

//         return null
//     }

