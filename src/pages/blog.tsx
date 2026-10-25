import { ChevronDown } from 'lucide-react'
import { useId, useState, type CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PostCard } from '@/components/blog/post-card'
import { Button } from '@/components/ui/button'
import { posts } from '@/content/posts'
import { staticPages } from '@/content/seo'
import { usePageMeta } from '@/lib/use-page-meta'
import { cn } from '@/lib/utils'

const tagCounts = new Map<string, number>()
for (const tag of posts.flatMap((post) => post.tags)) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)

// Each post's lead tag comes first (in post order), so the short list on phones
// always reaches every post; then the most-used remaining tags, then alphabetical.
const leadTags = [...new Set(posts.map((post) => post.tags[0]))]
const otherTags = [...tagCounts.keys()]
  .filter((tag) => !leadTags.includes(tag))
  .sort((a, b) => tagCounts.get(b)! - tagCounts.get(a)! || a.localeCompare(b))
const allTags = [...leadTags, ...otherTags]

/** Phones show this many tags until "More tags" is pressed; wider screens show all. */
const PHONE_TAG_LIMIT = Math.max(6, leadTags.length)
const hiddenOnPhones = Math.max(0, allTags.length - PHONE_TAG_LIMIT)

export function BlogPage() {
  usePageMeta(staticPages[2])
  // The active tag lives in the URL (?tag=postgresql), so a filtered view can be shared.
  const [searchParams] = useSearchParams()
  const activeTag = searchParams.get('tag')
  const visible = activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts
  const featured = activeTag ? undefined : visible.find((post) => post.featured)
  const rest = visible.filter((post) => post !== featured)
  const [showAllTags, setShowAllTags] = useState(false)
  const tagListId = useId()

  return (
    // Phones get tighter spacing so the first post's title fits on the first screen.
    <div className="space-y-8 sm:space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="w-full max-w-2xl space-y-3 sm:w-auto sm:space-y-4">
          <h1 className="animate-enter font-heading text-h1 font-semibold sm:text-display">Blog</h1>
          <p
            className="animate-enter text-base text-pretty text-muted-foreground sm:text-lg"
            style={{ '--enter-index': 1 } as CSSProperties}
          >
            Technical write-ups on systems I've designed and run: how they're modeled, deployed and observed,
            and the trade-offs I'd revisit.
          </p>
        </div>
      </header>

      <nav aria-label="Filter posts by tag" className="space-y-1 sm:space-y-3">
        <ul id={tagListId} className="flex flex-wrap gap-2">
          <li>
            <TagLink tag={null} active={!activeTag} label={`All (${posts.length})`} />
          </li>
          {allTags.map((tag, index) => {
            // The active tag always stays visible, even when it's past the phone limit.
            const collapsed = index >= PHONE_TAG_LIMIT && !showAllTags && tag !== activeTag
            return (
              <li key={tag} className={cn(collapsed && 'hidden sm:block')}>
                <TagLink tag={tag} active={activeTag === tag} label={tag} />
              </li>
            )
          })}
        </ul>
        {hiddenOnPhones > 0 && (
          <Button
            variant="ghost"
            className="-ml-3 h-11 font-mono text-xs text-muted-foreground sm:hidden"
            aria-expanded={showAllTags}
            aria-controls={tagListId}
            onClick={() => setShowAllTags((value) => !value)}
          >
            {showAllTags ? 'Fewer tags' : `More tags (+${hiddenOnPhones})`}
            <ChevronDown
              data-icon="inline-end"
              className={cn('transition-transform duration-(--dur-hover)', showAllTags && 'rotate-180')}
            />
          </Button>
        )}
      </nav>

      <p className="sr-only" role="status">
        {activeTag ? `${visible.length} posts tagged ${activeTag}` : `${posts.length} posts`}
      </p>

      {featured && <PostCard post={featured} headingLevel="h2" featured />}

      <ul className="grid gap-4 md:grid-cols-2">
        {rest.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function TagLink({ tag, active, label }: { tag: string | null; active: boolean; label: string }) {
  return (
    <Link
      to={tag ? `/blog?tag=${encodeURIComponent(tag)}` : '/blog'}
      replace
      preventScrollReset
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex min-h-9 items-center rounded-full border px-3.5 font-mono text-xs transition-colors duration-(--dur-hover)',
        active
          ? 'border-brand bg-brand text-primary-foreground'
          : 'bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground',
      )}
    >
      {tag && <span className="sr-only">Posts tagged </span>}
      {label}
    </Link>
  )
}
