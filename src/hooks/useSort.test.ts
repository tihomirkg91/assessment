import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSort } from './useSort'

type Field = 'name' | 'value'

const items = [
  { name: 'Charlie', value: 3 },
  { name: 'Alice', value: 1 },
  { name: 'Bob', value: 2 },
]

const setup = (overrides?: { initialField?: Field; initialDir?: 'asc' | 'desc' }) =>
  renderHook(() => useSort(items, { initialField: 'name', ...overrides })).result

describe('useSort', () => {
  it('sorts ascending by initialField by default', () => {
    const r = setup()

    expect(r.current.sorted.map((i) => i.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    expect(r.current.sortField).toBe('name')
    expect(r.current.sortDir).toBe('asc')
    expect(r.current.isPending).toBe(false)
  })

  it('respects initialDir', () => {
    const r = setup({ initialDir: 'desc' })

    expect(r.current.sorted.map((i) => i.name)).toEqual(['Charlie', 'Bob', 'Alice'])
    expect(r.current.sortDir).toBe('desc')
  })

  it('toggleSort: same field flips dir, new field resets to asc', () => {
    const r = setup()

    // same → desc
    act(() => r.current.toggleSort('name'))
    expect(r.current.sortDir).toBe('desc')
    expect(r.current.sorted.map((i) => i.name)).toEqual(['Charlie', 'Bob', 'Alice'])

    // same → asc
    act(() => r.current.toggleSort('name'))
    expect(r.current.sortDir).toBe('asc')

    // go desc, then switch field → resets to asc
    act(() => r.current.toggleSort('name'))
    act(() => r.current.toggleSort('value'))
    expect(r.current.sortField).toBe('value')
    expect(r.current.sortDir).toBe('asc')
    expect(r.current.sorted.map((i) => i.value)).toEqual([1, 2, 3])
  })

  it('uses numeric collation (bill2 < bill10)', () => {
    const { result } = renderHook(() =>
      useSort([{ id: 'bill10' }, { id: 'bill2' }, { id: 'bill1' }], {
        initialField: 'id',
      }),
    )

    expect(result.current.sorted.map((i) => i.id)).toEqual(['bill1', 'bill2', 'bill10'])
  })

  it('handles empty array', () => {
    const { result } = renderHook(() => useSort([], { initialField: 'name' }))

    expect(result.current.sorted).toEqual([])
  })
})
