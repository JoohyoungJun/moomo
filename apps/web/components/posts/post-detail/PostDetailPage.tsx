'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import UpdateCommentModal from '@/components/modal/update-comment-modal/UpdateCommentModal';
import * as styles from './PostDetailPage.css';
import DeleteModal from '@/components/modal/delete-modal/DeleteModal';

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

type CommentBody = {
  commentId: string;
  content: string;
};

type PaginatedResponse<T> = {
  items: T[];
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

export type DeleteTarget =
  | { type: 'post' }
  | { type: 'comment'; commentId: string };

const PAGE_SIZE = 10;

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const pageParam = Number(searchParams.get('page') ?? '1');
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

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

  const isOwner = me?.id === post?.authorId;

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useQuery({
    queryKey: ['comments', postId, currentPage],
    queryFn: () =>
      apiFetch<PaginatedResponse<Comment>>(
        `/posts/${postId}/comments?page=${currentPage}&pageSize=${PAGE_SIZE}`,
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
      const lastPage = Math.max(
        1,
        Math.ceil(((post?.commentsCount ?? 0) + 1) / PAGE_SIZE),
      );
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(lastPage));
      router.push(`/posts/${postId}?${params.toString()}`);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: () => apiFetch(`/posts/${postId}`, { method: 'DELETE' }),
    onSuccess: () => {
      setDeleteTarget(null);
      alert('게시글이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'posts'] });
      router.push('/posts');
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: CommentBody) =>
      apiFetch(`/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      setEditingComment(null);
      queryClient.invalidateQueries({
        queryKey: ['comments', postId, currentPage],
      });
      queryClient.invalidateQueries({ queryKey: ['me', 'comments'] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      apiFetch(`/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      setDeleteTarget(null);
      alert('댓글이 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['comments', postId, currentPage],
      });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'comments'] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleDeleteModalClose = () => {
    setDeleteTarget(null);
  };

  const handlePostDeleteOpen = () => {
    setDeleteTarget({ type: 'post' });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'post') {
      deletePostMutation.mutate();
      return;
    }

    deleteCommentMutation.mutate(deleteTarget.commentId);
  };

  const isDeletePending =
    deleteTarget?.type === 'post'
      ? deletePostMutation.isPending
      : deleteCommentMutation.isPending;

  const deleteError =
    deleteTarget?.type === 'post'
      ? deletePostMutation.isError
        ? deletePostMutation.error.message
        : undefined
      : deleteCommentMutation.isError
        ? deleteCommentMutation.error.message
        : undefined;

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

  const handleCommentDeleteOpen = (commentId: string) => {
    setDeleteTarget({ type: 'comment', commentId });
  };

  const handleCommentUpdateOpen = (comment: Comment) => {
    setEditingComment(comment);
  };

  const handleCommentUpdateClose = () => {
    setEditingComment(null);
  };

  const handleCommentUpdateSubmit = (content: string) => {
    if (!editingComment) return;

    updateCommentMutation.mutate({
      commentId: editingComment.id,
      content,
    });
  };

  const comments = commentsData?.items ?? [];
  const commentsMeta = commentsData?.meta;

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`/posts/${postId}?${params.toString()}`);
  };

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

          {isOwner && (
            <>
              <span>·</span>
              <Link
                href={`/posts/${postId}/edit`}
                className={styles.ownerAction}
              >
                수정
              </Link>
              <button
                type="button"
                className={styles.ownerActionDanger}
                onClick={handlePostDeleteOpen}
                disabled={deletePostMutation.isPending}
              >
                삭제
              </button>
            </>
          )}
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
          <span className={styles.actionStat}>댓글 {post.commentsCount}</span>
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
          <>
            <div className={styles.commentList}>
              {comments.map((item) => {
                const isCommentOwner = item.authorId === me?.id;

                return (
                  <div key={item.id} className={styles.commentItem}>
                    <div className={styles.commentMeta}>
                      <span>{item.authorNickname}</span>
                      <span>·</span>
                      <time>{formatDate(item.createdAt)}</time>
                      {isCommentOwner && (
                        <>
                          <span>·</span>
                          <button
                            type="button"
                            className={styles.ownerAction}
                            onClick={() => handleCommentUpdateOpen(item)}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            className={styles.ownerActionDanger}
                            onClick={() => handleCommentDeleteOpen(item.id)}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                    <p className={styles.commentContent}>{item.content}</p>
                  </div>
                );
              })}
            </div>

            {commentsMeta && commentsMeta.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!commentsMeta.hasPrev}
                >
                  이전
                </button>
                <span className={styles.pageInfo}>
                  {commentsMeta.page} / {commentsMeta.totalPages}
                </span>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!commentsMeta.hasNext}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <UpdateCommentModal
        key={editingComment?.id ?? 'closed'}
        open={editingComment !== null}
        initialContent={editingComment?.content ?? ''}
        onClose={handleCommentUpdateClose}
        onSubmit={handleCommentUpdateSubmit}
        isPending={updateCommentMutation.isPending}
        error={
          updateCommentMutation.isError
            ? updateCommentMutation.error.message
            : undefined
        }
      />
      {deleteTarget && (
        <DeleteModal
          open={true}
          target={deleteTarget}
          onClose={handleDeleteModalClose}
          onSubmit={handleDeleteConfirm}
          isPending={isDeletePending}
          error={deleteError}
        />
      )}
    </main>
  );
}
