import { expect, test } from '@playwright/test'

test.describe('search and filtering', () => {
  test('displays results and filters by query and category', async ({
    page
  }) => {
    await page.goto('/search')

    await expect(page.getByRole('article')).not.toHaveCount(0)

    const searchInput = page.getByLabel('Search query')
    await searchInput.fill('paris')
    await searchInput.press('Enter')

    await expect(page).toHaveURL(/q=paris/)

    await page.getByLabel('Filter by category').click()
    await page.getByRole('option', { name: 'Villa' }).click()

    await expect(page).toHaveURL(/category=villa/)
  })
})
