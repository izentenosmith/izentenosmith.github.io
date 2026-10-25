import { Award, ChevronDown, GraduationCap, Languages, MapPin } from 'lucide-react'
import { m, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Reveal } from '@/components/motion/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { certifications, education, interests, languages, roles, type Role } from '@/content/cv'
import { profile } from '@/content/profile'
import { staticPages } from '@/content/seo'
import { usePageMeta } from '@/lib/use-page-meta'
import { cn } from '@/lib/utils'

export function ExperiencePage() {
  usePageMeta(staticPages[1])

  return (
    <div className="space-y-24">
      <header className="max-w-3xl space-y-4">
        <h1 className="animate-enter font-heading text-h1 font-semibold sm:text-display">Experience</h1>
        <p
          className="animate-enter text-lg text-pretty text-muted-foreground"
          style={{ '--enter-index': 1 } as CSSProperties}
        >
          Ten years across backend, data, cloud and DevOps — most recently leading a team through a legacy ERP
          modernization and designing cloud platforms for clients.
        </p>
      </header>

      <Timeline />

      <section aria-labelledby="skills-title" className="space-y-8">
        <Reveal>
          <SectionHeading id="skills-title" eyebrow="Toolbox">
            Skills
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

      <section aria-labelledby="background-title" className="space-y-8">
        <Reveal>
          <SectionHeading id="background-title" eyebrow="Background">
            Education and more
          </SectionHeading>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard icon={GraduationCap} title={education.school}>
            <p className="font-mono text-xs text-muted-foreground">
              {education.period} · {education.location}
            </p>
            <p>{education.degree}</p>
            {education.notes.map((note) => (
              <p key={note} className="text-muted-foreground">
                {note}
              </p>
            ))}
          </InfoCard>
          <InfoCard icon={Award} title="Certifications">
            <ul className="space-y-1 text-muted-foreground">
              {certifications.map((certification) => (
                <li key={certification}>{certification}</li>
              ))}
            </ul>
          </InfoCard>
          <InfoCard icon={Languages} title="Languages and interests">
            <ul className="space-y-1 text-muted-foreground">
              {languages.map(({ name, level }) => (
                <li key={name}>
                  <span className="text-foreground">{name}</span> · {level}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground">{interests.join(' · ')}</p>
          </InfoCard>
        </div>
      </section>
    </div>
  )
}

function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  return (
    <section aria-labelledby="work-title" className="space-y-10">
      <Reveal>
        <SectionHeading id="work-title" eyebrow="Work history">
          Where I've worked
        </SectionHeading>
      </Reveal>
      <ol ref={ref} className="relative space-y-16 pl-8 sm:pl-12">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
        <m.span
          aria-hidden="true"
          style={{ scaleY: reduceMotion ? 1 : progress }}
          className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-brand"
        />
        {roles.map((role) => (
          <TimelineItem key={role.company} role={role} />
        ))}
      </ol>
    </section>
  )
}

function TimelineItem({ role }: { role: Role }) {
  const [first, ...rest] = role.groups

  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute top-1.5 -left-8 grid size-[15px] place-items-center rounded-full border bg-background sm:-left-12"
      >
        {/* Lights up as the scroll line reaches this role. */}
        <m.span
          className="size-[7px] rounded-full bg-brand"
          initial={{ scale: 0.4, opacity: 0.35 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-45% 0px -45% 0px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </span>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <header className="space-y-2 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <p className="font-mono text-xs text-muted-foreground">{role.period}</p>
          <h3 className="font-heading text-h3 font-semibold">
            {role.title} <span className="font-normal text-muted-foreground">at</span> {role.company}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin aria-hidden="true" className="size-3.5" />
            {role.location}
          </p>
          {role.focus && <p className="text-sm text-pretty text-brand">{role.focus}</p>}
          <ul className="flex flex-wrap gap-1.5 pt-2" aria-label="Technologies">
            {role.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline" className="font-mono">
                  {tag}
                </Badge>
              </li>
            ))}
          </ul>
        </header>
        <div className="space-y-6 lg:col-span-8">
          <BulletGroup heading={first.heading} bullets={first.bullets} />
          {rest.length > 0 && <MoreGroups groups={rest} />}
        </div>
      </div>
    </li>
  )
}

/** Collapses a long role to its first group; the rest expands in place. */
function MoreGroups({ groups }: { groups: Role['groups'] }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div className="space-y-4">
      <div
        id={id}
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-(--dur-reveal) ease-(--ease-enter) motion-reduce:transition-none',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="space-y-6 overflow-hidden">
          {groups.map(({ heading, bullets }) => (
            <BulletGroup key={heading} heading={heading} bullets={bullets} />
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        className="h-auto min-h-11 text-left whitespace-normal"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        {open
          ? 'Show less'
          : `Show ${groups.length} more: ${groups.map((group) => group.heading).join(', ')}`}
        <ChevronDown
          data-icon="inline-end"
          className={cn('transition-transform duration-(--dur-hover)', open && 'rotate-180')}
        />
      </Button>
    </div>
  )
}

function BulletGroup({ heading, bullets }: { heading?: string; bullets: string[] }) {
  return (
    <div className="space-y-3">
      {heading && (
        <h4 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">{heading}</h4>
      )}
      <ul className="space-y-3">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="relative pl-4 text-pretty text-foreground/90 before:absolute before:top-[0.65em] before:left-0 before:size-1 before:rounded-full before:bg-muted-foreground/60"
          >
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  )
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Award
  title: string
  children: ReactNode
}) {
  return (
    <div className="h-full space-y-3 rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  )
}
