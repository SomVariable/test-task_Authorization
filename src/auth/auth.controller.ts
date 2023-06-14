import { Controller, Get, Post, Body, Param, UseGuards, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashPasswordPipe } from 'src/user/pipes/hashPassword.pipe';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

import { AuthGuard } from '@nestjs/passport';
import { Response, response } from 'express';
import { Cookies } from 'src/decorators/cookie.decorator';
import { PartialDtoValidationPipe } from 'src/user/pipes/partialDtoValidationPipe.pipe';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signUp')
  signUp(
    @Body('password', new HashPasswordPipe('password')) hash: string,
    @Body() { email, login }: CreateUserDto,
    @Res({ passthrough: true }) response: Response) {
    return this.authService.singUp({ hash, email, login }, response);
  }

  @Post('signIn')
  @UseGuards(AuthGuard('local'))
  signIn(
    @Body('password') password: string,
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn({ password, email, res });
  }

  @Post('changePassword')
  async requestPasswordChange(
    @Body('email') email: string,
    @Res({ passthrough: true }) response: Response) {
    return this.authService.sendVerifiKeyForChangePassword(email, response);
  }

  @Get('signIn/:verifiCode')
  async login(
    @Param('verifiCode') verifiCode: string,
    @Cookies('email') email: string,
    @Res({ passthrough: true }) response: Response): Promise<string> {
    const isVerified = this.authService.isVerified(verifiCode, email)

    if (isVerified) {
      const token = this.authService.generateToken(email)
      response.clearCookie('email')
      response.cookie("jwt", token)
      return token
    } else {
      return 'wrong key'
    }
  }

  @Get('signUp/:verifiCode')
  async registerWithConfirmation(
    @Param('verifiCode') verifiCode: string,
    @Cookies('email') email: string,
    @Res({ passthrough: true }) response: Response): Promise<string> {
    const isVerified = this.authService.isVerified(verifiCode, email)

    if (isVerified) {
      const token = this.authService.generateToken(email)
      this.authService.activeUserStatus(email)
      response.clearCookie('email')
      response.cookie("jwt", token)
      return token
    } else {
      return 'wrong key'
    }
  }

  @Get('changePassword/:verifiCode')
  async verifyPasswordChangeKey(
    @Param('verifiCode') verifiCode: string,
    @Cookies('email') email: string,
    @Res({ passthrough: true }) response: Response) {
    const isVerified = this.authService.isVerified(verifiCode, email)
    if (isVerified) {
      this.authService.changeIsConfirmedChangePassword(email, true)
      return 'now you can change the password'
    } else {
      return 'wrong key'
    }
  }

  @Post("changePassword/submitNewPassword")
  @UsePipes(new PartialDtoValidationPipe('password') )
  async submitNewPassword(
    @Body(new HashPasswordPipe('password')) password: Partial<CreateUserDto>,
    @Cookies("email") email: string,
    @Res({ passthrough: true }) response: Response) {
    const message = this.authService.submitNewPassword(email, password as string)
    response.clearCookie('email')
    return message
  }
}
