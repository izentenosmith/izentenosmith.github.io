import { ChevronDown, Rss } from 'lucide-react'
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

// Most-used tags first; ties go to each post's lead tag (in post order), so the
// short list on phones still reaches every post. Then alphabetical.
const leadTags = posts.map((post) => post.tags[0])
const leadRank = (tag: string) => (leadTags.includes(tag) ? leadTags.indexOf(tag) : leadTags.length)
const allTags = [...tagCounts.keys()].sort(
  (a, b) => tagCounts.get(b)! - tagCounts.get(a)! || leadRank(a) - leadRank(b) || a.localeCompare(b),
)

/** Phones show this many tags until "More tags" is pressed; wider screens show all. */
const PHONE_TAG_LIMIT = 6
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
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl space-y-4">
          <h1 className="animate-enter font-heading text-h1 font-semibold sm:text-display">Blog</h1>
          <p
            className="animate-enter text-lg text-pretty text-muted-foreground"
            style={{ '--enter-index': 1 } as CSSProperties}
          >
            Technical write-ups on systems I've designed and run: how they're modeled, deployed and observed,
            and the trade-offs I'd revisit.
          </p>
        </div>
        <Button variant="outline" className="h-11" asChild>
          <a href="/rss.xml">
            <Rss data-icon="inline-start" />
            RSS feed
          </a>
        </Button>
      </header>

      <nav aria-label="Filter posts by tag" className="space-y-3">
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
