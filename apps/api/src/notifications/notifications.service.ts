import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { NOTIFICATION_TYPES } from './constants';

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
      message: `${data.commentAuthorNickname} 님이 ${data.postTitle} 게시글에 댓글을 남겼습니다.`,
      postId: data.postId,
      commentId: data.commentId,
    });
  }
}
