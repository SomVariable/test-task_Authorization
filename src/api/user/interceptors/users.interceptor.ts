import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserReturnType, usersResponse } from '../types/user.types';




@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: usersResponse) => {
        const { users, page, additionalInfo, message, pagination, totalCountUsers } = data
        let responseObject
        if (Array.isArray(users)) {
          const excludeDataFromUsers = users?.map(
            (userUnion): UserReturnType => {
              const { birth_date, city, country, email, login  } = userUnion
              return { birth_date, city, country, email, login }
            }
          )
          responseObject = {
            message,
            users: excludeDataFromUsers,
            totalCountUsers: totalCountUsers,
            pagination: pagination,
            page: page,
            additionalInfo
          }

          return JSON.stringify(responseObject);
        }
        const { birth_date, city, country, email, login } = users

        const excludeDataFromUser = { birth_date, city, country, email, login }

        responseObject = {
          message,
          user: excludeDataFromUser,
          totalCountUsers: totalCountUsers,
          pagination: pagination,
          page: page,
          additionalInfo
        }

        return JSON.stringify(responseObject);
      }),
    );
  }
}