'use client';

import { apiFetch } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

import * as styles from './header.css';
import { UserMenu } from './user-menu';
import { NotificationBell } from './notification-bell';
import Link from 'next/link';

type Me = {
  id: string;
  email: string;
  nickname: string;
};

export function AuthSection() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<Me>('/users/me'),
    retry: false,
  });

  if (isLoading) {
    return <div className={styles.authGroup} />;
  }

  if (user && user.id) {
    return (
      <div className={styles.authGroup}>
        <NotificationBell />
        <UserMenu nickname={user.nickname} />
      </div>
    );
  }

  return (
    <div className={styles.authGroup}>
      <Link href="/login" className={styles.navLink}>
        로그인
      </Link>
      <Link href="/signup" className={styles.navLinkPrimary}>
        회원가입
      </Link>
    </div>
  );
}
