import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NotificationType } from './constants';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createNotification(data: {
    userId: string;
    type: NotificationType;
    message: string;
    postId: string;
    commentId: string;
  }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        postId: data.postId,
        commentId: data.commentId,
      },
    });
  }

  async findAllNotificationsByUserId(
    userId: string,
    skip: number,
    take: number,
  ) {
    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);

    return { items, total };
  }

  findNotificationById(notificationId: string) {
    return this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
  }

  markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async hasUnread(userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { userId, isRead: false },
      select: { id: true },
    });
    return notification !== null;
  }
}
