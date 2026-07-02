'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import * as styles from './PostEditPage.css';

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

type UpdatePostBody = {
  title: string;
  content: string;
};

type Me = {
  id: string;
};

function PostEditForm({ postId, post }: { postId: string; post: Post }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const updateMutation = useMutation({
    mutationFn: (body: UpdatePostBody) =>
      apiFetch(`/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'posts'] });
      router.push(`/posts/${postId}`);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateMutation.mutate({
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
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

      {updateMutation.isError && (
        <p className={styles.error}>{updateMutation.error.message}</p>
      )}

      <div className={styles.actions}>
        <Link href={`/posts/${postId}`} className={styles.cancelButton}>
          취소
        </Link>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}

export default function PostEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const { data: me, isLoading: isMeLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<Me>('/users/me'),
  });

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => apiFetch<Post>(`/posts/${postId}`),
    enabled: Boolean(postId),
  });

  useEffect(() => {
    if (!post || !me) return;
    if (me.id !== post.authorId) {
      router.replace(`/posts/${postId}`);
    }
  }, [post, me, postId, router]);

  if (isPostLoading || isMeLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.state}>게시글을 불러오는 중...</p>
      </main>
    );
  }

  if (isPostError) {
    return (
      <main className={styles.page}>
        <p className={styles.error}>{postError.message}</p>
      </main>
    );
  }

  if (!post || !me || me.id !== post.authorId) {
    return null;
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>글 수정</h1>
        <Link href={`/posts/${postId}`} className={styles.backLink}>
          ← 게시글으로
        </Link>
      </div>

      <PostEditForm key={post.id} postId={postId} post={post} />
    </main>
  );
}
