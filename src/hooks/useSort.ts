import { useDeferredValue, useState, useTransition } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface UseSortOptions<F extends string> {
  initialField?: F
  initialDir?: SortDirection
}

export interface UseSortResult<T, F extends string> {
  sorted: T[]
  sortField: F
  sortDir: SortDirection
  toggleSort: (field: F) => void
  isPending: boolean
}

export function useSort<T, F extends string = string>(
  items: T[],
  options: UseSortOptions<F> = {},
): UseSortResult<T, F> {
  const { initialField, initialDir = 'asc' } = options

  const [sortField, setSortField] = useState<F>(initialField as F)
  const [sortDir, setSortDir] = useState<SortDirection>(initialDir)
  const [isPending, startTransition] = useTransition()

  const toggleSort = (field: F) => {
    startTransition(() => {
      setSortField((prev) => {
        // Same field flip direction
        if (prev === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        else setSortDir('asc')

        return field
      })
    })
  }

  const deferredItems = useDeferredValue(items)

  // React Compiler handles memoization of this computation automatically
  const dir = sortDir === 'asc' ? 1 : -1

  const sorted = [...deferredItems].sort((a, b) => {
    const aVal = String((a as Record<string, unknown>)[sortField as string] ?? '')
    const bVal = String((b as Record<string, unknown>)[sortField as string] ?? '')
    return dir * aVal.localeCompare(bVal, undefined, { numeric: true })
  })

  return { sorted, sortField, sortDir, toggleSort, isPending }
}
