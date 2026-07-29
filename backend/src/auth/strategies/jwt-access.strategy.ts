import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  AccessTokenUser,
  JwtPayload,
} from '../interfaces/jwt-payload.interface';
import jwtConfig from '../../config/jwt.config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.access.secret,
    });
  }

  validate(payload: JwtPayload): AccessTokenUser {
    return { userId: payload.sub, email: payload.email };
  }
}
