'use client';

import { apiFetch } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import AdminMePage from '../admin/admin-me/AdminMePage';
import MePage from './MePage';

type Me = {
  id: string;
  isAdmin: boolean;
};

export function MePageRouter() {
  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<Me>('/users/me'),
  });

  if (isLoading) return <p>불러오는중...</p>;

  if (me?.isAdmin) return <AdminMePage />;

  return <MePage />;
}
