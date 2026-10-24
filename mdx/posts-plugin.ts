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
import type { PostMeta } from '../src/content/post-types.ts'

const VIRTUAL_ID = 'virtual:posts'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const WORDS_PER_MINUTE = 220

type Frontmatter = Pick<PostMeta, 'title' | 'description' | 'date' | 'tags'>

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkGfm)

function extractMeta(slug: string, source: string): PostMeta {
  const tree = parser.parse(source) as Root
  // Same slug algorithm as rehype-slug, so ids match the rendered headings.
  const slugger = new GithubSlugger()
  const headings: PostMeta['headings'] = []
  let frontmatter: Partial<Frontmatter> = {}
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

  for (const key of ['title', 'description', 'date', 'tags'] as const) {
    if (!frontmatter[key]) throw new Error(`Post "${slug}" is missing frontmatter "${key}"`)
  }

  return {
    ...(frontmatter as Frontmatter),
    date: String(frontmatter.date),
    slug,
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    headings,
  }
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
      const files = (await readdir(postsDir)).filter((file) => file.endsWith('.mdx'))
      const posts = await Promise.all(
        files.map(async (file) => {
          const fullPath = path.join(postsDir, file)
          this.addWatchFile(fullPath)
          return extractMeta(path.basename(file, '.mdx'), await readFile(fullPath, 'utf8'))
        }),
      )
      posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
      return `export default ${JSON.stringify(posts)}`
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(postsDir) || !file.endsWith('.mdx')) return
      const module = server.moduleGraph.getModuleById(RESOLVED_ID)
      if (module) server.moduleGraph.invalidateModule(module)
    },
  }
}
