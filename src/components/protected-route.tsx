import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/use-auth';
import Navbar from '../layout/navbar';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Navbar>{children}</Navbar>;
}

export default ProtectedRoute;
