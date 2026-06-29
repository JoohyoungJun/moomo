import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCommentsRequestDto } from './dto/comments-request.dto';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createComment(
    postId: string,
    data: CreateCommentsRequestDto,
    authorId: string,
  ) {
    return this.prisma.comment.create({
      data: {
        content: data.content,
        postId,
        authorId,
      },
    });
  }

  async findAllComments(postId: string, skip: number, take: number) {
    const [items, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.comment.count({
        where: { postId },
      }),
    ]);

    return { items, total };
  }

  findCommentById(commentId: string) {
    return this.prisma.comment.findUnique({
      where: { id: commentId },
    });
  }

  updateComment(commentId: string, data: CreateCommentsRequestDto) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: data.content,
      },
    });
  }

  deleteComment(commentId: string) {
    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
