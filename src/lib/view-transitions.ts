/** Shared by post cards and the post page's <h1>, so the title glides between the two. */
export const postTitleTransition = (slug: string) => ({ viewTransitionName: `post-title-${slug}` })
