import { expect, test } from '@playwright/test'

test('the home page shows the studio name', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Studio Démo' })).toBeVisible()
})
