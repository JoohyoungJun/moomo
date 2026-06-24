import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ApiErrorResponse } from '@/common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { COMMON_ERRORS } from '@/common/constants/errors';
import { JwtAccessGuard } from '@/auth/jwt/jwt-access.guard';
import type { JwtAccessUser } from '@/auth/jwt/types';
import { PostsService } from './posts.service';
import { CreatePostsRequestDto } from './dto/create-posts-request.dto';
import { CreatePostsResponseDto } from './dto/create-posts-response.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '게시글 생성' })
  @ApiSuccessResponse(HttpStatus.CREATED, CreatePostsResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @UseGuards(JwtAccessGuard)
  @Post()
  createPost(
    @Body() createPostsRequestDto: CreatePostsRequestDto,
    @Req() req: Request & { user: JwtAccessUser },
  ) {
    return this.postsService.createPost(createPostsRequestDto, req.user.id);
  }
}
