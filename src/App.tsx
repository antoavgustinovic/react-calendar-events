import './App.css';

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './components/protected-route';
import Providers from './components/providers';
import HomePage from './pages/home-page/home-page';
import LoginPage from './pages/login/login';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Providers />}>
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
