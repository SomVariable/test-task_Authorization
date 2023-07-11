import { UserService } from 'src/user/user.service';
import { Controller, Get, Post, Body, Param, UseGuards, Res, UsePipes, Headers, Patch, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ResponseMessage, generateResponseMessage } from 'src/helpers/create-res-object';
import { AccessJwtConfig, RefreshJwtConfig } from 'src/config/jwt.config';
import { AccessJwtAuthGuard } from './guards/access-jwt.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';
import { SentMessageInfo } from 'nodemailer';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUser } from './dto/verify-user.dto';
import { KvStoreService } from 'src/kv-store/kv-store.service';
import { DeviceType } from 'src/decorators/device-type.decorator';
import { generateSessionKey } from 'src/helpers/create-session-key';
import { jwtType } from './types/auth.types';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private kvStoreService: KvStoreService,
    private userService: UserService) { }

  // @Post('sign-up')
  // async signUp(
  //   @DeviceType() deviceType: string,
  //   @Body() { email, login, password }: CreateUserDto) {
  //   const hash: string = await this.authService.hashPassword(password)
  //   const user: User = await this.authService.singUp({ email, login, hash }, deviceType);
  //   if (user) {
  //     return generateResponseMessage({ message: `User with email ${email} was created, please verify your account` })
  //   } else {
  //     return generateResponseMessage({ message: `User wasn't created` })
  //   }
  // }

  // @Post('sign-in')
  // @UseGuards(AuthGuard('local'))
  // async signIn(@DeviceType() deviceType: string, @Body() { email, password }: SignInDto) {
  //   const user: User = await this.authService.signIn({ password, email }, deviceType);
  //   if (user) {
  //     return generateResponseMessage({ message: `A verification code was sent to your email` })
  //   } else {
  //     return generateResponseMessage({ message: `Wrong email or password` })
  //   }
  // }

  // @Post('reset-password')
  // @ApiBearerAuth()
  // @UseGuards(AccessJwtAuthGuard)
  // async requestPasswordChange(
  //   @Headers('Authorization') authorization: string) {
  //   const { email, sessionKey }: jwtType = await this.authService.getDataFromJwt(authorization);
  //   const message: SentMessageInfo = await this.authService.sendVerificationKey(email, sessionKey);

  //   return generateResponseMessage({ message })
  // }

  // @Post('sign-in/verify')
  // async login(
  //   @Body() { email, verifyCode }: VerifyUser,
  //   @DeviceType() deviceType: string): Promise<ResponseMessage> {
  //   const { id }: User = await this.userService.findBy({ email })
  //   const sessionKey: string = generateSessionKey(String(id), deviceType)
  //   await this.authService.isVerified(verifyCode, sessionKey)

  //   const accessToken: string = await this.authService.generateToken(email, sessionKey, AccessJwtConfig)
  //   const refreshToken: string = await this.authService.generateToken(email, sessionKey, RefreshJwtConfig)

  //   return generateResponseMessage({ data: { accessToken, refreshToken } })

  // }

  // @Patch("logout")
  // @ApiBearerAuth()
  // @UseGuards(AccessJwtAuthGuard)
  // async logout(
  //   @Headers('Authorization') authorization: string) {
  //     const jwtBody: jwtType = await this.authService.getDataFromJwt(authorization)
  //   await this.authService.logout(jwtBody.sessionKey)
  // }

  // @Post('sign-up/verify')
  // async registerWithConfirmation(
  //   @Body() { email, verifyCode }: VerifyUser,
  //   @DeviceType() deviceType: string): Promise<ResponseMessage> {
    
  //   const { id }: User = await this.userService.findBy({ email })
  //   const sessionKey: string = generateSessionKey(String(id), deviceType)
  //   await this.authService.isVerified(verifyCode, sessionKey)
    
  //   const jwtToken: string = await this.authService.generateToken(email, sessionKey, AccessJwtConfig)
  //   const refreshToken: string = await this.authService.generateToken(email, sessionKey, RefreshJwtConfig)

  //   await this.authService.activeUserStatus(email)

  //   return generateResponseMessage({
  //     message: "user was created",
  //     data: { jwtToken, refreshToken }
  //   })
  // }

  // @Get('refresh-token')
  // @ApiBearerAuth()
  // @UseGuards(RefreshJwtAuthGuard)
  // async refreshToken(
  //   @Headers('Authorization') authorization: string
  //   ) {
  //   const { email, sessionKey }: jwtType = await this.authService.getDataFromJwt(authorization, RefreshJwtConfig);

  //   const newAccessToken: string = await this.authService.generateToken(email, sessionKey, AccessJwtConfig)
  //   const newRefreshToken: string = await this.authService.generateToken(email, sessionKey, RefreshJwtConfig)


  //   return generateResponseMessage({
  //     message: `tokens was refresh`,
  //     data: {
  //       newAccessToken,
  //       newRefreshToken
  //     }
  //   })
  // }

  // @Post('reset-password/verify')
  // @ApiBearerAuth()
  // @UseGuards(AccessJwtAuthGuard)
  // async verifyPasswordChangeKey(
  //   @Body() { email, verifyCode }: VerifyUser,
  //   @DeviceType() deviceType: string
  //   ) {
  //   const { id }: User = await this.userService.findBy({ email })
  //   const sessionKey: string = generateSessionKey(String(id), deviceType)
  //   await this.authService.isVerified(verifyCode, sessionKey)
  //   await this.authService.changeIsConfirmedChangePassword(email, true)
  //   return generateResponseMessage({
  //     message: `now you can change the password`
  //   })
  // }

  // @Patch("reset-password")
  // @ApiBearerAuth()
  // @UseGuards(AccessJwtAuthGuard)
  // async submitNewPassword(
  //   @Body() { password }: ResetPasswordDto,
  //   @Headers('Authorization') authorization: string) {
  //   const hash: string = await this.authService.hashPassword(password)
  //   const { email } = await this.authService.getDataFromJwt(authorization)
  //   const updatedUser: User = await this.authService.submitNewPassword(email, hash)

  //   if (updatedUser) {
  //     return generateResponseMessage({
  //       message: `password was changed`
  //     })
  //   } else {
  //     return generateResponseMessage({
  //       message: `password wasn't changed`
  //     })
  //   }
  // }
}
