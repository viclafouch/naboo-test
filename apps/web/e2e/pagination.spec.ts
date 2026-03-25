import { expect, test } from '@playwright/test'

test.describe('pagination', () => {
  test('navigates to page 2', async ({ page }) => {
    await page.goto('/search')

    const pagination = page.getByRole('navigation', { name: 'Pagination' })
    await expect(pagination).toBeVisible()

    await pagination.getByLabel('Page 2').click()

    await expect(page).toHaveURL(/page=2/)
  })

  test('preserves state on refresh', async ({ page }) => {
    await page.goto('/search?page=2')

    const article = page
      .getByRole('article')
      .filter({ hasText: 'Luxury Penthouse in Marina' })
    await expect(article).toBeVisible()

    await page.reload()

    await expect(article).toBeVisible()
  })
})
