'use client';

import { apiFetch } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import * as styles from './MePage.css';

type Me = {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
};

type MeTab = 'profile' | 'password';

const NAV_ITEMS: { id: MeTab; label: string }[] = [
  { id: 'profile', label: '내 정보' },
  { id: 'password', label: '비밀번호 변경' },
];

function isMeTab(value: string | null): value is MeTab {
  return value === 'profile' || value === 'password';
}

export default function MePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const tabParam = searchParams.get('tab');
  const activeTab: MeTab = isMeTab(tabParam) ? tabParam : 'profile';

  const {
    data: me,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<Me>('/users/me'),
  });

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!me) return;
    setEmail(me.email);
    setNickname(me.nickname);
  }, [me]);

  const updateProfileMutation = useMutation({
    mutationFn: (body: { email?: string; nickname?: string }) =>
      apiFetch<Me>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      apiFetch('/users/me/password', {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
    },
  });

  const handleTabChange = (tab: MeTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/me?${params.toString()}`);
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfileMutation.mutate({ email, nickname });
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.layout}>
          <nav className={styles.nav} aria-label="마이페이지 메뉴">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  activeTab === item.id ? styles.navItemActive : styles.navItem
                }
                onClick={() => handleTabChange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className={styles.content}>
            {isLoading && (
              <p className={styles.state}>내 정보를 불러오는 중...</p>
            )}
            {isError && <p className={styles.error}>{error.message}</p>}

            {!isLoading && !isError && me && activeTab === 'profile' && (
              <>
                <h1 className={styles.sectionTitle}>내 정보</h1>
                <p className={styles.sectionDescription}>
                  이메일과 닉네임을 수정할 수 있습니다.
                </p>

                <form className={styles.form} onSubmit={handleProfileSubmit}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">
                      이메일
                    </label>
                    <input
                      id="email"
                      className={styles.input}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="nickname">
                      닉네임
                    </label>
                    <input
                      id="nickname"
                      className={styles.input}
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      minLength={2}
                      maxLength={10}
                      required
                    />
                  </div>

                  {updateProfileMutation.isError && (
                    <p className={styles.error}>
                      {updateProfileMutation.error.message}
                    </p>
                  )}
                  {updateProfileMutation.isSuccess && (
                    <p className={styles.success}>저장되었습니다.</p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? '저장 중...' : '저장'}
                  </button>
                </form>
              </>
            )}

            {!isLoading && !isError && me && activeTab === 'password' && (
              <>
                <h1 className={styles.sectionTitle}>비밀번호 변경</h1>
                <p className={styles.sectionDescription}>
                  현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.
                </p>

                <form className={styles.form} onSubmit={handlePasswordSubmit}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="currentPassword">
                      현재 비밀번호
                    </label>
                    <input
                      id="currentPassword"
                      className={styles.input}
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="newPassword">
                      새 비밀번호
                    </label>
                    <input
                      id="newPassword"
                      className={styles.input}
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  {changePasswordMutation.isError && (
                    <p className={styles.error}>
                      {changePasswordMutation.error.message}
                    </p>
                  )}
                  {changePasswordMutation.isSuccess && (
                    <p className={styles.success}>비밀번호가 변경되었습니다.</p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending
                      ? '변경 중...'
                      : '비밀번호 변경'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
