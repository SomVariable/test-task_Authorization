import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { authUserReturnType } from '../types/auth.types';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: authUserReturnType) => {
        const { user, message } = data;
        const { email, status, role, id } = user;
        const excludeDataFromUser = {
          email,
          status,
          role,
          id
        };
        const responseObject = {
          message,
          data: excludeDataFromUser
        };

        return responseObject;
      }),
    );
  }
}