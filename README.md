# izentenosmith.github.io

Personal site: CV, technical blog and contact. Built with React, shadcn/ui and Motion, deployed to GitHub Pages as a client-side app (no SSR).

## Development

```bash
pnpm install
pnpm dev
```

`pnpm lint`, `pnpm typecheck` and `pnpm build` are the same checks CI runs.

## Branches and deploys

- `dev` is the working branch. Every push and pull request runs CI (lint, type check, build).
- `main` is what is live. It only accepts pull requests from `dev`, enforced by a repository ruleset and the `source-branch` CI check.
- Every merge to `main` builds and deploys to https://izentenosmith.github.io/.

## How pages are served

The site is client-rendered (no SSR). After the build, `mdx/route-html-plugin.ts` writes one copy of `index.html` per route (`experience.html`, `blog/<slug>.html`, …) carrying that page's title, description and Open Graph tags, plus `sitemap.xml`. Link-preview crawlers, which don't run JavaScript, read those tags, and GitHub Pages answers real routes with a 200. Anything else falls through to `404.html`, which loads the app and shows "Page not found".

## Writing a post

Add `src/content/posts/<slug>.mdx` with `title`, `description`, `date` and `tags` frontmatter. Diagrams live next to the posts in `src/content/posts/diagrams/` and use the SVG kit in `src/components/diagram/`. Reading time, headings and the sitemap entry are generated at build time.

## Link-preview image

`public/og.png` is rendered from `src/content/profile.ts` by `pnpm og`; rerun it after changing the name, title or tagline.
