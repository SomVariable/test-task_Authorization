import appConfig from './configuration.config';

const config = appConfig()


export const S3Config = {
    endPoint: config.S3_HOST,
    port: parseInt(config.S3_PORT),
    useSSL: false,
    accessKey:config.S3_ACCESS_KEY,
    secretKey:config.S3_SECRET_KEY
  };


  