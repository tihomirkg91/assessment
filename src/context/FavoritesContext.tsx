import { createContext, type ReactNode, useContext, useEffect, useReducer, useRef } from 'react'
import type { BillView } from '../types/bills.types'

interface FavoritesState {
  bills: Map<string, BillView>
}

type FavoritesAction = { type: 'TOGGLE'; bill: BillView } | { type: 'HYDRATE'; bills: BillView[] }

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'TOGGLE': {
      const next = new Map(state.bills)
      if (next.has(action.bill.id)) next.delete(action.bill.id)
      else next.set(action.bill.id, action.bill)

      return { bills: next }
    }
    case 'HYDRATE': {
      const next = new Map<string, BillView>()
      for (const bill of action.bills) next.set(bill.id, bill)
      return { bills: next }
    }
    default:
      return state
  }
}

export interface FavoritesContextValue {
  isFavorite: (billId: string) => boolean
  toggleFavorite: (bill: BillView) => void
  favoriteIds: Set<string>
  count: number
  favoriteBills: BillView[]
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)

const STORAGE_KEY = 'oireachtas-favorites'

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(favoritesReducer, {
    bills: new Map<string, BillView>(),
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const bills = JSON.parse(stored) as BillView[]
        if (Array.isArray(bills) && bills.length > 0) dispatch({ type: 'HYDRATE', bills })
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // Persist full BillView[] on every change (skip initial mount to avoid race with hydration)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.bills.values()]))
  }, [state.bills])

  const toggleFavorite = (bill: BillView) => {
    dispatch({ type: 'TOGGLE', bill })
    const wasFavorited = !state.bills.has(bill.id)
    const action = wasFavorited ? 'favorited' : 'un-favorited'
    // biome-ignore lint/suspicious/noConsole: required by specification
    console.log(`[Favorites] Request to ${action} bill "${bill.id}" dispatched to server.`)
  }

  return (
    <FavoritesContext
      value={{
        isFavorite: (billId: string) => state.bills.has(billId),
        toggleFavorite,
        favoriteIds: new Set(state.bills.keys()),
        count: state.bills.size,
        favoriteBills: [...state.bills.values()],
      }}
    >
      {children}
    </FavoritesContext>
  )
}

export const useFavorites = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within a <FavoritesProvider>')

  return ctx
}
