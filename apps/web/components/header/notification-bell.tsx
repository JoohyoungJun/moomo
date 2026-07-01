'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import * as styles from './notification-bell.css';

type Notification = {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  postId: string;
  commentId: string | null;
  createdAt: string;
};

type NotificationsResponse = {
  items: Notification[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

type HasUnreadResponse = {
  hasUnread: boolean;
};

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type DropdownPosition = {
  top: number;
  left: number;
};

const DROPDOWN_WIDTH = 280;
const DROPDOWN_GAP = 8;

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<DropdownPosition | null>(
    null,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: hasUnreadData } = useQuery({
    queryKey: ['notifications', 'has-unread'],
    queryFn: () => apiFetch<HasUnreadResponse>('/notifications/has-unread'),
    retry: false,
  });

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () =>
      apiFetch<NotificationsResponse>('/notifications?page=1&pageSize=20'),
    enabled: open,
    retry: false,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      apiFetch(`/notifications/${notificationId}/read`, {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      apiFetch('/notifications/read-all', {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    if (!open || !buttonRef.current) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + DROPDOWN_GAP,
        left: Math.max(
          DROPDOWN_GAP,
          rect.left - DROPDOWN_WIDTH - DROPDOWN_GAP,
        ),
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsReadMutation.mutateAsync(notification.id);
    }

    setOpen(false);
    router.push(`/posts/${notification.postId}`);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const hasUnread = hasUnreadData?.hasUnread ?? false;
  const notifications = notificationsData?.items ?? [];

  return (
    <div className={styles.bellRoot} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.bellButton}
        aria-label="알림"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {hasUnread && <span className={styles.unreadDot} aria-hidden />}
      </button>

      {open && menuPosition && (
        <div
          className={styles.dropdown}
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <div className={styles.dropdownHeader}>
            <p className={styles.dropdownTitle}>알림</p>
            {hasUnread && (
              <button
                type="button"
                className={styles.markAllButton}
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                모두 읽음
              </button>
            )}
          </div>

          <div className={styles.list}>
            {isLoading && (
              <p className={styles.empty}>불러오는 중...</p>
            )}

            {!isLoading && notifications.length === 0 && (
              <p className={styles.empty}>알림이 없습니다.</p>
            )}

            {!isLoading &&
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={
                    notification.isRead
                      ? styles.itemRead
                      : styles.itemUnread
                  }
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p
                    className={
                      notification.isRead
                        ? styles.itemMessageRead
                        : styles.itemMessageUnread
                    }
                  >
                    {notification.message}
                  </p>
                  <time className={styles.itemTime}>
                    {formatTime(notification.createdAt)}
                  </time>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
