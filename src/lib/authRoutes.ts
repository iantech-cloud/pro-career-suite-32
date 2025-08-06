import { User } from '@/types/user';

// Centralized logic to choose a default landing page per tier/role
export function getHomeRouteForUser(user: User): string {
  const tier = user.tier;
  switch (tier) {
    case 'admin':
      return '/admin';
    case 'pro':
      // Pro users get straight to analytics (they have access via ProtectedRoute requiredTier="pro")
      return '/social-publisher/analytics';
    case 'premium':
      // Premium users to the richer app dashboard
      return '/app-dashboard';
    case 'free':
    default:
      // Free users to the main dashboard overview
      return '/main-dashboard';
  }
}
