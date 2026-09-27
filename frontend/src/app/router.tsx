import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ConnexionPage, CreerComptePage } from '@/features/auth'
import { CataloguePage } from '@/features/catalogue'
import { CommandesPage } from '@/features/commandes'
import { PanierPage } from '@/features/panier'
import { TestsPage } from '@/features/tests'
import { CompteLayout } from '@/shared/components/CompteLayout'
import { Layout } from '@/shared/components/Layout'
import { NotFound } from '@/shared/components/NotFound'
import { PageAVenir } from '@/shared/components/PageAVenir'

export const router = createBrowserRouter([
  // Full-screen pages with their own header, so they sit outside the shared Layout.
  { path: 'connexion', element: <ConnexionPage /> },
  { path: 'inscription', element: <CreerComptePage /> },
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/catalogue" replace /> },
      { path: 'catalogue', element: <CataloguePage /> },
      { path: 'panier', element: <PanierPage /> },
      {
        element: <CompteLayout />,
        children: [
          { path: 'commandes', element: <CommandesPage /> },
          // TODO: replace the placeholders once these tabs have mockups
          { path: 'compte', element: <PageAVenir titre="Profil" /> },
          { path: 'compte/adresses', element: <PageAVenir titre="Adresses" /> },
          { path: 'compte/paiement', element: <PageAVenir titre="Moyens de paiement" /> },
        ],
      },
      { path: 'tests', element: <TestsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
