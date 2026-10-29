import { test as base, expect } from '@playwright/test'

/**
 * Fails any test whose page logs a console error or throws. Tests can allow
 * specific, expected errors with `test.use({ allowedConsoleErrors: [...] })`.
 */
export const test = base.extend<{ consoleErrors: string[]; allowedConsoleErrors: RegExp[] }>({
  allowedConsoleErrors: [[], { option: true }],
  consoleErrors: [
    async ({ page, allowedConsoleErrors }, use) => {
      const errors: string[] = []
      page.on('console', (message) => {
        const text = message.text()
        if (message.type() === 'error' && !allowedConsoleErrors.some((pattern) => pattern.test(text))) {
          errors.push(text)
        }
      })
      page.on('pageerror', (error) => errors.push(error.message))
      await use(errors)
      expect(errors, 'console errors').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }

export const routes = [
  { path: '/', heading: 'Ignacio Zenteno Smith', title: 'Ignacio Zenteno Smith' },
  { path: '/experience', heading: 'Experience', title: 'Experience' },
  { path: '/blog', heading: 'Blog', title: 'Blog' },
  { path: '/contact', heading: 'Get in touch', title: 'Contact' },
  { path: '/literature', heading: 'Literature', title: 'Literature' },
  {
    path: '/blog/configurable-workflows-in-postgres',
    heading: 'Modeling configurable resolution workflows',
    title: 'Modeling configurable resolution workflows',
  },
  {
    path: '/blog/blue-green-on-a-single-vm',
    heading: 'Blue/green deploys on a single VM',
    title: 'Blue/green deploys on a single VM',
  },
  {
    path: '/blog/inventory-driven-network-monitoring',
    heading: 'Inventory-driven network monitoring',
    title: 'Inventory-driven network monitoring',
  },
  {
    path: '/blog/nightly-ml-scoring-on-azure',
    heading: 'Designing a nightly ML scoring pipeline',
    title: 'Designing a nightly ML scoring pipeline',
  },
  {
    path: '/blog/monitoring-stack-as-code-on-docker-swarm',
    heading: 'A monitoring stack as code on a two-node Docker Swarm',
    title: 'A monitoring stack as code on a two-node Docker Swarm',
  },
]
