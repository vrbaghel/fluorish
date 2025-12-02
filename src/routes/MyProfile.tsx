import { Navigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import AppLayout from '../components/AppLayout'

export default function MyProfile() {
  const { isLoggedIn, user, logout } = useAppContext()

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            MY PROFILE
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Account settings
          </h1>
          <p className="text-base text-muted sm:text-lg">
            Manage your profile and preferences.
          </p>
        </div>

        {user && (
          <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-muted">{user.homeZone}</p>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Location
                  </p>
                  <p className="mt-1 text-sm text-foreground">{user.location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Sunlight
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {user.sunlightHoursPerDay} hours per day
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Space
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {user.spaceAreaSqFt} sq ft, {user.spaceHeightFt} ft height
                  </p>
                </div>
              </div>

              <button className="btn-primary mt-4 w-full" onClick={logout}>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

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

