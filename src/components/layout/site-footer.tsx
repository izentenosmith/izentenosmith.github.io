import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { Button } from '@/components/ui/button'
import { profile } from '@/content/profile'

const year = new Date().getFullYear()

const links = [
  { href: `mailto:${profile.email}`, label: 'Email', icon: Mail },
  { href: profile.links.linkedin, label: 'LinkedIn', icon: LinkedinIcon },
  { href: profile.links.github, label: 'GitHub', icon: GithubIcon },
]

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-6">
        <p className="text-sm text-muted-foreground">
          © {year} {profile.name}
        </p>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Button key={label} variant="ghost" size="icon" asChild>
              <a href={href} aria-label={label} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <Icon className="size-4" />
              </a>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  )
}
