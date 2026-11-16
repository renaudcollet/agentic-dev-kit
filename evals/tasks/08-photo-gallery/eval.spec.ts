import { expect, test } from '@playwright/test'

test('the gallery does not render all photos at once', async ({ page }) => {
  await page.goto('/photos')
  await expect(page.getByRole('img').first()).toBeVisible()
  const initialCount = await page.getByRole('img').count()
  expect(initialCount).toBeLessThanOrEqual(300)
})

test('more photos become reachable', async ({ page }) => {
  await page.goto('/photos')
  await expect(page.getByRole('img').first()).toBeVisible()

  const loadMore = page.getByRole('button', { name: /plus|suivant|charger/i })
  if (await loadMore.count()) {
    await loadMore.first().click()
  }
  else {
    await page.mouse.wheel(0, 20_000)
  }
  // A photo beyond the first 20 is now in the page
  await expect(page.getByRole('img', { name: /numéro (2[1-9]|[3-9]\d|\d{3,})\b/ }).first()).toBeAttached()
})
