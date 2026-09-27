import { createBrowserRouter } from 'react-router-dom'
import { TestsPage } from '@/features/tests'
import { Layout } from '@/shared/components/Layout'
import { NotFound } from '@/shared/components/NotFound'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <TestsPage /> },
      { path: 'tests', element: <TestsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
