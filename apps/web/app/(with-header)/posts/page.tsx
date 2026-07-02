import { Suspense } from 'react';
import PostListPage from '@/components/posts/post-list/PostListPage';

export default function Page() {
  return (
    <Suspense fallback={<p>게시글을 불러오는 중...</p>}>
      <PostListPage />
    </Suspense>
  );
}
