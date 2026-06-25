import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { ApiErrorResponse } from '@/common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '@/common/decorators/api-success-response.decorator';
import { COMMON_ERRORS, POSTS_ERRORS } from '@/common/constants/errors';
import { JwtAccessGuard } from '@/auth/jwt/jwt-access.guard';
import type { JwtAccessUser } from '@/auth/jwt/types';
import { PostsService } from './posts.service';
import {
  CreatePostsRequestDto,
  UpdatePostsRequestDto,
} from './dto/posts-request.dto';
import { PostsResponseDto } from './dto/posts-response.dto';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '게시글 생성' })
  @ApiSuccessResponse(HttpStatus.CREATED, PostsResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(POSTS_ERRORS.POST_TOO_SHORT, POSTS_ERRORS.POST_TOO_LONG)
  @UseGuards(JwtAccessGuard)
  @Post()
  createPost(
    @Body() createPostsRequestDto: CreatePostsRequestDto,
    @Req() req: Request & { user: JwtAccessUser },
  ) {
    return this.postsService.createPost(createPostsRequestDto, req.user.id);
  }

  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, [PostsResponseDto])
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllPosts(@Query() query: PaginationQueryDto) {
    return this.postsService.getAllPosts(query);
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiSuccessResponse(HttpStatus.OK, PostsResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @ApiSuccessResponse(HttpStatus.OK, PostsResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(POSTS_ERRORS.POST_NOT_FOUND)
  @ApiErrorResponse(POSTS_ERRORS.POST_TOO_SHORT, POSTS_ERRORS.POST_TOO_LONG)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  updatePost(
    @Param('id') postId: string,
    @Body() updatePostData: UpdatePostsRequestDto,
    @Req() req: Request & { user: JwtAccessUser },
  ) {
    return this.postsService.updatePost(postId, req.user.id, updatePostData);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '게시글 삭제 성공',
  })
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(POSTS_ERRORS.POST_NOT_FOUND)
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePost(
    @Param('id') postId: string,
    @Req() req: Request & { user: JwtAccessUser },
  ) {
    return this.postsService.deletePost(postId, req.user.id);
  }
}
