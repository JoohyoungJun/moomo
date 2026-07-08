import { Suspense } from 'react';
import ProductListPage from '@/components/products/product-list/ProductListPage';

export default function Page() {
  return (
    <Suspense fallback={<p>상품을 불러오는 중...</p>}>
      <ProductListPage />
    </Suspense>
  );
}
