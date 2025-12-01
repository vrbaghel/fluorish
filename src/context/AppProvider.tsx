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

export function AppProvider({ children }: Props) {
  const [status, setStatus] = useState<AppStatus>('loading')
  const [user, setUser] = useState<MockUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const data = await simulateFetchUser()
      setUser(data)
      setStatus('ready')
    } catch (err) {
      console.error(err)
      setError('Unable to load your profile. Please retry.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally prime mock fetch on mount
    fetchUser()
  }, [fetchUser])

  const logout = useCallback(() => {
    setUser(null)
    setStatus('ready')
  }, [])

  const value = useMemo(
    () => ({
      status,
      user,
      error,
      refreshUser: fetchUser,
      logout,
    }),
    [status, user, error, fetchUser, logout],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

