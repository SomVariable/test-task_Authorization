import { PrismaService } from './../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserFileDto } from './dto/create-user-file.dto';
import { UpdateUserFileDto } from './dto/update-user-file.dto';
import { UserFile } from '@prisma/client';
import { MinioService } from '../minio/minio.service';
import { extname } from 'path';
import {v4 as uuidv4} from 'uuid'
import { IDsType, pickPostProps } from './types/user-file.types';

@Injectable()
export class UserFileService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService

  ) {}
 
  createFileName(originalname: string){
    return `${uuidv4()}${extname(originalname)}`
  }

  async create(
    file: Express.Multer.File, 
    {user_id, profile_id, user_post_id}: IDsType
    ): Promise<UserFile> {
    const {originalname, size, mimetype} = file

    const file_name = this.createFileName(originalname);
    await this.minioService.uploadFile(file_name, file)

    const fileData = await  this.prismaService.userFile.create({
      data: {
        file_name,
        mimetype,
        original_name: originalname,
        size,
        user_id,
        profile_id,
        user_post_id
      }
    })
    
    return fileData;
  }

  async createMany(
    files: Express.Multer.File[], 
    {user_id, profile_id, user_post_id}: IDsType
    ) {

    const file_names = files.map(file => this.createFileName(file.originalname))

    
    await files.forEach(async (file, index) => {
      await this.minioService.uploadFile(file_names[index], file)
    }) 

    const filesData = files.map(({size, originalname, mimetype}, id) => {
      return {
        file_name: file_names[id],
        mimetype,
        original_name: originalname,
        size,
        user_id,
        profile_id,
        user_post_id
      }
    })

    const createdFilesData = await this.prismaService.userFile.createMany({
      data: filesData
    })
    
    return createdFilesData;
  }

  async findAll( {user_id, profile_id, user_post_id}: IDsType, IDs?: number[]
    ): Promise<UserFile[]> {
    const file = await  this.prismaService.userFile.findMany({
      where: {
        id: {in: IDs},
        user_id, 
        profile_id, 
        user_post_id
      }
    })

    return file;
  }

  async findOne(userId: number, id: number) {
    const file = await  this.prismaService.userFile.findFirst({
      where: {id, user_id: userId}
    })

    return file;
  }

  async remove(id: number) {
    const deletedFile = await  this.prismaService.userFile.delete({
      where: {id}
    })

    await this.minioService.deleteFile(deletedFile.file_name)

    return deletedFile;
  }

  async removeMany(IDs: IDsType, files_IDs?: number[]) {
    
    const filesData = await this.findAll(IDs, files_IDs)
    
    const filesNames = filesData.map(file => file.file_name)
    
    await filesNames.forEach(async (fileName) => {
      await this.minioService.deleteFile(fileName)
    })

    const files = await  this.prismaService.userFile.deleteMany({
      where: {id: {in: files_IDs}, ...IDs}
    })

    return files;
  }
}
