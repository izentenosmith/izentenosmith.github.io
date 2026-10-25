import { ArrowRight, ArrowUpRight, Mail, MapPin } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { images } from '@/assets/images'
import { LinkedinIcon } from '@/components/brand-icons'
import { PostCard } from '@/components/blog/post-card'
import { CountUp } from '@/components/motion/count-up'
import { Reveal } from '@/components/motion/reveal'
import { Picture } from '@/components/picture'
import { Eyebrow, SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { roles } from '@/content/cv'
import { posts } from '@/content/posts'
import { profile } from '@/content/profile'
import { staticPages } from '@/content/seo'
import { usePageMeta } from '@/lib/use-page-meta'

/** Staggers the CSS hero entrance; see `animate-enter` in index.css. */
const enter = (index: number) => ({ '--enter-index': index }) as CSSProperties

const [currentRole] = roles

export function HomePage() {
  usePageMeta(staticPages[0])

  return (
    <div className="space-y-24 sm:space-y-32">
      <section aria-labelledby="hero-title" className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-7">
          <p
            style={enter(0)}
            className="inline-flex animate-enter items-center gap-2 rounded-full border bg-card/70 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur"
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-signal" />
            {profile.title}
            {/* Location only from small tablets up; on phones the chip would wrap. */}
            <span className="hidden items-center gap-2 sm:inline-flex">
              <span aria-hidden="true">·</span>
              <MapPin aria-hidden="true" className="size-3.5" />
              {profile.location}
            </span>
          </p>
          <h1
            id="hero-title"
            style={enter(1)}
            className="animate-enter font-heading text-display font-semibold text-balance"
          >
            {/* Ink fading into electric blue; both ends keep text contrast above 4.5:1. */}
            <span className="bg-linear-to-br from-foreground from-55% to-brand bg-clip-text text-transparent">
              {profile.name}
            </span>
          </h1>
          <p
            style={enter(2)}
            className="max-w-2xl animate-enter text-xl text-pretty text-foreground/90 sm:text-2xl sm:leading-snug"
          >
            {profile.tagline}
          </p>
          <p
            style={enter(3)}
            className="max-w-2xl animate-enter text-reading text-pretty text-muted-foreground"
          >
            {profile.summary}
          </p>
          <div style={enter(4)} className="flex animate-enter flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              className="h-11 px-4 shadow-[0_10px_30px_-10px_var(--brand)] transition-shadow hover:shadow-[0_14px_36px_-10px_var(--brand)]"
              asChild
            >
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

        <figure
          style={enter(2)}
          className="relative mx-auto w-full max-w-sm animate-enter lg:col-span-5 lg:max-w-none"
        >
          {/* A thin electric-blue gradient frame around the photo. */}
          <div className="rounded-[1.4rem] bg-linear-to-br from-brand/60 via-border to-border p-px shadow-[0_30px_80px_-30px_var(--brand)]">
            <div className="overflow-hidden rounded-[calc(1.4rem-1px)] bg-card">
              <Picture
                picture={images.portrait.picture}
                alt={images.portrait.alt}
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 384px, 90vw"
                priority
                className="aspect-[4/5]"
              />
            </div>
          </div>
          <figcaption className="absolute bottom-3 left-3 rounded-full border bg-background/85 px-2.5 py-1 font-mono text-xs backdrop-blur">
            <span className="text-brand">$</span> whoami
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="glance-title" className="space-y-8">
        <Reveal>
          <SectionHeading id="glance-title" eyebrow="At a glance">
            What I'm doing, and what it moved
          </SectionHeading>
        </Reveal>
        {/* Bento grid: the current role takes a 2×2 tile, the four numbers fill the rest. */}
        <ul className="grid auto-rows-[minmax(9rem,auto)] grid-cols-2 gap-4 lg:grid-cols-4">
          <li className="spotlight col-span-2 row-span-2 flex flex-col justify-between gap-6 rounded-2xl border bg-card p-6 sm:p-8">
            <div className="space-y-4">
              <Eyebrow>Now</Eyebrow>
              <div className="space-y-1">
                <p className="font-mono text-xs text-muted-foreground">{currentRole.period}</p>
                <h3 className="font-heading text-h2 font-semibold">
                  {currentRole.title} <span className="font-normal text-muted-foreground">at</span>{' '}
                  {currentRole.company}
                </h3>
              </div>
              {currentRole.focus && <p className="text-pretty text-muted-foreground">{currentRole.focus}</p>}
              <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                {currentRole.tags.slice(0, 6).map((tag) => (
                  <li key={tag}>
                    <Badge variant="outline" className="font-mono">
                      {tag}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/experience"
              viewTransition
              className="group inline-flex min-h-11 items-center gap-1.5 self-start font-medium text-brand"
            >
              Full experience
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-(--dur-hover) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </li>
          {profile.highlights.map(({ value, label }) => (
            <li
              key={value}
              className="spotlight col-span-1 flex flex-col justify-between gap-3 rounded-2xl border bg-card p-5"
            >
              <CountUp
                value={value}
                className="block font-mono text-h2 font-semibold text-metric sm:text-h1"
              />
              <p className="text-sm text-pretty text-muted-foreground">{label}</p>
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
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.skills.map(({ group, items }) => (
            <div key={group} className="spotlight space-y-3 rounded-2xl border bg-card p-5">
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
        <Reveal className="relative isolate grid gap-6 overflow-hidden rounded-3xl border bg-card p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
          {/* A soft electric-blue glow in the corner, echoing the hero. */}
          <div
            aria-hidden="true"
            className="absolute -top-40 -right-40 -z-10 size-[28rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_22%,transparent),transparent)]"
          />
          <div className="space-y-3 lg:col-span-8">
            <Eyebrow>Contact</Eyebrow>
            <h2 id="talk-title" className="font-heading text-h2 font-semibold">
              Let's talk
            </h2>
            <p className="max-w-xl text-pretty text-muted-foreground">
              Backend architecture, platform and infrastructure work, or technical leadership. Email is the
              fastest way to reach me.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <Button size="lg" className="h-11 px-4 shadow-[0_10px_30px_-10px_var(--brand)]" asChild>
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
