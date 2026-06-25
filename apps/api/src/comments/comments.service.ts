import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentsRequestDto } from './dto/comments-request.dto';
import { PostsRepository } from '@/posts/posts.repository';
import { POSTS_ERRORS } from '@/common/constants/errors';
import { AppException } from '@/common/exception/app.exception';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';
import {
  buildPaginationResponse,
  getPaginationParams,
} from '@/common/pagination/pagination.util';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createComment(
    postId: string,
    data: CreateCommentsRequestDto,
    authorId: string,
  ) {
    const post = await this.postsRepository.findPostById(postId);

    if (post === null) {
      throw new AppException(POSTS_ERRORS.POST_NOT_FOUND);
    }

    const comment = await this.commentsRepository.createComment(
      postId,
      data,
      authorId,
    );

    return {
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      authorId: comment.authorId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  async getAllComments(postId: string, query: PaginationQueryDto) {
    const post = await this.postsRepository.findPostById(postId);

    if (post === null) {
      throw new AppException(POSTS_ERRORS.POST_NOT_FOUND);
    }

    const { page, pageSize, skip, take } = getPaginationParams(query);

    const { items, total } = await this.commentsRepository.findAllComments(
      postId,
      skip,
      take,
    );

    const mappedItems = items.map((item) => ({
      id: item.id,
      content: item.content,
      postId: item.postId,
      authorId: item.authorId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return buildPaginationResponse(mappedItems, total, page, pageSize);
  }
}
