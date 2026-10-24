import { ArrowRight, MapPin } from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import { Link } from 'react-router'
import { PostCard } from '@/components/blog/post-card'
import { Reveal } from '@/components/motion/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { posts } from '@/content/posts'
import { profile } from '@/content/profile'

const hero: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const heroItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export function HomePage() {
  return (
    <div className="space-y-20">
      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-4 -top-16 -bottom-8 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)] [background-size:20px_20px]"
        />
        <motion.div variants={hero} initial="hidden" animate="visible" className="max-w-2xl space-y-6">
          <motion.p
            variants={heroItem}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              {profile.title}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="size-3.5" />
              {profile.location}
            </span>
          </motion.p>
          <motion.h1
            variants={heroItem}
            className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            {profile.name}
          </motion.h1>
          <motion.p variants={heroItem} className="text-xl text-pretty text-foreground/90">
            {profile.tagline}
          </motion.p>
          <motion.p variants={heroItem} className="text-pretty text-muted-foreground">
            {profile.summary}
          </motion.p>
          <motion.div variants={heroItem} className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" asChild>
              <Link to="/experience">
                View experience
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/blog">Read the blog</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/contact">Get in touch</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="space-y-6">
        <Reveal>
          <SectionHeading eyebrow="Impact">A few numbers I'm proud of</SectionHeading>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.highlights.map(({ value, label }, index) => (
            <Reveal key={value} delay={index * 0.06} className="h-full">
              <Card className="h-full transition-shadow hover:ring-brand/50">
                <CardContent className="space-y-2">
                  <p className="font-mono text-3xl font-semibold tracking-tight text-brand">{value}</p>
                  <p className="text-sm text-pretty text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <Reveal>
          <SectionHeading eyebrow="Toolbox">What I work with</SectionHeading>
        </Reveal>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {profile.skills.map(({ group, items }, index) => (
            <Reveal key={group} delay={index * 0.04} className="space-y-2">
              <dt className="text-sm font-medium">{group}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="space-y-6">
        <Reveal className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Writing">From the blog</SectionHeading>
          <Button variant="ghost" asChild>
            <Link to="/blog">
              All posts
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </Reveal>
        <ul className="grid gap-4">
          {posts.slice(0, 3).map((post, index) => (
            <li key={post.slug}>
              <Reveal delay={index * 0.06} className="h-full">
                <PostCard post={post} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
