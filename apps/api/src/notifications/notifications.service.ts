import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { NOTIFICATION_TYPES } from './constants';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto';
import {
  buildPaginationResponse,
  getPaginationParams,
} from '@/common/pagination/pagination.util';

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
}
