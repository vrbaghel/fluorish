import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AppContext, type AppStatus, type OnboardingInput } from './AppContext'
import { simulateFetchUser, type MockUser } from '../mocks/mockUser'

type Props = {
  children: ReactNode
}

const USER_STORAGE_KEY = 'fluorish:user'
const LOGIN_STATUS_KEY = 'fluorish:isLoggedIn'

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function readStoredUser(): MockUser | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(USER_STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as MockUser
  } catch (err) {
    console.warn('Failed to parse stored user, clearing cache', err)
    window.localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

function readStoredLoginStatus(): boolean {
  if (typeof window === 'undefined') return false
  const stored = window.localStorage.getItem(LOGIN_STATUS_KEY)
  return stored === 'true'
}

function writeStoredLoginStatus(isLoggedIn: boolean): void {
  if (typeof window === 'undefined') return
  if (isLoggedIn) {
    window.localStorage.setItem(LOGIN_STATUS_KEY, 'true')
  } else {
    window.localStorage.removeItem(LOGIN_STATUS_KEY)
  }
}

export function AppProvider({ children }: Props) {
  const [status, setStatus] = useState<AppStatus>('splash')
  const [user, setUser] = useState<MockUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loginProvider, setLoginProvider] = useState<string | null>(null)

  // Single bootstrap effect: Load everything from localStorage during splash screen
  useEffect(() => {
    let cancelled = false
    const bootstrap = async () => {
      // Show splash screen while loading
      setStatus('splash')
      setError(null)

      // Simulate splash screen delay
      await wait(1000)
      if (cancelled) return

      // Read both login status and user data from localStorage
      const storedLoginStatus = readStoredLoginStatus()
      const storedUser = readStoredUser()
      if (cancelled) return

      // Restore state based on what we found
      if (storedLoginStatus) {
        setIsLoggedIn(true)
        if (storedUser) {
          // Returning user with profile - go to dashboard
          setUser(storedUser)
          setStatus('ready')
        } else {
          // Logged in but no profile - needs onboarding
          setUser(null)
          setStatus('ready')
        }
      } else {
        // User is not logged in - show login screen
        setUser(null)
        setIsLoggedIn(false)
        setStatus('loggedOut')
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(
    async (provider: string) => {
      setLoginProvider(provider)
      setStatus('authenticating')
      setError(null)
      try {
        await wait(1000 + Math.random() * 600)

        // Check if user already has a profile (from previous session)
        const existingProfile = readStoredUser()
        if (existingProfile) {
          // Returning user – load their profile and go straight to dashboard
          setUser(existingProfile)
          setIsLoggedIn(true)
          writeStoredLoginStatus(true)
          setStatus('ready')
        } else {
          // First-time user – mark as logged in, profile will be created in onboarding
          setUser(null)
          setIsLoggedIn(true)
          writeStoredLoginStatus(true)
          setStatus('ready')
        }
      } catch (err) {
        console.error(err)
        setError('Unable to sign you in. Please try again.')
        setStatus('loggedOut')
      } finally {
        setLoginProvider(null)
      }
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    setStatus('loggedOut')
    setError(null)
    setIsLoggedIn(false)
    setLoginProvider(null)
    // Clear both user and login status from localStorage
    if (typeof window !== 'undefined') {
      // window.localStorage.removeItem(USER_STORAGE_KEY)
      window.localStorage.removeItem(LOGIN_STATUS_KEY)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    if (!isLoggedIn) return
    setStatus('loading')
    setError(null)
    try {
      // First try to load from localStorage (preserves user's onboarding data)
      const storedUser = readStoredUser()
      if (storedUser) {
        setUser(storedUser)
        setStatus('ready')
        return
      }

      // Fallback to simulated fetch if no stored user
      const data = await simulateFetchUser()
      setUser(data)
      // Save fetched data to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data))
      }
      setStatus('ready')
    } catch (err) {
      console.error(err)
      setError('Unable to load your profile. Please retry.')
      setStatus('error')
    }
  }, [isLoggedIn])

  const completeOnboarding = useCallback((data: OnboardingInput) => {
    const profile: MockUser = {
      id: 'user-001',
      name: 'Jane Doe',
      avatar:
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
      homeZone: `${data.location} · Garden space (${data.spaceAreaSqFt} sq ft, ${data.spaceHeightFt} ft height)`,
      daylightHours: `${data.sunlightHoursPerDay} hrs / day`,
      location: data.location,
      sunlightHoursPerDay: data.sunlightHoursPerDay,
      spaceHeightFt: data.spaceHeightFt,
      spaceAreaSqFt: data.spaceAreaSqFt,
    }

    // Save to localStorage immediately
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile))
    }

    setUser(profile)
    setIsLoggedIn(true)
    writeStoredLoginStatus(true)
    setStatus('ready')
    setError(null)
  }, [])

  const value = useMemo(
    () => ({
      status,
      user,
      error,
      isLoggedIn,
      loginProvider,
      refreshUser,
      login,
      logout,
      completeOnboarding,
    }),
    [status, user, error, isLoggedIn, loginProvider, refreshUser, login, logout, completeOnboarding],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
