import { BadRequestException, Injectable } from '@nestjs/common';
import * as Minio from 'minio'
import { minioConfig } from 'src/config/minIo.config';

@Injectable()
export class MinioService {
  private readonly client: Minio.Client;
  private readonly bucketName = 'user-files'

  constructor() {
    this.client = new Minio.Client(minioConfig);
  }

  async createBucket(): Promise<void> {
    const bucketExists = await this.client.bucketExists(this.bucketName);

    if (!bucketExists) {
      await this.client.makeBucket(this.bucketName);
    }
  }

  async uploadFile(filename:string, file: Express.Multer.File): Promise<string> {
    try {
      await this.createBucket();
      await this.client.putObject(this.bucketName, filename, file.buffer);

      return filename;  
    } catch (error) {
      console.log(error)

      throw new Error('error')
    }  
  }


  async getFile(fileName: string): Promise<NodeJS.ReadableStream> {
    try {
      console.log(fileName)
      const objectStream = await this.client.getObject(this.bucketName, fileName);
      return objectStream;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to retrieve file');
    }
  }

  async getFiles(): Promise<Minio.BucketItem[]> {
    try {
      const objectsStream = await this.client.listObjects(this.bucketName);
      const files: Minio.BucketItem[] = [];
  
      return new Promise((resolve, reject) => {
        objectsStream.on('data', (obj) => {
          files.push(obj);
        });
  
        objectsStream.on('end', () => {
          resolve(files);
        });
  
        objectsStream.on('error', (err) => {
          reject(err);
        });
      });
    } catch (error) {
      console.log(error);
      throw new Error('Failed to retrieve files');
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, fileName);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to delete file');
    }
  }


}
