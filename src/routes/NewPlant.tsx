import { Navigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import AppLayout from '../components/AppLayout'
import NewPlantFlow from '../components/NewPlantFlow'

export default function NewPlant() {
  const { isLoggedIn } = useAppContext()

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return (
    <AppLayout>
      <NewPlantFlow />
      <section className="hidden min-h-svh flex-col items-center justify-center gap-4 px-6 text-center lg:flex">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-8 py-10 shadow-2xl shadow-red-900/40">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
            Desktop blocked
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white">
            FLOURISH only runs as a PWA on mobile screens
          </h2>
        </div>
      </section>
    </AppLayout>
  )
}

