import { AuthGuard } from '@/components/auth/auth-guard/AuthGuard';
import NewPostPage from '@/components/posts/new-post/NewPostPage';

export default function Page() {
  return (
    <AuthGuard>
      <NewPostPage />
    </AuthGuard>
  );
}
