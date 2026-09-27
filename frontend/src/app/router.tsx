import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ConnexionPage, CreerComptePage } from '@/features/auth'
import { CataloguePage } from '@/features/catalogue'
import { TestsPage } from '@/features/tests'
import { Layout } from '@/shared/components/Layout'
import { NotFound } from '@/shared/components/NotFound'

export const router = createBrowserRouter([
  // Full-screen pages with their own header, so they sit outside the shared Layout.
  { path: 'connexion', element: <ConnexionPage /> },
  { path: 'inscription', element: <CreerComptePage /> },
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/catalogue" replace /> },
      { path: 'catalogue', element: <CataloguePage /> },
      { path: 'tests', element: <TestsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
