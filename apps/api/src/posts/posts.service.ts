import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import {
  CreatePostsRequestDto,
  UpdatePostsRequestDto,
} from './dto/posts-request.dto';
import { COMMON_ERRORS, POSTS_ERRORS } from '@/common/constants/errors';
import { AppException } from '@/common/exception/app.exception';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async createPost(postData: CreatePostsRequestDto, authorId: string) {
    const post = await this.postsRepository.createPost(postData, authorId);

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

    if (postData.title === null && postData.content === null) {
      throw new AppException(POSTS_ERRORS.POST_UPDATE_EMPTY);
    }

    const updatedPost = await this.postsRepository.updatePost(postId, postData);

    return {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      authorId: updatedPost.authorId,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };
  }
}
