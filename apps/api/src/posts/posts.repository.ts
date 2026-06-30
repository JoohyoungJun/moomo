import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreatePostsRequestDto,
  UpdatePostsRequestDto,
} from './dto/posts-request.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPost(postData: CreatePostsRequestDto, authorId: string) {
    return this.prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        authorId,
      },
    });
  }

  async findAllPosts(skip: number, take: number) {
    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count(),
    ]);

    return { items, total };
  }

  findPostById(postId: string) {
    return this.prisma.post.findUnique({
      where: { id: postId },
    });
  }

  async findPostsByAuthorId(authorId: string, skip: number, take: number) {
    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where: { authorId } }),
    ]);

    return { items, total };
  }

  updatePost(postId: string, postData: UpdatePostsRequestDto) {
    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title: postData.title,
        content: postData.content,
      },
    });
  }

  deletePost(postId: string) {
    return this.prisma.post.delete({
      where: { id: postId },
    });
  }
}
