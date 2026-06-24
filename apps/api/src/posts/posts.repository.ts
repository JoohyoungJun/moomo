import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePostsRequestDto } from './dto/create-posts-request.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(postData: CreatePostsRequestDto, authorId: string) {
    return this.prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        authorId,
      },
    });
  }
}
