import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { ApiErrorResponse } from '@/common/decorators/api-error-response.decorator';
import { AUTH_ERRORS, COMMON_ERRORS } from '@/common/constants/errors';
import { UserResponseDto } from '@/users/dto/user-response.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiSuccessResponse(HttpStatus.CREATED, UserResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(AUTH_ERRORS.USER_ALREADY_EXISTS)
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiSuccessResponse(HttpStatus.OK, UserResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS)
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
  @Post('sign-out')
  signOut(@Res({ passthrough: true }) res: Response) {
    this.authService.clearAuthCookies(res);

    return {
      message: '로그아웃이 완료되었습니다.',
    };
  }
}
