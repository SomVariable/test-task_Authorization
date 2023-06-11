import { JwtModuleAsyncOptions } from '@nestjs/jwt';

import appConfig from './configuration.config';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: appConfig().secret_key,
      signOptions: { expiresIn: '3600s' },
    };
  },
};
