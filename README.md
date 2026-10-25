# izentenosmith.github.io

Personal site: CV, technical blog and contact. Built with React, shadcn/ui and Motion, deployed to GitHub Pages as a client-side app (no SSR).

## Development

```bash
pnpm install
pnpm dev
```

`pnpm lint`, `pnpm format:check`, `pnpm typecheck` and `pnpm build` are the same checks CI runs. `pnpm format` fixes formatting.

End-to-end tests run against the production build (every page in both themes, on desktop and mobile, with axe accessibility checks):

```bash
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
```

## Branches and deploys

- `dev` is the working branch. Every push and pull request runs CI (lint, type check, build).
- `main` is what is live. It only accepts pull requests from `dev`, enforced by a repository ruleset and the `source-branch` CI check.
- Every merge to `main` builds and deploys to https://izentenosmith.github.io/.

## How pages are served

The site is client-rendered (no SSR). After the build, `mdx/route-html-plugin.ts` writes one copy of `index.html` per route (`experience.html`, `blog/<slug>.html`, …) carrying that page's title, description and Open Graph tags, plus `sitemap.xml`. Link-preview crawlers, which don't run JavaScript, read those tags, and GitHub Pages answers real routes with a 200. Anything else falls through to `404.html`, which loads the app and shows "Page not found".

## Writing a post

Add `src/content/posts/<slug>.mdx` with `title`, `description`, `date` and `tags` frontmatter (optionally `featured: true`); it's validated at build time. Code fences accept `title="file.ext"`, and `# [!code highlight]` / `# [!code ++]` comments highlight lines. Diagrams live next to the posts in `src/content/posts/diagrams/` and use the SVG kit in `src/components/diagram/`. Reading time, headings and the sitemap entry are generated at build time.

## Design system

Tokens live in `src/index.css`: zinc neutrals plus three accents with one job each — electric blue (`brand`) for links, focus and actions; green (`signal`) for status; amber (`metric`) for numbers. The type scale (`text-display`, `text-h1`…, `text-reading`) and motion tokens (`--dur-*`, `--ease-enter`, `--ease-exit`) are defined there too. Animations always respect `prefers-reduced-motion`.

## Brand assets and photos

`pnpm brand` renders the IZS favicon, app icons, web manifest and the link-preview image (`public/og.png`) from `scripts/brand-assets.ts` and `src/content/profile.ts`. Photos live in `src/assets/` and are resized to AVIF/WebP at build time by `vite-imagetools` (see `src/assets/images.ts`).
