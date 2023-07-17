import { MinioService } from './../minio/minio.service';
import { 
  UseInterceptors, 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Headers, 
  ParseIntPipe, 
  Res,
  UploadedFile, 
  StreamableFile} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserFileService } from './user-file.service';
import { CreateUserFileDto } from './dto/create-user-file.dto';
import { UpdateUserFileDto } from './dto/update-user-file.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt.guard';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';

import { Response } from 'express';

@ApiTags("users-files")
@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@Controller('user-file')
export class UserFileController {
  constructor(
    private readonly userFileService: UserFileService,
    private readonly jwtHelperService: JwtHelperService,
    private readonly minioService: MinioService
    ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Headers('Authorization') authorization: string,
    @UploadedFile() file: Express.Multer.File
    ) {
    const {sub} = await this.jwtHelperService.getDataFromJwt(authorization)
    
    const newFileData = await this.userFileService.create(file, {user_id: sub})
    
    return newFileData
  }

  @Get()
  async findAll(
    @Headers('Authorization') authorization: string,
  ) {
    const {sub} = await this.jwtHelperService.getDataFromJwt(authorization)

    return this.userFileService.findAll({user_id: sub});
  }

  @Get(':fileId')
  async findOne(
    @Headers('Authorization') authorization: string, 
    @Param('fileId', ParseIntPipe) fileId: number,
    @Res() res: Response
    ) {
    const {sub} = await this.jwtHelperService.getDataFromJwt(authorization)
    const fileInfo = await this.userFileService.findOne(sub, fileId); 

    const stream = await this.minioService.getFile(fileInfo.file_name);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.file_name}"`);
    
    stream.pipe(res)
  }

  @Delete()
  async remove(
    @Headers('Authorization') authorization: string,
    @Body('fileId', ParseIntPipe) fileId: number
    ) {
    return this.userFileService.remove(fileId);
  }
}
