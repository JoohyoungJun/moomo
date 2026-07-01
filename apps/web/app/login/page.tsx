'use client';

import { apiFetch } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import * as styles from './login.css';
import Link from 'next/link';

type LoginBody = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: (body: LoginBody) =>
      apiFetch('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      router.push('/posts');
      router.refresh();
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.subtitle}>Moomo 계정으로 로그인하세요</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8~20자"
              autoComplete="current-password"
              minLength={8}
              maxLength={20}
              required
            />
          </div>
          {loginMutation.isError && (
            <p className={styles.error}>{loginMutation.error.message}</p>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className={styles.footer}>
          계정이 없으신가요?{' '}
          <Link href="/signup" className={styles.footerLink}>
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
