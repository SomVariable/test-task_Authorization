import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { userResponse } from '../types/user.types';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: userResponse) => {
        const {user, additionalInfo, message} = data
        const {id, email, role, status} = user
        let responseObject
        
        const excludeDataFromUser = {
          id, 
          email, 
          role, 
          status
        }


        responseObject = {
          message,
          data: excludeDataFromUser,
          additionalInfo
        }

        console.log(responseObject)

        return JSON.stringify(responseObject);
      }),
    );
  }
}