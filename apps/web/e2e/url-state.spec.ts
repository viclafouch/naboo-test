import { expect, test } from '@playwright/test'

test.describe('sharing search state via URL', () => {
  test('preserves search state when opening a shared URL', async ({ page }) => {
    await page.goto('/search?q=paris')

    await expect(page.getByRole('article')).not.toHaveCount(0)

    const newPage = await page.context().newPage()
    await newPage.goto('/search?q=paris')

    await expect(newPage.getByRole('article')).not.toHaveCount(0)

    await expect(page.getByRole('article').getByRole('heading')).toHaveText(
      await newPage.getByRole('article').getByRole('heading').allTextContents()
    )
  })
})
