import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { images } from '@/assets/images'
import { Picture } from '@/components/picture'
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
    <section className="grid items-center gap-10 md:grid-cols-12">
      <div className="space-y-5 md:col-span-7">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-metric">404</span> · {pathname}
        </p>
        <h1 className="animate-enter font-heading text-h1 font-semibold">Page not found</h1>
        <p className="max-w-lg text-lg text-pretty text-muted-foreground">
          This route isn't in service discovery. It may have moved, or the link has a typo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="h-11 px-4" asChild>
            <Link to="/" viewTransition>
              <ArrowLeft data-icon="inline-start" />
              Back home
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-11 px-4" asChild>
            <Link to="/blog" viewTransition>
              Read the blog
            </Link>
          </Button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-64 overflow-hidden rounded-2xl border bg-card md:col-span-5 md:max-w-xs">
        <Picture
          picture={images.cartoon.picture}
          alt={images.cartoon.alt}
          sizes="(min-width: 768px) 320px, 256px"
          className="aspect-[4/5]"
        />
      </div>
    </section>
  )
}
