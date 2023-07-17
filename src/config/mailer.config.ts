import { MailerOptions } from '@nestjs-modules/mailer';
import appConfig from './configuration.config';

const config = appConfig()

export const mailerConfig: MailerOptions = {
    transport: {
        host: config.MAILGUN_HOST,
        port: parseInt(config.MAILGUN_PORT),
        auth: {
          user: config.MAILGUN_USER,
          pass: config.MAILGUN_PASS
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