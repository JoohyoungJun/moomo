'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import * as styles from './PostListPage.css';

type PostListItem = {
  id: string;
  title: string;
  authorId: string;
  authorNickname: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
};

const PAGE_SIZE = 4;

type PostListResponse = {
  items: PostListItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function PostSearchForm({
  searchKeyword,
  onSearch,
  onReset,
}: {
  searchKeyword: string;
  onSearch: (value: string) => void;
  onReset: () => void;
}) {
  const [searchInput, setSearchInput] = useState(searchKeyword);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchInput.trim());
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        className={styles.searchInput}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="제목·내용 검색"
        maxLength={30}
      />
      <button type="submit" className={styles.searchButton}>
        검색
      </button>
      {searchKeyword && (
        <button
          type="button"
          className={styles.searchResetButton}
          onClick={onReset}
        >
          초기화
        </button>
      )}
    </form>
  );
}

export default function PostListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? '1');
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const searchKeyword = searchParams.get('search')?.trim() ?? '';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', currentPage, searchKeyword],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(PAGE_SIZE),
      });

      if (searchKeyword) {
        params.set('search', searchKeyword);
      }

      return apiFetch<PostListResponse>(`/posts?${params.toString()}`);
    },
  });

  const posts = data?.items ?? [];
  const meta = data?.meta;

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`/posts?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();

    if (value) {
      params.set('search', value);
    }

    params.set('page', '1');
    router.push(`/posts?${params.toString()}`);
  };

  const handleSearchReset = () => {
    router.push('/posts?page=1');
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>게시판</h1>
      </div>
      <p className={styles.description}>
        무인매장 운영 경험과 노하우를 나눠보세요.
      </p>

      <PostSearchForm
        key={searchKeyword}
        searchKeyword={searchKeyword}
        onSearch={handleSearch}
        onReset={handleSearchReset}
      />

      {isLoading && <p className={styles.state}>게시글을 불러오는 중...</p>}
      {isError && <p className={styles.state}>{error.message}</p>}

      {!isLoading && !isError && posts.length === 0 && (
        <p className={styles.state}>
          {searchKeyword
            ? `"${searchKeyword}" 검색 결과가 없습니다.`
            : '아직 게시글이 없습니다.'}
        </p>
      )}

      {!isLoading && !isError && posts.length > 0 && (
        <>
          <div className={styles.list}>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className={styles.card}
              >
                <h2 className={styles.cardTitle}>{post.title}</h2>

                <div className={styles.cardMeta}>
                  <span>{post.authorNickname}</span>
                  <span>·</span>
                  <time>{formatDate(post.createdAt)}</time>
                </div>

                <div className={styles.cardStats}>
                  <span>좋아요 {post.likesCount}</span>
                  <span>댓글 {post.commentsCount}</span>
                </div>
              </Link>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!meta.hasPrev}
              >
                이전
              </button>
              <span className={styles.pageInfo}>
                {meta.page} / {meta.totalPages}
              </span>
              <button
                type="button"
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!meta.hasNext}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
