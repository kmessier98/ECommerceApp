import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ConnexionPage, CreerComptePage, RequireAuth } from '@/features/auth'
import { CataloguePage } from '@/features/catalogue'
import { CommandesPage, ConfirmationPage } from '@/features/commandes'
import { ProfilPage } from '@/features/compte'
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
      // Landing page after checkout, once the payment webhook has confirmed the order.
      { path: 'commandes/:numero/confirmation', element: <ConfirmationPage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <CompteLayout />,
            children: [
              { path: 'commandes', element: <CommandesPage /> },
              // TODO: replace the placeholders once these tabs have mockups
              { path: 'compte', element: <ProfilPage /> },
              { path: 'compte/adresses', element: <PageAVenir titre="Adresses" /> },
              { path: 'compte/paiement', element: <PageAVenir titre="Moyens de paiement" /> },
            ],
          },
        ],
      },
      { path: 'tests', element: <TestsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
