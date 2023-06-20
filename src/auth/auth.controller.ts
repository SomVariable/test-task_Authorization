import { Controller, Get, Post, Body, Param, UseGuards, Res, UsePipes, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashPasswordPipe } from 'src/user/pipes/hashPassword.pipe';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ResponseMessage, generateResponseMessage } from 'src/helpers/createResObject';
import { AccessJwtConfig, RefreshJwtConfig } from 'src/config/jwt.config';
import { AccessJwtAuthGuard } from './guards/accessJwt.guard';
import { RefreshJwtAuthGuard } from './guards/refreshJwt.guard';
import { SentMessageInfo } from 'nodemailer';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/signIn.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  async signIn(@Body() {email, password} : SignInDto) {
    const user: User = await this.authService.signIn({ password, email });

    if (user) {
      return generateResponseMessage({ message: `A verification code was sent to your email` })
    } else {
      return generateResponseMessage({ message: `Wrong email or password` })
    }

  }

  @Post('changePassword')
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  async requestPasswordChange(@Headers('Authorization') authorization: string) {
    const {email} = await this.authService.getDataFromJwt(authorization);
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
  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(@Headers('Authorization') authorization: string) {
    const {email} = await this.authService.getDataFromJwt(authorization, RefreshJwtConfig);
    const newAccessToken: string = await this.authService.generateToken(email, AccessJwtConfig)
    const newRefreshToken: string = await this.authService.generateToken(email, RefreshJwtConfig)
    return generateResponseMessage({
      message: `tokens was refresh`,
      data: {
        newAccessToken, 
        newRefreshToken
      }
    })
  }

  @Get('changePassword/:verifyCode')
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  async submitNewPassword(
    @Body(new HashPasswordPipe()) {password}: ResetPasswordDto,
    @Headers('Authorization') authorization: string) {
    const {email} = await this.authService.getDataFromJwt(authorization)
    const updatedUser: User = await this.authService.submitNewPassword(email, password)

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
