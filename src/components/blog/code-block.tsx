import { useRef, type ComponentProps } from 'react'
import { CopyButton } from '@/components/copy-button'
import { cn } from '@/lib/utils'

const languageNames: Record<string, string> = {
  bash: 'Shell',
  go: 'Go',
  json: 'JSON',
  nginx: 'Nginx',
  promql: 'PromQL',
  python: 'Python',
  sql: 'SQL',
  yaml: 'YAML',
}

type CodeBlockProps = ComponentProps<'pre'> & {
  'data-title'?: string
  'data-language'?: string
}

/**
 * Replaces MDX's <pre>: a header with the file name (from ```lang title="…")
 * or the language, and a copy button. Highlighting comes from Shiki.
 */
export function CodeBlock({
  'data-title': title,
  'data-language': language,
  className,
  ...props
}: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const label = title ?? (language ? (languageNames[language] ?? language) : undefined)

  return (
    <figure className="not-prose group/code my-6 overflow-hidden rounded-xl border bg-card">
      <figcaption className="flex min-h-11 items-center justify-between gap-3 border-b bg-muted/60 pr-1.5 pl-4">
        <span className="truncate font-mono text-xs text-muted-foreground">{label ?? 'Code'}</span>
        <CopyButton
          value={() => preRef.current?.innerText ?? ''}
          label={`Copy ${label ?? 'code'}`}
          className="size-9 border-transparent bg-transparent"
        />
      </figcaption>
      <pre
        ref={preRef}
        {...props}
        className={cn('code-block m-0 overflow-x-auto py-4 font-mono text-[13px] leading-relaxed', className)}
      />
    </figure>
  )
}
