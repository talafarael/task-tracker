import { Controller, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { DeductPointsDto } from './dto/deduct-points.dto';
import { UserEntity } from './entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { toPublicUser } from './user.serializer';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me/points')
  @ApiOperation({ summary: "Deduct points from the current user's balance" })
  @ApiResponse({ status: 200, type: UserEntity })
  async deductPoints(
    @CurrentUser('userId') userId: string,
    @Body() dto: DeductPointsDto,
  ) {
    const user = await this.usersService.deductPoints(userId, dto.amount);
    return toPublicUser(user);
  }
}
