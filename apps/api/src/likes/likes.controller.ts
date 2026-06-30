import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { JwtAccessGuard } from '@/auth/jwt/jwt-access.guard';
import { ApiErrorResponse } from '@/common/decorators/api-error-response.decorator';
import { COMMON_ERRORS } from '@/common/constants/errors';
import { POSTS_ERRORS } from '@/common/constants/errors';
import { Request } from 'express';
import { JwtAccessUser } from '@/auth/jwt/types';
import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { LikesResponseDto } from './dto/likes-response.dto';

@ApiTags('likes')
@Controller('/posts/:postId/like')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ summary: '좋아요 토글' })
  @ApiOperation({ summary: '게시글 좋아요 토글' })
  @ApiSuccessResponse(HttpStatus.OK, LikesResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(POSTS_ERRORS.POST_NOT_FOUND)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  toggleLike(
    @Param('postId') postId: string,
    @Req() req: Request & { user: JwtAccessUser },
  ) {
    return this.likesService.toggleLike(req.user.id, postId);
  }
}
