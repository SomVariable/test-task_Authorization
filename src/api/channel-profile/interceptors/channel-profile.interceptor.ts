import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { User, ChannelProfile } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ChannelProfileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return JSON.stringify(data);
      }),
    );
  }
}