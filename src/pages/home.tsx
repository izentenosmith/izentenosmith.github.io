import { ArrowRight, Mail, MapPin } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { images } from '@/assets/images'
import { LinkedinIcon } from '@/components/brand-icons'
import { PostCard } from '@/components/blog/post-card'
import { CountUp } from '@/components/motion/count-up'
import { Reveal } from '@/components/motion/reveal'
import { Picture } from '@/components/picture'
import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { posts } from '@/content/posts'
import { profile } from '@/content/profile'
import { staticPages } from '@/content/seo'
import { usePageMeta } from '@/lib/use-page-meta'

/** Staggers the CSS hero entrance; see `animate-enter` in index.css. */
const enter = (index: number) => ({ '--enter-index': index }) as CSSProperties

export function HomePage() {
  usePageMeta(staticPages[0])

  return (
    <div className="space-y-24 sm:space-y-32">
      <section aria-labelledby="hero-title" className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-7">
          <p
            style={enter(0)}
            className="animate-enter inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-xs text-muted-foreground"
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-signal" />
            {profile.title}
            <span aria-hidden="true">·</span>
            <MapPin aria-hidden="true" className="size-3.5" />
            {profile.location}
          </p>
          <h1 id="hero-title" style={enter(1)} className="animate-enter font-heading text-display font-semibold text-balance">
            {profile.name}
          </h1>
          <p style={enter(2)} className="animate-enter max-w-2xl text-xl text-pretty text-foreground/90 sm:text-2xl sm:leading-snug">
            {profile.tagline}
          </p>
          <p style={enter(3)} className="animate-enter max-w-2xl text-reading text-pretty text-muted-foreground">
            {profile.summary}
          </p>
          <div style={enter(4)} className="animate-enter flex flex-wrap gap-3 pt-2">
            <Button size="lg" className="h-11 px-4" asChild>
              <Link to="/experience" viewTransition>
                View experience
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-4" asChild>
              <Link to="/blog" viewTransition>
                Read the blog
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-11 px-4" asChild>
              <Link to="/contact" viewTransition>
                Get in touch
              </Link>
            </Button>
          </div>
        </div>

        <figure style={enter(2)} className="animate-enter relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Picture
              picture={images.portrait.picture}
              alt={images.portrait.alt}
              sizes="(min-width: 1024px) 440px, (min-width: 640px) 384px, 90vw"
              priority
              className="aspect-[4/5]"
            />
          </div>
          <figcaption className="absolute bottom-3 left-3 rounded-md border bg-background/90 px-2 py-1 font-mono text-xs backdrop-blur">
            <span className="text-brand">$</span> whoami
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="impact-title" className="space-y-8">
        <Reveal>
          <SectionHeading id="impact-title" eyebrow="Impact">
            A few numbers I'm proud of
          </SectionHeading>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.highlights.map(({ value, label }) => (
            <li key={value} className="rounded-xl border bg-card p-5">
              <CountUp value={value} className="block font-mono text-h1 font-semibold text-metric" />
              <p className="mt-2 text-sm text-pretty text-muted-foreground">{label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="writing-title" className="space-y-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="writing-title" eyebrow="Writing">
            From the blog
          </SectionHeading>
          <Button variant="ghost" className="h-11" asChild>
            <Link to="/blog" viewTransition>
              All posts
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </Reveal>
        <ul className="grid gap-4 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="toolbox-title" className="space-y-8">
        <Reveal>
          <SectionHeading id="toolbox-title" eyebrow="Toolbox">
            What I work with
          </SectionHeading>
        </Reveal>
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {profile.skills.map(({ group, items }) => (
            <div key={group} className="space-y-2">
              <dt className="text-sm font-medium">{group}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="talk-title">
        <Reveal className="grid gap-6 rounded-2xl border bg-card p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
          <div className="space-y-3 lg:col-span-8">
            <p className="font-mono text-xs tracking-wider text-brand uppercase">Contact</p>
            <h2 id="talk-title" className="font-heading text-h2 font-semibold">
              Let's talk
            </h2>
            <p className="max-w-xl text-pretty text-muted-foreground">
              Backend architecture, platform and infrastructure work, or technical leadership. Email is the
              fastest way to reach me.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <Button size="lg" className="h-11 px-4" asChild>
              <a href={`mailto:${profile.email}`}>
                <Mail data-icon="inline-start" />
                Email me
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-4" asChild>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                <LinkedinIcon className="size-4" />
                LinkedIn
              </a>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
