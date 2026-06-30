import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserMeResponseDto } from './dto/user-response.dto';
import { COMMON_ERRORS, USERS_ERRORS } from '@/common/constants/errors';
import { ApiErrorResponse } from '@/common/decorators/api-error-response.decorator';
import { JwtAccessGuard } from '@/auth/jwt/jwt-access.guard';
import { Request } from 'express';
import { JwtAccessUser } from '@/auth/jwt/types';
import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { PostsResponseDto } from '@/posts/dto/posts-response.dto';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiSuccessResponse(HttpStatus.OK, UserMeResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(USERS_ERRORS.USER_NOT_FOUND)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  getMe(@Req() req: Request & { user: JwtAccessUser }) {
    return this.usersService.getMe(req.user.id);
  }

  @ApiOperation({ summary: '내 게시글 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, [PostsResponseDto])
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me/posts')
  getMyPosts(
    @Query() query: PaginationQueryDto,
    @Req() req: Request & { user: JwtAccessUser },
  ) {
    return this.usersService.getMyPosts(req.user.id, query);
  }
}
