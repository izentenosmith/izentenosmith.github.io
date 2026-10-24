import { Menu } from 'lucide-react'
import { m } from 'motion/react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { profile } from '@/content/profile'
import { cn } from '@/lib/utils'
import { navItems } from './nav-items'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-4xl items-center gap-2 px-4">
        <Link to="/" className="mr-auto flex items-center gap-2 font-heading font-semibold">
          <span className="grid size-7 place-items-center rounded-md bg-foreground font-mono text-xs text-background">
            IZ
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center sm:flex">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <m.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-md bg-muted"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle />

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle>{profile.name}</SheetTitle>
            </SheetHeader>
            <nav aria-label="Main" className="flex flex-col gap-1 px-4">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                      isActive && 'bg-muted text-foreground',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
