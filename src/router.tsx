import { createBrowserRouter, RouterProvider } from 'react-router';
import AdminLayout from './components/admin-layout';
import LoginPage from './pages/login';
import NotFound from './pages/not-found';
import TransparencyTypesPage from './pages/transparency-types';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { path: 'tipos-transparencia', element: <TransparencyTypesPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
