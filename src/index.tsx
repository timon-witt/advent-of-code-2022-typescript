import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PuzzleRoute, PuzzleOverview } from './puzzles';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PuzzleOverview />
  },
  {
    path: '/:day/:number',
    element: <PuzzleRoute />
  }
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
