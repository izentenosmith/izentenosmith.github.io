import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { CopyButton } from '@/components/copy-button'
import { Reveal } from '@/components/motion/reveal'
import { Card, CardContent } from '@/components/ui/card'
import { profile } from '@/content/profile'
import { staticPages } from '@/content/seo'
import { usePageMeta } from '@/lib/use-page-meta'

type Channel = {
  label: string
  value: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  copy?: boolean
}

const channels: Channel[] = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail, copy: true },
  {
    label: 'LinkedIn',
    value: profile.links.linkedin.replace('https://www.', ''),
    href: profile.links.linkedin,
    icon: LinkedinIcon,
  },
  {
    label: 'GitHub',
    value: profile.links.github.replace('https://', ''),
    href: profile.links.github,
    icon: GithubIcon,
  },
]

export function ContactPage() {
  usePageMeta(staticPages[3])
  return (
    <div className="max-w-2xl space-y-10">
      <Reveal className="space-y-4">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Get in touch</h1>
        <p className="text-lg text-pretty text-muted-foreground">
          Open to conversations about backend architecture, platform and infrastructure work, or
          technical leadership roles. Email is the fastest way to reach me.
        </p>
        <p className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {profile.location} · Spanish (native), English (advanced)
        </p>
      </Reveal>

      <ul className="space-y-3">
        {channels.map(({ label, value, href, icon: Icon, copy }, index) => {
          const external = href.startsWith('http')
          return (
            <li key={label}>
              <Reveal delay={0.1 + index * 0.06}>
                <Card className="group relative transition-shadow hover:ring-brand/50">
                  <CardContent className="flex items-center gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted">
                      <Icon className="size-5" />
                    </span>
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                      className="min-w-0 flex-1 after:absolute after:inset-0"
                    >
                      <span className="block text-sm text-muted-foreground">{label}</span>
                      <span className="block truncate font-medium">{value}</span>
                    </a>
                    {copy ? (
                      <span className="relative z-10">
                        <CopyButton value={value} label="Copy email address" />
                      </span>
                    ) : (
                      <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </CardContent>
                </Card>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
