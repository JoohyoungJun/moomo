'use client';

import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import AccountDeleteModal from '@/components/modal/account-delete-modal/AccountDeleteModal';
import * as styles from './MePage.css';

type Me = {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
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

type MyPost = {
  id: string;
  title: string;
  authorId: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
};

type MyComment = {
  id: string;
  content: string;
  postId: string;
  postTitle: string;
  createdAt: string;
};

type MyOrder = {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
};

type MeTab =
  | 'profile'
  | 'password'
  | 'posts'
  | 'comments'
  | 'orders'
  | 'account-delete';

const PAGE_SIZE = 4;

type OrderStatus = 'pending' | 'completed' | 'cancelled';

export const ORDER_STATUS: { id: OrderStatus; label: string }[] = [
  { id: 'pending', label: '처리중' },
  { id: 'completed', label: '처리 완료' },
  { id: 'cancelled', label: '취소' },
];

const NAV_ITEMS: { id: MeTab; label: string }[] = [
  { id: 'profile', label: '내 정보' },
  { id: 'password', label: '비밀번호 변경' },
  { id: 'posts', label: '내가 쓴 게시글' },
  { id: 'comments', label: '내가 쓴 댓글' },
  { id: 'orders', label: '주문 조회' },
  { id: 'account-delete', label: '회원탈퇴' },
];

function isMeTab(value: string | null): value is MeTab {
  return [
    'profile',
    'password',
    'posts',
    'comments',
    'orders',
    'account-delete',
  ].includes(value ?? '');
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function MePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const tabParam = searchParams.get('tab');
  const activeTab: MeTab = isMeTab(tabParam) ? tabParam : 'profile';
  const pageParam = Number(searchParams.get('page') ?? '1');
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [isAccountDeleteModalOpen, setIsAccountDeleteModalOpen] =
    useState(false);

  const {
    data: me,
    isLoading: isMeLoading,
    isError: isMeError,
    error: meError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<Me>('/users/me'),
    enabled: activeTab === 'profile' || activeTab === 'password',
  });

  const {
    data: myPostsData,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useQuery({
    queryKey: ['me', 'posts', currentPage],
    queryFn: () =>
      apiFetch<PaginatedResponse<MyPost>>(
        `/users/me/posts?page=${currentPage}&pageSize=${PAGE_SIZE}`,
      ),
    enabled: activeTab === 'posts',
  });

  const {
    data: myCommentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useQuery({
    queryKey: ['me', 'comments', currentPage],
    queryFn: () =>
      apiFetch<PaginatedResponse<MyComment>>(
        `/users/me/comments?page=${currentPage}&pageSize=${PAGE_SIZE}`,
      ),
    enabled: activeTab === 'comments',
  });

  const {
    data: myOrdersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
  } = useQuery({
    queryKey: ['me', 'orders', currentPage],
    queryFn: () =>
      apiFetch<PaginatedResponse<MyOrder>>(
        `/products/orders?page=${currentPage}&pageSize=${PAGE_SIZE}`,
      ),
    enabled: activeTab === 'orders',
  });

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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

  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) =>
      apiFetch('/users/me', {
        method: 'DELETE',
        body: JSON.stringify({ password }),
      }),
    onSuccess: () => {
      setIsAccountDeleteModalOpen(false);
      router.push('/');
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.clear();
      alert('회원탈퇴가 완료되었습니다.');
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleTabChange = (tab: MeTab) => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    params.set('page', '1');
    router.push(`/me?${params.toString()}`);
  };

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
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

  const myPosts = myPostsData?.items ?? [];
  const myPostsMeta = myPostsData?.meta;
  const myComments = myCommentsData?.items ?? [];
  const myCommentsMeta = myCommentsData?.meta;
  const myOrders = myOrdersData?.items ?? [];
  const myOrdersMeta = myOrdersData?.meta;

  const handleAccountDeleteOpen = () => {
    setIsAccountDeleteModalOpen(true);
  };

  const handleAccountDeleteClose = () => {
    setIsAccountDeleteModalOpen(false);
  };

  const handleAccountDeleteSubmit = (password: string) => {
    deleteAccountMutation.mutate(password);
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
            {activeTab === 'profile' && isMeLoading && (
              <p className={styles.state}>내 정보를 불러오는 중...</p>
            )}
            {activeTab === 'profile' && isMeError && (
              <p className={styles.error}>{meError.message}</p>
            )}

            {!isMeLoading && !isMeError && me && activeTab === 'profile' && (
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

            {activeTab === 'password' && isMeLoading && (
              <p className={styles.state}>내 정보를 불러오는 중...</p>
            )}
            {activeTab === 'password' && isMeError && (
              <p className={styles.error}>{meError.message}</p>
            )}

            {!isMeLoading && !isMeError && me && activeTab === 'password' && (
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

            {activeTab === 'posts' && (
              <>
                <h1 className={styles.sectionTitle}>내가 쓴 게시글</h1>

                {isPostsLoading && (
                  <p className={styles.state}>게시글을 불러오는 중...</p>
                )}
                {isPostsError && (
                  <p className={styles.error}>{postsError.message}</p>
                )}

                {!isPostsLoading && !isPostsError && myPosts.length === 0 && (
                  <p className={styles.state}>작성한 게시글이 없습니다.</p>
                )}

                {!isPostsLoading && !isPostsError && myPosts.length > 0 && (
                  <>
                    <div className={styles.list}>
                      {myPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/posts/${post.id}`}
                          className={styles.listItem}
                        >
                          <h2 className={styles.listItemTitle}>{post.title}</h2>

                          <div className={styles.listItemMeta}>
                            <time>{formatDate(post.createdAt)}</time>
                          </div>

                          <div className={styles.listItemStats}>
                            <span>좋아요 {post.likesCount}</span>
                            <span>댓글 {post.commentsCount}</span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {myPostsMeta && myPostsMeta.totalPages > 1 && (
                      <div className={styles.pagination}>
                        <button
                          type="button"
                          className={styles.pageButton}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!myPostsMeta.hasPrev}
                        >
                          이전
                        </button>
                        <span className={styles.pageInfo}>
                          {myPostsMeta.page} / {myPostsMeta.totalPages}
                        </span>
                        <button
                          type="button"
                          className={styles.pageButton}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!myPostsMeta.hasNext}
                        >
                          다음
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === 'comments' && (
              <>
                <h1 className={styles.sectionTitle}>내가 쓴 댓글</h1>

                {isCommentsLoading && (
                  <p className={styles.state}>댓글을 불러오는 중...</p>
                )}
                {isCommentsError && (
                  <p className={styles.error}>{commentsError.message}</p>
                )}

                {!isCommentsLoading &&
                  !isCommentsError &&
                  myComments.length === 0 && (
                    <p className={styles.state}>작성한 댓글이 없습니다.</p>
                  )}

                {!isCommentsLoading &&
                  !isCommentsError &&
                  myComments.length > 0 && (
                    <>
                      <div className={styles.list}>
                        {myComments.map((comment) => (
                          <Link
                            key={comment.id}
                            href={`/posts/${comment.postId}`}
                            className={styles.listItem}
                          >
                            <h2 className={styles.listItemTitle}>
                              {comment.postTitle}
                            </h2>

                            <p className={styles.listItemContent}>
                              {comment.content}
                            </p>

                            <div className={styles.listItemMeta}>
                              <time>{formatDate(comment.createdAt)}</time>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {myCommentsMeta && myCommentsMeta.totalPages > 1 && (
                        <div className={styles.pagination}>
                          <button
                            type="button"
                            className={styles.pageButton}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!myCommentsMeta.hasPrev}
                          >
                            이전
                          </button>
                          <span className={styles.pageInfo}>
                            {myCommentsMeta.page} / {myCommentsMeta.totalPages}
                          </span>
                          <button
                            type="button"
                            className={styles.pageButton}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!myCommentsMeta.hasNext}
                          >
                            다음
                          </button>
                        </div>
                      )}
                    </>
                  )}
              </>
            )}
            {activeTab === 'orders' && (
              <>
                <h1 className={styles.sectionTitle}>주문 조회</h1>

                {isOrdersLoading && (
                  <p className={styles.state}>주문을 불러오는중...</p>
                )}

                {isOrdersError && (
                  <p className={styles.error}>{ordersError.message}</p>
                )}

                {!isOrdersLoading &&
                  !isOrdersError &&
                  myOrders.length === 0 && (
                    <p className={styles.state}>주문한 상품이 없습니다.</p>
                  )}

                {!isOrdersLoading && !isOrdersError && myOrders.length > 0 && (
                  <>
                    <div className={styles.list}>
                      {myOrders.map((order) => (
                        <Link
                          key={order.id}
                          href={`/products/${order.productId}`}
                          className={styles.listItem}
                        >
                          <h2 className={styles.listItemTitle}>
                            {order.productName}
                          </h2>

                          <div className={styles.listItemStats}>
                            <span>
                              <span className={styles.listItemText}>수량:</span>{' '}
                              {order.quantity}
                            </span>
                            <span>
                              <span className={styles.listItemText}>가격:</span>{' '}
                              {order.productPrice}
                            </span>
                            <span>
                              <span className={styles.listItemText}>
                                총 가격:
                              </span>{' '}
                              {order.totalPrice}
                            </span>
                          </div>
                          <div className={styles.listItemMeta}>
                            <span>
                              <span className={styles.listItemText}>
                                주문 일자:
                              </span>{' '}
                              <time>{formatDate(order.createdAt)}</time>
                            </span>
                            <span>
                              <span className={styles.listItemText}>
                                주문 상태:
                              </span>{' '}
                              <span
                                className={
                                  order.status === 'pending'
                                    ? styles.listItemTextPending
                                    : order.status === 'completed'
                                      ? styles.listItemTextCompleted
                                      : order.status === 'cancelled'
                                        ? styles.listItemTextCancelled
                                        : ''
                                }
                              >
                                {
                                  ORDER_STATUS.find(
                                    (status) => status.id === order.status,
                                  )?.label
                                }
                              </span>
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {myOrdersMeta && myOrdersMeta.totalPages > 1 && (
                      <div className={styles.pagination}>
                        <button
                          type="button"
                          className={styles.pageButton}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!myOrdersMeta.hasPrev}
                        >
                          이전
                        </button>
                        <span className={styles.pageInfo}>
                          {myOrdersMeta.page} / {myOrdersMeta.totalPages}
                        </span>
                        <button
                          type="button"
                          className={styles.pageButton}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!myOrdersMeta.hasNext}
                        >
                          다음
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {activeTab === 'account-delete' && (
              <>
                <h1 className={styles.sectionTitle}>회원탈퇴</h1>
                <p className={styles.sectionDescription}>
                  탈퇴 시 계정과 작성한 게시글, 댓글 등 모든 데이터가
                  삭제됩니다.
                  <br /> 이 작업은 되돌릴 수 없습니다.
                </p>
                <button
                  type="button"
                  className={styles.deleteAccountButton}
                  onClick={handleAccountDeleteOpen}
                >
                  회원탈퇴
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <AccountDeleteModal
        open={isAccountDeleteModalOpen}
        onClose={handleAccountDeleteClose}
        onSubmit={handleAccountDeleteSubmit}
        isPending={deleteAccountMutation.isPending}
        error={
          deleteAccountMutation.isError
            ? deleteAccountMutation.error.message
            : undefined
        }
      />
    </main>
  );
}
