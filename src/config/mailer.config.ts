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

// export const mailerConfig: MailerOptions = {
//     transport: {
//         host: 'smtp.mailgun.org',
//         port: 587,
//         auth: {
//           user: "postmaster@sandboxb8170d96b5514eeab8bc9af3d02cc8da.mailgun.org",
//           pass: "311440a4d24f36fc30dc4265b86cfa1b-af778b4b-a9615621"
//         },
//       }
//   };


