import './App.css';

import { ChakraProvider } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';

import ProtectedRoute from './components/protected-route';
import { AxiosInterceptor } from './config/axios';
import { AuthContextProvider } from './hooks/use-auth';
import ErrorPage from './pages/error/error-page';
import HomePage from './pages/home/home-page';
import LoginPage from './pages/login/login';

function Providers() {
  return (
    <AuthContextProvider>
      <AxiosInterceptor>
        <SWRConfig>
          <ChakraProvider>
            <GoogleOAuthProvider clientId="695308344557-qaep1rg6cr8v58u7alojih9f9lggnk29.apps.googleusercontent.com">
              <Outlet />
            </GoogleOAuthProvider>
          </ChakraProvider>
        </SWRConfig>
      </AxiosInterceptor>
    </AuthContextProvider>
  );
}

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Providers />} errorElement={<ErrorPage />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
