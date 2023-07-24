import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { generateSendObject } from 'src/config/mailer.config';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { UserService } from '../user/user.service';
import { KvStoreService } from '../kv-store/kv-store.service';
import { VERIFY_KEY_TIMESTAMP } from './constants/constants';
import { Session, SetVerificationProps } from '../kv-store/kv-types/kv-store.type';

@Injectable()
export class VerificationService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly userService: UserService,
        private readonly kvStoreService: KvStoreService
    ) { }

    async sendVerificationCode(email: string, sessionKey: string, verificationKey: string) {
        try {
            const data: SetVerificationProps = {
                id: sessionKey, 
                verificationKey, 
                verificationTimestamp: Date.now().toString()
            }

            await this.kvStoreService.setVerificationProps(data)

            return true
            // i disable sendMail because of trial version. It work only with valhodisevil@gmail.com or other email that i can include. 
            return await this.mailerService.sendMail(generateSendObject(email, verificationKey));
        } catch (error) {
            console.log(error)
            throw new HttpException(
                'Failed to create user',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }

    generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    async validateVerifyCode(verifyCode: string, sessionKey: string): Promise<boolean> {
        const session: Session = await this.kvStoreService.getSession({id: sessionKey})

        if (parseInt(session.verificationTimestamp) + VERIFY_KEY_TIMESTAMP < Date.now()) {
            throw new BadRequestException(generateResponseMessage({message: `Sorry, but you overstayed your verification key. Please reauthenticate`}))
        }

        if (session.verificationKey !== verifyCode) {
            throw new BadRequestException(generateResponseMessage({message: `Wrong verification key`}))
        }

        return true
    }
}
