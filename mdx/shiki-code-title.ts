import type { ShikiTransformer } from 'shiki'

/**
 * Exposes a code fence's language and optional `title="…"` meta as data
 * attributes on <pre>, which the CodeBlock component renders as its header.
 *
 *   ```nginx title="prod-upstream-blue.conf"
 */
export function transformerCodeTitle(): ShikiTransformer {
  return {
    name: 'code-title',
    pre(node) {
      const raw = (this.options.meta as { __raw?: string } | undefined)?.__raw ?? ''
      const title = raw.match(/title="([^"]+)"/)?.[1]
      if (title) node.properties['data-title'] = title
      node.properties['data-language'] = this.options.lang
    },
  }
}
