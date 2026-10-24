import { Award, GraduationCap, Languages, MapPin } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { Reveal } from '@/components/motion/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { certifications, education, interests, languages, roles, type Role } from '@/content/cv'
import { profile } from '@/content/profile'

export function ExperiencePage() {
  return (
    <div className="space-y-20">
      <Reveal className="max-w-2xl space-y-4">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Experience</h1>
        <p className="text-lg text-pretty text-muted-foreground">
          Ten years across backend, data, cloud and DevOps — most recently leading a team through
          a legacy ERP modernization and designing cloud platforms for clients.
        </p>
      </Reveal>

      <Timeline />

      <section className="space-y-6">
        <Reveal>
          <SectionHeading eyebrow="Toolbox">Skills</SectionHeading>
        </Reveal>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {profile.skills.map(({ group, items }) => (
            <Reveal key={group} className="space-y-2">
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
        <Reveal>
          <SectionHeading eyebrow="Background">Education & more</SectionHeading>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal className="sm:col-span-2">
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
          </Reveal>
          <Reveal className="h-full">
            <InfoCard icon={Award} title="Certifications">
              <ul className="space-y-1 text-muted-foreground">
                {certifications.map((certification) => (
                  <li key={certification}>{certification}</li>
                ))}
              </ul>
            </InfoCard>
          </Reveal>
          <Reveal className="h-full" delay={0.06}>
            <InfoCard icon={Languages} title="Languages & interests">
              <ul className="space-y-1 text-muted-foreground">
                {languages.map(({ name, level }) => (
                  <li key={name}>
                    <span className="text-foreground">{name}</span> · {level}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground">{interests.join(' · ')}</p>
            </InfoCard>
          </Reveal>
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
    <section className="space-y-8">
      <Reveal>
        <SectionHeading eyebrow="Work history">Where I've worked</SectionHeading>
      </Reveal>
      <ol ref={ref} className="relative space-y-12 pl-8 sm:pl-10">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
        <motion.span
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
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute top-1.5 -left-8 grid size-[15px] place-items-center rounded-full border bg-background sm:-left-10"
      >
        <span className="size-[7px] rounded-full bg-brand" />
      </span>
      <Reveal className="space-y-4">
        <header className="space-y-1">
          <p className="font-mono text-xs text-muted-foreground">{role.period}</p>
          <h3 className="font-heading text-xl font-semibold tracking-tight">
            {role.title} <span className="text-muted-foreground">at</span> {role.company}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {role.location}
          </p>
          {role.focus && <p className="text-sm text-pretty text-brand">{role.focus}</p>}
        </header>
        <div className="space-y-5">
          {role.groups.map(({ heading, bullets }, index) => (
            <div key={heading ?? index} className="space-y-2">
              {heading && (
                <h4 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  {heading}
                </h4>
              )}
              <ul className="space-y-2">
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative pl-4 text-pretty text-foreground/90 before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-muted-foreground/60"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </li>
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
    <Card className="h-full">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
            <Icon className="size-4" />
          </span>
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="space-y-2 text-sm">{children}</div>
      </CardContent>
    </Card>
  )
}
