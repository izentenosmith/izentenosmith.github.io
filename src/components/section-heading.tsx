import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** A small pill label above a section title. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 font-mono text-xs tracking-wider text-muted-foreground uppercase backdrop-blur',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  children,
  id,
  className,
}: {
  eyebrow: string
  children: ReactNode
  id?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="font-heading text-h2 font-semibold">
        {children}
      </h2>
    </div>
  )
}
