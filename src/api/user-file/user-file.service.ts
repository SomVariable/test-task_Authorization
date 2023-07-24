import { PrismaService } from './../database/prisma.service';
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserFile } from '@prisma/client';
import { extname } from 'path';
import {v4 as uuidv4} from 'uuid'
import { IDsType, pickPostProps } from './types/user-file.types';
import { S3Service } from '../s3-store/s3-store.service';
import { ANOTHER_USER_FILE_MESSAGE, MISSING_FILE_MESSAGE } from './constants/user-file.constants';

@Injectable()
export class UserFileService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly S3Service: S3Service

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
    await this.S3Service.uploadFile(file_name, file)

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
      await this.S3Service.uploadFile(file_names[index], file)
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

  async findAll( {user_id, profile_id, user_post_id}: IDsType
    ): Promise<UserFile[]> {
    const files = await  this.prismaService.userFile.findMany({
      where: {
        AND: [
          {user_id},
          {OR: [{profile_id}, {user_post_id}]}
        ]
      }
    })

    return files;
  }

  async findOne(file_id: number, user_id: number) {
    const file = await  this.prismaService.userFile.findFirst({
      where: {id: file_id}
    })

    if(!file){
      throw new BadRequestException(MISSING_FILE_MESSAGE)
    }

    if( file.user_id !== user_id){
      throw new ForbiddenException(ANOTHER_USER_FILE_MESSAGE)
    }

    return file;
  }

  async remove(file_id: number, user_id: number) {
    const file = await  this.prismaService.userFile.findFirst({
      where: {id: file_id}
    })

    if( file.user_id !== user_id){
      throw new ForbiddenException(ANOTHER_USER_FILE_MESSAGE)
    }

    const deletedFile = await this.prismaService.userFile.delete({
      where: {id: file_id}
    })

    if(!deletedFile){
      throw new BadRequestException(MISSING_FILE_MESSAGE)
    }

    await this.S3Service.deleteFile(deletedFile.file_name)

    return deletedFile;
  }

  async removeMany(IDs: IDsType) {
    console.log('IDs, files_IDs ', IDs)
    const filesData = await this.findAll(IDs)
    const files_ids = filesData?.map(fileData => fileData.id )
    

    console.log('files_ids ', files_ids)


    const filesNames = filesData.map(file => file.file_name)

    console.log('filesNames ', filesNames)

    
    await filesNames.forEach(async (fileName) => {
      await this.S3Service.deleteFile(fileName)
    })

    const files = await this.prismaService.userFile.deleteMany({
      where: {id: {in: files_ids}}
    })

    console.log("files ", files)

    return files;
  }
}
