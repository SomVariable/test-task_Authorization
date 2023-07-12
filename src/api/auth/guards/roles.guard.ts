import { ROLES_KEY } from './../../roles/roles.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AccessJwtConfig } from 'src/config/jwt.config';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
   
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    try {
      // const decodedToken = this.jwtService.verify(token, AccessJwtConfig);
      // const {sub} = decodedToken;
      // const {role}: User = await this.prismaService.user.findFirst({where: {id: sub}})

      // return requiredRoles.some((r) => role === r);
      return true
    } catch (error) {
      console.error(error);
      return false; 
    }
  }
}