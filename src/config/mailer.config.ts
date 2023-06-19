import { MailerOptions } from '@nestjs-modules/mailer';
import appConfig from './configuration.config';

export const mailerConfig: MailerOptions = {
    transport: {
        host: appConfig().MAILGUN_HOST,
        port: +appConfig().MAILGUN_PORT,
        auth: {
          user: appConfig().MAILGUN_USER,
          pass: appConfig().MAILGUN_PASS
        },
      }
  };

export const generateSendObject = (email: string, verificationCode: string) => {
  const subject = 'Email Verification';
  const text = `Your verification code is: ${verificationCode}`;
  
  return {
    to: email,
    from: 'somevariable787898@gmail.com',
    subject,
    text,
}
}