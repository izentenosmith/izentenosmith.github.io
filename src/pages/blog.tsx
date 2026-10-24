import { PostCard } from '@/components/blog/post-card'
import { Reveal } from '@/components/motion/reveal'
import { posts } from '@/content/posts'
import { staticPages } from '@/content/seo'
import { usePageMeta } from '@/lib/use-page-meta'

export function BlogPage() {
  usePageMeta(staticPages[2])
  return (
    <div className="space-y-12">
      <Reveal className="max-w-2xl space-y-4">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Blog</h1>
        <p className="text-lg text-pretty text-muted-foreground">
          Technical write-ups on systems I've designed and run: how they're modeled, deployed and
          observed, and the trade-offs I'd revisit.
        </p>
      </Reveal>
      <ul className="grid gap-4">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Reveal delay={index * 0.06} className="h-full">
              <PostCard post={post} headingLevel="h2" />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}
