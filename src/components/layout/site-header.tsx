import { Menu } from 'lucide-react'
import { m } from 'motion/react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import electricBadge from '@/assets/brand/electric-badge.webp'
import oldMoneyBadge from '@/assets/brand/old-money-badge.webp'
import { useTheme, type SiteTheme } from '@/components/theme/theme-context'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { profile } from '@/content/profile'
import { cn } from '@/lib/utils'
import { navItems } from './nav-items'

const badges: Record<SiteTheme, string> = { electric: electricBadge, 'old-money': oldMoneyBadge }

/** The IZS mark of the current theme, cut from the same artwork as the app icons. */
export function IzsBadge({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <img
      src={badges[theme]}
      alt=""
      width={32}
      height={32}
      className={cn(
        'size-8 shrink-0',
        // The electric tile is near-black, so give it an edge on dark pages.
        theme === 'electric' && 'rounded-[30%] dark:ring-1 dark:ring-border',
        className,
      )}
    />
  )
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    // A floating, frosted bar: glass only here, where content scrolls underneath it.
    // `.site-header` (its view-transition-name) sits on the bar itself, not the <header>:
    // a view-transition-name on an ancestor would stop the blur from seeing the page.
    <header className="sticky top-3 z-40 px-3 sm:px-6">
      <div className="site-header mx-auto flex h-14 max-w-6xl items-center gap-1 rounded-pill border bg-background/80 pr-1.5 pl-2 shadow-(--float-shadow) backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sm:pr-2 sm:pl-3">
        <Link
          to="/"
          viewTransition
          className="mr-auto flex items-center gap-2.5 rounded-pill font-heading font-semibold"
        >
          <IzsBadge />
          <span className="hidden sm:inline">{profile.name}</span>
          <span className="sr-only sm:hidden">{profile.name}</span>
        </Link>

        <nav aria-label="Main" className="mr-1 hidden items-center sm:flex">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              viewTransition
              className={({ isActive }) =>
                cn(
                  'relative rounded-pill px-3.5 py-2 text-sm text-muted-foreground transition-colors duration-(--dur-hover) hover:text-foreground',
                  isActive && 'font-medium text-brand hover:text-brand',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <m.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-pill bg-brand/10 ring-1 ring-brand/20"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
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
            <Button variant="ghost" size="icon" className="size-11 sm:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2.5">
                <IzsBadge />
                {profile.name}
              </SheetTitle>
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
                      'flex min-h-11 items-center rounded-md px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                      isActive && 'bg-muted font-medium text-foreground',
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
