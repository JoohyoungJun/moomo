'use client';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import * as styles from './NewPostPage.css';

type CreatePostBody = {
  title: string;
  content: string;
};

type CreatePostResponse = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

type Me = {
  id: string;
};

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const createMutation = useMutation({
    mutationFn: (body: CreatePostBody) =>
      apiFetch<CreatePostResponse>('/posts', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (post) => {
      router.push(`/posts/${post.id}`);
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>글쓰기</h1>
        <Link href="/posts" className={styles.backLink}>
          ← 게시판으로
        </Link>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">
            제목
          </label>
          <input
            id="title"
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={50}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="content">
            내용
          </label>
          <textarea
            id="content"
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            maxLength={2000}
            required
          />
        </div>
        {createMutation.isError && (
          <p className={styles.error}>{createMutation.error.message}</p>
        )}
        <div className={styles.actions}>
          <Link href="/posts" className={styles.cancelButton}>
            취소
          </Link>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </main>
  );
}
