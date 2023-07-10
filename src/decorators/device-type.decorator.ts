import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const DeviceType = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userAgent = request.headers['user-agent'];

    if (userAgent.includes('Mobile')) {
      return 'mobile';
    } else if (userAgent.includes('Tablet')) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  },
);