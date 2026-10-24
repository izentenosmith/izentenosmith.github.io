import { motion } from 'motion/react'
import { NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/experience', label: 'Experience' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

const year = new Date().getFullYear()

export function SiteLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-4">
          <NavLink to="/" className="mr-auto font-heading font-semibold">
            Ignacio Zenteno
          </NavLink>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'text-sm text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'text-foreground',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="mx-auto w-full max-w-4xl flex-1 px-4 py-12"
      >
        <Outlet />
      </motion.main>

      <footer className="border-t">
        <p className="mx-auto max-w-4xl px-4 py-6 text-sm text-muted-foreground">
          © {year} Ignacio Zenteno Smith
        </p>
      </footer>

      <ScrollRestoration />
    </div>
  )
}
