import { BadRequestException, Injectable } from '@nestjs/common';
import * as S3 from 'minio'
import { S3Config } from '../../config/s3.config';
import { ERROR_MESSAGE } from './constants/s3-store.constants';

@Injectable()
export class S3Service {
  private readonly client: S3.Client;
  private readonly bucketName = 'user-files'

  constructor() {
    this.client = new S3.Client(S3Config);
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
      throw new Error(error)
    }  
  }


  async getFile(fileName: string): Promise<NodeJS.ReadableStream> {
    try {
      const objectStream = await this.client.getObject(this.bucketName, fileName);
      return objectStream;
    } catch (error) {
      console.log(error);
      throw new Error(ERROR_MESSAGE);
    }
  }

  async getFiles(): Promise<S3.BucketItem[]> {
    try {
      const objectsStream = await this.client.listObjects(this.bucketName);
      const files: S3.BucketItem[] = [];
  
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
      throw new Error(ERROR_MESSAGE);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, fileName);
    } catch (error) {
      console.log(error);
      throw new Error(ERROR_MESSAGE);
    }
  }


}
