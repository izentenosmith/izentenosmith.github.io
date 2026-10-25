import { useEffect, useState, type ReactNode } from 'react'
import { THEME_STORAGE_KEY, ThemeContext, type Theme } from './theme-context'

const systemQuery = '(prefers-color-scheme: dark)'

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Storage can be blocked (private mode); fall back to the system theme.
  }
  return 'system'
}

function applyTheme(theme: Theme) {
  const dark = theme === 'dark' || (theme === 'system' && matchMedia(systemQuery).matches)
  document.documentElement.classList.toggle('dark', dark)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const media = matchMedia(systemQuery)
    const onChange = () => applyTheme('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  const setTheme = (next: Theme) => {
    try {
      if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
      else localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Not persisted; the choice still applies for this visit.
    }
    // Apply synchronously so a view transition can snapshot the new theme.
    applyTheme(next)
    setThemeState(next)
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}
