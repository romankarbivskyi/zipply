import { describe, it, expect } from 'vitest'
import { fillMissingDates, formatDateRange } from '@/lib/date-utils'

describe('fillMissingDates', () => {
  it('returns same when data empty', () => {
    const result = fillMissingDates([], '2023-01-01', '2023-01-03')
    expect(result).toEqual([])
  })

  it('fills missing dates with zeros', () => {
    const data = [{ date: '2023-01-01', clicks: 5 }, { date: '2023-01-03', clicks: 2 }]
    const res = fillMissingDates(data, '2023-01-01', '2023-01-03')
    expect(res).toHaveLength(3)
    expect(res[1]).toEqual({ date: '2023-01-02', clicks: 0 })
  })
})

describe('formatDateRange', () => {
  it('formats valid range', () => {
    const s = formatDateRange('2023-01-01', '2023-01-03')
    expect(s).toContain('2023')
    expect(s).toContain('-')
  })
})
