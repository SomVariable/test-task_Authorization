import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HashPasswordPipe } from './pipes/hashPassword.pipe';
import { AccessJwtAuthGuard } from 'src/auth/guards/accessJwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles, Status, User } from '@prisma/client';
import { RolesDecorator } from 'src/roles/roles.decorator';
import { generateResponseMessage } from 'src/helpers/createResObject';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags("users")
@ApiBearerAuth()
@Controller('user')
@RolesDecorator(Roles.admin)
@UseGuards(AccessJwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('createUser')
  async createUser(
    @Body('password', new HashPasswordPipe()) hash: string,
    @Body() { email, login }: CreateUserDto) {
    const user: User | string[] | null = await this.userService.create({ email, login, hash })

    if (user) {
      return generateResponseMessage({
        message: `user with email ${email} was created`,
        data: { email, login }
      })
    } else {
      return generateResponseMessage({
        message: "user wasn't created"
      })
    }
  }

  @Post('createUsers')
  async createUsers(
    @Body('users', HashPasswordPipe) users: CreateUserDto[]) {
    let createdUsers: User[] = []
    let failedUsers: CreateUserDto[] = []
    let duplicateUsers: object[] = []

    if (users.length !== 0) {
      users.forEach(async (user: CreateUserDto) => {
        const newUser: User | null | string[] = await this.userService.create({ email: user.email, login: user.login, hash: user.password })
        
        if (Array.isArray(newUser)) {
          duplicateUsers = [...duplicateUsers, { email: user.email, duplicateProperty: newUser}]
          return null
        }

        if (newUser) {
          createdUsers = [...createdUsers, newUser]
        } else {
          failedUsers = [...failedUsers, user]
        }
      })

      return generateResponseMessage({
        message: `count users that was created: ${createdUsers.length}. count users that wasn't created: ${failedUsers.length}, duplicate users count: ${duplicateUsers.length}`,
        data: {
          createdUsers,
          failedUsers,
          duplicateUsers
        }
      })
    }
  }

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

  @Get('getUserById/:id')
  async findById(@Param('id') id: string) {
    const user: User = await this.userService.findBy({ id: +id});

    if (user) {
      const { email, login, isConfirmedChangePassword, role, status } = user

      return generateResponseMessage({
        data: { email, login, isConfirmedChangePassword, role, status }
      })
    } else {
      return generateResponseMessage({
        message: `user with id ${id} wasn't found`
      })
    }
  }

  @Get('getUserByEmail/:email')
  async findByEmail(@Param('email') email: string) {
    const user: User = await this.userService.findBy({email});

    if (user) {
      const { email, login, isConfirmedChangePassword, role, status } = user

      return generateResponseMessage({
        data: { email, login, isConfirmedChangePassword, role, status }
      })
    } else {
      return generateResponseMessage({
        message: `user with email ${email} wasn't found`
      })
    }
  }

  @Get('getUserByLogin/:login')
  @UseGuards(AccessJwtAuthGuard)
  @RolesDecorator(Roles.user)
  async findByLogin(@Param('login') login: string) {
    const user: User = await this.userService.findBy({login});

    if (user) {
      const { email, login, isConfirmedChangePassword, role, status } = user

      return generateResponseMessage({
        data: { email, login, isConfirmedChangePassword, role, status }
      })
    } else {
      return generateResponseMessage({
        message: `user with email ${login} wasn't found`
      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUser: User | null = await this.userService.remove(+id);

    if (deletedUser) {
      const { email } = deletedUser

      return generateResponseMessage({
        message: `user with email ${email} and id ${id} was deleted`
      })
    } else {
      return generateResponseMessage({
        message: `user  wasn't deleted`
      })
    }
  }

  @Patch('block/:id')
  async blockUser(@Param('id') id: string) {
    const blockedUser: User | null = await this.userService.updateProperty(+id, { status: Status.blocked });

    if (blockedUser) {
      const { email } = blockedUser

      return generateResponseMessage({
        message: `user with email ${email} and id ${id} was blocked`
      })
    } else {
      return generateResponseMessage({
        message: `user  wasn't blocked`
      })
    }
  }
}
