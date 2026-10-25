import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import GithubSlugger from 'github-slugger'
import type { Heading, Root, Yaml } from 'mdast'
import { toString } from 'mdast-util-to-string'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'vite'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import type { PostMeta } from '../src/content/post-types.ts'

const VIRTUAL_ID = 'virtual:posts'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const WORDS_PER_MINUTE = 220

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(20, 'description is used for link previews; write a full sentence'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD'),
  tags: z.array(z.string().regex(/^[a-z0-9-]+$/, 'tags are lowercase-kebab-case')).min(1),
  featured: z.boolean().default(false),
})

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkGfm)

function extractMeta(slug: string, source: string): PostMeta {
  const tree = parser.parse(source) as Root
  // Same slug algorithm as rehype-slug, so ids match the rendered headings.
  const slugger = new GithubSlugger()
  const headings: PostMeta['headings'] = []
  let frontmatter: unknown = {}
  let words = 0

  visit(tree, (node) => {
    if (node.type === 'yaml') frontmatter = parseYaml((node as Yaml).value) ?? {}
    if (node.type === 'heading') {
      const text = toString(node)
      const id = slugger.slug(text)
      const { depth } = node as Heading
      if (depth === 2 || depth === 3) headings.push({ depth, text, id })
    }
    if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'code') {
      words += node.value.split(/\s+/).filter(Boolean).length
    }
  })

  const parsed = frontmatterSchema.safeParse(frontmatter)
  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `  ${issue.path.join('.') || 'frontmatter'}: ${issue.message}`)
    throw new Error(`Invalid frontmatter in post "${slug}":\n${problems.join('\n')}`)
  }

  return {
    ...parsed.data,
    slug,
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    headings,
  }
}

/** Reads and parses every post in `postsDir`, newest first. */
export async function readPosts(postsDir: string, onFile?: (path: string) => void) {
  const files = (await readdir(postsDir)).filter((file) => file.endsWith('.mdx'))
  const posts = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(postsDir, file)
      onFile?.(fullPath)
      return extractMeta(path.basename(file, '.mdx'), await readFile(fullPath, 'utf8'))
    }),
  )
  return posts.sort(
    (a, b) =>
      b.date.localeCompare(a.date) || Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title),
  )
}

/**
 * Exposes every post's metadata (frontmatter, reading time, headings) as
 * `virtual:posts`, so the blog index never has to load post bodies.
 */
export function postsPlugin(postsDir: string): Plugin {
  return {
    name: 'posts-meta',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    async load(id) {
      if (id !== RESOLVED_ID) return
      const posts = await readPosts(postsDir, (file) => this.addWatchFile(file))
      return `export default ${JSON.stringify(posts)}`
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(postsDir) || !file.endsWith('.mdx')) return
      const module = server.moduleGraph.getModuleById(RESOLVED_ID)
      if (module) server.moduleGraph.invalidateModule(module)
    },
  }
}
