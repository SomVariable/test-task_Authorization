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
        const {user, message} = data
        let responseObject
        
        const excludeDataFromUser = {
          id: user.id,
          email: user.email,
        }

        responseObject = {
          message,
          data: {
            user: excludeDataFromUser
          }
        }

        return JSON.stringify(responseObject);
      }),
    );
  }
}