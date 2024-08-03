import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import PrivateRoute from './PrivateRoute'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/pages/login/login3" replace />
  },
  {
    element: <PrivateRoute />,
    children: [MainRoutes]
  },
  AuthenticationRoutes,
], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
