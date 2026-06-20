import { describe, expect, it } from 'vitest'
import { COLUMNS, getStatusColor, PAGE_SIZE } from './table.constants'

describe('table.constants', () => {
  describe('getStatusColor', () => {
    it.each([
      ['Current', 'success'],
      ['Enacted', 'success'],
      ['CURRENT', 'success'],
      ['Lapsed', 'warning'],
      ['Withdrawn', 'warning'],
      ['lapsed', 'warning'],
      ['Initiated', 'info'],
      ['Published', 'info'],
    ])('maps "%s" → "%s"', (input, expected) => {
      expect(getStatusColor(input)).toBe(expected)
    })

    it('returns "default" for unknown statuses', () => {
      expect(getStatusColor('UnknownStatus')).toBe('default')
    })
  })

  it('PAGE_SIZE is a positive integer', () => {
    expect(PAGE_SIZE).toBeGreaterThan(0)
    expect(Number.isInteger(PAGE_SIZE)).toBe(true)
  })

  describe('COLUMNS', () => {
    it('has correct ids and sortability', () => {
      expect(COLUMNS.map((c) => c.id)).toEqual([
        'billNo',
        'billType',
        'status',
        'sponsor',
        'favorite',
      ])
      expect(COLUMNS).toHaveLength(5)
    })

    it('only the favorite column is non-sortable', () => {
      for (const col of COLUMNS) {
        expect(col.sortable).toBe(col.id !== 'favorite')
      }
    })
  })
})
