import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import {
  CreatePostsRequestDto,
  UpdatePostsRequestDto,
} from './dto/posts-request.dto';
import { COMMON_ERRORS, POSTS_ERRORS } from '@/common/constants/errors';
import { AppException } from '@/common/exception/app.exception';
import {
  POSTS_MAX_LENGTH_CONTENT,
  POSTS_MAX_LENGTH_TITLE,
  POSTS_MIN_LENGTH,
} from './constants';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';
import {
  buildPaginationResponse,
  getPaginationParams,
} from '@/common/pagination/pagination.util';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async createPost(postData: CreatePostsRequestDto, authorId: string) {
    const title = postData.title.trim();
    const content = postData.content.trim();

    if (title.length < POSTS_MIN_LENGTH || content.length < POSTS_MIN_LENGTH) {
      throw new AppException(POSTS_ERRORS.POST_TOO_SHORT);
    }

    if (
      title.length > POSTS_MAX_LENGTH_TITLE ||
      content.length > POSTS_MAX_LENGTH_CONTENT
    ) {
      throw new AppException(POSTS_ERRORS.POST_TOO_LONG);
    }

    const post = await this.postsRepository.createPost(
      { title, content },
      authorId,
    );

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async getAllPosts(query: PaginationQueryDto) {
    const { page, pageSize, skip, take } = getPaginationParams(query);

    const { items, total } = await this.postsRepository.findAllPosts(
      skip,
      take,
    );

    const mappedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      authorId: item.authorId,
      createdAt: item.createdAt,
    }));

    return buildPaginationResponse(mappedItems, total, page, pageSize);
  }

  async getPostById(postId: string) {
    const post = await this.postsRepository.findPostById(postId);

    if (post === null) {
      throw new AppException(POSTS_ERRORS.POST_NOT_FOUND);
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async updatePost(
    postId: string,
    authorId: string,
    postData: UpdatePostsRequestDto,
  ) {
    const post = await this.postsRepository.findPostById(postId);

    if (post === null) {
      throw new AppException(POSTS_ERRORS.POST_NOT_FOUND);
    }

    if (post.authorId !== authorId) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    const normalizedData: UpdatePostsRequestDto = {};

    if (postData.title !== undefined) {
      const title = postData.title.trim();

      if (title.length < POSTS_MIN_LENGTH) {
        throw new AppException(POSTS_ERRORS.POST_TOO_SHORT);
      }

      if (title.length > POSTS_MAX_LENGTH_TITLE) {
        throw new AppException(POSTS_ERRORS.POST_TOO_LONG);
      }

      normalizedData.title = title;
    }

    if (postData.content !== undefined) {
      const content = postData.content.trim();

      if (content.length < POSTS_MIN_LENGTH) {
        throw new AppException(POSTS_ERRORS.POST_TOO_SHORT);
      }

      if (content.length > POSTS_MAX_LENGTH_CONTENT) {
        throw new AppException(POSTS_ERRORS.POST_TOO_LONG);
      }

      normalizedData.content = content;
    }

    if (
      normalizedData.title === undefined &&
      normalizedData.content === undefined
    ) {
      throw new AppException(POSTS_ERRORS.POST_UPDATE_EMPTY);
    }

    const updatedPost = await this.postsRepository.updatePost(
      postId,
      normalizedData,
    );

    return {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      authorId: updatedPost.authorId,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };
  }

  async deletePost(postId: string, authorId: string) {
    const post = await this.postsRepository.findPostById(postId);

    if (post === null) {
      throw new AppException(POSTS_ERRORS.POST_NOT_FOUND);
    }

    if (post.authorId !== authorId) {
      throw new AppException(COMMON_ERRORS.FORBIDDEN);
    }

    await this.postsRepository.deletePost(postId);

    return;
  }
}
