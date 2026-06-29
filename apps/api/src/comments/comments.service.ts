import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CommentsRequestDto } from './dto/comments-request.dto';
import { PostsRepository } from '@/posts/posts.repository';
import {
  COMMENTS_ERRORS,
  COMMON_ERRORS,
  POSTS_ERRORS,
} from '@/common/constants/errors';
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
    data: CommentsRequestDto,
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

  async updateComment(
    postId: string,
    userId: string,
    commentId: string,
    data: CommentsRequestDto,
  ) {
    const post = await this.postsRepository.findPostById(postId);

    if (post === null) {
      throw new AppException(POSTS_ERRORS.POST_NOT_FOUND);
    }

    const comment = await this.commentsRepository.findCommentById(commentId);

    if (comment === null) {
      throw new AppException(COMMENTS_ERRORS.COMMENT_NOT_FOUND);
    }

    if (comment.authorId !== userId) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    if (comment.postId !== postId) {
      throw new AppException(COMMENTS_ERRORS.COMMENT_POST_MISMATCH);
    }

    if (data.content === undefined) {
      throw new AppException(COMMENTS_ERRORS.COMMENT_UPDATE_EMPTY);
    }

    return this.commentsRepository.updateComment(commentId, data);
  }

  async deleteComment(postId: string, userId: string, commentId: string) {
    const post = await this.postsRepository.findPostById(postId);

    if (post === null) {
      throw new AppException(POSTS_ERRORS.POST_NOT_FOUND);
    }

    const comment = await this.commentsRepository.findCommentById(commentId);

    if (comment === null) {
      throw new AppException(COMMENTS_ERRORS.COMMENT_NOT_FOUND);
    }

    if (comment.postId !== postId) {
      throw new AppException(COMMENTS_ERRORS.COMMENT_POST_MISMATCH);
    }

    if (comment.authorId !== userId) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    await this.commentsRepository.deleteComment(commentId);
  }
}
