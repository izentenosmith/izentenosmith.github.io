import type { MDXContent } from 'mdx/types'
import posts from 'virtual:posts'

export type { PostMeta } from './post-types'
export { posts }

const bodies = import.meta.glob<{ default: MDXContent }>('./posts/*.mdx')

export function findPost(slug: string) {
  return posts.find((post) => post.slug === slug)
}

/** Loads a post body on demand, so each post is its own chunk. */
export function loadPostBody(slug: string) {
  const load = bodies[`./posts/${slug}.mdx`]
  if (!load) throw new Error(`No post body for "${slug}"`)
  return load().then((module) => module.default)
}

export function formatPostDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
