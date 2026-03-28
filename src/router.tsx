import { createBrowserRouter, RouterProvider } from 'react-router';
import LoginPage from './pages/login';
import NotFound from './pages/not-found';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <NotFound /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
