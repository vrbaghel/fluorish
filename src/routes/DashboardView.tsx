import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'

export default function DashboardView() {
  const { status, isLoggedIn, user, error, refreshUser, logout } = useAppContext()
  const [streak, setStreak] = useState(0);
  const isLoading = status === 'loading';
  const isReady = status === 'ready';
  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  };

  return (
    <main className="min-h-svh bg-background text-foreground">
      <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16 lg:hidden">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            FLUORISH
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Urban gardening for compact city spaces
          </h1>
          <p className="text-base text-muted sm:text-lg">
            Plan and track a thriving balcony or window garden, tuned to your
            light, space, and local climate.
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted">
            Account snapshot
          </p>

          {isLoading && (
            <div className="mt-4 space-y-3 text-left">
              <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
              <p className="text-sm text-muted">
                Syncing your garden plan (mock delay via <code>setTimeout</code>)…
              </p>
            </div>
          )}

          {status === 'error' && user && (
            <div className="mt-4 space-y-4 text-left">
              <p className="text-sm text-red-300">{error}</p>
              <button className="btn-primary w-full" onClick={refreshUser}>
                Retry mock fetch
              </button>
            </div>
          )}

          {isReady && (
            <div className="mt-4 space-y-4 text-left">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-base font-semibold">{user.name}</p>
                      <p className="text-xs text-muted">{user.homeZone}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 px-4 py-3 text-sm text-muted">
                    <p className="font-semibold text-foreground">Natural light</p>
                    <p>{user.daylightHours}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="btn-secondary flex-1" onClick={refreshUser}>
                      Refresh mock data
                    </button>
                    <button className="btn-primary flex-1" onClick={logout}>
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted">
                    You are signed out. Load the mock profile to keep planning your crops.
                  </p>
                  <button className="btn-primary w-full" onClick={refreshUser}>
                    Load mock profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/8 bg-surface-elevated/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted">
              Daily care streak
            </p>
            <button className="btn-secondary text-xs" onClick={() => setStreak(0)}>
              Reset
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-5xl font-semibold text-foreground">{streak}</p>
              <p className="text-xs text-muted">days watering on schedule</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => setStreak((value) => value + 1)}>
                Mark today as done
              </button>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-muted">
          Built for mobile PWA — perfect for balconies, windowsills, and tiny terraces.
        </footer>
      </section>

      <section className="hidden min-h-svh flex-col items-center justify-center gap-4 px-6 text-center lg:flex">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-8 py-10 shadow-2xl shadow-red-900/40">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
            Desktop blocked
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white">
            FLUORISH only runs as a PWA on mobile screens
          </h2>
          <p className="mt-3 text-base text-red-200">
            Install the app as a Progressive Web App on your phone or shrink the viewport to
            continue.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Switch to mobile view to proceed
        </p>
      </section>
    </main>
  )
}


