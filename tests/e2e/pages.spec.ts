import AxeBuilder from '@axe-core/playwright'
import { expect, routes, test } from './fixtures.ts'

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme })

    for (const { path, heading } of routes) {
      test(`${path} renders and passes axe`, async ({ page }) => {
        await page.goto(path)
        await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)
        await expect(page.locator('html')).toHaveClass(colorScheme === 'dark' ? /dark/ : /^(?!.*dark)/)
        // Let entrance animations settle so axe measures final colors.
        await page.waitForTimeout(600)

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()
        expect(
          results.violations.map(({ id, nodes }) => `${id}: ${nodes.map((node) => node.target).join(', ')}`),
        ).toEqual([])
      })
    }
  })
}

test.describe('unknown routes', () => {
  // GitHub Pages answers unknown paths with a real 404 (serving 404.html), which
  // Chrome logs as a failed resource load. That's the correct status, not a bug.
  test.use({ allowedConsoleErrors: [/status of 404/] })

  test('show the not-found page', async ({ page }) => {
    await page.goto('/no-such-page')
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
    await expect(page).toHaveTitle(/Page not found/)
  })
})

test('every route serves its own link-preview tags', async ({ request }) => {
  for (const { path, title } of routes) {
    const response = await request.get(path)
    expect(response.ok()).toBeTruthy()
    const html = await response.text()
    expect(html, path).toMatch(
      /<meta property="og:image" content="https:\/\/izentenosmith\.github\.io\/og\.png"/,
    )
    expect(html, path).toContain(`<meta property="og:title" content="${title}`)
  }
})

test('feeds and icons are published', async ({ request }) => {
  for (const asset of [
    '/rss.xml',
    '/sitemap.xml',
    '/robots.txt',
    '/og.png',
    '/favicon.svg',
    '/site.webmanifest',
  ]) {
    expect((await request.get(asset)).ok(), asset).toBeTruthy()
  }
  const rss = await (await request.get('/rss.xml')).text()
  expect(rss.match(/<item>/g)).toHaveLength(routes.filter((route) => route.path.startsWith('/blog/')).length)
})
