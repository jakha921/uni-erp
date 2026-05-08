import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import type { RoleKey } from '@/types/auth';

interface RoleGuardProps {
  allowed: RoleKey[];
  children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser || !allowed.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
