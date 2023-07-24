import { S3Service } from '../s3-store/s3-store.service';
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
  Query,
  ForbiddenException} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserFileService } from './user-file.service';
import { CreateUserFileDto } from './dto/create-user-file.dto';
import { UpdateUserFileDto } from './dto/update-user-file.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt.guard';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';

import { Response } from 'express';
import { FindUserFileDto } from './dto/find-user-file.dto';
import { UserParam } from 'src/decorators/param-user.decorator';
import { jwtType } from '../jwt-helper/types/jwt-helper.types';
import { ANOTHER_USER_FILE_MESSAGE } from './constants/user-file.constants';

@ApiTags("users-files")
@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@Controller('user-file')
export class UserFileController {
  constructor(
    private readonly userFileService: UserFileService,
    private readonly jwtHelperService: JwtHelperService,
    private readonly S3Service: S3Service
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
    @UserParam() jwtBody: jwtType,
    @UploadedFile() file: Express.Multer.File
    ) {
    const {sub} = jwtBody
    
    const newFileData = await this.userFileService.create(file, {user_id: sub})
    
    return newFileData
  }

  @Post('files')
  async findAll(
    @UserParam() jwtBody: jwtType,
    @Body() body: FindUserFileDto
  ) {
    console.log(body)
    const {sub} = jwtBody

    return this.userFileService.findAll({user_id: sub, ...body});
  }

  @Get(':fileId')
  async findOne(
    @Param('fileId', ParseIntPipe) fileId: number,
    @Res() res: Response,
    @UserParam() {sub}: jwtType,
    ) {
    const fileInfo = await this.userFileService.findOne(fileId, sub); 

    const stream = await this.S3Service.getFile(fileInfo?.file_name);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.file_name}"`);
    
    stream.pipe(res)
  }

  @Delete(':fileId')
  async remove(
    @Param('fileId', ParseIntPipe) fileId: number,
    @UserParam() {sub}: jwtType,
    ) {
    return this.userFileService.remove(fileId, sub);
  }
}
