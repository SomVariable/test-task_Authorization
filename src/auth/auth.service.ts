import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Prisma, Status, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { VerificationService } from 'src/verification/verification.service';
import { SentMessageInfo } from 'nodemailer';
import { generateResponseMessage } from 'src/helpers/createResObject';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private verificationService: VerificationService
  ) { }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findBy({ email });

    if (!user) {
      throw new BadRequestException(generateResponseMessage({ message: 'wrong email or password' }))
    }
    const isCompare: boolean = await bcrypt.compare(password, user.hash)

    if (user && isCompare) {
      return user
    }

    throw new BadRequestException(generateResponseMessage({ message: 'wrong email or password' }));
  }

  async singUp(data: Prisma.UserCreateInput): Promise<User> {
    const userData: User = await this.userService.create(data);

    if (userData) {
      const { email } = userData;

      this.sendVerificationKey(email)
      return userData
    }
  }

  async signIn({ email, password }: { email: string, password: string }) {
    const user: User = await this.validateUser(email, password)

    if (user) {
      this.sendVerificationKey(email)
    } 

    return user
  }

  async sendVerificationKey(email: string): Promise<SentMessageInfo | null> {
    const verifyCode = this.verificationService.generateVerificationCode()
    return await this.verificationService.sendVerificationCode(email, verifyCode)
  }

  async generateToken(email: string, options?: JwtSignOptions): Promise<string> {
    const user: User = await this.userService.findBy({ email })
    const payload = { username: user.email, sub: user.id, role: user.role };
    const jwt: string = this.jwtService.sign(payload, options)

    return jwt
  }

  async isVerified(verifyCode: string, email: string): Promise<boolean> {
    return await this.verificationService.validateVerifyCode(verifyCode, email);
  }

  async activeUserStatus(email: string): Promise<User | null> {
    const { id }: User = await this.userService.findBy({ email })

    return await this.userService.updateProperty(id, { status: Status.active });

  }

  async changeIsConfirmedChangePassword(email: string, state: boolean): Promise<User> {
    const { id } = await this.userService.findBy({ email })
    const newData: Partial<User> = {
      isConfirmedChangePassword: state
    }
    return await this.userService.updateProperty(id, newData)

  }

  async submitNewPassword(email: string, hash: string): Promise<User | null> {
    const user: User = await this.userService.findBy({ email });
    const { id, isConfirmedChangePassword } = user
    
    if (isConfirmedChangePassword) {
      const newData: Partial<User> = { hash }
      await this.changeIsConfirmedChangePassword(email, false)
      return await this.userService.updateProperty(id, newData)
    } else {
      throw new UnauthorizedException(generateResponseMessage({
        message: 'You did not confirm the password change. Please check your email and enter the verification code'
      }))
    }

  }
}
