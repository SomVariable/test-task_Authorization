import appConfig from './configuration.config';

const config = appConfig()


export const minioConfig = {
    endPoint: config.MINIO_HOST,
    port: parseInt(config.MINIO_PORT),
    useSSL: false,
    accessKey:config.MINIO_ACCESS_KEY,
    secretKey:config.MINIO_SECRET_KEY
  };


  