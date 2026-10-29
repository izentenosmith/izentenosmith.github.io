import { ArrowUpRight, BookOpen } from 'lucide-react'
import { Tabs } from 'radix-ui'
import type { CSSProperties, ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { books, papers, type Book, type Group, type Paper } from '@/content/literature'
import { staticPages } from '@/content/seo'
import { usePageMeta } from '@/lib/use-page-meta'

const count = <T,>(groups: Group<T>[]) => groups.reduce((total, group) => total + group.items.length, 0)

const tabs = [
  { value: 'books', total: count(books) },
  { value: 'papers', total: count(papers) },
] as const
type Tab = (typeof tabs)[number]['value']

export function LiteraturePage() {
  usePageMeta(staticPages[4])
  // The open tab lives in the URL (?tab=papers), so either list can be shared directly.
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: Tab = searchParams.get('tab') === 'papers' ? 'papers' : 'books'

  return (
    <div className="space-y-8 sm:space-y-12">
      <header className="max-w-2xl space-y-3 sm:space-y-4">
        <h1 className="animate-enter font-heading text-h1 font-semibold sm:text-display">Literature</h1>
        <p
          className="animate-enter text-base text-pretty text-muted-foreground sm:text-lg"
          style={{ '--enter-index': 1 } as CSSProperties}
        >
          Books and papers I've read and recommend: the ones behind how I design, build and run software.
        </p>
      </header>

      <Tabs.Root
        value={tab}
        onValueChange={(value) =>
          setSearchParams(value === 'books' ? {} : { tab: value }, {
            replace: true,
            preventScrollReset: true,
          })
        }
        className="space-y-8"
      >
        <Tabs.List aria-label="Reading list" className="inline-flex gap-1 rounded-full border bg-card p-1">
          {tabs.map(({ value, total }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 font-mono text-xs text-muted-foreground capitalize transition-colors duration-(--dur-hover) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[state=active]:bg-brand data-[state=active]:text-primary-foreground"
            >
              {value}
              <span aria-hidden="true" className="opacity-70">
                {total}
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="books" className="space-y-10 focus-visible:outline-none">
          {books.map((group) => (
            <Section key={group.label} label={group.label}>
              {group.items.map((book) => (
                <BookItem key={book.title} book={book} />
              ))}
            </Section>
          ))}
        </Tabs.Content>

        <Tabs.Content value="papers" className="space-y-10 focus-visible:outline-none">
          {papers.map((group) => (
            <Section key={group.label} label={group.label}>
              {group.items.map((paper) => (
                <PaperItem key={paper.href} paper={paper} />
              ))}
            </Section>
          ))}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">{label}</h2>
      <ul className="grid gap-3 md:grid-cols-2">{children}</ul>
    </section>
  )
}

function BookItem({ book }: { book: Book }) {
  return (
    <li className="flex items-start gap-4 rounded-2xl border bg-card p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted">
        <BookOpen aria-hidden="true" className="size-4.5" />
      </span>
      <div className="min-w-0">
        <p className="font-medium text-balance">{book.title}</p>
        <p className="text-sm text-muted-foreground">{book.authors}</p>
      </div>
    </li>
  )
}

function PaperItem({ paper }: { paper: Paper }) {
  return (
    <li className="group spotlight flex interactive-card items-start gap-4 rounded-2xl border bg-card p-4 hover:border-brand/40 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-mono text-xs text-muted-foreground">
          {paper.source}
          {paper.year && ` · ${paper.year}`}
        </p>
        <a
          href={paper.href}
          target="_blank"
          rel="noreferrer"
          className="block font-medium text-balance after:absolute after:inset-0 focus-visible:outline-none"
        >
          {paper.title}
        </a>
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="size-5 shrink-0 text-muted-foreground transition-transform duration-(--dur-hover) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
      />
    </li>
  )
}
