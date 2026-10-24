import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPostDate, type PostMeta } from '@/content/posts'

export function PostMetaLine({ post }: { post: PostMeta }) {
  return (
    <p className="font-mono text-xs text-muted-foreground">
      <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingMinutes} min read
    </p>
  )
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Card className="group relative h-full transition-shadow hover:ring-brand/50">
      <CardContent className="flex h-full flex-col gap-3">
        <PostMetaLine post={post} />
        <h3 className="font-heading text-lg font-semibold tracking-tight text-balance">
          <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="flex-1 text-pretty text-muted-foreground">{post.description}</p>
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-mono text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
        </div>
      </CardContent>
    </Card>
  )
}
