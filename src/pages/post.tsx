import { ArrowLeft, ListTree } from 'lucide-react'
import type { MDXContent } from 'mdx/types'
import { motion, useScroll, useSpring } from 'motion/react'
import { lazy, Suspense, useState } from 'react'
import { Link, useParams } from 'react-router'
import { mdxComponents } from '@/components/blog/mdx-components'
import { PostMetaLine } from '@/components/blog/post-card'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { Badge } from '@/components/ui/badge'
import { findPost, loadPostBody, posts } from '@/content/posts'
import { NotFoundPage } from './not-found'

// One lazy component per post, created once, so each body is its own chunk.
const postBodies: Record<string, MDXContent> = Object.fromEntries(
  posts.map(({ slug }) => [slug, lazy(() => loadPostBody(slug).then((body) => ({ default: body })))]),
)

export function PostPage() {
  const { slug = '' } = useParams()
  const post = findPost(slug)
  const [tocOpen, setTocOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  const Body = postBodies[slug]
  if (!post || !Body) return <NotFoundPage />

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-14 z-30 h-0.5 origin-left bg-brand"
      />
      <article className="relative">
        <header className="max-w-2xl space-y-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All posts
          </Link>
          <PostMetaLine post={post} />
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {post.title}
          </h1>
          <p className="text-lg text-pretty text-muted-foreground">{post.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-mono text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <details
          open={tocOpen}
          onToggle={(event) => setTocOpen(event.currentTarget.open)}
          className="mt-8 rounded-xl border p-4 2xl:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
            <ListTree className="size-4" />
            On this page
          </summary>
          <div className="mt-3">
            <TableOfContents headings={post.headings} onNavigate={() => setTocOpen(false)} />
          </div>
        </details>

        <aside className="absolute top-0 left-full ml-10 hidden h-full w-56 2xl:block">
          <nav aria-label="On this page" className="sticky top-24 space-y-3">
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">On this page</p>
            <TableOfContents headings={post.headings} />
          </nav>
        </aside>

        <div className="prose mt-10 max-w-none prose-neutral dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-heading prose-headings:tracking-tight prose-a:text-brand prose-a:underline-offset-4 prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:text-[13px] prose-pre:leading-relaxed [&_pre_code]:bg-transparent [&_pre_code]:p-0">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted/50" />}>
            <Body components={mdxComponents} />
          </Suspense>
        </div>
      </article>
    </>
  )
}
