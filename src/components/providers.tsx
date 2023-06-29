import { GoogleOAuthProvider } from '@react-oauth/google';
import { Outlet } from 'react-router-dom';

import { AuthProvider } from '../hooks/use-auth';

function Providers() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId="695308344557-qaep1rg6cr8v58u7alojih9f9lggnk29.apps.googleusercontent.com">
        <Outlet />
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default Providers;
