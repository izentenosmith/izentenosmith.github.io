import { expect, test } from './fixtures.ts'

test('theme choice applies and survives a reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Change theme' }).click()
  await page.getByRole('menuitemradio', { name: 'Dark' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('blog tag filter narrows the list and lives in the URL', async ({ page }) => {
  await page.goto('/blog')
  await page.getByRole('link', { name: 'Posts tagged postgresql', exact: true }).first().click()
  await expect(page).toHaveURL(/\?tag=postgresql$/)
  await expect(page.getByRole('main').getByRole('heading', { level: 2 })).toHaveCount(1)
  await page.getByRole('link', { name: /^All \(\d+\)$/ }).click()
  await expect(page).toHaveURL(/\/blog$/)
})

test('post card opens the post and the pager moves between posts', async ({ page }) => {
  await page.goto('/blog')
  await page
    .getByRole('link', { name: 'Blue/green deploys on a single VM with Docker Compose and Nginx' })
    .click()
  await expect(page).toHaveURL(/\/blog\/blue-green-on-a-single-vm$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Blue/green')
  // Keyboard and screen reader focus moves to the new page.
  await expect(page.locator('main')).toBeFocused()

  const pager = page.getByRole('navigation', { name: 'More posts' })
  await expect(pager.getByRole('link')).not.toHaveCount(0)
  await expect(page.getByText('sites-available/prod-upstream-blue.conf')).toBeVisible()
})

test('long roles expand and collapse', async ({ page }) => {
  await page.goto('/experience')
  const toggle = page.getByRole('button', { name: /^Show 3 more/ })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(page.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('heading', { name: 'Performance', level: 4 })).toBeVisible()
})

test('mobile menu navigates and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile layout only')
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('dialog').getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('hero entrance and impact numbers settle on their final values', async ({ page }) => {
  await page.goto('/')
  const hero = page.getByRole('heading', { level: 1 })
  await expect(hero).toHaveCSS('opacity', '1')
  await page.getByRole('heading', { name: "A few numbers I'm proud of" }).scrollIntoViewIfNeeded()
  const impact = page.locator('ul').filter({ hasText: 'faster business-critical queries' })
  await expect(impact.locator('[aria-hidden="true"]').first()).toHaveText('40×')
  // Each number counts up when it scrolls into view; on phones the last tile starts below the fold.
  await impact.locator('li').last().scrollIntoViewIfNeeded()
  await expect(impact.locator('[aria-hidden="true"]').last()).toHaveText('12M')
})

test('reduced motion shows final states immediately', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('opacity', '1', { timeout: 100 })
  const impact = page.locator('ul').filter({ hasText: 'faster business-critical queries' })
  await expect(impact.locator('[aria-hidden="true"]').first()).toHaveText('40×', { timeout: 100 })
  await context.close()
})

test('phones show the top tags and expand the rest on demand', async ({ page, isMobile }) => {
  await page.goto('/blog')
  const tags = page.getByRole('navigation', { name: 'Filter posts by tag' }).getByRole('link')
  const toggle = page.getByRole('button', { name: /^More tags/ })

  if (!isMobile) {
    await expect(toggle).toBeHidden()
    return
  }

  // "All" plus the six top tags, which cover every post's lead tag.
  await expect(tags.filter({ visible: true })).toHaveCount(7)
  for (const lead of ['postgresql', 'deployment', 'prometheus', 'azure']) {
    await expect(page.getByRole('link', { name: `Posts tagged ${lead}`, exact: true })).toBeVisible()
  }
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(page.getByRole('button', { name: 'Fewer tags' })).toHaveAttribute('aria-expanded', 'true')
  await expect(tags.filter({ visible: true })).toHaveCount(await tags.count())

  // A tag past the limit stays visible once it's active, even after collapsing.
  await page.getByRole('link', { name: 'Posts tagged workflows', exact: true }).click()
  await page.getByRole('button', { name: 'Fewer tags' }).click()
  await expect(page.getByRole('link', { name: 'Posts tagged workflows', exact: true })).toBeVisible()
})
