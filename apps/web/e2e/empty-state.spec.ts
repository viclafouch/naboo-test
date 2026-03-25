import { expect, test } from '@playwright/test'

test.describe('empty state', () => {
  test('shows empty state for nonexistent query', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.getByLabel('Search query')
    await searchInput.fill('xyznonexistent')
    await searchInput.press('Enter')

    await expect(page).toHaveURL(/q=xyznonexistent/)
    await expect(page.getByText('No places found')).toBeVisible()
    await expect(page.getByRole('article')).toHaveCount(0)
  })
})
