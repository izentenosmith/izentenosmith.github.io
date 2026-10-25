import { ArrowLeft, ArrowRight, ListTree, Mail } from 'lucide-react'
import type { MDXContent } from 'mdx/types'
import { m, useScroll, useSpring } from 'motion/react'
import { lazy, Suspense, useState } from 'react'
import { Link, useParams } from 'react-router'
import { images } from '@/assets/images'
import { LinkedinIcon } from '@/components/brand-icons'
import { mdxComponents } from '@/components/blog/mdx-components'
import { PostMetaLine, PostTags } from '@/components/blog/post-card'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { Picture } from '@/components/picture'
import { Button } from '@/components/ui/button'
import { findPost, loadPostBody, posts, type PostMeta } from '@/content/posts'
import { profile } from '@/content/profile'
import { postPageMeta } from '@/content/seo'
import { usePageMeta } from '@/lib/use-page-meta'
import { postTitleTransition } from '@/lib/view-transitions'
import { NotFoundPage } from './not-found'

// One lazy component per post, created once, so each body is its own chunk.
const postBodies: Record<string, MDXContent> = Object.fromEntries(
  posts.map(({ slug }) => [slug, lazy(() => loadPostBody(slug).then((body) => ({ default: body })))]),
)

const proseClasses = [
  'prose max-w-[68ch] text-reading prose-neutral dark:prose-invert',
  'prose-headings:scroll-mt-24 prose-headings:font-heading prose-headings:tracking-tight',
  'prose-h2:text-h2 prose-h3:text-h3',
  'prose-a:text-brand prose-a:underline-offset-4',
  'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-normal',
  'prose-code:before:content-none prose-code:after:content-none',
].join(' ')

export function PostPage() {
  const { slug = '' } = useParams()
  const post = findPost(slug)
  usePageMeta(post && postPageMeta(post))
  const [tocOpen, setTocOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  const Body = postBodies[slug]
  if (!post || !Body) return <NotFoundPage />

  const index = posts.indexOf(post)
  const previous = posts[index - 1]
  const next = posts[index + 1]

  return (
    <>
      <m.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-14 z-30 h-0.5 origin-left bg-brand"
      />
      <article>
        <header className="max-w-3xl space-y-5">
          <Link
            to="/blog"
            viewTransition
            className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            All posts
          </Link>
          <PostMetaLine post={post} />
          <h1
            className="font-heading text-h1 font-semibold text-balance sm:text-[2.75rem] sm:leading-[1.1]"
            style={postTitleTransition(post.slug)}
          >
            {post.title}
          </h1>
          <p className="text-lg text-pretty text-muted-foreground sm:text-xl">{post.description}</p>
          <PostTags tags={post.tags} />
        </header>

        <div className="mt-10 grid gap-12 xl:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            <details
              open={tocOpen}
              onToggle={(event) => setTocOpen(event.currentTarget.open)}
              className="mb-10 max-w-[68ch] rounded-xl border bg-card p-4 xl:hidden"
            >
              <summary className="flex min-h-8 cursor-pointer list-none items-center gap-2 text-sm font-medium">
                <ListTree aria-hidden="true" className="size-4" />
                On this page
              </summary>
              <div className="mt-3">
                <TableOfContents headings={post.headings} onNavigate={() => setTocOpen(false)} />
              </div>
            </details>

            <div className={proseClasses}>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted/50" />}>
                <Body components={mdxComponents} />
              </Suspense>
            </div>

            <AuthorCard />
            <PostPager previous={previous} next={next} />
          </div>

          <aside className="hidden xl:block">
            <nav aria-label="On this page" className="sticky top-24 space-y-3">
              <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">On this page</p>
              <TableOfContents headings={post.headings} />
            </nav>
          </aside>
        </div>
      </article>
    </>
  )
}

function AuthorCard() {
  return (
    <section
      aria-label="About the author"
      className="mt-16 flex max-w-[68ch] flex-col gap-5 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center"
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-full border">
        <Picture picture={images.avatar.picture} alt={images.avatar.alt} sizes="80px" className="size-20" />
      </div>
      <div className="flex-1 space-y-3">
        <div>
          <p className="font-medium">Written by {profile.name}</p>
          <p className="text-sm text-pretty text-muted-foreground">
            {profile.title} in {profile.location}. I write about systems I've designed and run.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="h-11 sm:h-9" asChild>
            <Link to="/contact" viewTransition>
              <Mail data-icon="inline-start" />
              Get in touch
            </Link>
          </Button>
          <Button variant="outline" className="h-11 sm:h-9" asChild>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              <LinkedinIcon className="size-4" />
              LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

function PostPager({ previous, next }: { previous?: PostMeta; next?: PostMeta }) {
  if (!previous && !next) return null
  return (
    <nav aria-label="More posts" className="mt-8 grid max-w-[68ch] gap-4 sm:grid-cols-2">
      {previous ? <PagerLink post={previous} direction="previous" /> : <span />}
      {next && <PagerLink post={next} direction="next" />}
    </nav>
  )
}

function PagerLink({ post, direction }: { post: PostMeta; direction: 'previous' | 'next' }) {
  const isNext = direction === 'next'
  return (
    <Link
      to={`/blog/${post.slug}`}
      viewTransition
      className="group flex interactive-card flex-col gap-1 rounded-xl border bg-card p-4 hover:border-brand/50 sm:data-[next=true]:text-right"
      data-next={isNext}
    >
      <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground sm:group-data-[next=true]:justify-end">
        {!isNext && <ArrowLeft aria-hidden="true" className="size-3.5" />}
        {isNext ? 'Next post' : 'Previous post'}
        {isNext && <ArrowRight aria-hidden="true" className="size-3.5" />}
      </span>
      <span className="font-medium text-balance group-hover:text-brand">{post.title}</span>
    </Link>
  )
}
