declare module 'virtual:posts' {
  import type { PostMeta } from '@/content/post-types'

  const posts: PostMeta[]
  export default posts
}
