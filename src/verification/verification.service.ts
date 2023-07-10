import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { SentMessageInfo } from 'nodemailer';
import { VERIFY_KEY_TIMESTAMP } from 'src/verification/constants/consts';
import { generateSendObject } from 'src/config/mailer.config';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { UserService } from 'src/user/user.service';
import { KvStoreService } from 'src/kv-store/kv-store.service';
import { Session, SetVerificationProps } from 'kv-types';

@Injectable()
export class VerificationService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly userService: UserService,
        private readonly kvStoreService: KvStoreService
    ) { }

    async sendVerificationCode(email: string, verificationKey: string): Promise<SentMessageInfo | null> {
        try {
            const user: User = await this.userService.findBy({email});
            const data: SetVerificationProps = {
                id: String(user.id), 
                verificationKey, 
                verificationTimestamp: Date.now().toString()
            }
            console.log(data)
            await this.kvStoreService.setVerificationProps(data)

            return await this.mailerService.sendMail(generateSendObject(email, verificationKey));
        } catch (error) {
            throw new HttpException(
                'Failed to create user',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }

    generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    async validateVerifyCode(verifyCode: string, email: string): Promise<boolean> {
        const user: User = await this.userService.findBy({email})
        const session: Session = await this.kvStoreService.getSession({id: String(user.id)})

        if (parseInt(session.verificationTimestamp) + VERIFY_KEY_TIMESTAMP < Date.now()) {
            throw new BadRequestException(generateResponseMessage({message: `Sorry, but you overstayed your verification key. Please reauthenticate`}))
        }

        if (session.verificationKey !== verifyCode) {
            throw new BadRequestException(generateResponseMessage({message: `Wrong verification key`}))
        }

        return true
    }
}
