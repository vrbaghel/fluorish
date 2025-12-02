import { useAppContext } from './hooks/useAppContext'
import { Navigate } from 'react-router-dom'

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
    logout,
    login,
    loginProvider,
    isLoggedIn,
  } = useAppContext()

  const hasProfile = !!user
  const isFirstTimeLoggedIn = isLoggedIn && !hasProfile

  const shouldShowDashboard =
    (status === 'ready' && hasProfile) ||
    status === 'loading' ||
    (status === 'error' && isLoggedIn)

  if (status === 'splash') {
    return <SplashScreen />
  }

  if (status === 'authenticating') {
    return <AuthLoadingScreen provider={loginProvider} />
  }

  if (isFirstTimeLoggedIn) {
    return <Navigate to="/onboarding" replace />
  }

  if (status === 'loggedOut' && !shouldShowDashboard) {
    return <LoginScreen errorMessage={error} onSelectProvider={login} />
  }

  if (status === 'error' && !isLoggedIn) {
    return <FatalErrorScreen message={error} onBackToLogin={logout} />
  }

  if (shouldShowDashboard) {
    return <Navigate to="/dashboard" replace />
  }

  return null
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
      ? 'h-24 w-24'
      : size === 'sm'
        ? 'h-10 w-10'
        : 'h-14 w-14'

  return (
    <div
      className={`mx-auto flex items-center justify-center rounded-2xl bg-linear-to-br from-primary to-emerald-500 font-semibold text-background ${dimensions}`}
    >
      <img src="/pwa-512x512.png" alt="Fluorish" className="w-full h-full object-contain" />
    </div>
  )
}

export default App
