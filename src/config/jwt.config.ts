import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

import appConfig from './configuration.config';

const config = appConfig()

export const AccessJwtConfig: JwtSignOptions = {
  secret: config.ACCESS_SECRET_KEY,
  expiresIn : '30d',
};

export const RefreshJwtConfig: JwtSignOptions = {
  secret: config.REFRESH_SECRET_KEY,
  expiresIn : '90d',
};

