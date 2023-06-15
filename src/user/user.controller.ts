import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HashPasswordPipe, HashPasswordPipeNewVersion } from './pipes/hashPassword.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user-data.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles, Status } from '@prisma/client';
import { RolesDecorator } from 'src/roles/roles.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesDecorator(Roles.admin)
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post('createUser')
  async createUser(
    @Body('password', new HashPasswordPipeNewVersion()) hash: string, 
    @Body() {email, login}: CreateUserDto){
      console.log(email, login, hash)
    return this.userService.create({email, login, hash})
  }

  @Post('createUsers')
  async createUsers( 
    @Body('users', HashPasswordPipeNewVersion) users: CreateUserDto[]){
      if(users.length !== 0){
        users.forEach((user: CreateUserDto) => {
          this.userService.create({email: user.email, login: user.login, hash: user.password})
        })
        return 'users war created'
      }
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(+id);
  }
  
  @Get(':email')
  async findByEmail(@Param('id') email: string) {
    return this.userService.findByEmail(email);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch('block/:id')
  blockUser(@Param('id') id: string) {
    return this.userService.updateProperty(+id, {status: Status.blocked});
  }
}
