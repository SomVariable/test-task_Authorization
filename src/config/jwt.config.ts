import { JwtModuleAsyncOptions } from '@nestjs/jwt';

import appConfig from './configuration.config';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: appConfig().SECRET_KEY,
      signOptions: { expiresIn: '3600s' },
    };
  },
};
