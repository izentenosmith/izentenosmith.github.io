import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import type { ComponentType, CSSProperties, SVGProps } from 'react'
import { images } from '@/assets/images'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { CopyButton } from '@/components/copy-button'
import { Picture } from '@/components/picture'
import { languages } from '@/content/cv'
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

const spokenLanguages = languages.map(({ name, level }) => `${name} (${level.toLowerCase()})`).join(', ')

export function ContactPage() {
  usePageMeta(staticPages[3])

  return (
    <div className="grid items-start gap-12 lg:grid-cols-12">
      <div className="space-y-10 lg:col-span-7">
        <header className="space-y-4">
          <h1 className="animate-enter font-heading text-h1 font-semibold sm:text-display">Get in touch</h1>
          <p
            className="animate-enter text-lg text-pretty text-muted-foreground"
            style={{ '--enter-index': 1 } as CSSProperties}
          >
            Open to conversations about backend architecture, platform and infrastructure work, or technical
            leadership roles. Email is the fastest way to reach me.
          </p>
          <p className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <MapPin aria-hidden="true" className="size-3.5" />
            {profile.location} · {spokenLanguages}
          </p>
        </header>

        <ul className="space-y-3">
          {channels.map(({ label, value, href, icon: Icon, copy }) => {
            const external = href.startsWith('http')
            return (
              <li
                key={label}
                className="group relative flex interactive-card items-center gap-4 rounded-xl border bg-card p-4 hover:border-brand/50 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-muted">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <a
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  className="min-w-0 flex-1 after:absolute after:inset-0 focus-visible:outline-none"
                >
                  <span className="block text-sm text-muted-foreground">{label}</span>
                  <span className="block truncate font-medium">{value}</span>
                </a>
                {copy ? (
                  <span className="relative z-10">
                    <CopyButton
                      value={value}
                      label="Copy email address"
                      failedText="Couldn't copy, select the address instead"
                    />
                  </span>
                ) : (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform duration-(--dur-hover) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                  />
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <figure
        className="mx-auto w-full max-w-sm animate-enter lg:col-span-5 lg:max-w-none"
        style={{ '--enter-index': 2 } as CSSProperties}
      >
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Picture
            picture={images.cartoon.picture}
            alt={images.cartoon.alt}
            sizes="(min-width: 1024px) 440px, (min-width: 640px) 384px, 90vw"
            className="aspect-[4/5]"
          />
        </div>
        <figcaption className="mt-3 text-center font-mono text-xs text-muted-foreground">
          On call for good conversations
        </figcaption>
      </figure>
    </div>
  )
}
