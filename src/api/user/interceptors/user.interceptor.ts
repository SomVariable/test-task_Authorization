import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IUserResponse {
  user: User;
  message?: string;
  additionalInfo?: object;
}


@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: IUserResponse) => {
        const {user, additionalInfo, message} = data
        let responseObject
        
        const excludeDataFromUser = {
          id: user.id,
          email: user.email,
        }

        responseObject = {
          message,
          data: excludeDataFromUser,
          additionalInfo
        }


        return JSON.stringify(responseObject);
      }),
    );
  }
}