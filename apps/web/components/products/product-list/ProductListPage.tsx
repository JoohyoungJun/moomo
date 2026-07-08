'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import * as styles from './ProductListPage.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

type ProductListItem = {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
  thumbnailImage?: string | null;
};

function isAllowedThumbnailUrl(src: string) {
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

function ProductCardThumbnail({ src }: { src?: string | null }) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(src) && isAllowedThumbnailUrl(src!) && !hasError;

  return (
    <div className={styles.cardThumbnail} aria-hidden>
      {showImage && (
        <Image
          src={src!}
          alt=""
          width={72}
          height={72}
          sizes="72px"
          className={styles.cardThumbnailImage}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

const PAGE_SIZE = 4;

type ProductListResponse = {
  items: ProductListItem[];
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

function ProductSearchForm({
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

export default function ProductListPage() {
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

      return apiFetch<ProductListResponse>(`/products?${params.toString()}`);
    },
  });

  const products = data?.items ?? [];
  const meta = data?.meta;

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();

    if (value) {
      params.set('search', value);
    }

    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchReset = () => {
    router.push('/posts?page=1');
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>무모 상품 구매</h1>
      </div>
      <p className={styles.description}>무모 회원 전용 상품을 구매해보세요.</p>

      <ProductSearchForm
        key={searchKeyword}
        searchKeyword={searchKeyword}
        onSearch={handleSearch}
        onReset={handleSearchReset}
      />

      {isLoading && <p className={styles.state}>상품을 불러오는 중...</p>}
      {isError && <p className={styles.state}>{error.message}</p>}

      {!isLoading && !isError && products.length === 0 && (
        <p className={styles.state}>
          {searchKeyword
            ? `"${searchKeyword}" 검색 결과가 없습니다.`
            : '아직 상품이 없습니다.'}
        </p>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <>
          <div className={styles.list}>
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={styles.card}
              >
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{product.name}</h2>

                  <div className={styles.cardMeta}>
                    <time>{formatDate(product.createdAt)}</time>
                  </div>

                  <div className={styles.cardStats}>
                    <span>가격: {product.price}원</span>
                    <span>·</span>
                    <span>재고: {product.stock}개</span>
                  </div>
                </div>

                <ProductCardThumbnail src={product.thumbnailImage} />
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
