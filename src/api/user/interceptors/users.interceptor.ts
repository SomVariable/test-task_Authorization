import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IUsersResponse {
  users: User | User[];
  totalCountUsers?: number;
  pagination?: number;
  page?: number;
  message?: string;
  additionalInfo?: object;
}


@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: IUsersResponse) => {
        const { users, page, additionalInfo, message, pagination, totalCountUsers } = data
        let responseObject
        if (Array.isArray(users)) {
          const excludeDataFromUsers = users?.map(({ email, id }) => ({ email, id }))
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
        const {id, email} = users

        const excludeDataFromUser = {id, email} 

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