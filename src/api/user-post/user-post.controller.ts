import { UserFileService } from './../user-file/user-file.service';
import { JwtHelperService } from './../jwt-helper/jwt-helper.service';
import {
  UseGuards,
  Headers, UploadedFile,
  UseInterceptors,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  ParseIntPipe
} from '@nestjs/common';
import { UserPostService } from './user-post.service';
import { CreateUserPostDto } from './dto/create-user-post.dto';
import { UpdateUserPostDto } from './dto/update-user-post.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt.guard';

@ApiTags("user-posts")
@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@Controller('user-post')
export class UserPostController {
  constructor(
    private readonly userPostService: UserPostService,
    private readonly jwtHelperService: JwtHelperService
  ) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserPostDto })
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Headers('Authorization') authorization: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: CreateUserPostDto,
  ) {
    const {message, channel_id} = data
    const { sub } = await this.jwtHelperService.getDataFromJwt(authorization)

    return this.userPostService.create({
      author_id: sub,
      channel_id: parseInt(channel_id)
    }, message, files);
  }

  @Get()
  async findAll(
    @Headers('Authorization') authorization: string,
  ) {
    const { sub } = await this.jwtHelperService.getDataFromJwt(authorization)
    
    return this.userPostService.findAll(sub);
  }

  @Get(':id')
  async findOne(
    @Headers('Authorization') authorization: string,
    @Param('id', ParseIntPipe) id: number
    ) {
    const { sub } = await this.jwtHelperService.getDataFromJwt(authorization)

    return this.userPostService.findOne(sub, id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserPostDto })
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Headers('Authorization') authorization: string,
    @Body() data: UpdateUserPostDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
    const { sub } = await this.jwtHelperService.getDataFromJwt(authorization)

    return this.userPostService.update(sub, id, data, files);
  }

  @Delete(':id')
  async remove(
    @Headers('Authorization') authorization: string,
    @Param('id', ParseIntPipe) postId: number, 
    ) {
    const { sub } = await this.jwtHelperService.getDataFromJwt(authorization)

    return this.userPostService.remove(sub, postId);
  }
}
