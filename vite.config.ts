import path from 'node:path'
import mdx from '@mdx-js/rollup'
import rehypeShiki from '@shikijs/rehype'
import { transformerMetaHighlight, transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
import { postsPlugin } from './mdx/posts-plugin.ts'
import { routeHtmlPlugin } from './mdx/route-html-plugin.ts'
import { transformerCodeTitle } from './mdx/shiki-code-title.ts'

const postsDir = path.resolve(import.meta.dirname, 'src/content/posts')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              test: ['h2', 'h3'],
              properties: { className: ['heading-anchor'], ariaHidden: 'true', tabIndex: -1 },
              content: { type: 'text', value: '#' },
            },
          ],
          [
            rehypeShiki,
            {
              themes: { light: 'github-light-default', dark: 'github-dark-default' },
              defaultColor: false,
              transformers: [
                transformerCodeTitle(),
                transformerMetaHighlight(),
                transformerNotationHighlight(),
                transformerNotationDiff(),
              ],
            },
          ],
        ],
      }),
    },
    postsPlugin(postsDir),
    routeHtmlPlugin(postsDir),
    react({ include: /\.(mdx|jsx|tsx)$/ }),
    tailwindcss(),
    imagetools(),
  ],
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor code in its own chunks, so a content change doesn't
        // invalidate the browser's cache of React or the router.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'router', test: /node_modules[\\/]react-router[\\/]/ },
            { name: 'ui', test: /node_modules[\\/](@radix-ui|radix-ui|@floating-ui|react-remove-scroll)/ },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
