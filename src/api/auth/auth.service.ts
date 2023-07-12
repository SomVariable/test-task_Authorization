import { UserProfileService } from './../user-profile/user-profile.service';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Prisma, Status, User } from '@prisma/client';
import * as bcrypt from 'bcrypt'
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SentMessageInfo } from 'nodemailer';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { AccessJwtConfig } from 'src/config/jwt.config';
import { generateSessionKey } from 'src/helpers/create-session-key';
import { UserService } from '../user/user.service';
import { VerificationService } from '../verification/verification.service';
import { KvStoreService } from '../kv-store/kv-store.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserProfileDto } from '../user-profile/dto/create-user-profile.dto';
import { authUserReturnType } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private verificationService: VerificationService,
    private kvStoreService: KvStoreService,
    private userProfileService: UserProfileService
  ) { }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findBy({ email });

    if (!user) {
      throw new BadRequestException(generateResponseMessage({ message: 'wrong email or password' }))
    }

    const isCompare: boolean = await bcrypt.compare(password, user.hash)

    if (isCompare) {
      return user
    }

    throw new BadRequestException(generateResponseMessage({ message: 'wrong email or password' }));
  }

  async singUp(data: {email: string, password: string, login: string}, deviceType: string): Promise<User> {
    const {email, login, password} = data
    const userData = await this.userService.create({email, hash: password});
    const { id } = userData;
    const sessionKey: string = generateSessionKey(String(id), deviceType)
    
    //await this.userProfileService.create({login, userId: userData.id})
    await this.kvStoreService.createSession({id: sessionKey})
    await this.sendVerificationKey(email, sessionKey)
    
    return userData
  }

  async signIn({ email, password }: { email: string, password: string }, deviceType: string) {
    const user = await this.validateUser(email, password)
    const sessionKey: string = generateSessionKey(String(user.id), deviceType)

    this.kvStoreService.activeSession({id: sessionKey})
    this.sendVerificationKey(email, sessionKey)
    
    return user
  }

  async sendVerificationKey(email: string, sessionKey: string): Promise<SentMessageInfo | null> {
    const verifyCode = this.verificationService.generateVerificationCode()
    return await this.verificationService.sendVerificationCode(email, sessionKey, verifyCode)
  }


  async isVerified(verifyCode: string, sessionKey: string): Promise<boolean> {
    return await this.verificationService.validateVerifyCode(verifyCode, sessionKey);
  }

  async activeUserStatus(email: string): Promise<User | null> {
    const { id } = await this.userService.findBy({ email })
    return await this.userService.updateProperty(id, { status: Status.ACTIVE });
  }


  async changeIsConfirmedChangePassword(email: string, state: boolean): Promise<User> {
    const { id } = await this.userService.findBy({ email })
    const newData: UpdateUserDto = {
      isConfirmedChangePassword: state
    }
    return await this.userService.updateProperty(id, newData)
  }

  async submitNewPassword(email: string, hash: string): Promise<User | null> {
    const user = await this.userService.findBy({ email });
    const { id, isConfirmedChangePassword } = user
    
    if (isConfirmedChangePassword) {
      const newData: UpdateUserDto = { hash }
      await this.changeIsConfirmedChangePassword(email, false)
      return await this.userService.updateProperty(id, newData)
    } else {
      throw new UnauthorizedException(generateResponseMessage({
        message: 'You did not confirm the password change. Please check your email and enter the verification code'
      }))
    }
  }

  async hashPassword(password) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error by hashing');
    }
  }

  async logout(sessionKey: string): Promise<void> {
    await this.kvStoreService.blockSession({id: sessionKey})
  }
}
