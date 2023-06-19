import { ROLES_KEY } from './../../roles/roles.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

   
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const role = request.headers["role"]
    console.log(requiredRoles, role)
    return requiredRoles.some((r) => role === r);
  }
}