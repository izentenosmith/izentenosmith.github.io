import { MotionConfig, motion } from 'motion/react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

export function SiteLayout() {
  const { pathname } = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <div className="flex min-h-svh flex-col">
          <SiteHeader />
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:py-16"
          >
            <Outlet />
          </motion.main>
          <SiteFooter />
        </div>
        <ScrollRestoration />
      </TooltipProvider>
    </MotionConfig>
  )
}
