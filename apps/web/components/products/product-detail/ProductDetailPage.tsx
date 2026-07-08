'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import * as styles from './ProductDetailPage.css';
import Image from 'next/image';
import OrderModal from '@/components/modal/order-modal/OrderModal';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  images: string[];
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

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<Me>('/users/me'),
    retry: false,
  });

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => apiFetch<Product>(`/products/${productId}`),
    enabled: Boolean(productId),
  });

  const orderMutation = useMutation({
    mutationFn: (quantity: number) =>
      apiFetch(`/products/${productId}/order`, {
        method: 'POST',
        body: JSON.stringify({ quantity }),
      }),
    onSuccess: () => {
      setIsOrderModalOpen(false);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleOrder = (quantity: number) => {
    if (!me) {
      alert('주문은 로그인 후 이용할 수 있습니다.');
      router.push('/login');
      return;
    }
    orderMutation.mutate(quantity);
  };

  if (isProductLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.state}>상품을 불러오는 중...</p>
      </main>
    );
  }

  if (isProductError) {
    return (
      <main className={styles.page}>
        <p className={styles.state}>{productError.message}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.page}>
        <p className={styles.state}>상품을 찾을 수 없습니다.</p>
      </main>
    );
  }

  const handleOrderModalOpen = () => {
    if (!me) {
      alert('주문은 로그인 후 이용할 수 있습니다.');
      router.push('/login');
      return;
    }
    setQuantity(1);
    setIsOrderModalOpen(true);
  };

  const handleOrderModalClose = () => {
    setIsOrderModalOpen(false);
  };

  const handleQuantityIncrease = () => {
    if (!product) return;
    setQuantity((prev) => Math.min(prev + 1, product.stock || 10));
  };

  const handleQuantityDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <main className={styles.page}>
      <Link href="/products" className={styles.backLink}>
        ← 상품목록으로
      </Link>

      <article className={styles.postCard}>
        <h1 className={styles.title}>{product.name}</h1>

        <div className={styles.meta}>
          <span>재고: {product.stock}개</span>
          <span>·</span>
          <time>{formatDate(product.createdAt)}</time>
        </div>

        <p className={styles.content}>{product.description}</p>

        <div className={styles.images}>
          {product.images.map((image) => (
            <Image
              src={image}
              key={image}
              alt={product.name}
              width={100}
              height={100}
            />
          ))}
        </div>
        <p className={styles.price}>{product.price}원</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.orderButton}
            onClick={handleOrderModalOpen}
            disabled={orderMutation.isPending || product.stock < 1}
          >
            {product.stock < 1 ? '품절' : '주문하기'}
          </button>
        </div>
      </article>

      <OrderModal
        open={isOrderModalOpen}
        name={product.name}
        productId={product.id}
        quantity={quantity}
        maxQuantity={product.stock}
        onIncrease={handleQuantityIncrease}
        onDecrease={handleQuantityDecrease}
        onClose={handleOrderModalClose}
        onSubmit={handleOrder}
        isPending={orderMutation.isPending}
        error={orderMutation.error?.message}
      />
    </main>
  );
}
