import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPostDate, type PostMeta } from '@/content/posts'
import { cn } from '@/lib/utils'
import { postTitleTransition } from '@/lib/view-transitions'

export function PostMetaLine({ post }: { post: PostMeta }) {
  return (
    <p className="font-mono text-xs text-muted-foreground">
      <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingMinutes} min read
    </p>
  )
}

export function PostTags({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Badge variant="outline" className="font-mono">
            {tag}
          </Badge>
        </li>
      ))}
    </ul>
  )
}

type PostCardProps = {
  post: PostMeta
  /** h2 under a page title, h3 inside a section, so the outline has no gaps. */
  headingLevel?: 'h2' | 'h3'
  featured?: boolean
}

export function PostCard({ post, headingLevel = 'h3', featured = false }: PostCardProps) {
  const Heading = headingLevel
  return (
    <Card className="group relative h-full interactive-card hover:ring-brand/50 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
      <CardContent className={cn('flex h-full flex-col gap-3', featured && 'gap-4 sm:p-2')}>
        <div className="flex items-center justify-between gap-3">
          <PostMetaLine post={post} />
          {featured && (
            <Badge className="bg-brand/10 font-mono text-brand" variant="secondary">
              Featured
            </Badge>
          )}
        </div>
        <Heading
          className={cn(
            'font-heading font-semibold tracking-tight text-balance',
            featured ? 'text-h3 sm:text-h2' : 'text-lg',
          )}
        >
          <Link
            to={`/blog/${post.slug}`}
            viewTransition
            className="after:absolute after:inset-0 focus-visible:outline-none"
            style={postTitleTransition(post.slug)}
          >
            {post.title}
          </Link>
        </Heading>
        <p className={cn('flex-1 text-pretty text-muted-foreground', featured && 'text-base sm:text-lg')}>
          {post.description}
        </p>
        <div className="flex items-end justify-between gap-4">
          <PostTags tags={post.tags} />
          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--dur-hover) group-hover:translate-x-0.5 group-hover:text-brand"
          />
        </div>
      </CardContent>
    </Card>
  )
}
