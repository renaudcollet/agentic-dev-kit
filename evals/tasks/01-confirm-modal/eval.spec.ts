import { expect, test } from '@playwright/test'

test('deleting a project asks for an accessible confirmation', async ({ page }) => {
  await page.goto('/projects')
  const trigger = page.getByRole('button', { name: /supprimer vitrine horlogerie/i })
  await trigger.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  // Focus has moved into the dialog
  await expect(dialog.locator(':focus')).toHaveCount(1)

  // Escape closes the dialog, focus goes back to the trigger, nothing was deleted
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('link', { name: /vitrine horlogerie/i })).toBeVisible()

  // Confirming deletes the project
  await trigger.click()
  await dialog.getByRole('button', { name: /supprimer|confirmer|oui/i }).click()
  await expect(page.getByRole('link', { name: /vitrine horlogerie/i })).toHaveCount(0)
})
