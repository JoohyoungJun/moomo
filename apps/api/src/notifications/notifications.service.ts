import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { NOTIFICATION_TYPES } from './constants';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';
import {
  buildPaginationResponse,
  getPaginationParams,
} from '@/common/pagination/pagination.util';
import { AppException } from '@/common/exception/app.exception';
import { NOTIFICATIONS_ERRORS } from '@/common/constants/errors';
import { MarkAsReadResponseDto } from './dto/notification-response.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async createCommentNotification(data: {
    postAuthorId: string;
    commentAuthorId: string;
    commentAuthorNickname: string;
    postTitle: string;
    postId: string;
    commentId: string;
  }) {
    return this.notificationsRepository.createNotification({
      userId: data.postAuthorId,
      type: NOTIFICATION_TYPES.COMMENT_ON_POST,
      message: `'${data.commentAuthorNickname}' 님이 '${data.postTitle}' 게시글에 댓글을 남겼습니다.`,
      postId: data.postId,
      commentId: data.commentId,
    });
  }

  async findAllNotifications(userId: string, query: PaginationQueryDto) {
    const { page, pageSize, skip, take } = getPaginationParams(query);

    const { items, total } =
      await this.notificationsRepository.findAllNotificationsByUserId(
        userId,
        skip,
        take,
      );

    const mappedItems = items.map((item) => ({
      id: item.id,
      type: item.type,
      message: item.message,
      isRead: item.isRead,
      postId: item.postId,
      commentId: item.commentId,
      createdAt: item.createdAt,
    }));

    return buildPaginationResponse(mappedItems, total, page, pageSize);
  }

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<MarkAsReadResponseDto> {
    const notification =
      await this.notificationsRepository.findNotificationById(notificationId);

    if (notification === null) {
      throw new AppException(NOTIFICATIONS_ERRORS.NOTIFICATION_NOT_FOUND);
    }

    if (notification.userId !== userId) {
      throw new AppException(NOTIFICATIONS_ERRORS.NOTIFICATION_USER_MISMATCH);
    }

    const updated =
      await this.notificationsRepository.markAsRead(notificationId);

    return {
      id: notification.id,
      isRead: updated.isRead,
    };
  }

  async markAllAsRead(userId: string) {
    await this.notificationsRepository.markAllAsRead(userId);

    return {
      message: '알림 모두 읽음 처리 성공',
    };
  }
}
