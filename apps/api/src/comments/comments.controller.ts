import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCommentsResponseDto } from './dto/comments-response.dto';
import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { ApiErrorResponse } from '@/common/decorators/api-error-response.decorator';
import { COMMON_ERRORS, POSTS_ERRORS } from '@/common/constants/errors';
import { CreateCommentsRequestDto } from './dto/comments-request.dto';
import { Request } from 'express';
import { JwtAccessUser } from '@/auth/jwt/types';
import { JwtAccessGuard } from '@/auth/jwt/jwt-access.guard';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';

@Controller('/posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '댓글 생성' })
  @ApiSuccessResponse(HttpStatus.CREATED, CreateCommentsResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(POSTS_ERRORS.POST_NOT_FOUND)
  @UseGuards(JwtAccessGuard)
  @Post()
  createComment(
    @Param('postId') postId: string,
    @Body() body: CreateCommentsRequestDto,
    @Req() req: Request & { user: JwtAccessUser },
  ) {
    return this.commentsService.createComment(postId, body, req.user.id);
  }

  @ApiOperation({ summary: '댓글 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, [CreateCommentsResponseDto])
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(POSTS_ERRORS.POST_NOT_FOUND)
  @Get()
  getAllComments(
    @Param('postId') postId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.commentsService.getAllComments(postId, query);
  }
}
