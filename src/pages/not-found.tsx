import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { profile } from '@/content/profile'
import { usePageMeta } from '@/lib/use-page-meta'

export function NotFoundPage() {
  const { pathname } = useLocation()
  usePageMeta({
    path: pathname,
    title: `Page not found — ${profile.name}`,
    description: 'There is nothing at this address.',
  })
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">There is nothing at this address.</p>
      <Button asChild>
        <Link to="/">Back home</Link>
      </Button>
    </section>
  )
}
