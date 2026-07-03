import { Suspense } from 'react';
import PostDetailPage from '@/components/posts/post-detail/PostDetailPage';

export default function Page() {
  return (
    <Suspense fallback={<p>게시글을 불러오는 중...</p>}>
      <PostDetailPage />
    </Suspense>
  );
}
