import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import * as styles from '../../me/MePage.css';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import NewProductModal from '@/components/modal/new-product-modal/NewProductModal';
import { useState } from 'react';

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

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

type AdminTab = 'products' | 'orders';
type CreateProductBody = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: { url: string }[];
};

const ADMIN_NAV_ITEMS: { id: AdminTab; label: string }[] = [
  { id: 'products', label: '상품 관리' },
  { id: 'orders', label: '주문 관리' },
];

function isAdminTab(value: string | null): value is AdminTab {
  return ['products', 'orders'].includes(value ?? '');
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function AdminMePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const tabParam = searchParams.get('tab');
  const activeTab: AdminTab = isAdminTab(tabParam) ? tabParam : 'products';
  const pageParam = Number(searchParams.get('page') ?? '1');
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const PAGE_SIZE = 4;

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    queryKey: ['products', currentPage, PAGE_SIZE],
    queryFn: () =>
      apiFetch<PaginatedResponse<Product>>(
        `/products?page=${currentPage}&pageSize=${PAGE_SIZE}`,
      ),
    enabled: activeTab === 'products',
  });

  const products = productsData?.items ?? [];
  const productsMeta = productsData?.meta;

  const createProductMutation = useMutation({
    mutationFn: (body: CreateProductBody) =>
      apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      setIsNewProductModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleTabChange = (tab: AdminTab) => {
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

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.layout}>
          <nav className={styles.nav} aria-label="관리자 페이지 메뉴">
            {ADMIN_NAV_ITEMS.map((item) => (
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
            {activeTab === 'products' && (
              <button
                type="button"
                className={styles.submitButton}
                onClick={() => setIsNewProductModalOpen(true)}
              >
                새 상품 등록
              </button>
            )}

            {activeTab === 'products' && isProductsLoading && (
              <p className={styles.state}>상품 내역 불러오는 중...</p>
            )}

            {activeTab === 'products' && isProductsError && (
              <p className={styles.error}>{productsError.message}</p>
            )}

            {activeTab === 'products' &&
              !isProductsError &&
              !isProductsLoading &&
              products.length === 0 && (
                <p className={styles.state}>상품이 없습니다.</p>
              )}

            {activeTab === 'products' &&
              !isProductsError &&
              !isProductsLoading &&
              products.length > 0 && (
                <>
                  <div className={styles.list}>
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className={styles.listItem}
                      >
                        <h2 className={styles.listItemTitle}>{product.name}</h2>

                        <div className={styles.listItemStats}>
                          <span>재고 {product.stock}</span>
                          <span>가격 {product.price}</span>
                        </div>
                        <div className={styles.listItemMeta}>
                          <time>{formatDate(product.createdAt)}</time>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {productsMeta && productsMeta.totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        type="button"
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!productsMeta.hasPrev}
                      >
                        이전
                      </button>
                      <span className={styles.pageInfo}>
                        {productsMeta.page} / {productsMeta.totalPages}
                      </span>
                      <button
                        type="button"
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!productsMeta.hasNext}
                      >
                        다음
                      </button>
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      </div>
      <NewProductModal
        open={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onSubmit={(product) => createProductMutation.mutate(product)}
        isPending={createProductMutation.isPending}
        error={
          createProductMutation.isError
            ? createProductMutation.error.message
            : undefined
        }
      />
    </main>
  );
}
