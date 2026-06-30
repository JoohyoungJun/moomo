import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesRepository {
  constructor(private readonly prisma: PrismaService) {}

  createLike(userId: string, postId: string) {
    return this.prisma.like.create({
      data: { userId, postId },
    });
  }

  deleteLike(userId: string, postId: string) {
    return this.prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  findLike(userId: string, postId: string) {
    return this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  countLikes(postId: string) {
    return this.prisma.like.count({
      where: { postId },
    });
  }
}
