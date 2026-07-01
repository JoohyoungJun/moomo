import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserConfirmPasswordDto } from '@/users/dto/user-request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { ApiErrorResponse } from '@/common/decorators/api-error-response.decorator';
import { AUTH_ERRORS, COMMON_ERRORS } from '@/common/constants/errors';
import { UserResponseDto } from '@/users/dto/user-response.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import type { Request, Response } from 'express';
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard';
import { JwtRefreshUser } from './jwt/types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiSuccessResponse(HttpStatus.CREATED, UserResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    AUTH_ERRORS.PASSWORD_MISMATCH,
    AUTH_ERRORS.PASSWORD_TOO_SHORT,
    AUTH_ERRORS.PASSWORD_TOO_LONG,
  )
  @ApiErrorResponse(AUTH_ERRORS.USER_ALREADY_EXISTS)
  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserConfirmPasswordDto) {
    return this.authService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiSuccessResponse(HttpStatus.OK, UserResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() body: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.signIn(body);
    this.authService.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: HttpStatus.OK, description: '로그아웃 성공' })
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  signOut(@Res({ passthrough: true }) res: Response) {
    this.authService.clearAuthCookies(res);

    return {
      message: '로그아웃이 완료되었습니다.',
    };
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @ApiResponse({ status: HttpStatus.OK, description: '토큰 갱신 성공' })
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED, AUTH_ERRORS.INVALID_TOKEN)
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request & { user: JwtRefreshUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      req.user.id,
      req.user.email,
    );

    this.authService.setAuthCookies(res, accessToken, refreshToken);

    return {
      message: '토큰 갱신 성공',
    };
  }
}
