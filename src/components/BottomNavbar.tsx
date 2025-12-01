import { Link, useLocation } from 'react-router-dom'

type NavItem = {
  path: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/my-plants', label: 'My Plants', icon: '🌱' },
  { path: '/new-plant', label: 'New Plant', icon: '➕' },
  { path: '/my-tasks', label: 'My Tasks', icon: '✅' },
  { path: '/my-profile', label: 'My Profile', icon: '👤' },
]

export default function BottomNavbar() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-surface-elevated/95 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.05em]">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

