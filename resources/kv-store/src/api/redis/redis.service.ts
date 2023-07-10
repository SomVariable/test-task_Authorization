import { createClient } from 'redis';
import { Injectable } from '@nestjs/common';
import { Session } from 'kv-types';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SaveSessionDto } from './dto/save-session.dto';

@Injectable()
export class RedisService {
    private readonly client = createClient();
    
    constructor(){
        this.client.connect()
    }

    async saveSession(id: string): Promise<Session> {
        const session: Session = {
            id,
            jwtToken: null,
            refreshToken: null,
            verificationKey: null,
            verificationTimestamp: null,
            status: 'ACTIVE'
        }
        
        await this.client.set(id, JSON.stringify(session));
        const sessionJSON: string = await this.client.get(id)
        const newSession: Session = await JSON.parse(sessionJSON)
        return newSession
    }

    async getSession(id: string): Promise<Session> {
        const sessionJSON: string = await this.client.get(id)
        const session: Session = await JSON.parse(sessionJSON)
        return session
    }

    async removeSession(id: string): Promise<boolean> {
        const isDeleted: number = await this.client.del(id);

        return isDeleted? true : false
    }

    async updateSession({id, ...data}: UpdateSessionDto): Promise<Session | null>{
        const session: Session = await JSON.parse(await this.client.get(id));
        console.log('session ', session)
        if(!session){
            return null
        }

        const updateObject = JSON.stringify({...session, ...data})
        const isUpdated: string = await this.client.set(id, updateObject)

        if(isUpdated === 'OK') {
            const updatedSession: Session = await JSON.parse(await this.client.get(id))
            
            return updatedSession
        }

        return null
    }

    async blockSession({id}: SaveSessionDto): Promise<Session | null>{
        const session: Session = await JSON.parse(await this.client.get(id));

        if(!session || session.status === "BLOCKED"){
            return null
        }

        const updateObject = JSON.stringify({...session, status: "BLOCKED"})
        const isUpdated: string = await this.client.set(id, updateObject)

        if(isUpdated === 'OK') {
            const updatedSession: Session = await JSON.parse(await this.client.get(id))
            
            return updatedSession
        }

        return null
    }

    async activeSession({id}: SaveSessionDto): Promise<Session | null>{
        const session: Session = await JSON.parse(await this.client.get(id));

        if(!session || session.status === "ACTIVE"){
            return null
        }

        const updateObject = JSON.stringify({...session, status: "ACTIVE"})
        const isUpdated: string = await this.client.set(id, updateObject)

        if(isUpdated === 'OK') {
            const updatedSession: Session = await JSON.parse(await this.client.get(id))
            
            return updatedSession
        }

        return null
    }
}
