import { type ReactNode } from 'react'
import BottomNavbar from './BottomNavbar'

type AppLayoutProps = {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNavbar />
    </div>
  )
}

