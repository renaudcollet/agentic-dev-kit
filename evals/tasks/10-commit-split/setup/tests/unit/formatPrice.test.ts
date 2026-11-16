import { describe, expect, it } from 'vitest'
import { formatPrice } from '../../app/utils/formatPrice'

// Intl uses non-breaking spaces: normalize them for readable assertions.
const normalize = (value: string) => value.replace(/[  ]/g, ' ')

describe('formatPrice', () => {
  it('formats euros with French separators', () => {
    expect(normalize(formatPrice(1234.5))).toBe('1 234,50 €')
  })

  it('formats zero', () => {
    expect(normalize(formatPrice(0))).toBe('0,00 €')
  })
})
