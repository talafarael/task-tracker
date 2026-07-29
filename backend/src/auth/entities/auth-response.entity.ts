import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class AuthResponseEntity {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
