import { useEffect } from 'react'
import { headTags, type PageMeta } from '@/content/seo'

function setMeta(attr: string, key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.append(element)
  }
  element.content = content
}

/**
 * Keeps the tab title, description, canonical URL and Open Graph tags in step
 * with client-side navigation. Crawlers get the same tags from the per-route
 * HTML written at build time. Pass `undefined` to leave the tags alone.
 */
export function usePageMeta(page: PageMeta | undefined) {
  const tags = page && headTags(page)
  const title = tags?.title
  const canonical = tags?.canonical
  const serializedMeta = JSON.stringify(tags?.meta ?? [])

  useEffect(() => {
    if (!title || !canonical) return
    document.title = title
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical)
    for (const { content, ...key } of JSON.parse(serializedMeta) as ReturnType<typeof headTags>['meta']) {
      const [attr, value] = Object.entries(key)[0]
      setMeta(attr, value, content)
    }
  }, [title, canonical, serializedMeta])
}
