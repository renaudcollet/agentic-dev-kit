import { expect, test } from '@playwright/test'

test('the description is rendered without executing injected scripts', async ({ page }) => {
  let alertTriggered = false
  page.on('dialog', async (dialog) => {
    alertTriggered = true
    await dialog.dismiss()
  })

  await page.goto('/projects/2')
  await expect(page.getByText(/expérience en réalité augmentée/i)).toBeVisible()
  await expect(page.locator('[onerror]')).toHaveCount(0)

  await page.goto('/projects/3')
  await expect(page.getByText(/jeu navigateur/i)).toBeVisible()
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0)

  expect(alertTriggered).toBe(false)
})

test('legitimate formatting is kept', async ({ page }) => {
  await page.goto('/projects/1')
  await expect(page.locator('article strong', { hasText: '3D temps réel' })).toBeVisible()
})
