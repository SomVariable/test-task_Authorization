import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IUsersResponse {
    users: User[];
    totalItems: number;
    pagination: number;
    page: number;
    message?: string;
    additionalInfo?: object;
}


@Injectable()
export class UsersResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: IUsersResponse) => {
        const {users, page, additionalInfo, message, pagination, totalItems} = data
        let responseObject
        
        const excludeDataFromUsers = users?.map(({email, id }) => ({email, id}))
        responseObject = {
            message,
            data: excludeDataFromUsers,
            totalItems: totalItems,
            pagination: pagination,
            page: page,
            additionalInfo 
        }

        return JSON.stringify(responseObject);
      }),
    );
  }
}