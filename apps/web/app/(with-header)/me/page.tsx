import { AuthGuard } from '@/components/auth/auth-guard/AuthGuard';
import MePage from '@/components/me/MePage';

export default function Page() {
  return (
    <AuthGuard>
      <MePage />
    </AuthGuard>
  );
}
