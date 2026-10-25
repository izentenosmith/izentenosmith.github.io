import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Feed } from 'feed'
import type { Plugin, ResolvedConfig } from 'vite'
import type { PostMeta } from '../src/content/post-types.ts'
import { profile } from '../src/content/profile.ts'
import { headTags, OG_IMAGE, postPageMeta, SITE_URL, staticPages, type PageMeta } from '../src/content/seo.ts'
import { readPosts } from './posts-plugin.ts'

const HEAD_START = '<!-- head:start -->'
const HEAD_END = '<!-- head:end -->'

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function renderHead(page: PageMeta) {
  const { title, canonical, meta } = headTags(page)
  const lines = [
    `<title>${escape(title)}</title>`,
    `<link rel="canonical" href="${escape(canonical)}" />`,
    ...meta.map(({ content, ...key }) => {
      const [attr, value] = Object.entries(key)[0]
      return `<meta ${attr}="${escape(value)}" content="${escape(content)}" />`
    }),
  ]
  return `${HEAD_START}\n    ${lines.join('\n    ')}\n    ${HEAD_END}`
}

function withHead(html: string, page: PageMeta) {
  const start = html.indexOf(HEAD_START)
  const end = html.indexOf(HEAD_END)
  if (start === -1 || end === -1) throw new Error('index.html is missing the head:start/head:end markers')
  return html.slice(0, start) + renderHead(page) + html.slice(end + HEAD_END.length)
}

function rssFeed(posts: PostMeta[]) {
  const feed = new Feed({
    id: `${SITE_URL}/blog`,
    link: `${SITE_URL}/blog`,
    title: `${profile.name} — Blog`,
    description: staticPages[2].description,
    language: 'en',
    image: OG_IMAGE,
    copyright: `© ${new Date().getFullYear()} ${profile.name}`,
    author: { name: profile.name, link: SITE_URL },
    feedLinks: { rss: `${SITE_URL}/rss.xml` },
  })
  for (const post of posts) {
    const url = `${SITE_URL}/blog/${post.slug}`
    feed.addItem({
      id: url,
      link: url,
      title: post.title,
      description: post.description,
      date: new Date(`${post.date}T12:00:00Z`),
      category: post.tags.map((tag) => ({ name: tag })),
    })
  }
  return feed.rss2()
}

/**
 * The site is client-rendered, but link-preview crawlers don't run JavaScript.
 * After the build, this writes one copy of index.html per route with that
 * route's title, description and Open Graph tags (the body stays the same
 * empty shell), plus sitemap.xml and rss.xml. GitHub Pages serves `/experience` from
 * `experience.html`, so real routes also stop answering with a 404 status.
 */
export function routeHtmlPlugin(postsDir: string): Plugin {
  let config: ResolvedConfig
  return {
    name: 'route-html',
    configResolved(resolved) {
      config = resolved
    },
    transformIndexHtml: (html) => withHead(html, staticPages[0]),
    async closeBundle() {
      if (config.command !== 'build') return
      const outDir = path.resolve(config.root, config.build.outDir)
      const template = await readFile(path.join(outDir, 'index.html'), 'utf8')
      const posts = await readPosts(postsDir)
      const pages = [...staticPages, ...posts.map(postPageMeta)]

      for (const page of pages) {
        const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`
        await mkdir(path.dirname(path.join(outDir, file)), { recursive: true })
        await writeFile(path.join(outDir, file), withHead(template, page))
      }
      await writeFile(path.join(outDir, '404.html'), template)

      const urls = pages.map((page) => {
        const lastmod = page.publishedTime ? `<lastmod>${page.publishedTime}</lastmod>` : ''
        return `  <url><loc>${SITE_URL}${page.path}</loc>${lastmod}</url>`
      })
      await writeFile(path.join(outDir, 'rss.xml'), rssFeed(posts))
      await writeFile(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
      )
    },
  }
}
