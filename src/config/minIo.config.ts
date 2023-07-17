import appConfig from './configuration.config';

export const minioConfig = {
    endPoint: appConfig().MINIO_HOST,
    port: parseInt(appConfig().MINIO_PORT),
    useSSL: false,
    accessKey:appConfig().MINIO_ACCESS_KEY,
    secretKey:appConfig().MINIO_SECRET_KEY
  };


  