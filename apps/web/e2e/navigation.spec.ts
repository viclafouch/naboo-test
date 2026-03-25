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

  test('navigates back to search', async ({ page }) => {
    await page.goto('/places/cozy-apartment-paris')

    await page.getByText('Back to search').click()

    await expect(page).toHaveURL('/search')
    await expect(page.getByRole('article')).not.toHaveCount(0)
  })
})
