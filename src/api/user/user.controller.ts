import { UserProfileService } from './../user-profile/user-profile.service';
import { Controller, Query, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UseGuards, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { Role, Status, User } from '@prisma/client';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeviceType } from 'src/decorators/device-type.decorator';
import { IUserResponse, UserInterceptor } from './interceptors/user.interceptor';
import { IUsersResponse, UsersInterceptor, userUnion } from './interceptors/users.interceptor';
import { RolesDecorator } from '../roles/roles.decorator';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserFileService } from '../user-file/user-file.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { LIMIT_USERS } from './constants/user.constants';

@ApiTags("user")
@ApiBearerAuth()
@Controller('user')
@RolesDecorator(Role.ADMIN)
@UseGuards(AccessJwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
    private readonly userFileService: UserFileService,
    private readonly jwtHelperService: JwtHelperService
  ) { }

  @UseInterceptors(UserInterceptor)
  @Get('')
  async getSelf(
    @Headers('Authorization') authorization: string
    ): Promise<IUserResponse> {
    const {sub} = await this.jwtHelperService.getDataFromJwt(authorization)
    const user = await this.userService.findById(sub);

    const res: IUserResponse = {
      user
    }

    return res
  }

  @Delete('')
  async remove(
    @Headers('Authorization') authorization: string)
    : Promise<IUserResponse> {
    const {sub} = await this.jwtHelperService.getDataFromJwt(authorization)
    const deletedUser = await this.userService.remove(sub);

    const res: IUserResponse = {
      user: deletedUser
    }

    return res
  }

  @Patch('')
  async update(
    @Headers('Authorization') authorization: string, 
    @Body() data: UpdateUserDto): Promise<IUserResponse>{
    const {sub} = await this.jwtHelperService.getDataFromJwt(authorization)
    const blockedUser = await this.userService.updateProperty(sub, data);

    const res: IUserResponse = {
      user: blockedUser
    }

    return res
  }

  @Patch('block')
  async block(
    @Headers('Authorization') authorization: string
    ): Promise<IUserResponse>{
    const {sub} = await this.jwtHelperService.getDataFromJwt(authorization)
    const blockedUser = await this.userService.updateProperty(sub, { status: Status.BLOCKED });

    const res: IUserResponse = {
      user: blockedUser
    }

    return res
  }
}

@ApiTags("users")
@UseInterceptors(UsersInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
    private readonly userFileService: UserFileService
  ) { }

  @Get('')
  async findUsers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = LIMIT_USERS
    ): Promise<IUsersResponse> {
    const _limit = limit > LIMIT_USERS? LIMIT_USERS: limit
    const users = await this.userService.findUsers(page, _limit);
    const IDs = users.map(user => user.id) 
    const usersProfiles = await this.userProfileService.findMany(IDs)
    const usersUnions: userUnion[] = users.map((user, index) => {
      return {...user, ...usersProfiles[index]}
    })
    const totalCount = await this.userService.getTotalCount()
    const res: IUsersResponse = {
      users: usersUnions,
      page,
      pagination: _limit,
      totalCountUsers: totalCount
    }

    return res
  }

  @Get(':id')
  async findUserById(@Param('id', ParseIntPipe) id: number): Promise<IUsersResponse> {
    const user = await this.userService.findById(id);
    const userProfile = await this.userProfileService.findOne(id)
    const res: IUsersResponse = {
      users: {
        ...user,
        ...userProfile
      }
    }

    return res
  }
}

