import { createBrowserRouter, RouterProvider } from 'react-router';
import NotFound from './pages/not-found';

const router = createBrowserRouter([{ path: '*', element: <NotFound /> }]);

export default function Router() {
  return <RouterProvider router={router} />;
}
