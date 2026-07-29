import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { RefreshTokenUser } from './interfaces/jwt-payload.interface';
import { AuthResponseEntity } from './entities/auth-response.entity';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a user and issues an access token and a refresh token in the response body.',
  })
  @ApiResponse({ status: 201, type: AuthResponseEntity })
  @ApiResponse({ status: 409, description: 'Email is already in use' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Log in with email and password',
    description:
      'Issues an access token and a refresh token in the response body.',
  })
  @ApiResponse({ status: 200, type: AuthResponseEntity })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Rotate access/refresh tokens',
    description:
      'Reads the refresh token from the Authorization header, verifies it against the stored hash, and issues a new token pair.',
  })
  @ApiResponse({ status: 200, type: AuthResponseEntity })
  @ApiResponse({
    status: 403,
    description: 'Refresh token missing, invalid or revoked',
  })
  async refresh(@CurrentUser() currentUser: RefreshTokenUser) {
    return this.authService.refreshTokens(
      currentUser.userId,
      currentUser.refreshToken,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Log out the current user',
    description: 'Revokes the stored refresh token.',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@CurrentUser('userId') userId: string) {
    await this.authService.logout(userId);
    return { success: true };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiResponse({ status: 200, type: UserEntity })
  getCurrentUser(@CurrentUser('userId') userId: string) {
    return this.authService.getCurrentUser(userId);
  }
}
