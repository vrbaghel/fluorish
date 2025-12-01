import { createContext } from 'react'
import type { MockUser } from '../mocks/mockUser'

export type AppStatus =
  | 'splash'
  | 'authenticating'
  | 'loading'
  | 'ready'
  | 'error'
  | 'loggedOut'

export type AppContextValue = {
  status: AppStatus
  user: MockUser | null
  error: string | null
  isLoggedIn: boolean
  loginProvider: string | null
  refreshUser: () => void
  login: (provider: string) => Promise<void>
  logout: () => void
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)

