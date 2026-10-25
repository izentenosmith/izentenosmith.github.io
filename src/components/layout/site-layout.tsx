import { LazyMotion, MotionConfig } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

// Animation features load in their own chunk after first paint; `m` components
// render their initial state until then.
const loadMotionFeatures = () => import('@/components/motion/features').then((module) => module.default)

/**
 * Feeds the `.spotlight` hover glow (index.css): one listener for the whole
 * page writes the pointer position into CSS variables on the hovered card.
 */
function useSpotlight() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const card = (event.target as Element | null)?.closest<HTMLElement>('.spotlight')
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
      card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}

/**
 * After client-side navigation, move focus to the new page's content so
 * keyboard and screen reader users start there instead of on the old link.
 */
function useFocusOnRouteChange() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return mainRef
}

export function SiteLayout() {
  const mainRef = useFocusOnRouteChange()
  useSpotlight()

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <a
            href="#main"
            className="sr-only z-50 rounded-md bg-background px-3 py-2 text-sm font-medium ring-2 ring-ring focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <div className="relative isolate flex min-h-dvh flex-col">
            <div aria-hidden="true" className="aurora" />
            <SiteHeader />
            <main
              ref={mainRef}
              id="main"
              tabIndex={-1}
              className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 outline-none sm:px-6 sm:py-16"
            >
              <Outlet />
            </main>
            <SiteFooter />
          </div>
          <ScrollRestoration />
        </TooltipProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
