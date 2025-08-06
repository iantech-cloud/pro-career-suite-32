import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getHomeRouteForUser } from '@/lib/authRoutes';

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const target = getHomeRouteForUser(user);
  return <Navigate to={target} replace />;
}
