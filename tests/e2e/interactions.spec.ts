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
  await page.getByRole('link', { name: 'postgresql', exact: true }).first().click()
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
