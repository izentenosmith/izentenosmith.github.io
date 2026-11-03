import { Landmark, Monitor, Moon, Sun, Zap } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme, type Mode, type SiteTheme } from './theme-context'

const themeOptions: { value: SiteTheme; label: string; icon: typeof Sun }[] = [
  { value: 'electric', label: 'Electric', icon: Zap },
  { value: 'old-money', label: 'Old money', icon: Landmark },
]

const modeOptions: { value: Mode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

/**
 * Switches theme or mode with the new look spreading in a circle from the toggle,
 * using the View Transitions API. Falls back to an instant switch when the
 * browser lacks the API or the user prefers reduced motion.
 */
function switchWithReveal(apply: () => void, origin: HTMLElement | null) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion || !origin) {
    apply()
    return
  }
  const rect = origin.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const root = document.documentElement

  root.classList.add('theme-transition')
  const transition = document.startViewTransition(apply)
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 500,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
    .catch(() => {})
  transition.finished.finally(() => root.classList.remove('theme-transition'))
}

export function ThemeToggle() {
  const { theme, setTheme, mode, setMode } = useTheme()
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="ghost"
          size="icon"
          className="size-11 sm:size-9"
          aria-label="Change theme"
        >
          <Sun className="size-4 scale-100 rotate-0 transition-transform duration-(--dur-enter) dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-transform duration-(--dur-enter) dark:scale-100 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) =>
              switchWithReveal(() => setTheme(value as SiteTheme), triggerRef.current)
            }
          >
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Mode</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={mode}
            onValueChange={(value) => switchWithReveal(() => setMode(value as Mode), triggerRef.current)}
          >
            {modeOptions.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
