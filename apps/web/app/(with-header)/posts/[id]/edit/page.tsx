import { AuthGuard } from '@/components/auth/auth-guard/AuthGuard';
import PostEditPage from '@/components/posts/post-edit/PostEditPage';

export default function Page() {
  return (
    <AuthGuard>
      <PostEditPage />
    </AuthGuard>
  );
}
