import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ConfigType } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { RefreshTokenUser } from './interfaces/jwt-payload.interface';
import { parseDurationToMs } from './utils/parse-duration';
import appConfig from '../config/app.config';
import jwtConfig from '../config/jwt.config';
import { AuthResponseEntity } from './entities/auth-response.entity';
import { UserEntity } from '../users/entities/user.entity';

const REFRESH_COOKIE_NAME = 'refreshToken';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a user, issues an access token in the response body and sets the refresh token as an httpOnly cookie.',
  })
  @ApiResponse({ status: 201, type: AuthResponseEntity })
  @ApiResponse({ status: 409, description: 'Email is already in use' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(dto);
    this.setRefreshTokenCookie(res, refreshToken);
    return { user, accessToken };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Log in with email and password',
    description:
      'Issues an access token in the response body and sets the refresh token as an httpOnly cookie.',
  })
  @ApiResponse({ status: 200, type: AuthResponseEntity })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(dto);
    this.setRefreshTokenCookie(res, refreshToken);
    return { user, accessToken };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Rotate access/refresh tokens',
    description:
      'Reads the refresh token from the httpOnly cookie, verifies it against the stored hash, and issues a new token pair.',
  })
  @ApiResponse({ status: 200, type: AuthResponseEntity })
  @ApiResponse({
    status: 403,
    description: 'Refresh token missing, invalid or revoked',
  })
  async refresh(
    @CurrentUser() currentUser: RefreshTokenUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.refreshTokens(
        currentUser.userId,
        currentUser.refreshToken,
      );
    this.setRefreshTokenCookie(res, refreshToken);
    return { user, accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Log out the current user',
    description: 'Revokes the stored refresh token and clears the cookie.',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @CurrentUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/auth/refresh' });
    return { success: true };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiResponse({ status: 200, type: UserEntity })
  getCurrentUser(@CurrentUser('userId') userId: string) {
    return this.authService.getCurrentUser(userId);
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: this.appConfiguration.nodeEnv === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: parseDurationToMs(this.jwtConfiguration.refresh.expiresIn),
    });
  }
}
