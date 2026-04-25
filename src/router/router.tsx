import FamiliesAdminPage from '@/pages/family';
import FamilyRegistrationPage from '@/pages/family-registration';
import { createBrowserRouter, RouterProvider } from 'react-router';
import AdminLayout from '../components/admin-layout';
import LoginPage from '../pages/login';
import NotFound from '../pages/not-found';
import TransparencyPage from '../pages/transparency';
import TransparencyTypesPage from '../pages/transparency-types';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/cadastro-familia/:token', element: <FamilyRegistrationPage /> },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { path: 'tipos-transparencia', element: <TransparencyTypesPage /> },
      { path: 'transparencia', element: <TransparencyPage /> },
      { path: 'familia', element: <FamiliesAdminPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
