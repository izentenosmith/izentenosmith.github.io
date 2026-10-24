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

Deep links work because the build copies `index.html` to `404.html`, so GitHub Pages serves the app for any path and the client router takes over.
