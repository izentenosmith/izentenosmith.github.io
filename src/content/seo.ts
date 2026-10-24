// Plain relative imports only: this module is also loaded by the Vite build
// (mdx/route-html-plugin.ts), where the `@/` alias isn't available.
import type { PostMeta } from './post-types.ts'
import { profile } from './profile.ts'

export const SITE_URL = 'https://izentenosmith.github.io'
export const OG_IMAGE = `${SITE_URL}/og.png`

export type PageMeta = {
  path: string
  title: string
  description: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
}

export const staticPages: PageMeta[] = [
  {
    path: '/',
    title: `${profile.name} — ${profile.title}`,
    description: profile.tagline,
    type: 'profile',
  },
  {
    path: '/experience',
    title: `Experience — ${profile.name}`,
    description: 'Work history, skills, education and certifications: backend, data, cloud and DevOps.',
  },
  {
    path: '/blog',
    title: `Blog — ${profile.name}`,
    description: "Technical write-ups on systems I've designed and run, and the trade-offs I'd revisit.",
  },
  {
    path: '/contact',
    title: `Contact — ${profile.name}`,
    description: `Get in touch with ${profile.name} by email, LinkedIn or GitHub.`,
  },
]

export function postPageMeta(post: PostMeta): PageMeta {
  return {
    path: `/blog/${post.slug}`,
    title: `${post.title} — ${profile.name}`,
    description: post.description,
    type: 'article',
    publishedTime: post.date,
  }
}

/** The tags crawlers read for link previews, as name/property → content pairs. */
export function headTags(page: PageMeta) {
  const url = `${SITE_URL}${page.path === '/' ? '/' : page.path}`
  return {
    title: page.title,
    canonical: url,
    meta: [
      { name: 'description', content: page.description },
      { property: 'og:site_name', content: profile.name },
      { property: 'og:type', content: page.type ?? 'website' },
      { property: 'og:title', content: page.title },
      { property: 'og:description', content: page.description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      ...(page.publishedTime ? [{ property: 'article:published_time', content: page.publishedTime }] : []),
    ],
  }
}
