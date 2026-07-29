import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import {
  JwtPayload,
  RefreshTokenUser,
} from '../interfaces/jwt-payload.interface';
import jwtConfig from '../../config/jwt.config';

function extractRefreshTokenFromCookie(req: Request): string | null {
  return (req.cookies?.refreshToken as string | undefined) ?? null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractRefreshTokenFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.refresh.secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): RefreshTokenUser {
    const refreshToken = extractRefreshTokenFromCookie(req) ?? '';
    return { userId: payload.sub, email: payload.email, refreshToken };
  }
}
