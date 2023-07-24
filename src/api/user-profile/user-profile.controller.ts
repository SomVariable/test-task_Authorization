import { JwtHelperService } from './../jwt-helper/jwt-helper.service';
import { UserFileService } from './../user-file/user-file.service';
import { 
  Headers, 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  BadRequestException, 
  FileTypeValidator, 
  UploadedFile, 
  UseInterceptors, 
  Req,
  UseGuards } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { FindUserProfileDto } from './dto/find-user-profile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as FileType from 'file-type';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt.guard';
import { UserProfileInterceptor } from './interceptors/user-profile.interceptor';
import { imageFileFilter } from '../user-file/helpers/fileFilters.helper';
import { UserParam } from 'src/decorators/param-user.decorator';
import { jwtType } from '../jwt-helper/types/jwt-helper.types';

@ApiTags("users-profile")
@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@UseInterceptors(UserProfileInterceptor)
@Controller('user-profile')
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly userFileService: UserFileService,
    private readonly jwtHelperService: JwtHelperService
    ) {}

  @Post()
  async create(@Body() createProfileData: CreateUserProfileDto) {
    return this.userProfileService.create(createProfileData);
  }

  @Get()
  async findOne(@UserParam() jwtBody: jwtType) {
    const {sub} = jwtBody
    return this.userProfileService.findOne(sub);
  }

  @Patch()
  async update(
    @UserParam() jwtBody: jwtType, 
    @Body() updateUserProfileData: UpdateUserProfileDto) {
    const {sub} = jwtBody

    return this.userProfileService.update(sub, updateUserProfileData);
  }

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
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: imageFileFilter
  }))
  @Patch(':id/avatar')
  async uploadAvatar(@UploadedFile()  file: Express.Multer.File,
  @Param('id', ParseIntPipe) id: number,
  @UserParam() jwtBody: jwtType,
  @Req() req: any
  ){
    const {sub} = jwtBody

    if(!file || req.fileValidationError){
      throw new BadRequestException('only image is allowed')
    }

    this.userFileService.create(file, {user_id: sub, profile_id: id})
  }

}
