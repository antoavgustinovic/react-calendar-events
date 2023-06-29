import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/use-auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user?.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
