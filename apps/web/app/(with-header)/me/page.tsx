import { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard/AuthGuard';
import { MePageRouter } from '@/components/me/MePageRouter';

export default function Page() {
  return (
    <AuthGuard>
      <Suspense fallback={<p>마이페이지를 불러오는 중...</p>}>
        <MePageRouter />
      </Suspense>
    </AuthGuard>
  );
}
