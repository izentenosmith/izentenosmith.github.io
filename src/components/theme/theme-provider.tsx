import { useEffect, useState, type ReactNode } from 'react'
import {
  MODE_STORAGE_KEY,
  SITE_THEMES,
  THEME_STORAGE_KEY,
  ThemeContext,
  type Mode,
  type SiteTheme,
} from './theme-context'

const systemQuery = '(prefers-color-scheme: dark)'

/** Each theme's tab icons; electric's are the defaults in index.html. */
const icons: Record<SiteTheme, { favicon: string; appleTouch: string }> = {
  electric: { favicon: '/favicon-32.png', appleTouch: '/apple-touch-icon.png' },
  'old-money': { favicon: '/icons/old-money-32.png', appleTouch: '/icons/old-money-apple-touch.png' },
}

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const stored = localStorage.getItem(key) as T | null
    if (stored && allowed.includes(stored)) return stored
  } catch {
    // Storage can be blocked (private mode); fall back to the default.
  }
  return fallback
}

function store(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Not persisted; the choice still applies for this visit.
  }
}

/** Mirrors the pre-paint script in index.html, plus the parts that can wait for React. */
function apply(theme: SiteTheme, mode: Mode) {
  const root = document.documentElement
  const dark = mode === 'dark' || (mode === 'system' && matchMedia(systemQuery).matches)
  root.classList.toggle('dark', dark)
  if (theme === 'electric') delete root.dataset.theme
  else root.dataset.theme = theme

  document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute('href', icons[theme].favicon)
  document
    .querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')
    ?.setAttribute('href', icons[theme].appleTouch)
  // The browser chrome matches the page background of the current theme and mode.
  const background = getComputedStyle(root).getPropertyValue('--background').trim()
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    meta.content = background
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(() =>
    readStored(THEME_STORAGE_KEY, SITE_THEMES, 'electric'),
  )
  const [mode, setModeState] = useState<Mode>(() =>
    readStored(MODE_STORAGE_KEY, ['light', 'dark'] as Mode[], 'system'),
  )

  useEffect(() => {
    apply(theme, mode)
    if (mode !== 'system') return
    const media = matchMedia(systemQuery)
    const onChange = () => apply(theme, 'system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme, mode])

  // Both setters apply synchronously so a view transition can snapshot the result.
  const setTheme = (next: SiteTheme) => {
    store(THEME_STORAGE_KEY, next === 'electric' ? null : next)
    apply(next, mode)
    setThemeState(next)
  }
  const setMode = (next: Mode) => {
    store(MODE_STORAGE_KEY, next === 'system' ? null : next)
    apply(theme, next)
    setModeState(next)
  }

  return <ThemeContext value={{ theme, setTheme, mode, setMode }}>{children}</ThemeContext>
}
