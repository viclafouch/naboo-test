import { expect, test } from '@playwright/test'

test.describe('detail page navigation', () => {
  test('opens place detail from search', async ({ page }) => {
    await page.goto('/search')

    const article = page
      .getByRole('article')
      .filter({ hasText: 'Cozy Apartment in Le Marais' })
    await expect(article).toBeVisible()

    await article.getByRole('link').click()

    await expect(page).toHaveURL(/\/places\/cozy-apartment-paris/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Cozy Apartment in Le Marais'
    )
  })

  test('browser back preserves search context', async ({ page }) => {
    await page.goto('/search?q=paris')

    const article = page
      .getByRole('article')
      .filter({ hasText: 'Cozy Apartment in Le Marais' })

    await article.getByRole('link').click()
    await expect(page).toHaveURL(/\/places\/cozy-apartment-paris/)

    await page.goBack()
    await expect(page).toHaveURL('/search?q=paris')
  })
})
