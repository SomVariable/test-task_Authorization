import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

import appConfig from './configuration.config';


export const AccessJwtConfig: JwtSignOptions = {
  secret: appConfig().ACCESS_SECRET_KEY,
  expiresIn : '30d',
};

export const RefreshJwtConfig: JwtSignOptions = {
  secret: appConfig().REFRESH_SECRET_KEY,
  expiresIn : '90d',
};

