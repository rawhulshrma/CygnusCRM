// MainRoutes.jsx
import {Navigate } from 'react-router-dom';
import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';
import MainLayout from 'layout/MainLayout';
import ErrorBoundary from '../ErrorBoundary';
import Loadex from '../ui-component/Loadex';
import Loadable from '../ui-component/Loadable';


const DashboardDefault = Loadable(lazy(() => import('views/dashboard')), {
  fallback: <Loadex />
});
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')), {
  fallback: <Loadex />
});
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')), {
  fallback: <Loadex />
});
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')), {
  fallback: <Loadex />
});
const SamplePage = Loadable(lazy(() => import('views/sample-page')), {
  fallback: <Loadex />
});
const ProductsCategory = Loadable(lazy(() => import('views/products/productsCategory')), {
  fallback: <Loadex />
});
const Admin = Loadable(lazy(() => import('views/admin')), {
  fallback: <Loadex />
});
const Branch = Loadable(lazy(() => import('views/branch')), {
  fallback: <Loadex />
});
const Products = Loadable(lazy(() => import('views/products/products')), {
  fallback: <Loadex />
});
const CalendarPage = Loadable(lazy(() => import('views/calendar')), {
  fallback: <Loadex />
});
const Analytics = Loadable(lazy(() => import('views/analytics')), {
  fallback: <Loadex />
});
const People = Loadable(lazy(() => import('views/people')), {
  fallback: <Loadex />
});
const Companies = Loadable(lazy(() => import('views/companies')), {
  fallback: <Loadex />
});
const Profile = Loadable(lazy(() => import('views/profile')), {
  fallback: <Loadex />
});

const MainRoutes = {
  path: '/',
  element: <MainLayout />,  
  children: [
    {
      path: '/',
      element: <PrivateRoute />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: '/',
          element: <Navigate to="/dashboard" />,
          errorElement: <ErrorBoundary />
        },
        {
          path: 'dashboard',
          element: <DashboardDefault />,
            errorElement: <ErrorBoundary />
        },
        {
          path: 'utils/util-typography',
          element: <UtilsTypography />,
            errorElement: <ErrorBoundary />
        },
        {
          path: 'utils/util-color',
          element: <UtilsColor />,
            errorElement: <ErrorBoundary />
        },
        {
          path: 'utils/util-shadow',
          element: <UtilsShadow />,
            errorElement: <ErrorBoundary />
        },
        {
          path: 'sample-page',
          element: <SamplePage />,
            errorElement: <ErrorBoundary />
        },
        {
          path: '/people',
          element: <People />,
            errorElement: <ErrorBoundary />
        },
        {
          path: '/companies',
          element: <Companies />,
            errorElement: <ErrorBoundary />
        },
        {
          path: '/extra/calendar',
          element: <CalendarPage />,
            errorElement: <ErrorBoundary />
        },
        {
          path: '/analytics',
          element: <Analytics />,
            errorElement: <ErrorBoundary />
        },
        {
          path: '/profile',
          element: <Profile />,
            errorElement: <ErrorBoundary />
        },
        {
          path: '/admin',
          element: <Admin />,
            errorElement: <ErrorBoundary />
        },
        {
          path: '/branch',
          element: <Branch />,
            errorElement: <ErrorBoundary />
        },
        {
          path: '/products',
          element: <Products />,
            errorElement: <ErrorBoundary />
        },
        {
          path: '/category/products',
          element: <ProductsCategory/>,
            errorElement: <ErrorBoundary />
        }
      ]
    }
  ]
};

export default MainRoutes;
