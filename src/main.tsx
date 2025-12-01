import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import { AppProvider } from './context/AppProvider.tsx'
import './index.css'
import DashboardView from './routes/DashboardView.tsx'

registerSW({
  immediate: true,
})

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppProvider>
        <App />
      </AppProvider>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <AppProvider>
        <DashboardView />
      </AppProvider>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
