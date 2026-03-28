import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/home';
import NotFound from './pages/not-found';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '*', element: <NotFound /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
