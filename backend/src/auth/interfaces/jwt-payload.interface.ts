export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AccessTokenUser {
  userId: string;
  email: string;
}

export interface RefreshTokenUser extends AccessTokenUser {
  refreshToken: string;
}
