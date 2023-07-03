import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/use-auth';
import Layout from '../layout/layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
}

export default ProtectedRoute;
