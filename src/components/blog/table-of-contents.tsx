import { useEffect, useMemo, useState } from 'react'
import type { PostHeading } from '@/content/post-types'
import { cn } from '@/lib/utils'

/** Tracks which section heading is currently at the top of the viewport. */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string>()

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el) => el !== null)
    if (elements.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

export function TableOfContents({
  headings,
  onNavigate,
}: {
  headings: PostHeading[]
  onNavigate?: () => void
}) {
  const ids = useMemo(() => headings.map((heading) => heading.id), [headings])
  const active = useActiveHeading(ids)

  return (
    <ul className="space-y-1.5 text-sm">
      {headings.map(({ id, text, depth }) => (
        <li key={id} className={cn(depth === 3 && 'pl-3')}>
          <a
            href={`#${id}`}
            onClick={onNavigate}
            className={cn(
              'block text-pretty text-muted-foreground transition-colors hover:text-foreground',
              active === id && 'font-medium text-brand hover:text-brand',
            )}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  )
}
