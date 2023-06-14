import * as dotenv from 'dotenv';
dotenv.config();


export default () => ({
    PORT: parseInt(process.env.PORT, 10) || 3000,
    DATABASE: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    },

    SECRET_KEY: process.env.SECRET_KEY,
    MAILGUN_HOST: process.env.MAILGUN_HOST,
    MAILGUN_PORT: process.env.MAILGUN_PORT,
    MAILGUN_USER: process.env.MAILGUN_USER,
    MAILGUN_PASS: process.env.MAILGUN_PASS,

    SENDGRID_HOST:  process.env.SENDGRID_HOST,
    SENDGRID_PORT:  process.env.SENDGRID_PORT,
    SENDGRID_USER:  process.env.SENDGRID_USER,
    SENDGRID_PASS:  process.env.SENDGRID_PASS  

  });


// MAILGUN_HOST='smtp.mailgun.org'
// MAILGUN_PORT=587
// MAILGUN_USER="postmaster@sandboxb8170d96b5514eeab8bc9af3d02cc8da.mailgun.org"
// MAILGUN_PASS="311440a4d24f36fc30dc4265b86cfa1b-af778b4b-a9615621"

// # SENDGRID
// SENDGRID_HOST='smtp.sendgrid.net'
// SENDGRID_PORT=465
// SENDGRID_USER="apikey"
// SENDGRID_PASS="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"