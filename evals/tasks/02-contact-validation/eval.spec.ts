import { expect, test } from '@playwright/test'

test('empty contact form shows accessible errors', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: /envoyer/i }).click()

  const name = page.getByLabel(/nom/i)
  await expect(name).toHaveAttribute('aria-invalid', 'true')
  await expect(name).toBeFocused()
  // The error message is announced with the field
  await expect(name).toHaveAccessibleDescription(/.+/)
  await expect(page.getByText(/merci, votre message/i)).toHaveCount(0)
})

test('invalid e-mail is reported', async ({ page }) => {
  await page.goto('/contact')
  await page.getByLabel(/nom/i).fill('Camille')
  await page.getByLabel(/e-mail/i).fill('pas-un-email')
  await page.getByLabel(/message/i).fill('Bonjour')
  await page.getByRole('button', { name: /envoyer/i }).click()

  const email = page.getByLabel(/e-mail/i)
  await expect(email).toHaveAttribute('aria-invalid', 'true')
  await expect(email).toHaveAccessibleDescription(/.+/)
})
