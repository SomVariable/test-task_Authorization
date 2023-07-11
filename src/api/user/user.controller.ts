import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role, Status, User } from '@prisma/client';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeviceType } from 'src/decorators/device-type.decorator';
import { IUserResponse, UserInterceptor } from './interceptors/user.interceptor';
import { IUsersResponse, UsersInterceptor } from './interceptors/users.interceptor';
import { RolesDecorator } from '../roles/roles.decorator';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { AccessJwtAuthGuard } from '../auth/guards/access-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags("users")
@ApiBearerAuth()
@Controller('user')
// @RolesDecorator(Role.ADMIN)
// @UseGuards(AccessJwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    if (users && users.length) {
      return generateResponseMessage({
        data: users,
        totalItems: users.length
      })
    } else {
      return generateResponseMessage({
        message: 'there is no users'
      })
    }
  }

  @UseInterceptors(UsersInterceptor)
  @Get('interceptTestReq')
  async testFunc() {
    const user: User[] = [{
      email: 'valhodisevil@gmail.com',
      hash: 'sdfsfsfsf',
      id: 12,
      role: 'USER',
      status: 'ACTIVE',
      isConfirmedChangePassword: false,
      created_at: new Date(),
      updated_at: new Date(),
    }]

    const response: IUsersResponse = {
      users: user,
      pagination: 10,
      totalItems: 5,
      page: 3,
      message: "OK"
    }

    return response
  }

  @UseInterceptors(UserInterceptor)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<IUserResponse> {
    const user = await this.userService.findById(id);

    const res: IUserResponse = {
      user
    }

    return res
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<IUserResponse> {
    const deletedUser = await this.userService.remove(id);

    const res: IUserResponse = {
      user: deletedUser
    }

    return res
  }

  @Patch('')
  async update(@Body('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto): Promise<IUserResponse>{
    const blockedUser = await this.userService.updateProperty(id, data);

    const res: IUserResponse = {
      user: blockedUser
    }

    return res
  }

  @Patch('block')
  async block(@Body('id', ParseIntPipe) id: number): Promise<IUserResponse>{
    const blockedUser = await this.userService.updateProperty(id, { status: Status.BLOCKED });


    const res: IUserResponse = {
      user: blockedUser
    }

    return res
  }
}
