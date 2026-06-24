import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostsRequestDto } from './dto/create-posts-request.dto';

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
}
