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
  UsePipes, 
  MaxFileSizeValidator, 
  ParseFilePipe,
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
  async findOne(@Headers('Authorization') authorization: string) {
    const { sub } = await this.jwtHelperService.getDataFromJwt(authorization)
    return this.userProfileService.findOne(sub);
  }

  @Patch()
  async update(
    @Headers('Authorization') authorization: string, 
    @Body() updateUserProfileData: UpdateUserProfileDto) {
    const { sub } = await this.jwtHelperService.getDataFromJwt(authorization)

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
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id/avatar')
  async uploadAvatar(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 10000000 }),
      new FileTypeValidator({ fileType: 'image/jpeg' }),
    ],
  }),)  file: Express.Multer.File,
  @Param('id', ParseIntPipe) id: number,
  @Headers('Authorization') authorization: string,
  ){
    const { sub } = await this.jwtHelperService.getDataFromJwt(authorization)

    this.userFileService.create(file, {user_id: sub, profile_id: id})
  }

}
