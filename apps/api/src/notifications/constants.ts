export const NOTIFICATION_TYPES = {
  COMMENT_ON_POST: 'COMMENT_ON_POST',
};

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
