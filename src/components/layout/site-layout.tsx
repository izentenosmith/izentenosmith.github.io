import { LazyMotion, MotionConfig, m } from 'motion/react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

// Animation features load in their own chunk after first paint; `m` components
// render their initial state until then.
const loadMotionFeatures = () => import('@/components/motion/features').then((module) => module.default)

export function SiteLayout() {
  const { pathname } = useLocation()

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
          <div className="flex min-h-svh flex-col">
            <SiteHeader />
            <m.main
              id="main"
              tabIndex={-1}
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 outline-none sm:py-16"
            >
              <Outlet />
            </m.main>
            <SiteFooter />
          </div>
          <ScrollRestoration />
        </TooltipProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
