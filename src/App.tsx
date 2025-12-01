import { useState } from 'react'
import type { AppStatus } from './context/AppContext'
import type { MockUser } from './mocks/mockUser'
import { useAppContext } from './hooks/useAppContext'

const AUTH_OPTIONS = [
  { id: 'google', label: 'Google', badge: 'G', classes: 'bg-white text-background' },
  { id: 'facebook', label: 'Facebook', badge: 'F', classes: 'bg-blue-600 text-white' },
  { id: 'apple', label: 'Apple', badge: 'A', classes: 'bg-black text-white' },
  { id: 'x', label: 'X', badge: 'X', classes: 'bg-slate-900 text-white' },
] as const

const PROVIDER_COPY: Record<string, string> = {
  google: 'Google',
  facebook: 'Facebook',
  apple: 'Apple',
  x: 'X',
}

function App() {
  const {
    status,
    user,
    error,
    refreshUser,
    logout,
    login,
    loginProvider,
    isLoggedIn,
  } = useAppContext()

  const shouldShowDashboard =
    status === 'ready' ||
    status === 'loading' ||
    (status === 'error' && isLoggedIn)

  if (status === 'splash') {
    return <SplashScreen />
  }

  if (status === 'authenticating') {
    return <AuthLoadingScreen provider={loginProvider} />
  }

  if (status === 'loggedOut' && !shouldShowDashboard) {
    return <LoginScreen errorMessage={error} onSelectProvider={login} />
  }

  if (status === 'error' && !isLoggedIn) {
    return <FatalErrorScreen message={error} onBackToLogin={logout} />
  }

  if (shouldShowDashboard) {
    return (
      <DashboardView
        status={status}
        user={user}
        error={error}
        refreshUser={refreshUser}
        logout={logout}
      />
    )
  }

  return null
}

type DashboardProps = {
  status: AppStatus
  user: MockUser | null
  error: string | null
  refreshUser: () => void
  logout: () => void
}

function DashboardView({ status, user, error, refreshUser, logout }: DashboardProps) {
  const [streak, setStreak] = useState(0)
  const isLoading = status === 'loading'
  const isReady = status === 'ready'

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
                Syncing your garden plan (mock delay via <code>setTimeout</code>
                )…
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
                    You are signed out. Load the mock profile to keep planning
                    your crops.
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
          Built for mobile PWA — perfect for balconies, windowsills, and tiny
          terraces.
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
            Install the app as a Progressive Web App on your phone or shrink the
            viewport to continue.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Switch to mobile view to proceed
        </p>
      </section>
    </main>
  )
}

type ProviderHandler = (provider: string) => Promise<void>

function LoginScreen({
  errorMessage,
  onSelectProvider,
}: {
  errorMessage: string | null
  onSelectProvider: ProviderHandler
}) {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
        <div className="space-y-4 text-center">
          <LogoMark size="lg" />
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-primary">
            FLUORISH
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground">
            Sign in to continue growing
          </h1>
          <p className="text-sm text-muted">
            Choose a mock provider below. We&apos;ll save your garden plan to
            local storage and send you to the dashboard.
          </p>
        </div>

        {errorMessage && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </p>
        )}

        <div className="space-y-4 flex flex-col items-center">
          {AUTH_OPTIONS.map((provider) => (
            <button
              key={provider.id}
              className={`flex w-3/4 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold tracking-[0.3em] transition-transform active:scale-[0.99] ${provider.classes}`}
              onClick={() => {
                void onSelectProvider(provider.id)
              }}
            >
              <span className="text-base">{provider.badge}</span>
              <span className="flex-1 text-center font-semibold tracking-[0.2em]">
                {provider.label}
              </span>
              <span className="text-base">&rarr;</span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted">
          Mock auth only — nothing is sent over the network.
        </p>
      </div>
    </main>
  )
}

function SplashScreen() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh max-w-sm flex-col items-center justify-center px-6 text-center">
        <LogoMark size="lg" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.55em] text-primary">
          FLUORISH
        </p>
        <p className="mt-3 text-sm text-muted">Preparing your city-growing hub…</p>
      </div>
    </main>
  )
}

function AuthLoadingScreen({ provider }: { provider: string | null }) {
  const providerLabel = provider ? PROVIDER_COPY[provider] ?? provider : 'your garden'

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh max-w-sm flex-col items-center justify-center px-6 text-center">
        <LogoMark />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.55em] text-primary">
          FLUORISH
        </p>
        <h2 className="mt-4 text-2xl font-semibold">
          Connecting with {providerLabel}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Saving your garden preferences before launching the dashboard.
        </p>
        <div className="mt-8 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-1/3 animate-pulse bg-primary" />
        </div>
      </div>
    </main>
  )
}

function FatalErrorScreen({
  message,
  onBackToLogin,
}: {
  message: string | null
  onBackToLogin: () => void
}) {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
        <LogoMark />
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-red-400">
            FLUORISH
          </p>
          <h2 className="text-2xl font-semibold text-white">We hit a snag</h2>
          <p className="text-sm text-muted">
            {message ?? 'Something interrupted the launch. Please return to the login screen.'}
          </p>
        </div>
        <button className="btn-primary w-full max-w-xs" onClick={onBackToLogin}>
          Back to login
        </button>
      </div>
    </main>
  )
}

function LogoMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions =
    size === 'lg'
      ? 'h-20 w-20 text-2xl'
      : size === 'sm'
        ? 'h-10 w-10 text-lg'
        : 'h-14 w-14 text-xl'

  return (
    <div
      className={`mx-auto flex items-center justify-center rounded-2xl bg-linear-to-br from-primary to-emerald-500 font-semibold text-background ${dimensions}`}
    >
      F
    </div>
  )
}

export default App
