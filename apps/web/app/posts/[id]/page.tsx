'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import * as styles from './post-detail.css';

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorNickname: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
};

type Comment = {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  authorNickname: string;
  createdAt: string;
  updatedAt: string;
};

type CommentsResponse = {
  items: Comment[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

type LikeResponse = {
  postId: string;
  likesCount: number;
  isLiked: boolean;
};

type Me = {
  id: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<Me>('/users/me'),
    retry: false,
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

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () =>
      apiFetch<CommentsResponse>(
        `/posts/${postId}/comments?page=1&pageSize=20`,
      ),
    enabled: Boolean(postId),
  });

  const likeMutation = useMutation({
    mutationFn: () =>
      apiFetch<LikeResponse>(`/posts/${postId}/like`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      apiFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleLike = () => {
    if (!me) {
      alert('로그인이 필요합니다.');
      return;
    }
    likeMutation.mutate();
  };

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!me) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!comment.trim()) return;
    commentMutation.mutate(comment.trim());
  };

  if (isPostLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.state}>게시글을 불러오는 중...</p>
      </main>
    );
  }

  if (isPostError) {
    return (
      <main className={styles.page}>
        <p className={styles.state}>{postError.message}</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className={styles.page}>
        <p className={styles.state}>게시글을 찾을 수 없습니다.</p>
      </main>
    );
  }

  const comments = commentsData?.items ?? [];

  return (
    <main className={styles.page}>
      <Link href="/posts" className={styles.backLink}>
        ← 게시판으로
      </Link>

      <article className={styles.postCard}>
        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.meta}>
          <span>{post.authorNickname}</span>
          <span>·</span>
          <time>{formatDate(post.createdAt)}</time>
        </div>

        <p className={styles.content}>{post.content}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={
              post.isLiked ? styles.likeButtonActive : styles.likeButton
            }
            onClick={handleLike}
            disabled={likeMutation.isPending}
          >
            {post.isLiked ? '♥' : '♡'} 좋아요 {post.likesCount}
          </button>
          <span className={styles.meta}>댓글 {post.commentsCount}</span>
        </div>
      </article>

      <section className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>댓글</h2>

        {me ? (
          <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
            <textarea
              className={styles.commentInput}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              maxLength={200}
              required
            />
            {commentMutation.isError && (
              <p className={styles.state}>{commentMutation.error.message}</p>
            )}
            <button
              type="submit"
              className={styles.commentSubmit}
              disabled={commentMutation.isPending}
            >
              {commentMutation.isPending ? '등록 중...' : '댓글 등록'}
            </button>
          </form>
        ) : (
          <p className={styles.loginHint}>
            댓글을 작성하려면 <Link href="/login">로그인</Link>이 필요합니다.
          </p>
        )}

        {isCommentsLoading && (
          <p className={styles.state}>댓글을 불러오는 중...</p>
        )}
        {isCommentsError && (
          <p className={styles.state}>{commentsError.message}</p>
        )}

        {!isCommentsLoading && !isCommentsError && comments.length === 0 && (
          <p className={styles.state}>아직 댓글이 없습니다.</p>
        )}

        {!isCommentsLoading && !isCommentsError && comments.length > 0 && (
          <div className={styles.commentList}>
            {comments.map((item) => (
              <div key={item.id} className={styles.commentItem}>
                <div className={styles.commentMeta}>
                  <span>{item.authorNickname}</span>
                  <span>·</span>
                  <time>{formatDate(item.createdAt)}</time>
                </div>
                <p className={styles.commentContent}>{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
