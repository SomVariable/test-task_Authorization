import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { SentMessageInfo } from 'nodemailer';
import { VERIFY_KEY_TIMESTAMP } from 'src/verification/constants/consts';
import { generateSendObject } from 'src/config/mailer.config';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VerificationService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly userService: UserService
    ) { }

    async sendVerificationCode(email: string, verificationCode: string): Promise<SentMessageInfo | null> {
        try {
            const user: User = await this.userService.findBy({email});
            
            await this.userService.saveVerificationKey(user.id, verificationCode, Date.now().toString())

            return await this.mailerService.sendMail(generateSendObject(email, verificationCode));
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

        if (+user.verification_timestamp + VERIFY_KEY_TIMESTAMP < Date.now()) {
            throw new BadRequestException(generateResponseMessage({message: `Sorry, but you overstayed your verification key. Please reauthenticate`}))
        }

        if (user.verification_key !== verifyCode) {
            throw new BadRequestException(generateResponseMessage({message: `Wrong verification key`}))
        }

        return true
    }
}
