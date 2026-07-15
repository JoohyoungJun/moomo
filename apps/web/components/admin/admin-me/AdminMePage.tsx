'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import * as styles from '../../me/MePage.css';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import NewProductModal from '@/components/modal/new-product-modal/NewProductModal';
import { useState } from 'react';
import { colors } from '@/styles/theme.css';
import { ORDER_STATUS } from '@/components/me/MePage';

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

export type Order = {
  id: string;
  userId: string;
  userNickname: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
};

type AdminTab = 'products' | 'orders';
type CreateProductBody = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: { url: string }[];
};

type UpdateProductBody = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: { url: string }[];
};

type ProductDetail = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: Array<string | { url: string }>;
};

function getImageUrl(image: string | { url: string }) {
  if (typeof image === 'string') return image.trim();
  return image.url?.trim() ?? '';
}

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
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [isEditingOrderModalOpen, setIsEditingOrderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
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

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
  } = useQuery({
    queryKey: ['orders', currentPage, PAGE_SIZE],
    queryFn: () =>
      apiFetch<PaginatedResponse<Order>>(
        `/products/orders/all?page=${currentPage}&pageSize=${PAGE_SIZE}`,
      ),
    enabled: activeTab === 'orders',
  });

  const products = productsData?.items ?? [];
  const productsMeta = productsData?.meta;
  const orders = ordersData?.items ?? [];
  const ordersMeta = ordersData?.meta;

  const { data: editingProductDetail } = useQuery({
    queryKey: ['product', editingProduct?.id],
    queryFn: () => apiFetch<ProductDetail>(`/products/${editingProduct!.id}`),
    enabled: isEditingModalOpen && Boolean(editingProduct?.id),
  });

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

  const updateProductMutation = useMutation({
    mutationFn: ({
      productId,
      body,
    }: {
      productId: string;
      body: UpdateProductBody;
    }) =>
      apiFetch(`/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      setIsEditingModalOpen(false);
      setEditingProduct(null);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      alert(`에러가 발생했습니다. ${error.message}`);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) =>
      apiFetch(`/products/${productId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      alert(`에러가 발생했습니다. ${error.message}`);
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) =>
      apiFetch(`/products/orders/${orderId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      alert('주문이 삭제되었습니다.');
    },
    onError: (error) => {
      alert(`에러가 발생했습니다. ${error.message}`);
    },
  });

  const handleClickDeleteProduct = (productId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleClickDeleteOrder = (order: Order, orderId: string) => {
    if (!confirm('정말 삭제하시겠습니까? ')) return;
    if (order.status !== 'cancelled') {
      alert('취소된 주문만 삭제할 수 있습니다.');
      return;
    }
    deleteOrderMutation.mutate(orderId);
  };

  const handleClickEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditingModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditingModalOpen(false);
    setEditingProduct(null);
  };

  const handleClickEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsEditingOrderModalOpen(true);
  };

  const handleEditOrderModalClose = () => {
    setIsEditingOrderModalOpen(false);
    setEditingOrder(null);
  };

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
                      <div key={product.id} className={styles.listItem}>
                        <Link
                          href={`/products/${product.id}`}
                          style={{
                            textDecoration: 'none',
                            color: 'inherit',
                          }}
                        >
                          <h2 className={styles.listItemTitle}>
                            {product.name}
                          </h2>

                          <div className={styles.listItemStats}>
                            <span>재고 {product.stock}</span>
                            <span>가격 {product.price}</span>
                          </div>
                        </Link>

                        <div className={styles.listItemMeta}>
                          <time>{formatDate(product.createdAt)}</time>
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => handleClickEditProduct(product)}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => handleClickDeleteProduct(product.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
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

            {activeTab === 'orders' && isOrdersLoading && (
              <p className={styles.state}>주문 내역 불러오는중...</p>
            )}

            {activeTab === 'orders' && isOrdersError && (
              <p className={styles.error}>{ordersError.message}</p>
            )}

            {activeTab === 'orders' &&
              !isOrdersError &&
              !isOrdersLoading &&
              orders.length === 0 && (
                <p className={styles.state}>주문이 없습니다.</p>
              )}

            {activeTab === 'orders' &&
              !isOrdersError &&
              !isOrdersLoading &&
              orders.length > 0 && (
                <>
                  <div className={styles.list}>
                    {orders.map((order) => (
                      <div key={order.id} className={styles.listItem}>
                        <h2 className={styles.listItemTitle}>
                          {order.productName}
                        </h2>

                        <div className={styles.listItemStats}>
                          <span>
                            <span className={styles.listItemText}>주문자:</span>{' '}
                            {order.userNickname}
                          </span>
                          <span>
                            <span className={styles.listItemText}>
                              상품 가격:
                            </span>{' '}
                            {order.productPrice}
                          </span>
                          <span>
                            <span className={styles.listItemText}>
                              주문 수량:
                            </span>{' '}
                            {order.quantity}
                          </span>
                          <span>
                            <span className={styles.listItemText}>
                              주문 가격:
                            </span>{' '}
                            {order.totalPrice}
                          </span>
                        </div>
                        <div className={styles.listItemMeta}>
                          <span className={styles.listItemText}>
                            주문 일자:{' '}
                          </span>
                          <time>{formatDate(order.createdAt)}</time>
                          <span>
                            <span className={styles.listItemText}>
                              주문 상태:{' '}
                            </span>
                            <span
                              className={
                                order.status === 'pending'
                                  ? styles.listItemTextPending
                                  : order.status === 'completed'
                                    ? styles.listItemTextCompleted
                                    : styles.listItemTextCancelled
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
                        <div className={styles.listItemStats}>
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => handleClickEditOrder(order)}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() =>
                              handleClickDeleteOrder(order, order.id)
                            }
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {ordersMeta && ordersMeta.totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        type="button"
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!ordersMeta.hasPrev}
                      >
                        이전
                      </button>
                      <span className={styles.pageInfo}>
                        {ordersMeta.page} / {ordersMeta.totalPages}
                      </span>
                      <button
                        type="button"
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!ordersMeta.hasNext}
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
        key="create-product"
        open={isNewProductModalOpen}
        mode="create"
        onClose={() => setIsNewProductModalOpen(false)}
        onSubmit={(product) => createProductMutation.mutate(product)}
        isPending={createProductMutation.isPending}
        error={
          createProductMutation.isError
            ? createProductMutation.error.message
            : undefined
        }
      />
      <NewProductModal
        key={
          editingProduct
            ? `edit-${editingProduct.id}-${editingProductDetail ? 'ready' : 'pending'}`
            : 'edit-product'
        }
        open={isEditingModalOpen}
        mode="edit"
        initialValues={
          editingProductDetail
            ? {
                name: editingProductDetail.name,
                description: editingProductDetail.description,
                price: editingProductDetail.price,
                stock: editingProductDetail.stock,
                imageUrls: editingProductDetail.images
                  .map(getImageUrl)
                  .filter(Boolean),
              }
            : editingProduct
              ? {
                  name: editingProduct.name,
                  description: editingProduct.description,
                  price: editingProduct.price,
                  stock: editingProduct.stock,
                }
              : undefined
        }
        onClose={handleEditModalClose}
        onSubmit={(product) => {
          if (!editingProduct) return;
          updateProductMutation.mutate({
            productId: editingProduct.id,
            body: product,
          });
        }}
        isPending={updateProductMutation.isPending}
        error={
          updateProductMutation.isError
            ? updateProductMutation.error.message
            : undefined
        }
      />
    </main>
  );
}
