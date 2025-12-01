import { createContext } from 'react'
import type { MockUser } from '../mocks/mockUser'

export type AppStatus = 'loading' | 'ready' | 'error'

export type AppContextValue = {
  status: AppStatus
  user: MockUser | null
  error: string | null
  isLoggedIn: boolean
  refreshUser: () => void
  logout: () => void
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)

