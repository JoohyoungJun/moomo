'use client';

import { apiFetch } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import * as styles from './AuthGuard.css';

type Me = {
  id: string;
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<Me>('/users/me'),
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace('/login');
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return <main className={styles.page}>로딩중...</main>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
