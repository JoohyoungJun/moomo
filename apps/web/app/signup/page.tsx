'use client';

import { useRouter } from 'next/navigation';
import * as styles from '../login/login.css';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

type SignupBody = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

export default function SignupPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [clientError, setClientError] = useState('');

  const signupMutation = useMutation({
    mutationFn: async (body: SignupBody) => {
      await apiFetch('/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      await apiFetch('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({
          email: body.email,
          password: body.password,
        }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      router.push('/posts');
      router.refresh();
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError('');

    if (password !== passwordConfirm) {
      setClientError('비밀번호가 일치하지 않습니다.');
      return;
    }

    signupMutation.mutate({ email, password, passwordConfirm, nickname });
  };

  const errorMessage =
    clientError || (signupMutation.isError ? signupMutation.error.message : '');

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>회원가입</h1>
        <p className={styles.subtitle}>Moomo에 오신 것을 환영합니다</p>
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
            <label className={styles.label} htmlFor="nickname">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              className={styles.input}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="2~10자"
              minLength={2}
              maxLength={10}
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
              autoComplete="new-password"
              minLength={8}
              maxLength={20}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="passwordConfirm">
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              className={styles.input}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호 다시 입력"
              autoComplete="new-password"
              minLength={8}
              maxLength={20}
              required
            />
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className={styles.footer}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className={styles.footerLink}>
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
