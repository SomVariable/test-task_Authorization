import { UserProfileService } from './../user-profile/user-profile.service';
import { Controller, Query, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UseGuards, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { Role, Status, User } from '@prisma/client';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeviceType } from 'src/decorators/device-type.decorator';
import {  UserInterceptor } from './interceptors/user.interceptor';
import { UsersInterceptor } from './interceptors/users.interceptor';
import { RolesDecorator } from '../roles/roles.decorator';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserFileService } from '../user-file/user-file.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { LIMIT_USERS } from './constants/user.constants';
import { userResponse, userUnion, usersResponse } from './types/user.types';
import { UserParam } from 'src/decorators/param-user.decorator';
import { jwtType } from '../jwt-helper/types/jwt-helper.types';

@ApiTags("user")
@ApiBearerAuth()
@Controller('user')
@RolesDecorator(Role.ADMIN)
@UseGuards(AccessJwtAuthGuard, RolesGuard)
@UseInterceptors(UserInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtHelperService: JwtHelperService
  ) { }

  @Get('')
  async getSelf(
    @UserParam() jwtBody: jwtType
    ): Promise<userResponse> {
    const {sub} = jwtBody
    const user = await this.userService.findById(sub);

    const res: userResponse = {
      user
    }

    return res
  }


  @Delete('')
  async remove(
    @UserParam() jwtBody: jwtType)
    : Promise<userResponse> {
    const {sub} = jwtBody
    const deletedUser = await this.userService.remove(sub);

    const res: userResponse = {
      user: deletedUser
    }

    return res
  }

  @Patch('')
  async update(
    @UserParam() jwtBody: jwtType, 
    @Body() data: UpdateUserDto): Promise<userResponse>{
    const {sub} = jwtBody
    const blockedUser = await this.userService.updateProperty(sub, data);

    const res: userResponse = {
      user: blockedUser
    }

    return res
  }

  @Patch('block')
  async block(
    @UserParam() jwtBody: jwtType
    ): Promise<userResponse>{
    const {sub} = jwtBody
    const blockedUser = await this.userService.updateProperty(sub, { status: Status.BLOCKED });

    const res: userResponse = {
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
    ): Promise<usersResponse> {
    const _limit = limit > LIMIT_USERS? LIMIT_USERS: limit
    const users = await this.userService.findUsers(page, _limit);
    const IDs = users.map(user => user.id) 
    const usersProfiles = await this.userProfileService.findMany(IDs)
    const usersUnions: userUnion[] = users.map((user, index) => {
      return {...user, ...usersProfiles[index]}
    })
    const totalCount = await this.userService.getTotalCount()
    const res: usersResponse = {
      users: usersUnions,
      page,
      pagination: _limit,
      totalCountUsers: totalCount
    }

    return res
  }

  @Get(':id')
  async findUserById(@Param('id', ParseIntPipe) id: number): Promise<usersResponse> {
    const user = await this.userService.findById(id);
    const userProfile = await this.userProfileService.findOne(id)
    const res: usersResponse = {
      users: {
        ...user,
        ...userProfile
      }
    }

    return res
  }
}

