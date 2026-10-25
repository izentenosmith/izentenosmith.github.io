import { Info, Lightbulb, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const kinds = {
  note: { icon: Info, className: 'border-border bg-muted/50' },
  tip: { icon: Lightbulb, className: 'border-brand/40 bg-brand/5' },
  warning: { icon: TriangleAlert, className: 'border-amber-500/40 bg-amber-500/5' },
}

export function Callout({
  kind = 'note',
  title,
  children,
}: {
  kind?: keyof typeof kinds
  title?: string
  children: ReactNode
}) {
  const { icon: Icon, className } = kinds[kind]
  return (
    <aside className={cn('not-prose my-6 flex gap-3 rounded-xl border p-4 text-sm', className)}>
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="space-y-2 text-pretty [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em] [&_p]:leading-relaxed">
        {title && <p className="font-medium">{title}</p>}
        {children}
      </div>
    </aside>
  )
}
