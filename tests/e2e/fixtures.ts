import { test as base, expect } from '@playwright/test'

/** Fails any test whose page logs a console error or throws. */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
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
]
