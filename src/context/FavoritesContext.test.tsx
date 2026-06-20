import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BillView } from '../types/bills.types'
import { FavoritesProvider, useFavorites } from './FavoritesContext'

const make = (id: string): BillView => ({
  id,
  billNo: id,
  billType: 'Public',
  status: 'Current',
  sponsor: 'Test Sponsor',
  shortTitleEn: `Bill ${id}`,
  shortTitleGa: `Bille ${id}`,
  longTitleEn: `Long title for bill ${id}`,
  longTitleGa: `Teideal fada do bhille ${id}`,
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
)

describe('FavoritesContext', () => {
  beforeEach(() => localStorage.clear())

  it('starts with no favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    expect(result.current.count).toBe(0)
    expect(result.current.favoriteBills).toHaveLength(0)
  })

  it('toggles a bill in and out of favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    act(() => result.current.toggleFavorite(make('1')))
    expect(result.current.count).toBe(1)
    expect(result.current.isFavorite('1')).toBe(true)

    act(() => result.current.toggleFavorite(make('1')))
    expect(result.current.count).toBe(0)
    expect(result.current.isFavorite('1')).toBe(false)
  })

  it('persists favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    act(() => result.current.toggleFavorite(make('1')))
    expect(JSON.parse(localStorage.getItem('oireachtas-favorites') ?? '[]')).toEqual([make('1')])
  })

  it.each([
    ['favorited', '1', false],
    ['un-favorited', '1', true],
  ])('logs "%s" to console on toggle', (action, id, preToggle) => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { result } = renderHook(() => useFavorites(), { wrapper })
    if (preToggle) act(() => result.current.toggleFavorite(make(id)))
    act(() => result.current.toggleFavorite(make(id)))
    expect(spy).toHaveBeenCalledWith(
      `[Favorites] Request to ${action} bill "${id}" dispatched to server.`,
    )
    spy.mockRestore()
  })

  it('supports multiple favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    for (const id of ['1', '2', '3']) act(() => result.current.toggleFavorite(make(id)))
    expect(result.current.count).toBe(3)
    expect(result.current.favoriteIds.size).toBe(3)
  })

  it('hydrates from localStorage on mount', () => {
    const bills = [make('10'), make('20')]
    localStorage.setItem('oireachtas-favorites', JSON.stringify(bills))
    const { result } = renderHook(() => useFavorites(), { wrapper })
    expect(result.current.count).toBe(2)
    expect(result.current.isFavorite('10')).toBe(true)
    expect(result.current.isFavorite('30')).toBe(false)
  })

  it('recovers from corrupted localStorage', () => {
    localStorage.setItem('oireachtas-favorites', '{invalid')
    const { result } = renderHook(() => useFavorites(), { wrapper })
    expect(result.current.count).toBe(0)
    expect(localStorage.getItem('oireachtas-favorites')).toBeNull()
  })
})
