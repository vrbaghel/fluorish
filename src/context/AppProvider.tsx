import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AppContext, type AppStatus } from './AppContext'
import { simulateFetchUser, type MockUser } from '../mocks/mockUser'

type Props = {
  children: ReactNode
}

const STORAGE_KEY = 'fluorish:isLoggedIn'

function readStoredLogin(): boolean {
  if (typeof window === 'undefined') return true
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === null) return true
  return stored === 'true'
}

export function AppProvider({ children }: Props) {
  const initialLoginState = readStoredLogin()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialLoginState)
  const [status, setStatus] = useState<AppStatus>(
    initialLoginState ? 'loading' : 'ready',
  )
  const [user, setUser] = useState<MockUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, String(isLoggedIn))
    }
  }, [isLoggedIn])

  const [fetchNonce, setFetchNonce] = useState(0)

  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false
    const load = async () => {
      setStatus('loading')
      setError(null)
      try {
        const data = await simulateFetchUser()
        if (cancelled) return
        setUser(data)
        setStatus('ready')
        setIsLoggedIn(true)
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

  const logout = useCallback(() => {
    setUser(null)
    setStatus('ready')
    setError(null)
    setIsLoggedIn(false)
  }, [])

  const refreshUser = useCallback(() => {
    if (!isLoggedIn) {
      setIsLoggedIn(true)
      setStatus('loading')
      setError(null)
      setFetchNonce((nonce) => nonce + 1)
    } else {
      setFetchNonce((nonce) => nonce + 1)
    }
  }, [isLoggedIn])

  const value = useMemo(
    () => ({
      status,
      user,
      error,
      isLoggedIn,
      refreshUser,
      logout,
    }),
    [status, user, error, isLoggedIn, refreshUser, logout],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
