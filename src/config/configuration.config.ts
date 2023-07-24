import * as dotenv from 'dotenv';
dotenv.config();


export default () => ({
    PORT: parseInt(process.env.PORT, 10) || 3000,
    DATABASE: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    },

    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,

    MAILGUN_HOST: process.env.MAILGUN_HOST,
    MAILGUN_PORT: process.env.MAILGUN_PORT,
    MAILGUN_USER: process.env.MAILGUN_USER,
    MAILGUN_PASS: process.env.MAILGUN_PASS,

    REDIS_URL: process.env.REDIS_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    S3_HOST : process.env.S3_HOST,
    S3_PORT : process.env.S3_PORT,
    S3_ACCESS_KEY : process.env.S3_ROOT_USER,
    S3_SECRET_KEY : process.env.S3_ROOT_PASSWORD,
  });


