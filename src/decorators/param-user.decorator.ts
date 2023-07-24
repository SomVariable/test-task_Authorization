import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { userResponse } from "src/api/user/types/user.types";

export const UserParam = createParamDecorator(
    (data: string, ctx: ExecutionContext): userResponse => {
      switch (ctx.getType()) {
        case 'http':
          const httpRequest = ctx.switchToHttp().getRequest();
          const user = httpRequest.user;

          if (user && user.sub === -1) return null;
          
          return data ? user?.[data] : user;
        case 'ws':
          return ctx.switchToWs().getClient().data;
      }
    },
  );