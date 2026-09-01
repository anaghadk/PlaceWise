import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireOnboarded = true }) {
  const { isAuthenticated, onboarded } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requireOnboarded && !onboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}
