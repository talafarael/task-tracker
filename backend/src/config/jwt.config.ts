import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_ACCESS_SECRET as string,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET as string,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
}));
