import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { User, UserProfile } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type userUnion = UserProfile & User 
export type UserReturnType = Pick<User, "email"> & Pick<UserProfile, "login" | "birth_date" | "city" | "country">

export interface IUsersResponse {
  users: userUnion | userUnion[];
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