import { describe, expect, it } from 'vitest'
import { slugify } from '../../app/utils/slugify'

describe('slugify', () => {
  it.skip('removes accents and special characters', () => {
    expect(slugify('Vitrine Horlogerie : édition été')).toBe('vitrine-horlogerie-edition-ete')
  })

  it('trims leading and trailing separators', () => {
    expect(slugify('  --Campagne WebAR--  ')).toBe('campagne-webar')
  })
})
