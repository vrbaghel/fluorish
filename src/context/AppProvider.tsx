import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AppContext, type AppStatus } from './AppContext'
import { mockUser, simulateFetchUser, type MockUser } from '../mocks/mockUser'

type Props = {
  children: ReactNode
}

const USER_STORAGE_KEY = 'fluorish:user'

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

export function AppProvider({ children }: Props) {
  const [status, setStatus] = useState<AppStatus>('splash')
  const [user, setUser] = useState<MockUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loginProvider, setLoginProvider] = useState<string | null>(null)
  const [fetchNonce, setFetchNonce] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [user])

  useEffect(() => {
    let cancelled = false
    const bootstrap = async () => {
      setStatus('splash')
      setError(null)
      await wait(1000)
      if (cancelled) return

      const storedUser = readStoredUser()
      if (cancelled) return

      if (storedUser) {
        setUser(storedUser)
        setIsLoggedIn(true)
        setStatus('ready')
      } else {
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

  useEffect(() => {
    if (!isLoggedIn || fetchNonce === 0) return
    let cancelled = false
    const load = async () => {
      setStatus('loading')
      setError(null)
      try {
        const data = await simulateFetchUser()
        if (cancelled) return
        setUser(data)
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        console.error(err)
        setError('Unable to load your profile. Please retry.')
        setStatus('error')
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [isLoggedIn, fetchNonce])

  const login = useCallback(
    async (provider: string) => {
      setLoginProvider(provider)
      setStatus('authenticating')
      setError(null)
      try {
        const [profile] = await Promise.all([
          Promise.resolve(mockUser),
          wait(1000 + Math.random() * 600),
        ])
        setUser(profile)
        setIsLoggedIn(true)
        setStatus('ready')
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
  }, [])

  const refreshUser = useCallback(() => {
    if (!isLoggedIn) return
    setFetchNonce((nonce) => nonce + 1)
  }, [isLoggedIn])

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
    }),
    [status, user, error, isLoggedIn, loginProvider, refreshUser, login, logout],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
