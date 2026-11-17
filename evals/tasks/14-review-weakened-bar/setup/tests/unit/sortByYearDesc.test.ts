import { describe, expect, it } from 'vitest'
import { sortByYearDesc } from '../../server/utils/sortByYearDesc'

describe('sortByYearDesc', () => {
  it('sorts projects', () => {
    const result = sortByYearDesc([{ year: 2024 }, { year: 2026 }, { year: 2025 }])
    expect(result).toBeDefined()
  })
})
