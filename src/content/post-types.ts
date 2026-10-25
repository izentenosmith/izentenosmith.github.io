export type PostHeading = { depth: 2 | 3; text: string; id: string }

export type PostMeta = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  featured: boolean
  readingMinutes: number
  headings: PostHeading[]
}
