import { Mail } from 'lucide-react'
import { Link } from 'react-router'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { Button } from '@/components/ui/button'
import { profile } from '@/content/profile'
import { IzsBadge } from './site-header'

const year = new Date().getFullYear()

const links = [
  { href: `mailto:${profile.email}`, label: 'Email', icon: Mail },
  { href: profile.links.linkedin, label: 'LinkedIn', icon: LinkedinIcon },
  { href: profile.links.github, label: 'GitHub', icon: GithubIcon },
]

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <IzsBadge />
          <p className="text-sm text-muted-foreground">
            © {year} {profile.name} ·{' '}
            <Link
              to="/contact"
              viewTransition
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              Get in touch
            </Link>
          </p>
        </div>
        <ul className="-ml-3 flex items-center gap-1 sm:ml-0">
          {links.map(({ href, label, icon: Icon }) => {
            const external = href.startsWith('http')
            return (
              <li key={label}>
                <Button variant="ghost" size="icon" className="size-11 sm:size-9" asChild>
                  <a
                    href={href}
                    aria-label={label}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                  >
                    <Icon className="size-4" />
                  </a>
                </Button>
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}
