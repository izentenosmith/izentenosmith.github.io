import type { ReactNode } from 'react'

export function SectionHeading({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-xs tracking-wider text-brand uppercase">{eyebrow}</p>
      <h2 className="font-heading text-2xl font-semibold tracking-tight">{children}</h2>
    </div>
  )
}
