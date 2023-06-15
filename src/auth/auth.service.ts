import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Status, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { VerificationService } from 'src/verification/verification.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private verificationService: VerificationService
  ) { }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user: User = await this.userService.findByEmail(email);

    if (!user) {
      return null
    }
    const isCompare: boolean = await bcrypt.compare(password, user.hash)

    if (user && isCompare) {
      return user
    }

    return null;
  }

  async singUp(data: Prisma.UserCreateInput, res: Response) {
    console.log(data)
    try {
      const userData = await this.userService.create(data);
      const { email } = userData;

      if (userData) {
        this.sendVerificationKey(email, res)
      } else {
        return new UnauthorizedException('Invalid email or password')
      }

    } catch (error) {
      throw new UnauthorizedException('RegistrationError')
    }
  }

  async signIn({ email, password, res }: { email: string, password: string, res: Response }) {
    const user = await this.validateUser(email, password)
    if (user) {
      this.sendVerificationKey(email, res)
    } else {
      return new UnauthorizedException('Invalid email or password')
    }
  }

  sendVerificationKey(email: string, res: Response) {
    res.cookie('email', email)

    const verifiCode = this.verificationService.generateVerificationCode()
    this.verificationService.sendVerificationCode(email, verifiCode)
  }

  async generateToken(email: string): Promise<string> {
    const user: User = await this.userService.findByEmail(email)
    const payload = { username: user.email, sub: user.id };
    const jwt: string = this.jwtService.sign(payload)

    return jwt
  }

  async isVerified(verifiCode: string, email: string): Promise<boolean> {
    const isVerified = await this.verificationService.validateVerifiCode(verifiCode, email);

    return isVerified ? true : false
  }



  async activeUserStatus(email: string): Promise<string> {
    const isUpdated = await this.userService.chageStatus(email, Status.active);

    if (isUpdated) {
      return "user status was changed"
    } else {
      return "user status was'nt changed"
    }
  }

  async blockUser(email: string): Promise<string> {
    const isUpdated = await this.userService.chageStatus(email, Status.blocked);

    if (isUpdated) {
      return "user status was changed"
    } else {
      return "user status was'nt changed"
    }
  }

  async sendVerifiKeyForChangePassword(email: string, res: Response): Promise<string> {
    const user = this.userService.findByEmail(email)

    if (user) {
      this.sendVerificationKey(email, res)
      return 'the code of verification was sended on your email'
    } else {
      return 'there is no such user'
    }
  }

  async changeIsConfirmedChangePassword(email: string, state: boolean) {
    const { id } = await this.userService.findByEmail(email)
    if (state) {
      const newData: Partial<User> = {
        isConfirmedChangePassword: true
      }
      this.userService.updateProperty(id, newData)
    } else {
      const newData: Partial<User> = {
        isConfirmedChangePassword: false
      }
      this.userService.updateProperty(id, newData)
    }
  }

  async submitNewPassword(email: string, password: string) {
    const user: User = await this.userService.findByEmail(email);
    const {id, isConfirmedChangePassword} = user
    if(isConfirmedChangePassword){
      const newData : Partial<User> = {hash: password}
      this.changeIsConfirmedChangePassword(email, false)
      return  await this.userService.updateProperty(id, newData)
    }else{
      throw new UnauthorizedException('you are not verified')
    }

  }

}
