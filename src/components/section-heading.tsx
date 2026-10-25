import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

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
    <div className={cn('space-y-2', className)}>
      <p className="font-mono text-xs tracking-wider text-brand uppercase">{eyebrow}</p>
      <h2 id={id} className="font-heading text-h2 font-semibold">
        {children}
      </h2>
    </div>
  )
}
