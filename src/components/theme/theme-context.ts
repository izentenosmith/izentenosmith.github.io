import { createContext, useContext } from 'react'

/** The site's look: palette, faces and shapes (index.css). */
export type SiteTheme = 'electric' | 'old-money'

/** Light or dark within the theme; 'system' follows the OS. */
export type Mode = 'light' | 'dark' | 'system'

export const SITE_THEMES: SiteTheme[] = ['electric', 'old-money']

export const THEME_STORAGE_KEY = 'site-theme'
// Named 'theme' because it predates site themes; kept so returning visitors keep their mode.
export const MODE_STORAGE_KEY = 'theme'

type ThemeContextValue = {
  theme: SiteTheme
  setTheme: (theme: SiteTheme) => void
  mode: Mode
  setMode: (mode: Mode) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside ThemeProvider')
  return value
}
