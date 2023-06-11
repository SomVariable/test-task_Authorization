import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HashPasswordPipe } from './pipes/hashPassword.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user-data.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.userService.findById(+id);
  }
  
  @Get(':email')
  @UseGuards(JwtAuthGuard)
  findByEmail(@Param('id') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  changePassword(@Param('id') id: string, @Body(HashPasswordPipe) {password}: UpdateUserDto) {
    return this.userService.changePassword(+id, password);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
