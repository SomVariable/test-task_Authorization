import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Prisma, Status, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { VerificationService } from 'src/verification/verification.service';
import { SentMessageInfo } from 'nodemailer';
import { generateResponseMessage } from 'src/helpers/create-res-object';
import { AccessJwtConfig } from 'src/config/jwt.config';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { KvStoreService } from 'src/kv-store/kv-store.service';
import { generateSessionKey } from 'src/helpers/create-session-key';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private verificationService: VerificationService,
    private kvStoreService: KvStoreService
  ) { }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findBy({ email });

    if (!user) {
      throw new BadRequestException(generateResponseMessage({ message: 'wrong email or password' }))
    }

    const isCompare: boolean = await bcrypt.compare(password, user.hash)

    if (isCompare) {
      return user
    }

    throw new BadRequestException(generateResponseMessage({ message: 'wrong email or password' }));
  }

  async singUp(data: Prisma.UserCreateInput, deviceType: string): Promise<User> {
    const userData: User = await this.userService.create(data);
    const { email, id } = userData;
    const sessionKey: string = generateSessionKey(String(id), deviceType)

    await this.kvStoreService.createSession({id: sessionKey})
    await this.sendVerificationKey(email, sessionKey)
    return userData
    
  }

  async signIn({ email, password }: { email: string, password: string }, deviceType: string) {
    const user: User = await this.validateUser(email, password)
    const sessionKey: string = generateSessionKey(String(user.id), deviceType)

    this.kvStoreService.activeSession({id: sessionKey})
    this.sendVerificationKey(email, sessionKey)
    
    return user
  }

  async sendVerificationKey(email: string, sessionKey: string): Promise<SentMessageInfo | null> {
    const verifyCode = this.verificationService.generateVerificationCode()
    return await this.verificationService.sendVerificationCode(email, sessionKey, verifyCode)
  }

  async generateToken(email: string, sessionKey: string,  options?: JwtSignOptions): Promise<string> {
    const user: User = await this.userService.findBy({ email })
    const payload = { email: user.email, sub: user.id, sessionKey }; // add role
    const jwt: string = this.jwtService.sign(payload, options)

    return jwt
  }

  async isVerified(verifyCode: string, sessionKey: string): Promise<boolean> {
    return await this.verificationService.validateVerifyCode(verifyCode, sessionKey);
  }

  async activeUserStatus(email: string): Promise<User | null> {
    const { id }: User = await this.userService.findBy({ email })
    return await this.userService.updateProperty(id, { status: Status.ACTIVE });
  }

  async getDataFromJwt(authorization: string, option: JwtSignOptions = AccessJwtConfig){
    const token = authorization?.replace('Bearer ', '');
    const dataFromToken = await this.jwtService.verify(token, option)

    return dataFromToken ;
  }

  async changeIsConfirmedChangePassword(email: string, state: boolean): Promise<User> {
    const { id } = await this.userService.findBy({ email })
    const newData: UpdateUserDto = {
      isConfirmedChangePassword: state
    }
    return await this.userService.updateProperty(id, newData)
  }

  async submitNewPassword(email: string, hash: string): Promise<User | null> {
    const user: User = await this.userService.findBy({ email });
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
