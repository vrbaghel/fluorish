import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import { AppProvider } from './context/AppProvider.tsx'
import './index.css'
import DashboardView from './routes/DashboardView.tsx'
import MyPlants from './routes/MyPlants.tsx'
import MyProfile from './routes/MyProfile.tsx'
import MyTasks from './routes/MyTasks.tsx'
import NewPlant from './routes/NewPlant.tsx'
import Onboarding from './routes/Onboarding.tsx'
import PlantDetails from './routes/PlantDetails.tsx'

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
    path: '/my-plants',
    element: (
      <AppProvider>
        <MyPlants />
      </AppProvider>
    ),
  },
  {
    path: '/new-plant',
    element: (
      <AppProvider>
        <NewPlant />
      </AppProvider>
    ),
  },
  {
    path: '/my-tasks',
    element: (
      <AppProvider>
        <MyTasks />
      </AppProvider>
    ),
  },
  {
    path: '/my-profile',
    element: (
      <AppProvider>
        <MyProfile />
      </AppProvider>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <AppProvider>
        <Onboarding />
      </AppProvider>
    ),
  },
  {
    path: '/plant/:id',
    element: (
      <AppProvider>
        <PlantDetails />
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
