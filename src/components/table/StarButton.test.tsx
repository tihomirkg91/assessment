import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FavoritesContext, type FavoritesContextValue } from '../../context/FavoritesContext'
import type { BillView } from '../../types/bills.types'
import { StarButton } from './StarButton'

const bill: BillView = {
  id: 'bill-123',
  billNo: '123',
  billType: 'Public',
  status: 'Current',
  sponsor: 'Senator Smith',
  shortTitleEn: 'Test Bill',
  shortTitleGa: 'Bille Tástála',
  longTitleEn: 'A test bill for testing purposes',
  longTitleGa: 'Bille tástála chun críocha tástála',
}

const wrap =
  (overrides: Partial<FavoritesContextValue> = {}) =>
  ({ children }: { children: React.ReactNode }) => (
    <FavoritesContext
      value={{
        isFavorite: () => false,
        toggleFavorite: vi.fn(),
        favoriteIds: new Set(),
        count: 0,
        favoriteBills: [],
        ...overrides,
      }}
    >
      {children}
    </FavoritesContext>
  )

describe('StarButton', () => {
  it.each([
    [false, 'Favorite this bill'],
    [true, 'Un-favorite this bill'],
  ])('renders correct icon when favorited=%s', (favorited, label) => {
    render(<StarButton bill={bill} />, {
      wrapper: wrap({ isFavorite: () => favorited }),
    })
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
  })

  it('calls toggleFavorite with the bill on click', async () => {
    const toggleFavorite = vi.fn()
    render(<StarButton bill={bill} />, { wrapper: wrap({ toggleFavorite }) })
    await userEvent.setup().click(screen.getByRole('button', { name: 'Favorite this bill' }))
    expect(toggleFavorite).toHaveBeenCalledWith(bill)
  })

  it('stops click propagation to parent', async () => {
    const outerClick = vi.fn()
    render(
      // biome-ignore lint/a11y/useKeyWithClickEvents: test-only wrapper
      // biome-ignore lint/a11y/noStaticElementInteractions: test-only wrapper
      <div onClick={outerClick}>
        <StarButton bill={bill} />
      </div>,
      { wrapper: wrap() },
    )
    await userEvent.setup().click(screen.getByRole('button', { name: 'Favorite this bill' }))
    expect(outerClick).not.toHaveBeenCalled()
  })
})
