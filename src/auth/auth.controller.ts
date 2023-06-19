import { Controller, Get, Post, Body, Param, UseGuards, Res, UsePipes, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashPasswordPipe } from 'src/user/pipes/hashPassword.pipe';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

import { AuthGuard } from '@nestjs/passport';
import { PartialDtoValidationPipe } from 'src/user/pipes/partialDtoValidationPipe.pipe';
import { User } from '@prisma/client';
import { ResponseMessage, generateResponseMessage } from 'src/helpers/createResObject';
import { AccessJwtConfig, RefreshJwtConfig } from 'src/config/jwt.config';
import { AccessJwtAuthGuard } from './guards/accessJwt.guard';
import { RefreshJwtAuthGuard } from './guards/refreshJwt.guard';
import { SentMessageInfo } from 'nodemailer';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signUp')
  async signUp(
    @Body('password', new HashPasswordPipe()) hash: string,
    @Body() { email, login }: CreateUserDto) {

    const user: User = await this.authService.singUp({ hash, email, login });

    if (user) {
      return generateResponseMessage({ message: `User with email ${email} was created, please verify your account` })
    } else {
      return generateResponseMessage({ message: `User wasn't created` })
    }
  }

  @Post('signIn')
  @UseGuards(AuthGuard('local'))
  async signIn(
    @Body('password') password: string,
    @Body('email') email: string) {
    const user: User = await this.authService.signIn({ password, email });

    if (user) {
      return generateResponseMessage({ message: `A verification code was sent to your email` })
    } else {
      return generateResponseMessage({ message: `Wrong email or password` })
    }

  }

  @Post('changePassword')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
      },
    },
  })
  async requestPasswordChange(
    @Body('email') email: string) {
    const message: SentMessageInfo = await this.authService.sendVerificationKey(email);

    return generateResponseMessage({ message })

  }

  @Get('signIn/:verifyCode')
  async login(
    @Param('verifyCode') verifyCode: string,
    @Headers('User-Email') email: string): Promise<ResponseMessage> {
    await this.authService.isVerified(verifyCode, email)
    const accessToken = this.authService.generateToken(email, AccessJwtConfig)
    const refreshToken = this.authService.generateToken(email, RefreshJwtConfig)
    return generateResponseMessage({data: {accessToken, refreshToken}})
    
  }

  @Get('signUp/:verifyCode')
  async registerWithConfirmation(
    @Param('verifyCode') verifyCode: string,
    @Headers('User-Email') email: string): Promise<ResponseMessage> {
    await this.authService.isVerified(verifyCode, email)

    const accessToken: string = await this.authService.generateToken(email, AccessJwtConfig)
    const secretToken: string = await this.authService.generateToken(email, RefreshJwtConfig)
      
    await this.authService.activeUserStatus(email)

    return generateResponseMessage({
      message: "user was created",
      data: { accessToken, secretToken }
    })
  }

  @Get('refreshToken')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(@Headers('User-Email') email: string) {
    return await this.authService.generateToken(email, RefreshJwtConfig)
  }

  @Get('changePassword/:verifyCode')
  async verifyPasswordChangeKey(
    @Param('verifyCode') verifyCode: string,
    @Headers('User-Email') email: string) {
    await this.authService.isVerified(verifyCode, email)
    await this.authService.changeIsConfirmedChangePassword(email, true)
    return generateResponseMessage({
      message: `now you can change the password`
    })
    
  }

  @Post("changePassword/submitNewPassword")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
        },
      },
    },
  })
  
  @UsePipes(new PartialDtoValidationPipe('password'))
  async submitNewPassword(
    @Body(new HashPasswordPipe()) {password}: Partial<CreateUserDto>,
    @Headers('User-Email') email: string) {
    const updatedUser: User = await this.authService.submitNewPassword(email, password as string)

    if (updatedUser) {
      return generateResponseMessage({
        message: `password was changed`
      })
    } else {
      return generateResponseMessage({
        message: `password wasn't changed`
      })
    }
  }
}
