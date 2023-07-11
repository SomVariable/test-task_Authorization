import { Controller, Get, Post, Body, Param, UseGuards, Res, UsePipes, Headers, Patch, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessJwtConfig, RefreshJwtConfig } from 'src/config/jwt.config';
import { AccessJwtAuthGuard } from './guards/access-jwt.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';
import { SentMessageInfo } from 'nodemailer';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUser } from './dto/verify-user.dto';
import { DeviceType } from 'src/decorators/device-type.decorator';
import { generateSessionKey } from 'src/helpers/create-session-key';
import { jwtType, authUserReturnType, authVerifyReturnType } from './types/auth.types';
import { KvStoreService } from '../kv-store/kv-store.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserProfileDto } from '../user-profile/dto/create-user-profile.dto';
import {
  PASSWORD_CHANGED_MESSAGE,
  REFRESH_TOKEN_MESSAGE,
  SIGN_IN_MESSAGE,
  SIGN_UP_MESSAGE,
  SUCCESS_VERIFICATION_MESSAGE
} from './constants/auth.constants';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthUserInterceptor } from './interceptors/auth-user.interceptor';

@ApiTags("auth")
@UseInterceptors(AuthInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private kvStoreService: KvStoreService,
    private userService: UserService) { }

  @UseInterceptors(AuthUserInterceptor)
  @Post('sign-up')
  async signUp(
    @DeviceType() deviceType: string,
    @Body() { email, login, password }: CreateUserDto & CreateUserProfileDto) :Promise<authUserReturnType>{
    const hash: string = await this.authService.hashPassword(password)
    const user = await this.authService.singUp({ email, login, password: hash }, deviceType);

    const resObject: authUserReturnType = {
      message: SIGN_UP_MESSAGE(email),
      user
    }

    return resObject
  }

  @UseInterceptors(AuthUserInterceptor)
  @Post('sign-in')
  @UseGuards(AuthGuard('local'))
  async signIn(@DeviceType() deviceType: string, @Body() { email, password }: SignInDto):Promise<authUserReturnType> {
    const user = await this.authService.signIn({ password, email }, deviceType);

    const resObject: authUserReturnType = {
      message: SIGN_IN_MESSAGE,
      user
    }
    return resObject
  }

  @Post('reset-password')
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  async requestPasswordChange(
    @Headers('Authorization') authorization: string) {
    const { email, sessionKey }: jwtType = await this.authService.getDataFromJwt(authorization);
    const message: SentMessageInfo = await this.authService.sendVerificationKey(email, sessionKey);

    return message
  }

  @Post('sign-in/verify')
  async login(
    @Body() { email, verifyCode }: VerifyUser,
    @DeviceType() deviceType: string): Promise<authVerifyReturnType> {
    const { id } = await this.userService.findBy({ email })
    const sessionKey: string = generateSessionKey(String(id), deviceType)
    await this.authService.isVerified(verifyCode, sessionKey)

    const accessToken: string = await this.authService.generateToken(email, sessionKey, AccessJwtConfig)
    const refreshToken: string = await this.authService.generateToken(email, sessionKey, RefreshJwtConfig)

      const res: authVerifyReturnType = {
        jwtToken: accessToken,
        refreshToken
      }

    return res
  }

  @Patch("logout")
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  async logout(
    @Headers('Authorization') authorization: string) {
    const jwtBody: jwtType = await this.authService.getDataFromJwt(authorization)
    await this.authService.logout(jwtBody.sessionKey)
  }

  @Post('sign-up/verify')
  async registerWithConfirmation(
    @Body() { email, verifyCode }: VerifyUser,
    @DeviceType() deviceType: string): Promise<authVerifyReturnType> {

    const { id } = await this.userService.findBy({ email })
    const sessionKey: string = generateSessionKey(String(id), deviceType)
    await this.authService.isVerified(verifyCode, sessionKey)

    const jwtToken: string = await this.authService.generateToken(email, sessionKey, AccessJwtConfig)
    const refreshToken: string = await this.authService.generateToken(email, sessionKey, RefreshJwtConfig)

    await this.authService.activeUserStatus(email)

    const res: authVerifyReturnType = {
      message: SUCCESS_VERIFICATION_MESSAGE,
      jwtToken,
      refreshToken
    }
    return res
  }

  @Get('refresh-token')
  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(
    @Headers('Authorization') authorization: string
  ) {
    const { email, sessionKey }: jwtType = await this.authService.getDataFromJwt(authorization, RefreshJwtConfig);

    const newAccessToken: string = await this.authService.generateToken(email, sessionKey, AccessJwtConfig)
    const newRefreshToken: string = await this.authService.generateToken(email, sessionKey, RefreshJwtConfig)

    const res: authVerifyReturnType = {
      message: SUCCESS_VERIFICATION_MESSAGE,
      jwtToken: newAccessToken,
      refreshToken: newRefreshToken
    }
    return res
  }

  @Post('reset-password/verify')
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  async verifyPasswordChangeKey(
    @Body() { email, verifyCode }: VerifyUser,
    @DeviceType() deviceType: string
  ) {
    const { id } = await this.userService.findBy({ email })
    const sessionKey: string = generateSessionKey(String(id), deviceType)
    await this.authService.isVerified(verifyCode, sessionKey)
    await this.authService.changeIsConfirmedChangePassword(email, true)

    return {
      message: SUCCESS_VERIFICATION_MESSAGE
    }
  }

  @Patch("reset-password")
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  async submitNewPassword(
    @Body() { password }: ResetPasswordDto,
    @Headers('Authorization') authorization: string) {
    const hash: string = await this.authService.hashPassword(password)
    const { email } = await this.authService.getDataFromJwt(authorization)
    const updatedUser = await this.authService.submitNewPassword(email, hash)

    return {
      message: PASSWORD_CHANGED_MESSAGE
    }
  }
}
