import { User } from '@prisma/client';

export type PublicUser = Omit<User, 'password' | 'refreshToken'>;

export function toPublicUser(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, refreshToken, ...rest } = user;
  return rest;
}
