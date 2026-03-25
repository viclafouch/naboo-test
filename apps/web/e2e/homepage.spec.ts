import { expect, test } from '@playwright/test'

test.describe('homepage', () => {
  test('navigates to search page', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { level: 1, name: 'Naboo Places' })
    ).toBeVisible()
    await expect(page.getByText('Browse places')).toBeVisible()

    await page.getByText('Browse places').click()

    await expect(page).toHaveURL('/search')
    await expect(page.getByRole('article')).not.toHaveCount(0)
  })
})
