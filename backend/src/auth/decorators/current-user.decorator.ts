import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { RefreshTokenUser } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof RefreshTokenUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: RefreshTokenUser }>();
    return data ? request.user[data] : request.user;
  },
);
