import { AuthService } from './../auth/auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VerificationService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly userService: UserService
    ) { }

    async sendVerificationCode(email: string, verificationCode: string): Promise<void> {
        const subject = 'Email Verification';
        const text = `Your verification code is: ${verificationCode}`;
        try {
            console.log('we are in the sendVerificationCode')
            const user: User = await this.userService.findByEmail(email);
            console.log(user)
            this.userService.saveVerificationKey(user.id, verificationCode, Date.now().toString())

            await this.mailerService.sendMail({
                to: email,
                from: 'somevariable787898@gmail.com',
                subject,
                text,
            });
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

    async validateVerifiCode(verifiCode: string, email: string): Promise<boolean> {
        const user: User = await this.userService.findByEmail(email)
        if (!user) {
            return false;
        }


        if (+user.verification_timestemp + 600000 < Date.now()) {
            return false
        }

        if (user.verification_key !== verifiCode) {
            return false
        }


        return true
    }



}
