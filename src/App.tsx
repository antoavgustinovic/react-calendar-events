import './App.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './components/protected-route';
import { AuthProvider } from './contexts/auth-context';
import HomePage from './pages/home-page/home-page';
import LoginPage from './pages/login/login';

function App() {
  const router = createBrowserRouter([
    {
      element: (
        <AuthProvider>
          <GoogleOAuthProvider clientId="695308344557-qaep1rg6cr8v58u7alojih9f9lggnk29.apps.googleusercontent.com">
            <Outlet />
          </GoogleOAuthProvider>
        </AuthProvider>
      ),
      children: [
        {
          path: '/',
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
