import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { HashPasswordPipe } from 'src/user/pipes/hashPassword.pipe';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body('password', HashPasswordPipe) hash: string,  @Body() {email, login, role}: CreateUserDto) {
    return this.authService.singUp({hash, email, login, role});
  }

  @Post('signIn')
  @UseGuards(AuthGuard('local'))
  signIn(@Body('password') password: string, @Body('email') email: string, @Body('id')id: number) {
    console.log('sign in')
    return this.authService.signIn({password, email, id});
  }
}
