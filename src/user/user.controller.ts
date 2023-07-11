import { Controller, Get, Post, Body, Patch, Param, Delete,  ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessJwtAuthGuard } from 'src/auth/guards/access-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role, Status, User } from '@prisma/client';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeviceType } from 'src/decorators/device-type.decorator';
import { UserResponseInterceptor } from './interceptors/user.interceptor';
import { IUsersResponse, UsersResponseInterceptor } from './interceptors/users.interceptor';

@ApiTags("users")
@ApiBearerAuth()
@Controller('user')

// @RolesDecorator(Roles.ADMIN)
// @UseGuards(AccessJwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
    ) { }

  @Get()
  async findAll() {
    const users: User[] = await this.userService.findAll();

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
  @UseInterceptors(UsersResponseInterceptor)
  @Get('interceptTestReq')
  async testFunc() {
    const user: User[] = [{
      email: 'valhodisevil@gmail.com',
      hash: 'sdfsfsfsf',
      id: 12,
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

  // @Get(':id')
  // async findById(@Param('id', ParseIntPipe) id: number) {
  //   const user: User = await this.userService.findById( id );

  //   if (user) {
  //     const { email, login, isConfirmedChangePassword, role, status } = user

  //     return generateResponseMessage({
  //       data: { email, login, isConfirmedChangePassword, role, status }
  //     })
  //   } else {
  //     return generateResponseMessage({
  //       message: `user with id ${id} wasn't found`
  //     })
  //   }
  // }

  // @Get(':login')
  // @RolesDecorator(Roles.USER)
  // async findByLogin(@Param('login') login: string) {
  //   const user: User = await this.userService.findBy({login});

  //   if (user) {
  //     const { email, login, isConfirmedChangePassword, role, status } = user

  //     return generateResponseMessage({
  //       data: { email, login, isConfirmedChangePassword, role, status }
  //     })
  //   } else {
  //     return generateResponseMessage({
  //       message: `user with email ${login} wasn't found`
  //     })
  //   }
  // }

  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   const deletedUser: User | null = await this.userService.remove(id);

  //   if (deletedUser) {
  //     const { email } = deletedUser

  //     return generateResponseMessage({
  //       message: `user with email ${email} and id ${id} was deleted`
  //     })
  //   } else {
  //     return generateResponseMessage({
  //       message: `user  wasn't deleted`
  //     })
  //   }
  // }

  // @Patch(':id')
  // async blockUser(@Body('id', ParseIntPipe) id: number) {
  //   const blockedUser: User | null = await this.userService.updateProperty(id, { status: Status.BLOCKED });

  //   if (blockedUser) {
  //     const { email } = blockedUser

  //     return generateResponseMessage({
  //       message: `user with email ${email} and id ${id} was blocked`
  //     })
  //   } else {
  //     return generateResponseMessage({
  //       message: `user  wasn't blocked`
  //     })
  //   }
  // }
}
